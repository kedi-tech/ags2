import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/shared/Breadcrumb";
import ProductCard from "@/components/shared/ProductCard";
import {
  Star,
  Heart,
  ShoppingCart,
  Package,
  Shield,
  Truck,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  Plus,
  Minus,
  Check,
} from "lucide-react";

const thumbnails = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80",
  "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=200&q=80",
  "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=200&q=80",
  "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=200&q=80",
];

const colors = [
  { name: "Minuit", hex: "#1a1a2e" },
  { name: "Or Rose", hex: "#e8c99a" },
  { name: "Argent", hex: "#c0c0c0" },
  { name: "Bleu Acier", hex: "#4a90d9" },
];

const relatedProducts = [
  { id: 5, name: "Bracelet Sport Premium", category: "Wearables", price: 49, image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&q=80", rating: 4.6 },
  { id: 6, name: "Chargeur Sans Fil 15W", category: "Accessoires", price: 29, originalPrice: 39, image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80", rating: 4.7 },
  { id: 7, name: "Boîtier Protection", category: "Accessoires", price: 19, image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=80", rating: 4.4 },
];

const accordionItems = [
  {
    title: "Détails produit",
    content: "La Zenith Smart Watch Pro est équipée d'un processeur double cœur dernière génération, d'un écran AMOLED Always-On de 1,9 pouces avec une luminosité maximale de 2 000 nits. Résistante à l'eau jusqu'à 50 mètres (5ATM). Autonomie jusqu'à 18 jours en mode économie d'énergie.",
    open: true,
  },
  {
    title: "Spécifications techniques",
    content: "Écran : AMOLED 1.9\" 448×368px | Processeur : Dual-core 1.1GHz | Mémoire : 32MB RAM / 4GB stockage | Batterie : 490mAh | Connectivité : Bluetooth 5.3, WiFi 2.4GHz, NFC | GPS intégré | Capteurs : FC, SpO2, température, accéléromètre, gyroscope",
    open: false,
  },
  {
    title: "Livraison & Retours",
    content: "Livraison standard gratuite sous 3-5 jours ouvrés. Livraison express disponible dès 15€ (24h). Retours gratuits sous 30 jours. Le produit doit être dans son emballage d'origine non endommagé.",
    open: false,
  },
];

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("44mm");
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number[]>([0]);
  const [bundleItems, setBundleItems] = useState([true, true, true]);

  const toggleAccordion = (idx: number) => {
    setOpenAccordion((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleAddToCart = () => {
    navigate("/panier");
  };

  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb
          items={[
            { name: "Électronique", href: "/categorie/electronique" },
            { name: "Wearables", href: "/categorie/wearables" },
            { name: "Zenith Smart Watch Pro" },
          ]}
        />

        {/* Main product section */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gallery */}
          <div className="flex gap-4">
            {/* Thumbnails - vertical on desktop, horizontal on mobile */}
            <div className="hidden sm:flex flex-col gap-3">
              {thumbnails.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedThumb(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedThumb === idx
                      ? "border-[#137fec] shadow-md shadow-[#137fec]/20"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img src={thumb} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="flex-1">
              <div className="relative bg-white rounded-2xl overflow-hidden group border border-gray-100">
                <img
                  src={thumbnails[selectedThumb]}
                  alt="Zenith Smart Watch Pro"
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Mobile thumbnails */}
              <div className="flex gap-2 mt-3 sm:hidden overflow-x-auto pb-1">
                {thumbnails.map((thumb, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedThumb(idx)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                      selectedThumb === idx ? "border-[#137fec]" : "border-gray-200"
                    }`}
                  >
                    <img src={thumb} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product info */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-[#137fec] bg-[#137fec]/10 px-2.5 py-1 rounded-full">
                  Wearables
                </span>
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2.5 py-1 rounded-full">
                  En stock
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#101922] leading-tight">
                Zenith Smart Watch Pro
              </h1>
              <p className="text-sm text-gray-400 mt-1">SKU: ZSW-PRO-2024</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= 4 ? "fill-amber-400 text-amber-400" : "fill-amber-200 text-amber-400"}`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700">4.5</span>
              <span className="text-sm text-gray-400">128 avis</span>
              <a href="#reviews" className="text-sm text-[#137fec] hover:underline">Voir les avis</a>
            </div>

            {/* Price */}
            <div className="bg-[#f6f7f8] rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-[#101922]">349&nbsp;000 GNF</span>
                  <span className="text-lg text-gray-400 line-through">429&nbsp;000 GNF</span>
                </div>
                <span className="text-sm text-green-600 font-semibold mt-1 block">
                  ✓ Vous économisez 80&nbsp;000 GNF (19%)
                </span>
              </div>
              <div className="text-right text-xs text-gray-500">
                <div>Prix habituel</div>
                <div className="font-semibold text-gray-700">429&nbsp;000 GNF</div>
              </div>
            </div>

            {/* Color selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-800">
                  Couleur : <span className="text-[#137fec]">{colors[selectedColor].name}</span>
                </span>
              </div>
              <div className="flex gap-2">
                {colors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(idx)}
                    className={`w-9 h-9 rounded-full border-2 transition-all ${
                      selectedColor === idx
                        ? "border-[#137fec] ring-2 ring-[#137fec]/30 ring-offset-1"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-800">Taille</span>
                <button className="text-xs text-[#137fec] hover:underline">Guide des tailles</button>
              </div>
              <div className="flex gap-2">
                {["40mm", "44mm", "48mm"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                      selectedSize === size
                        ? "border-[#137fec] bg-[#137fec]/5 text-[#137fec]"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + actions */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <span className="px-4 py-2.5 text-sm font-bold text-gray-800 min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#137fec] hover:bg-[#0a6fd4] text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-[#137fec]/30 text-sm flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Ajouter au Panier
              </button>

              <button
                onClick={() => setWishlisted(!wishlisted)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  wishlisted
                    ? "border-red-300 bg-red-50 text-red-500"
                    : "border-gray-200 hover:border-gray-300 text-gray-400"
                }`}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
              </button>
            </div>

            <button
              onClick={() => navigate("/paiement")}
              className="w-full border-2 border-[#101922] text-[#101922] hover:bg-[#101922] hover:text-white font-semibold py-3 rounded-xl transition-all text-sm"
            >
              Acheter Maintenant
            </button>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Truck, text: "Livraison gratuite", sub: "Dès 50€ d'achat" },
                { icon: Shield, text: "Garantie 2 ans", sub: "Satisfaction garantie" },
                { icon: RefreshCw, text: "Retours gratuits", sub: "30 jours pour retourner" },
                { icon: Package, text: "Emballage sécurisé", sub: "Livraison express dispo" },
              ].map((badge) => (
                <div key={badge.text} className="flex items-center gap-2.5 bg-white rounded-xl p-3 border border-gray-100">
                  <badge.icon className="w-4 h-4 text-[#137fec] flex-shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-gray-800">{badge.text}</div>
                    <div className="text-xs text-gray-400">{badge.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Accordion */}
            <div className="space-y-2">
              {accordionItems.map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                  >
                    {item.title}
                    {openAccordion.includes(idx) ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  {openAccordion.includes(idx) && (
                    <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                      <p className="pt-3">{item.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Frequently bought together */}
        <div className="mt-12 bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-black text-[#101922] mb-5">Fréquemment achetés ensemble</h2>
          <div className="flex flex-wrap items-center gap-4">
            {/* Main product */}
            <div className="flex items-center gap-3">
              <img src={thumbnails[0]} alt="" className="w-16 h-16 rounded-xl object-cover" />
              <div>
                <p className="text-xs font-semibold text-gray-800 max-w-[120px] line-clamp-2">Zenith Smart Watch Pro</p>
                <p className="text-sm font-bold text-[#137fec]">349&nbsp;000 GNF</p>
              </div>
            </div>

            <span className="text-gray-300 font-bold text-xl">+</span>

            {relatedProducts.map((product, idx) => (
              <div key={product.id} className="flex items-center gap-3">
                <div className="relative">
                  <img src={product.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
                  <input
                    type="checkbox"
                    checked={bundleItems[idx]}
                    onChange={() => {
                      const newItems = [...bundleItems];
                      newItems[idx] = !newItems[idx];
                      setBundleItems(newItems);
                    }}
                    className="absolute -top-1 -right-1 w-4 h-4 accent-[#137fec]"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800 max-w-[100px] line-clamp-2">{product.name}</p>
                  <p className="text-sm font-bold text-[#137fec]">
                    {product.price.toLocaleString("fr-FR")} GNF
                  </p>
                </div>
                {idx < relatedProducts.length - 1 && <span className="text-gray-300 font-bold text-xl">+</span>}
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-gray-100">
            <div>
              <p className="text-sm text-gray-500">Prix du bundle</p>
                <p className="text-2xl font-black text-[#101922]">
                  463&nbsp;000 GNF{" "}
                  <span className="text-sm text-green-600 font-semibold">Économisez 34&nbsp;000 GNF</span>
                </p>
            </div>
            <button className="bg-[#137fec] hover:bg-[#0a6fd4] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-[#137fec]/30 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Ajouter 3 articles au panier
            </button>
          </div>
        </div>

        {/* Related products */}
        <div className="mt-12">
          <h2 className="text-2xl font-black text-[#101922] mb-6">Vous pourriez aussi aimer</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...relatedProducts, { id: 8, name: "Earbuds Pro Max", category: "Audio", price: 149, originalPrice: 199, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80", rating: 4.8 }].map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
