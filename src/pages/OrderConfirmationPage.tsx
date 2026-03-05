import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/shared/ProductCard";
import { CheckCircle, Package, Truck, Home, UserPlus, ShoppingCart } from "lucide-react";

const timelineSteps = [
  { icon: CheckCircle, label: "Commandée", sub: "15 Jan 2024, 14:32", status: "done" },
  { icon: Package, label: "En traitement", sub: "15 Jan 2024, 15:00", status: "active" },
  { icon: Truck, label: "Expédiée", sub: "Estimé 16 Jan 2024", status: "pending" },
  { icon: Home, label: "Livrée", sub: "Estimé 18 Jan 2024", status: "pending" },
];

const recommendations = [
  { id: 20, name: "Smart Speaker Pro", category: "Audio", price: 129, originalPrice: 159, image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=400&q=80", rating: 4.7, reviews: 231, badge: "Nouveau" },
  { id: 21, name: "Fitness Tracker Plus", category: "Wearables", price: 79, image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&q=80", rating: 4.5, reviews: 189 },
  { id: 22, name: "Wireless Charger Pad", category: "Accessoires", price: 39, originalPrice: 59, image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80", rating: 4.6, reviews: 310 },
  { id: 23, name: "True Wireless Earbuds", category: "Audio", price: 99, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80", rating: 4.8, reviews: 567 },
];

export default function OrderConfirmationPage() {
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
            <span className="text-[#137fec] font-semibold">jean.dupont@email.com</span>
          </p>
          <div className="inline-flex items-center gap-2 bg-[#137fec]/10 text-[#137fec] font-bold px-4 py-2 rounded-full text-sm mt-2">
            Commande n°{" "}
            <span className="font-black">#ORD-88294710</span>
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
            <div className="bg-gradient-to-r from-[#137fec]/10 to-blue-50 rounded-2xl border border-[#137fec]/20 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#137fec] rounded-xl flex items-center justify-center flex-shrink-0">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-[#101922]">Créez votre compte AGS</h3>
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
                {[
                  { name: "Casque Audio Premium", price: 299, qty: 1, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80" },
                  { name: "Montre Series 7", price: 449, qty: 1, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80" },
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#f6f7f8] flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 line-clamp-2">{item.name}</p>
                      <p className="text-xs text-gray-400">Qté: {item.qty}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-800">
                      {item.price.toLocaleString("fr-FR")} GNF
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Sous-total</span>
                  <span className="font-semibold">748&nbsp;000 GNF</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Livraison</span>
                  <span className="font-semibold text-green-600">Gratuit</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">TVA</span>
                  <span className="font-semibold">149&nbsp;600 GNF</span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between">
                  <span className="font-black text-gray-900">Total</span>
                  <span className="font-black text-xl text-[#137fec]">897&nbsp;600 GNF</span>
                </div>
              </div>

              {/* Delivery details */}
              <div className="mt-5 pt-5 border-t border-gray-100">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Livraison</h3>
                <div className="space-y-1.5 text-sm text-gray-600">
                  <p className="font-semibold text-gray-800">Jean Dupont</p>
                  <p>123 Rue de la Paix</p>
                  <p>75001 Paris, France</p>
                  <p className="text-[#137fec] font-medium mt-2">📦 Livraison Standard — Estimé 18 Jan 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-12">
          <h2 className="text-2xl font-black text-[#101922] mb-6">Vous pourriez aimer</h2>
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
