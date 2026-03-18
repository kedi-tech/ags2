import React from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/shared/ProductCard";
import { useAuth } from "@/context/AuthContext";
import { getProducts } from "@/api/products";
import { CheckCircle, Package, Truck, Home, UserPlus, ShoppingCart } from "lucide-react";

const timelineSteps = [
  { icon: CheckCircle, label: "Commandée", sub: "15 Jan 2024, 14:32", status: "done" },
  { icon: Package, label: "En traitement", sub: "15 Jan 2024, 15:00", status: "active" },
  { icon: Truck, label: "Expédiée", sub: "Estimé 16 Jan 2024", status: "pending" },
  { icon: Home, label: "Livrée", sub: "Estimé 18 Jan 2024", status: "pending" },
];

export default function OrderConfirmationPage() {
  const { client } = useAuth();
  const location = useLocation();
  const state = (location.state || {}) as any;
  const [recommended, setRecommended] = React.useState<any[]>([]);
  const [recsLoading, setRecsLoading] = React.useState(false);

  const orderNumber: string =
    state.orderNumber || "ORD-88294710";

  const items: {
    id: string | number;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }[] = Array.isArray(state.items) ? state.items : [];

  const totals = state.totals || {};
  const subtotal: number = typeof totals.subtotal === "number" ? totals.subtotal : 748000;
  const shipping: number = typeof totals.shipping === "number" ? totals.shipping : 0;
  const tax: number = typeof totals.tax === "number" ? totals.tax : 149600;
  const total: number = typeof totals.total === "number" ? totals.total : 897600;

  const buyer = state.buyer || {};
  const buyerName: string =
    buyer.name || client?.name || "Client ASG";
  const buyerEmail: string =
    client?.email || buyer.email || "votre adresse email";
  const buyerPhone: string | undefined =
    client?.phone || buyer.phone;
  const buyerAddressLine: string =
    buyer.address || client?.address || "Adresse de livraison";
  const buyerCityLine: string =
    [buyer.postalCode, buyer.city, buyer.state].filter(Boolean).join(" ") ||
    "";

  React.useEffect(() => {
    let cancelled = false;

    const loadRecommended = async () => {
      try {
        setRecsLoading(true);
        const data = await getProducts();
        if (cancelled) return;
        const all: any[] = Array.isArray(data) ? data : [];
        const orderedIds = new Set(items.map((it) => String(it.id)));

        const makeCard = (p: any) => {
          const firstImageUrl =
            p.images && p.images.length > 0 ? p.images[0].url : undefined;
          return {
            id: p.id,
            name: p.name,
            category: p.category?.name ?? "Produits",
            price: p.price ?? 0,
            image:
              firstImageUrl ||
              p.imageUrl ||
              "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
          };
        };

        const candidates = all.filter(
          (p) => !orderedIds.has(String(p.id))
        );

        const chosen =
          (candidates.length ? candidates : all)
            .slice(0, 4)
            .map(makeCard) || [];

        setRecommended(chosen);
      } catch (error) {
        console.error("Failed to load confirmation recommendations", error);
      } finally {
        if (!cancelled) setRecsLoading(false);
      }
    };

    loadRecommended();
    return () => {
      cancelled = true;
    };
  }, [items]);
  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero confirmation */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#101922] mb-2">Commande Confirmée !</h1>
          <p className="text-gray-500 mb-1">
            Un email de confirmation a été envoyé à{" "}
            <span className="text-[#137fec] font-semibold">
              {buyerEmail}
            </span>
          </p>
          <div className="inline-flex items-center gap-2 bg-[#137fec]/10 text-[#137fec] font-bold px-4 py-2 rounded-full text-sm mt-2">
            Commande n°{" "}
            <span className="font-black">#{orderNumber}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Timeline + account CTA */}
          <div className="lg:col-span-2 space-y-5">
            {/* Delivery timeline */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-black text-[#101922] mb-6">Suivi de livraison</h2>
              <div className="flex items-start justify-between relative">
                {/* Connecting line */}
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200" />
                <div className="absolute top-5 left-5 h-0.5 bg-[#137fec]" style={{ width: "35%" }} />

                {timelineSteps.map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 flex-1 relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all ${
                        step.status === "done"
                          ? "bg-green-500 text-white"
                          : step.status === "active"
                          ? "bg-[#137fec] text-white ring-4 ring-[#137fec]/20"
                          : "bg-gray-100 text-gray-300"
                      }`}
                    >
                      <step.icon className="w-5 h-5" />
                    </div>
                    <p className={`text-xs font-bold text-center ${step.status === "pending" ? "text-gray-400" : "text-gray-800"}`}>
                      {step.label}
                    </p>
                    <p className={`text-xs text-center ${step.status === "pending" ? "text-gray-300" : "text-gray-400"}`}>
                      {step.sub}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Create account CTA */}
            {!client && (
              <div className="bg-gradient-to-r from-[#137fec]/10 to-blue-50 rounded-2xl border border-[#137fec]/20 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#137fec] rounded-xl flex items-center justify-center flex-shrink-0">
                    <UserPlus className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-[#101922]">Créez votre compte ASG</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Suivez vos commandes, gérez vos retours et accédez à des offres exclusives.
                    </p>
                  </div>
                  <Link
                    to="/compte"
                    className="flex-shrink-0 bg-[#137fec] hover:bg-[#0a6fd4] text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all hover:shadow-md"
                  >
                    Créer un compte
                  </Link>
                </div>
              </div>
            )}

            {/* Continue shopping */}
            <Link
              to="/"
              className="flex items-center justify-center gap-2 bg-white rounded-2xl border border-gray-100 p-4 text-sm font-semibold text-gray-700 hover:border-[#137fec]/30 hover:text-[#137fec] transition-all"
            >
              ← Continuer les achats
            </Link>
          </div>

          {/* Right: Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-black text-[#101922] mb-5">Résumé de commande</h2>

              {/* Items */}
              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#f6f7f8] flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 line-clamp-2">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400">Qté: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-800">
                      {(item.price * item.quantity).toLocaleString("fr-FR")} GNF
                    </p>
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="text-xs text-gray-400">
                    Aucune ligne de commande disponible. Ceci est un exemple de mise en page.
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Sous-total</span>
                  <span className="font-semibold">
                    {subtotal.toLocaleString("fr-FR")} GNF
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Livraison</span>
                  <span className={`font-semibold ${shipping === 0 ? "text-green-600" : ""}`}>
                    {shipping === 0
                      ? "Gratuit"
                      : `${shipping.toLocaleString("fr-FR")} GNF`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">TVA</span>
                  <span className="font-semibold">
                    {tax.toLocaleString("fr-FR")} GNF
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between">
                  <span className="font-black text-gray-900">Total</span>
                  <span className="font-black text-xl text-[#137fec]">
                    {total.toLocaleString("fr-FR")} GNF
                  </span>
                </div>
              </div>

              {/* Delivery details */}
              <div className="mt-5 pt-5 border-t border-gray-100">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Livraison</h3>
                <div className="space-y-1.5 text-sm text-gray-600">
                  <p className="font-semibold text-gray-800">{buyerName}</p>
                  <p>{buyerAddressLine}</p>
                  {buyerCityLine && <p>{buyerCityLine}</p>}
                  {/* <p className="text-[#137fec] font-medium mt-2">📦 Livraison Standard — Estimé 18 Jan 2024</p> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommended.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-black text-[#101922] mb-2">
              Vous pourriez aimer
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              D'autres produits qui pourraient compléter votre commande.
            </p>
            {recsLoading ? (
              <div className="py-6 text-sm text-gray-500">
                Chargement des recommandations...
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {recommended.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
