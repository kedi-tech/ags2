import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/shared/ProductCard";
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
  { icon: CreditCard, label: "Méthodes de paiement", id: "payment" },
  { icon: Settings, label: "Paramètres", id: "settings" },
];

const orders = [
  { id: "#ORD-88294710", date: "15 Jan 2024", total: "897 600 GNF", status: "Livré", statusType: "delivered" },
  { id: "#ORD-77183621", date: "02 Dec 2023", total: "245 000 GNF", status: "En traitement", statusType: "processing" },
  { id: "#ORD-66072512", date: "18 Nov 2023", total: "1 299 000 GNF", status: "Livré", statusType: "delivered" },
  { id: "#ORD-55961403", date: "01 Oct 2023", total: "89 000 GNF", status: "Annulé", statusType: "cancelled" },
  { id: "#ORD-44850394", date: "15 Sep 2023", total: "349 000 GNF", status: "Livré", statusType: "delivered" },
];

const recommendations = [
  { id: 30, name: "iPad Pro M4", category: "Tablette", price: 999, image: "https://images.unsplash.com/photo-1544244015-0df4702b5573?w=400&q=80", rating: 4.9, reviews: 456 },
  { id: 31, name: "Camera Instax Wide", category: "Photo", price: 119, originalPrice: 149, image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80", rating: 4.6, reviews: 213 },
  { id: 32, name: "Gaming Mouse Pro", category: "Gaming", price: 79, image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&q=80", rating: 4.7, reviews: 328 },
  { id: 33, name: "Mechanical Keyboard", category: "Gaming", price: 149, originalPrice: 199, image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&q=80", rating: 4.8, reviews: 445 },
];

const statusConfig: Record<string, { color: string; icon: any }> = {
  delivered: { color: "text-green-700 bg-green-100", icon: CheckCircle },
  processing: { color: "text-blue-700 bg-blue-100", icon: Clock },
  cancelled: { color: "text-red-600 bg-red-100", icon: XCircle },
};

const trackingSteps = [
  { label: "Commandée", done: true },
  { label: "Expédiée", done: true },
  { label: "En route", done: false },
  { label: "Livrée", done: false },
];

export default function AccountPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Profile */}
              <div className="bg-gradient-to-r from-[#137fec] to-[#0a5fb8] p-6 text-white">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl font-black mb-3">
                  JD
                </div>
                <p className="font-black text-lg">Jean Dupont</p>
                <p className="text-white/70 text-sm">jean.dupont@email.com</p>
                <span className="inline-block mt-2 text-xs font-bold bg-amber-400 text-amber-900 px-2.5 py-1 rounded-full">
                  ⭐ Membre Premium
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
                      <link.icon className={`w-4 h-4 ${activeSection === link.id ? "text-[#137fec]" : "text-gray-400 group-hover:text-gray-600"}`} />
                      {link.label}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-30" />
                  </button>
                ))}

                <hr className="my-2 border-gray-100" />

                <Link
                  to="/"
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Se déconnecter
                </Link>
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-5">
            {/* Overview */}
            {activeSection === "overview" && (
              <>
                {/* Welcome card */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="text-xl font-black text-[#101922] mb-1">Bonjour, Jean ! 👋</h2>
                  <p className="text-gray-500 text-sm">Voici un aperçu de votre activité récente.</p>

                  <div className="grid grid-cols-3 gap-4 mt-5">
                    {[
                      { label: "Commandes", value: "12", icon: Package, color: "text-[#137fec] bg-[#137fec]/10" },
                      { label: "Souhaits", value: "8", icon: Heart, color: "text-red-500 bg-red-50" },
                      { label: "Points fidélité", value: "2,450", icon: Star, color: "text-amber-500 bg-amber-50" },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-[#f6f7f8] rounded-xl p-4 text-center">
                        <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                          <stat.icon className="w-5 h-5" />
                        </div>
                        <p className="text-xl font-black text-gray-800">{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent order */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-black text-[#101922]">Commande récente</h2>
                    <Link to="#" className="text-xs font-semibold text-[#137fec] hover:underline flex items-center gap-1">
                      Suivre le colis <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Tracking */}
                  <div className="flex items-center justify-between mb-5 relative">
                    <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200" />
                    <div className="absolute top-4 left-4 h-0.5 bg-[#137fec]" style={{ width: "50%" }} />
                    {trackingSteps.map((step, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1.5 relative z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.done ? "bg-[#137fec] text-white" : "bg-gray-100 text-gray-300"}`}>
                          {step.done ? <CheckCircle className="w-4 h-4" /> : <div className="w-2 h-2 bg-gray-300 rounded-full" />}
                        </div>
                        <p className={`text-xs font-medium ${step.done ? "text-gray-700" : "text-gray-300"}`}>{step.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Order item */}
                  <div className="flex items-center gap-4 bg-[#f6f7f8] rounded-xl p-3">
                    <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80" alt="" className="w-14 h-14 rounded-xl object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-800">Casque Audio Premium</p>
                      <p className="text-xs text-gray-400">Commande #ORD-88294710 · 15 Jan 2024</p>
                      <p className="text-xs text-[#137fec] font-semibold mt-1">En route — Livraison prévue le 18 Jan</p>
                    </div>
                    <p className="text-sm font-black text-gray-900">299&nbsp;000 GNF</p>
                  </div>
                </div>
              </>
            )}

            {/* Orders section */}
            {(activeSection === "overview" || activeSection === "orders") && (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-6 pb-0">
                  <h2 className="text-lg font-black text-[#101922]">Historique des commandes</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {["ID commande", "Date", "Total", "Statut", ""].map((col) => (
                          <th key={col} className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-6 py-4">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => {
                        const config = statusConfig[order.statusType];
                        const StatusIcon = config.icon;
                        return (
                          <tr key={order.id} className="border-b border-gray-50 hover:bg-[#f6f7f8] transition-colors">
                            <td className="px-6 py-4 text-sm font-bold text-[#137fec]">{order.id}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                            <td className="px-6 py-4 text-sm font-bold text-gray-800">{order.total}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${config.color}`}>
                                <StatusIcon className="w-3 h-3" />
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <Link to={`/produit/1`} className="text-xs font-semibold text-[#137fec] hover:underline">
                                Voir détails
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="p-6">
                  <button className="w-full py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-[#137fec] hover:text-[#137fec] transition-all">
                    Charger plus
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-12">
          <h2 className="text-2xl font-black text-[#101922] mb-6">Recommandé pour vous</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
