import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/shared/ProductCard";
import { getProducts } from "@/api/products";
import { loginClient, registerClient, updateClientInfos } from "@/api/clients";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import {
  LayoutDashboard,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Star,
  ShoppingCart,
} from "lucide-react";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Aperçu", id: "overview" },
  { icon: Package, label: "Historique commandes", id: "orders" },
  { icon: Heart, label: "Liste de souhaits", id: "wishlist", href: "/souhaits" },
  { icon: MapPin, label: "Adresses", id: "addresses" },
  
  { icon: Settings, label: "Paramètres", id: "settings" },
];

// const orders = [
//   { id: "#ORD-88294710", date: "15 Jan 2024", total: "897 600 GNF", status: "Livré", statusType: "delivered" },
//   { id: "#ORD-77183621", date: "02 Dec 2023", total: "245 000 GNF", status: "En traitement", statusType: "processing" },
//   { id: "#ORD-66072512", date: "18 Nov 2023", total: "1 299 000 GNF", status: "Livré", statusType: "delivered" },
//   { id: "#ORD-55961403", date: "01 Oct 2023", total: "89 000 GNF", status: "Annulé", statusType: "cancelled" },
//   { id: "#ORD-44850394", date: "15 Sep 2023", total: "349 000 GNF", status: "Livré", statusType: "delivered" },
// ];

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: {
    label: "En attente",
    color: "text-amber-700 bg-amber-100",
    icon: Clock,
  },
  paid: {
    label: "En cours",
    color: "text-blue-700 bg-blue-100",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Annulée",
    color: "text-red-600 bg-red-100",
    icon: XCircle,
  },
  delivered: {
    label: "Livrée",
    color: "text-green-700 bg-green-100",
    icon: CheckCircle,
  },
};

const getOrderStatusMeta = (rawStatus: unknown) => {
  const key = String(rawStatus || "pending").toLowerCase();
  return statusConfig[key] || {
    label: "En attente",
    color: "text-amber-700 bg-amber-100",
    icon: Clock,
  };
};

const trackingSteps = [
  { label: "Commandée", done: true },
  { label: "Expédiée", done: true },
  { label: "En route", done: false },
  { label: "Livrée", done: false },
];

type AddressSectionProps = {
  client: any;
  token: string | null;
  updateClient: (patch: Partial<any>) => void;
};

function AddressSection({ client, token, updateClient }: AddressSectionProps) {
  const [address, setAddress] = useState<string>(client.address || "");
  const [saving, setSaving] = useState(false);
   const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (!address.trim()) return;
    setSaving(true);
    try {
      if (token) {
        const updated = await updateClientInfos(token, {
          address: address.trim(),
        });
        // If backend returns updated client, prefer it; otherwise just patch locally
        if (updated && typeof updated === "object") {
          updateClient(updated as any);
        } else {
          updateClient({ address: address.trim() });
        }
      } else {
        updateClient({ address: address.trim() });
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (error) {
      console.error("Failed to update client address", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-[#101922]">Adresses</h2>
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
          Adresse principale
        </label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          placeholder="Ex: ALMAMYA KALOUM"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#137fec]/30 focus:border-[#137fec] resize-none"
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={!address.trim() || saving}
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#137fec] hover:bg-[#0a6fd4] disabled:bg-[#9fc9f5] disabled:cursor-not-allowed text-white text-xs font-semibold transition-all"
        >
          {saving ? "Enregistrement..." : "Enregistrer l'adresse"}
        </button>
        {success && (
          <p className="text-xs text-green-600 font-semibold">
            Adresse mise à jour avec succès.
          </p>
        )}
      </div>

      <p className="text-xs text-gray-400">
        Cette adresse sera utilisée pour vos livraisons et provient de votre
        profil client. Les modifications sont enregistrées localement pour
        cette session.
      </p>
    </div>
  );
}

export default function AccountPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const ordersSectionRef = useRef<HTMLDivElement | null>(null);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const { client, token, loginWithToken, logout, updateClient, refreshClient } =
    useAuth();
  const navigate = useNavigate();
  const [recommended, setRecommended] = useState<any[]>([]);
  const [recommendedLoading, setRecommendedLoading] = useState(false);

  const displayName =
    (client &&
      (client.name ||
        (client as any).fullName ||
        (client as any).full_name ||
        (client as any).username ||
        client.email)) ||
    "Invité";

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const goToOrders = () => {
    setActiveSection("orders");
    setMobileMenuOpen(false);
    window.requestAnimationFrame(() => {
      ordersSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      if (authTab === "login") {
        const data = await loginClient(authForm.email, authForm.password);
        const token = (data as any).token;
        if (!token) {
          setAuthError("Réponse de connexion invalide (token manquant).");
          return;
        }
        await loginWithToken(token);
        navigate("/compte");
      } else {
        if (!authForm.name || !authForm.email || !authForm.password || !authForm.address) {
          setAuthError(
            "Veuillez renseigner votre nom, email, mot de passe et adresse."
          );
          return;
        }

        const data = await registerClient({
          name: authForm.name,
          type: "INDIVIDUAL",
          email: authForm.email,
          password: authForm.password,
          phone: authForm.phone,
          address: authForm.address,
        });
        const token = (data as any).token;
        if (!token) {
          setAuthError("Réponse d'inscription invalide (token manquant).");
          return;
        }
        await loginWithToken(token);
        navigate("/compte");
      }
    } catch (err: any) {
      if (err.status === 409) {
        setAuthError("Un compte existe déjà avec cet email. Essayez de vous connecter.");
      } else if (err.status === 401) {
        setAuthError("Email ou mot de passe incorrect.");
      } else {
        setAuthError("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const clientOrders: any[] = Array.isArray((client as any)?.orders)
    ? (client as any).orders
    : [];
  const ordersCount = clientOrders.length;
  const { items: wishlistItems } = useWishlist();

  useEffect(() => {
    let cancelled = false;
    const loadRecommended = async () => {
      try {
        setRecommendedLoading(true);
        const data = await getProducts();
        if (cancelled) return;
        const list = (data || []) as any[];
        const sorted = list
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          )
          .slice(0, 4)
          .map((p) => {
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
          });
        setRecommended(sorted);
      } catch (error) {
        console.error("Failed to load recommended products", error);
      } finally {
        if (!cancelled) setRecommendedLoading(false);
      }
    };
    loadRecommended();
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep orders/client info fresh while user is on account page
  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const tick = async () => {
      try {
        await refreshClient();
      } catch {
        // ignore
      }
    };

    // Fetch immediately on entering the page
    tick();

    // Poll every 10 seconds
    const interval = window.setInterval(() => {
      if (cancelled) return;
      tick();
    }, 10000);

    // Refresh when user refocuses the tab
    const onFocus = () => tick();
    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [token, refreshClient]);

  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!client && (
          <div className="max-w-xl mx-auto mb-10">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex mb-4 border border-gray-200 rounded-xl overflow-hidden">
                {[
                  { id: "login", label: "Se connecter" },
                  { id: "register", label: "Créer un compte" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setAuthTab(tab.id as "login" | "register");
                      setAuthError(null);
                    }}
                    className={`flex-1 py-2.5 text-sm font-semibold transition-all ${
                      authTab === tab.id
                        ? "bg-[#137fec] text-white"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authTab === "register" && (
                  <input
                    type="text"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    placeholder="Nom complet"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#137fec]/30 focus:border-[#137fec]"
                  />
                )}
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  placeholder="Email"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#137fec]/30 focus:border-[#137fec]"
                />
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  placeholder="Mot de passe"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#137fec]/30 focus:border-[#137fec]"
                />
                {authTab === "register" && (
                  <>
                    <input
                      type="text"
                      value={authForm.phone}
                      onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                      placeholder="Téléphone"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#137fec]/30 focus:border-[#137fec]"
                    />
                    <input
                      type="text"
                      value={authForm.address}
                      onChange={(e) => setAuthForm({ ...authForm, address: e.target.value })}
                      placeholder="Adresse"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#137fec]/30 focus:border-[#137fec]"
                    />
                  </>
                )}

                {authError && (
                  <p className="text-xs text-red-500">{authError}</p>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-[#137fec] hover:bg-[#0a6fd4] disabled:bg-[#9fc9f5] disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                >
                  {authLoading && (
                    <span className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                  )}
                  {authTab === "login"
                    ? authLoading
                      ? "Connexion..."
                      : "Se connecter"
                    : authLoading
                    ? "Création du compte..."
                    : "Créer un compte"}
                </button>
              </form>
            </div>
          </div>
        )}

        {client && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Mobile header (profile + quick nav) */}
            <div className="lg:hidden space-y-3">
              <div className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#137fec]/10 rounded-full flex items-center justify-center text-[#137fec] text-lg font-black">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-gray-900 truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {client.email || "—"}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className="text-xs font-semibold text-red-500 border border-red-200 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-2 overflow-x-auto">
                <div className="flex gap-2 min-w-max">
                  {sidebarLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => setActiveSection(link.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                        activeSection === link.id
                          ? "bg-[#137fec] text-white"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar (desktop) */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {/* Profile */}
                <div className="bg-gradient-to-r from-[#137fec] to-[#0a5fb8] p-6 text-white">
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl font-black mb-3">
                    {initials}
                  </div>
                  <p className="font-black text-lg">{displayName}</p>
                  <p className="text-white/70 text-sm">
                    {client.email || "—"}
                  </p>
                  <span className="inline-block mt-2 text-xs font-bold bg-amber-400 text-amber-900 px-2.5 py-1 rounded-full">
                    ⭐ Client ASG
                  </span>
                </div>

                {/* Nav */}
                <nav className="p-3">
                  {sidebarLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => setActiveSection(link.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 group ${
                        activeSection === link.id
                          ? "bg-[#137fec]/10 text-[#137fec]"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <link.icon
                          className={`w-4 h-4 ${
                            activeSection === link.id
                              ? "text-[#137fec]"
                              : "text-gray-400 group-hover:text-gray-600"
                          }`}
                        />
                        {link.label}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-30" />
                    </button>
                  ))}

                  <hr className="my-2 border-gray-100" />

                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Se déconnecter
                  </button>
                </nav>
              </div>
            </div>

            {/* Main content */}
            <div className="lg:col-span-3 space-y-5">
              {/* Overview */}
              {activeSection === "overview" && (
                <>
                  {/* Welcome & account info */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h2 className="text-xl font-black text-[#101922] mb-1">
                      Bonjour, {displayName} 👋
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Voici un aperçu de votre compte ASG.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-5">
                      <div className="bg-[#f6f7f8] rounded-xl p-4">
                        <p className="text-xs font-semibold text-gray-500 mb-1">
                          Email
                        </p>
                        <p className="text-sm font-medium text-gray-800 break-all">
                          {client.email || "—"}
                        </p>
                      </div>
                      <div className="bg-[#f6f7f8] rounded-xl p-4">
                        <p className="text-xs font-semibold text-gray-500 mb-1">
                          Téléphone
                        </p>
                        <p className="text-sm font-medium text-gray-800">
                          {(client as any).phone || "—"}
                        </p>
                      </div>
                      <div className="bg-[#f6f7f8] rounded-xl p-4 sm:col-span-2 lg:col-span-1">
                        <p className="text-xs font-semibold text-gray-500 mb-1">
                          Adresse
                        </p>
                        <p className="text-sm font-medium text-gray-800 line-clamp-2">
                          {(client as any).address || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-5">
                      <div className="bg-[#f6f7f8] rounded-xl p-4 text-center">
                        <div className="w-10 h-10 text-[#137fec] bg-[#137fec]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <Package className="w-5 h-5" />
                        </div>
                        <p className="text-xl font-black text-gray-800">
                          {ordersCount}
                        </p>
                        <p className="text-xs text-gray-500">Commandes</p>
                      </div>
                      <div className="bg-[#f6f7f8] rounded-xl p-4 text-center">
                        <div className="w-10 h-10 text-red-500 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <Heart className="w-5 h-5" />
                        </div>
                        <p className="text-xl font-black text-gray-800">
                          {wishlistItems.length}
                        </p>
                        <p className="text-xs text-gray-500">Souhaits</p>
                      </div>
                      <div className="bg-[#f6f7f8] rounded-xl p-4 text-center col-span-2 sm:col-span-1">
                        <div className="w-10 h-10 text-amber-500 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <Star className="w-5 h-5" />
                        </div>
                        <p className="text-xl font-black text-gray-800">
                          {ordersCount > 0 ? "Actif" : "Nouveau"}
                        </p>
                        <p className="text-xs text-gray-500">Statut client</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent order (dynamic if available) */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-lg font-black text-[#101922]">
                        Commande récente
                      </h2>
                      {ordersCount > 0 && (
                        <button
                          type="button"
                          onClick={goToOrders}
                          className="text-xs font-semibold text-[#137fec] hover:underline flex items-center gap-1"
                        >
                          Voir tout l'historique
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {ordersCount === 0 ? (
                      <div className="bg-[#f6f7f8] rounded-xl p-4 text-sm text-gray-600">
                        Vous n'avez pas encore passé de commande. Votre prochaine
                        commande apparaîtra ici.
                      </div>
                    ) : (
                      (() => {
                        const lastOrder = clientOrders[0];
                        const createdAt = lastOrder.createdAt || lastOrder.date;
                        const total = lastOrder.total ?? lastOrder.amount;
                        const statusMeta = getOrderStatusMeta(lastOrder.status);
                        const items = Array.isArray(lastOrder.items)
                          ? lastOrder.items
                          : [];
                        const firstItem = items[0];

                        return (
                          <div className="flex items-center gap-4 bg-[#f6f7f8] rounded-xl p-3">
                            {firstItem?.image ? (
                              <img
                                src={firstItem.image}
                                alt={firstItem.name || "Produit"}
                                className="w-14 h-14 rounded-xl object-cover"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                ASG
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-bold text-gray-800 line-clamp-2">
                                {firstItem?.name || "Commande ASG"}
                              </p>
                              <p className="text-xs text-gray-400">
                                #{lastOrder.id ?? lastOrder.code ?? "—"}
                                {createdAt && ` · ${new Date(createdAt).toLocaleString()}`}
                              </p>
                              <p className="text-xs text-[#137fec] font-semibold mt-1">
                                {statusMeta.label}
                              </p>
                            </div>
                            {typeof total === "number" && (
                              <p className="text-sm font-black text-gray-900">
                                {total.toLocaleString("fr-FR")} GNF
                              </p>
                            )}
                          </div>
                        );
                      })()
                    )}
                  </div>
                </>
              )}

              {/* Orders section (dynamic from client.orders) */}
              {(activeSection === "overview" || activeSection === "orders") && (
                <div
                  ref={ordersSectionRef}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden scroll-mt-24"
                >
                  <div className="p-6 pb-0">
                    <h2 className="text-lg font-black text-[#101922]">
                      Historique des commandes
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Retrouvez ici toutes les commandes passées avec votre compte.
                    </p>
                  </div>

                  {ordersCount === 0 ? (
                    <div className="p-6 text-sm text-gray-600">
                      Vous n'avez pas encore de commandes. Commencez vos achats
                      pour voir apparaître votre historique ici.
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-100">
                              {["ID commande", "Date", "Statut", "Total"].map(
                                (col) => (
                                  <th
                                    key={col}
                                    className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-6 py-4"
                                  >
                                    {col}
                                  </th>
                                )
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {clientOrders.map((order) => {
                              const createdAt =
                                order.createdAt || order.date || order.iat;
                              const total =
                                order.total ??
                                order.amount ??
                                (Array.isArray(order.items)
                                  ? order.items.reduce(
                                      (sum: number, it: any) =>
                                        sum +
                                        (it.price || 0) *
                                          (it.quantity || 1),
                                      0
                                    )
                                  : null);
                              const statusMeta = getOrderStatusMeta(order.status);

                              return (
                                <tr
                                  key={order.id}
                                  className="border-b border-gray-50 hover:bg-[#f6f7f8] transition-colors"
                                >
                              <td className="px-6 py-4 text-sm font-bold text-[#137fec]">
                                {String(order.id).slice(-12)}
                              </td>
                                  <td className="px-6 py-4 text-sm text-gray-600">
                                    {createdAt
                                      ? new Date(createdAt).toLocaleString()
                                      : "—"}
                                  </td>
                                  <td className="px-6 py-4">
                                    <span
                                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${statusMeta.color}`}
                                    >
                                      {statusMeta.label}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-sm font-bold text-gray-800">
                                    {typeof total === "number"
                                      ? `${total.toLocaleString("fr-FR")} GNF`
                                      : "—"}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Wishlist section */}
              {activeSection === "wishlist" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="text-lg font-black text-[#101922] mb-2">
                    Liste de souhaits
                  </h2>
                  <p className="text-xs text-gray-400 mb-4">
                    Retrouvez ici les produits que vous avez ajoutés à vos favoris.
                  </p>
                  <div className="py-6 text-sm text-gray-600">
                    Vous n'avez pas encore de produits dans votre liste de souhaits.
                  </div>
                </div>
              )}

              {/* Addresses section */}
              {activeSection === "addresses" && (
                <AddressSection client={client} token={token} updateClient={updateClient} />
              )}

              {/* Payment methods section */}
              {activeSection === "payment" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="text-lg font-black text-[#101922] mb-2">
                    Méthodes de paiement
                  </h2>
                  <p className="text-xs text-gray-400 mb-4">
                    Vous pourrez bientôt enregistrer vos moyens de paiement
                    préférés ici.
                  </p>
                  <div className="py-6 text-sm text-gray-600">
                    Aucune méthode de paiement enregistrée pour le moment.
                  </div>
                </div>
              )}

              {/* Settings section */}
              {activeSection === "settings" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                  <h2 className="text-lg font-black text-[#101922] mb-2">
                    Paramètres du compte
                  </h2>
                  <p className="text-xs text-gray-400 mb-4">
                    Consultez et ajustez les informations principales de votre compte.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        value={client.name || ""}
                        readOnly
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        value={client.email || ""}
                        readOnly
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Téléphone
                      </label>
                      <input
                        type="text"
                        value={(client as any).phone || ""}
                        readOnly
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Adresse
                      </label>
                      <textarea
                        value={(client as any).address || ""}
                        readOnly
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 text-sm resize-none"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    Ces informations proviennent de votre profil client chargé via l'API
                    et ne sont pas encore modifiables depuis cette interface.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="mt-12">
          <h2 className="text-2xl font-black text-[#101922] mb-2">
            Recommandé pour vous
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Une sélection de produits récents qui pourraient vous intéresser.
          </p>
          {recommendedLoading ? (
            <div className="py-6 text-sm text-gray-500">
              Chargement des recommandations...
            </div>
          ) : recommended.length === 0 ? (
            <div className="py-6 text-sm text-gray-500">
              Aucun produit recommandé pour le moment.
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {recommended.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
