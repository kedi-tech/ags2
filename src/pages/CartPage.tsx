import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/shared/Breadcrumb";
import ProductCard from "@/components/shared/ProductCard";
import {
  Plus,
  Minus,
  Heart,
  Trash2,
  Truck,
  Gift,
  CreditCard,
  ArrowRight,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const cartItems = [
  {
    id: 1,
    name: "Casque Audio Premium",
    sku: "SKU-CAP-001",
    variant: "Noir / Standard",
    price: 299,
    originalPrice: 349,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80",
  },
  {
    id: 2,
    name: "Montre Series 7",
    sku: "SKU-MS7-002",
    variant: "Argent / 44mm",
    price: 449,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80",
  },
  {
    id: 3,
    name: "Enceinte SoundBar Pro",
    sku: "SKU-ESP-003",
    variant: "Blanc / 120W",
    price: 89,
    originalPrice: 129,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=200&q=80",
  },
];

const recommendations = [
  { id: 10, name: "AirPods Pro 2", category: "Audio", price: 249, image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&q=80", rating: 4.9, reviews: 892 },
  { id: 11, name: "iPad Air M2", category: "Tablette", price: 699, originalPrice: 799, image: "https://images.unsplash.com/photo-1544244015-0df4702b5573?w=400&q=80", rating: 4.8, reviews: 345 },
  { id: 12, name: "MacBook Air M3", category: "Ordinateur", price: 1199, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80", rating: 4.9, reviews: 567 },
  { id: 13, name: "iPhone 15 Pro", category: "Téléphone", price: 1129, image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80", rating: 4.8, reviews: 1204 },
];

export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState(cartItems);

  const updateQuantity = (id: number, delta: number) => {
    setItems(items.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ));
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={[{ name: "Votre Panier" }]} />

        <div className="mt-6 flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-[#101922]">
            Votre Panier{" "}
            <span className="text-[#137fec]">({items.length} articles)</span>
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">Votre panier est vide</h2>
            <p className="text-gray-400 mb-6">Découvrez nos produits et ajoutez-en à votre panier</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[#137fec] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#0a6fd4] transition-colors"
            >
              Continuer les achats
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Free shipping banner */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">
                    🎉 Livraison express gratuite appliquée !
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Gift className="w-4 h-4 text-[#137fec]" />
                  <span className="text-xs text-gray-600">Dépensez encore 63&nbsp;000 GNF pour débloquer un cadeau mystère</span>
                </div>
                <div className="mt-2 bg-white rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#137fec] to-blue-400 h-full rounded-full" style={{ width: "82%" }} />
                </div>
              </div>

              {/* Items */}
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#f6f7f8] flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm sm:text-base font-bold text-gray-800 leading-tight">{item.name}</h3>
                          <p className="text-xs text-gray-400 mt-0.5">{item.sku} · {item.variant}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-base font-black text-gray-900">
                            {(item.price * item.quantity).toLocaleString("fr-FR")} GNF
                          </p>
                          {item.originalPrice && (
                            <p className="text-xs text-gray-400 line-through">
                              {(item.originalPrice * item.quantity).toLocaleString("fr-FR")} GNF
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                        {/* Quantity control */}
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-[#f6f7f8]">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="px-3 py-1.5 hover:bg-gray-200 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5 text-gray-600" />
                          </button>
                          <span className="px-3 py-1.5 text-sm font-bold text-gray-800 min-w-[36px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="px-3 py-1.5 hover:bg-gray-200 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5 text-gray-600" />
                          </button>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <button className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-500 hover:text-[#137fec] hover:bg-[#137fec]/5 rounded-lg transition-colors">
                            <Heart className="w-3.5 h-3.5" />
                            <span className="hidden sm:block">Liste de souhaits</span>
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:block">Supprimer</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue shopping */}
              <Link
                to="/"
                className="flex items-center gap-2 text-sm font-semibold text-[#137fec] hover:underline py-2"
              >
                ← Continuer les achats
              </Link>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                <h2 className="text-lg font-black text-[#101922] mb-5">Résumé de la Commande</h2>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Sous-total</span>
                    <span className="font-semibold text-gray-800">
                      {subtotal.toLocaleString("fr-FR")} GNF
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Livraison</span>
                    <span className="font-semibold text-green-600">GRATUIT</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Taxes (TVA 20%)</span>
                    <span className="font-semibold text-gray-800">
                      {(subtotal * 0.2).toLocaleString("fr-FR")} GNF
                    </span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="font-black text-gray-900">Total</span>
                    <span className="font-black text-xl text-[#137fec]">
                    {(subtotal * 1.2).toLocaleString("fr-FR")} GNF
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/paiement")}
                  className="w-full bg-[#137fec] hover:bg-[#0a6fd4] text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-[#137fec]/30 flex items-center justify-center gap-2"
                >
                  Commander maintenant
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  to="/"
                  className="mt-3 w-full text-center text-sm font-medium text-gray-600 hover:text-[#137fec] py-2 block transition-colors"
                >
                  Continuer les achats
                </Link>

                {/* Payment methods */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400 text-center mb-3">Paiement sécurisé</p>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {["Visa", "Mastercard", "PayPal", "Apple Pay"].map((method) => (
                      <span
                        key={method}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Trust */}
                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Paiement 100% sécurisé SSL</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="mt-12">
          <h2 className="text-2xl font-black text-[#101922] mb-6">Vous pourriez aussi aimer</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
