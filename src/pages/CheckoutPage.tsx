import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { loginClient, registerClient } from "@/api/clients";
import { createOrder } from "@/api/orders";
import {
  cancelOrderForPayment,
  generatePaymentLink,
  getPaymentStatus,
} from "@/api/payments";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  CreditCard,
  Truck,
  CheckCircle,
  ChevronRight,
  Tag,
  Lock,
  ChevronDown,
} from "lucide-react";

const steps = ["Livraison", "Paiement", "Révision"];

type PaymentMethod = "cash" | "mobile" | "card";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { client, token, loginWithToken } = useAuth();
  const { items: cartItems, clearCart } = useCart();
  const currentStep = client ? 3 : 2;
  const [selectedShipping, setSelectedShipping] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [finalizing, setFinalizing] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const [waitingPayment, setWaitingPayment] = useState(false);
  const [pendingPaymentId, setPendingPaymentId] = useState<string | null>(null);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [pendingOrderSummary, setPendingOrderSummary] = useState<any | null>(null);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const pollInFlightRef = useRef(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = selectedShipping === "express" ? 15000 : 0;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const tax = Math.round((subtotal - discount) * 0.18 * 100) / 100;
  const total = subtotal + shipping - discount + tax;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "ASG10") {
      setPromoApplied(true);
    }
  };

  const handleFinalizeOrder = async () => {
    try {
      if (finalizing || waitingPayment) return;
      setFinalizing(true);

      if (cartItems.length === 0) {
        alert("Votre panier est vide. Ajoutez des produits avant de valider la commande.");
        return;
      }

      if (!client) {
        alert(
          "Pour finaliser votre commande, veuillez d'abord vous connecter ou créer un compte."
        );
        navigate("/compte");
        return;
      }

      if (!token) {
        alert(
          "Votre session a expiré. Veuillez vous reconnecter avant de finaliser la commande."
        );
        navigate("/compte");
        return;
      }

      const orderPayload = {
        clientId: client.id,
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          ...(item.variant
            ? (() => {
                const parts = String(item.variant)
                  .split("/")
                  .map((p) => p.trim())
                  .filter(Boolean);
                return {
                  color: parts[0] || "",
                  size: parts[1] || "",
                };
              })()
            : { color: "", size: "" }),
        })),
        total,
        paymentMethod,
        address: client.address,
      };

      const orderSummary = {
        orderNumber: `ORD-${Math.floor(10000000 + Math.random() * 90000000)}`,
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
        })),
        totals: {
          subtotal,
          discount,
          shipping,
          tax,
          total,
        },
        buyer: {
          name: client.name,
          email: client.email,
          phone: client.phone,
          address: client.address,
          city: "",
          state: "",
          postalCode: "",
        },
        paymentMethod,
      };

      if (paymentMethod === "cash") {
        // Flux "cash" : on reste comme avant, on va directement à la page de confirmation
        const orderResponse = await createOrder(token, orderPayload);
        const orderNumber =
          orderResponse?.code ||
          orderResponse?.id ||
          orderSummary.orderNumber;
        clearCart();
        navigate("/confirmation", {
          state: { ...orderSummary, orderNumber },
        });
        return;
      }

      // Méthodes autres que cash : créer la commande d'abord, puis générer le lien de paiement.
      const orderResponse = await createOrder(token, orderPayload);
      const orderId = orderResponse?.id || orderResponse?.code;
      if (!orderId) {
        throw new Error("Impossible de récupérer l'identifiant de la commande.");
      }
      const orderNumber =
        orderResponse?.code ||
        orderResponse?.id ||
        orderSummary.orderNumber;

      const payment = await generatePaymentLink(token, orderId);
      window.open(payment.paymentUrl, "_blank", "noopener,noreferrer");
      setPendingPaymentId(payment.paymentId);
      setPendingOrderId(String(orderId));
      setPendingOrderSummary({ ...orderSummary, orderNumber });
      setWaitingPayment(true);
    } catch (error) {
      console.error("Checkout error", error);
      alert("Une erreur est survenue lors de la validation de votre commande.");
    } finally {
      setFinalizing(false);
    }
  };

  const handleCancelCreatedOrder = async () => {
    if (!token || !pendingOrderId || cancellingOrder) return;
    try {
      setCancellingOrder(true);
      await cancelOrderForPayment(token, pendingOrderId);
      setWaitingPayment(false);
      setPendingPaymentId(null);
      setPendingOrderId(null);
      setPendingOrderSummary(null);
      setShowCancelSuccess(true);
    } catch (error) {
      console.error("Cancel order error", error);
      alert("Impossible d'annuler la commande pour le moment.");
    } finally {
      setCancellingOrder(false);
    }
  };

  useEffect(() => {
    if (!waitingPayment || !pendingPaymentId || !token) return;
    let isEffectActive = true;

    const poll = async () => {
      if (pollInFlightRef.current) return;
      pollInFlightRef.current = true;
      try {
        const statusResponse = await getPaymentStatus(token, pendingPaymentId);
        if (!isEffectActive) return;
        const status = String(statusResponse?.status || "").toUpperCase();

        if (status === "SUCCESS") {
          const summary = pendingOrderSummary || {};
          clearCart();
          setWaitingPayment(false);
          setPendingPaymentId(null);
          setPendingOrderId(null);
          setPendingOrderSummary(null);
          navigate("/confirmation", { state: summary });
          return;
        }

        if (status === "FAILED") {
          setWaitingPayment(false);
          const orderNumber =
            pendingOrderSummary?.orderNumber || pendingPaymentId.slice(-12);
          setPendingPaymentId(null);
          setPendingOrderId(null);
          setPendingOrderSummary(null);
          navigate("/paiement-echoue", {
            state: { paymentId: pendingPaymentId, orderNumber },
          });
          return;
        }
      } catch (error) {
        console.error("Payment status polling failed", error);
      } finally {
        pollInFlightRef.current = false;
      }
    };

    poll();
    const interval = window.setInterval(poll, 5000);
    return () => {
      isEffectActive = false;
      window.clearInterval(interval);
    };
  }, [
    waitingPayment,
    pendingPaymentId,
    token,
    pendingOrderSummary,
    clearCart,
    navigate,
  ]);

  return (
    <div className="min-h-screen bg-[#f6f7f8] relative">
      <Header />

      {/* Success modal for order cancellation */}
      {showCancelSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowCancelSuccess(false)}
          />
          <div className="relative max-w-sm w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-red-500 rotate-45" />
              </div>
              <h2 className="text-base font-black text-[#101922]">
                Commande annulée
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              Votre commande en attente de paiement a été annulée. Vous pouvez
              ajuster votre panier ou relancer un nouveau paiement à tout moment.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => setShowCancelSuccess(false)}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#137fec] hover:bg-[#0a6fd4] text-white text-xs font-semibold transition-colors"
              >
                Fermer
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCancelSuccess(false);
                  navigate("/panier");
                }}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:border-[#137fec] hover:text-[#137fec] transition-colors"
              >
                Retour au panier
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {steps.map((step, idx) => {
              const stepNum = idx + 1;
              const isDone = stepNum < currentStep;
              const isCurrent = stepNum === currentStep;
              return (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isDone
                          ? "bg-green-500 text-white"
                          : isCurrent
                          ? "bg-[#137fec] text-white ring-4 ring-[#137fec]/20"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {isDone ? <CheckCircle className="w-4 h-4" /> : stepNum}
                    </div>
                    <span className={`text-sm font-semibold hidden sm:block ${isCurrent ? "text-[#137fec]" : isDone ? "text-green-600" : "text-gray-400"}`}>
                      {step}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-3 ${isDone || isCurrent ? "bg-[#137fec]" : "bg-gray-200"} transition-all`} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm font-semibold text-[#137fec]">Étape {currentStep} sur {steps.length}</p>
            <div className="bg-gray-200 rounded-full h-1.5 w-40 overflow-hidden">
              <div
                className="bg-[#137fec] h-full rounded-full transition-all"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {waitingPayment && (
          <div className="mb-6 bg-[#137fec]/5 border border-[#137fec]/20 rounded-2xl p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 w-5 h-5 border-2 border-[#137fec]/40 border-t-[#137fec] rounded-full animate-spin flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#0a6fd4]">
                  Vérification du paiement en cours...
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Nous attendons le retour du prestataire de paiement. Après le
                  paiement dans l&apos;autre onglet, cette page se mettra à jour
                  automatiquement.
                </p>
                {pendingPaymentId && (
                  <p className="mt-2 text-[11px] sm:text-xs text-gray-500 break-all">
                    Référence paiement:{" "}
                    <span className="font-semibold">{pendingPaymentId}</span>
                  </p>
                )}
                {pendingOrderId && (
                  <p className="mt-1 text-[11px] sm:text-xs text-gray-500 break-all">
                    Référence commande:{" "}
                    <span className="font-semibold">{pendingOrderId}</span>
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleCancelCreatedOrder}
                  disabled={cancellingOrder || !pendingOrderId}
                  className="mt-3 inline-flex items-center justify-center px-3.5 py-2 rounded-xl border border-red-200 bg-white text-red-600 text-xs font-semibold hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {cancellingOrder ? "Annulation..." : "Annuler cette commande"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-5">
            {/* Shipping info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-black text-[#101922] mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-[#137fec]/10 text-[#137fec] rounded-lg flex items-center justify-center text-sm font-bold">1</span>
                Informations de livraison
              </h2>

              {client ? (
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Nom complet</span>
                    <span>{client.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Email</span>
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Téléphone</span>
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-semibold mt-0.5">Adresse</span>
                    <span className="text-right">
                      {client.address}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Vous êtes connecté. Vos informations seront utilisées pour cette commande.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 text-sm text-gray-700">
                  <p className="text-gray-600">
                    Pour continuer la livraison et le paiement, vous devez être connecté à votre compte ASG.
                  </p>
                  <button
                    onClick={() => navigate("/compte")}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#137fec] hover:bg-[#0a6fd4] text-white text-sm font-semibold transition-all hover:shadow-md"
                  >
                    Se connecter ou créer un compte
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-gray-400">
                    Une fois connecté, revenez sur cette page pour finaliser votre commande.
                  </p>
                </div>
              )}
            </div>

            {/* Shipping method */}
            {/* <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-black text-[#101922] mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-[#137fec]/10 text-[#137fec] rounded-lg flex items-center justify-center text-sm font-bold">2</span>
                Mode de livraison
              </h2>
              <div className="space-y-3">
                {[
                  { id: "standard", label: "Standard", sub: "3-5 jours ouvrés", price: "Gratuit", icon: "📦" },
                  { id: "express", label: "Express", sub: "Livraison le lendemain", price: "15€", icon: "⚡" },
                ].map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedShipping === option.id
                        ? "border-[#137fec] bg-[#137fec]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value={option.id}
                      checked={selectedShipping === option.id}
                      onChange={() => setSelectedShipping(option.id)}
                      className="accent-[#137fec]"
                    />
                    <span className="text-2xl">{option.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-800">{option.label}</p>
                      <p className="text-xs text-gray-400">{option.sub}</p>
                    </div>
                    <span className={`text-sm font-bold ${option.id === "standard" ? "text-green-600" : "text-gray-800"}`}>
                      {option.price}
                    </span>
                  </label>
                ))}
              </div>
            </div> */}

            {/* Payment method */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-black text-[#101922] mb-5 flex items-center gap-2">
                <span className="w-7 h-7 bg-[#137fec]/10 text-[#137fec] rounded-lg flex items-center justify-center text-sm font-bold">3</span>
                Méthode de paiement
              </h2>

              {/* Payment tabs */}
              <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-5">
                {([
                  { id: "cash" as PaymentMethod, label: "Cash" },
                  { id: "mobile" as PaymentMethod, label: "Mobile money" },
                  // { id: "card" as PaymentMethod, label: "Carte bancaire" },
                ]).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setPaymentMethod(tab.id)}
                    className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                      paymentMethod === tab.id
                        ? "bg-[#137fec] text-white"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {paymentMethod === "cash" && (
                <div className="bg-[#f6f7f8] rounded-xl p-6 text-sm text-gray-700 space-y-2">
                  <p className="font-semibold">Paiement en espèces à la livraison</p>
                  <p className="text-xs text-gray-500">
                    Préparez le montant exact en GNF. Notre livreur vous remettra un reçu au moment de la livraison.
                  </p>
                </div>
              )}

              {paymentMethod === "mobile" && (
                <div className="bg-[#f6f7f8] rounded-xl p-6 text-sm text-gray-700 space-y-2">
                  <p className="font-semibold">Paiement par Mobile Money</p>
                  <p className="text-xs text-gray-500">
                    Après validation de la commande, un numéro Mobile Money et les instructions de paiement vous seront envoyés par SMS.
                  </p>
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Numéro de carte</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={form.cardNumber}
                        onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#137fec]/30 focus:border-[#137fec]"
                        maxLength={19}
                      />
                      <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Date d'expiration</label>
                      <input
                        type="text"
                        value={form.expiry}
                        onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                        placeholder="MM/AA"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#137fec]/30 focus:border-[#137fec]"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">CVV</label>
                      <input
                        type="text"
                        value={form.cvv}
                        onChange={(e) => setForm({ ...form, cvv: e.target.value })}
                        placeholder="123"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#137fec]/30 focus:border-[#137fec]"
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              
            </div>
          </div>

          {/* Right: Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-black text-[#101922] mb-4">Résumé de commande</h2>

              {/* Items */}
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#f6f7f8] flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-400">Qté: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-800 flex-shrink-0">
                      {(item.price * item.quantity).toLocaleString("fr-FR")} GNF
                    </p>
                  </div>
                ))}
              </div>

              {/* Promo code */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Code promo (ASG10)"
                      className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#137fec]/30 focus:border-[#137fec]"
                    />
                  </div>
                  <button
                    onClick={handleApplyPromo}
                    className="px-3 py-2 bg-[#137fec] text-white text-xs font-semibold rounded-lg hover:bg-[#0a6fd4] transition-colors"
                  >
                    Appliquer
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-xs text-green-600 font-semibold mt-1.5 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Code ASG10 appliqué — 10% de remise
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-100 pt-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Sous-total</span>
                  <span className="font-semibold">
                    {subtotal.toLocaleString("fr-FR")} GNF
                  </span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Remise (10%)</span>
                    <span className="font-semibold text-green-600">
                      -{discount.toFixed(2)} GNF
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Livraison</span>
                  <span className={`font-semibold ${shipping === 0 ? "text-green-600" : ""}`}>
                    {shipping === 0 ? "Gratuit" : `${shipping.toLocaleString("fr-FR")} GNF`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">TVA (18%)</span>
                  <span className="font-semibold">
                    {tax.toFixed(2)} GNF
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-2.5 flex justify-between">
                  <span className="font-black text-gray-900">Total</span>
                  <span className="font-black text-xl text-[#137fec]">
                    {total.toFixed(2)} GNF
                  </span>
                </div>
              </div>

              <button
                onClick={handleFinalizeOrder}
                disabled={finalizing || waitingPayment}
                className="mt-5 w-full bg-[#137fec] hover:bg-[#0a6fd4] disabled:bg-[#9fc9f5] disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-[#137fec]/30 flex items-center justify-center gap-2"
              >
                {finalizing && (
                  <span className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                )}
                <Lock className="w-4 h-4" />
                {waitingPayment
                  ? "En attente du paiement..."
                  : finalizing
                  ? "Validation en cours..."
                  : "Finaliser la commande"}
              </button>

              {/* Trust */}
              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                <Lock className="w-3.5 h-3.5" />
                <span>Paiement sécurisé 256-bit SSL</span>
              </div>

              <div className="flex items-center justify-center gap-2 mt-3 flex-wrap text-xs text-gray-500">
                <span className="bg-gray-100 px-2 py-0.5 rounded font-medium">Cash</span>
                <span className="bg-gray-100 px-2 py-0.5 rounded font-medium">Mobile money</span>
                <span className="bg-gray-100 px-2 py-0.5 rounded font-medium">Carte bancaire</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
