import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { getProducts } from "@/api/products";
import {
  Heart,
  Share2,
  ShoppingCart,
  X,
  Filter,
  ChevronDown,
  Gift,
  Star,
  AlertTriangle,
  TrendingDown,
} from "lucide-react";

type WishlistTab = "wishlist" | "saved";

const wishlistItems = [
  {
    id: 1,
    name: "MacBook Pro M3 14\"",
    category: "Ordinateurs",
    price: 1999,
    originalPrice: 2299,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
    rating: 4.9,
    status: "in-stock",
    badge: "Alerte baisse de prix",
  },
  {
    id: 2,
    name: "Sony WH-1000XM5",
    category: "Audio",
    price: 349,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    rating: 4.8,
    status: "in-stock",
    badge: null,
  },
  {
    id: 3,
    name: "iPhone 15 Pro Max",
    category: "Téléphones",
    price: 1329,
    originalPrice: 1459,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80",
    rating: 4.9,
    status: "limited",
    badge: "Stock limité",
  },
  {
    id: 4,
    name: "Nike Air Max 2024",
    category: "Sport",
    price: 189,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    rating: 4.7,
    status: "in-stock",
    badge: null,
  },
  {
    id: 5,
    name: "Samsung Galaxy Tab S9",
    category: "Tablettes",
    price: 799,
    originalPrice: 899,
    image: "https://images.unsplash.com/photo-1544244015-0df4702b5573?w=400&q=80",
    rating: 4.6,
    status: "in-stock",
    badge: null,
  },
  {
    id: 6,
    name: "Dyson V15 Detect",
    category: "Maison",
    price: 549,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    rating: 4.8,
    status: "in-stock",
    badge: null,
  },
];

const statusBadge = {
  "in-stock": { label: "En stock", color: "bg-green-100 text-green-700" },
  limited: { label: "Stock limité", color: "bg-orange-100 text-orange-700" },
  "out-of-stock": { label: "Rupture de stock", color: "bg-gray-100 text-gray-600" },
};

export default function WishlistPage() {
  const [activeTab, setActiveTab] = React.useState<WishlistTab>("wishlist");
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();
  const [sidebarRecs, setSidebarRecs] = useState<any[]>([]);
  const [recsLoading, setRecsLoading] = useState(false);

  const enrichedItems = useMemo(() => {
    if (!items.length) return [];
    // Merge any static metadata if IDs match, otherwise use minimal info
    return items.map((it) => {
      const meta = wishlistItems.find((m) => String(m.id) === String(it.id));
      return {
        ...meta,
        id: it.id,
        name: it.name,
        price: it.price,
        image: it.image,
        category: meta?.category ?? "Produits",
        originalPrice: meta?.originalPrice,
        rating: meta?.rating ?? 4.5,
        status: meta?.status ?? "in-stock",
        badge: meta?.badge ?? null,
      };
    });
  }, [items]);

  useEffect(() => {
    let cancelled = false;

    const loadRecs = async () => {
      try {
        setRecsLoading(true);
        const data = await getProducts();
        if (cancelled) return;

        const all: any[] = Array.isArray(data) ? data : [];
        const wishlistIds = new Set(items.map((it) => String(it.id)));

        const makeCard = (p: any) => {
          const firstImageUrl =
            p.images && p.images.length > 0 ? p.images[0].url : undefined;
          return {
            id: p.id,
            name: p.name,
            price: p.price ?? 0,
            image:
              firstImageUrl ||
              p.imageUrl ||
              "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
          };
        };

        const candidates = all.filter(
          (p) => !wishlistIds.has(String(p.id))
        );

        const chosen =
          (candidates.length ? candidates : all)
            .slice(0, 3)
            .map(makeCard) || [];

        setSidebarRecs(chosen);
      } catch (error) {
        console.error("Failed to load wishlist recommendations", error);
      } finally {
        if (!cancelled) setRecsLoading(false);
      }
    };

    loadRecs();

    return () => {
      cancelled = true;
    };
  }, [items]);

  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#101922]">Mes Collections</h1>
            <p className="text-gray-500 text-sm mt-1">Retrouvez tous vos articles sauvegardés</p>
          </div>
          <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-[#137fec] hover:text-[#137fec] transition-all">
            <Share2 className="w-4 h-4" />
            Partager la liste
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 w-fit mb-6">
          {([
            {
              id: "wishlist" as WishlistTab,
              label: "Ma Liste de souhaits",
              count: enrichedItems.length,
            },
            {
              id: "saved" as WishlistTab,
              label: "Sauvegardé pour plus tard",
              count: 0,
            },
          ]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-[#137fec] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.id ? "bg-white/20" : "bg-gray-100"}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main grid */}
          <div className="lg:col-span-3">
            {/* Controls */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <p className="text-sm text-gray-500 font-medium">
                <span className="font-black text-gray-800">
                  {enrichedItems.length} Article
                  {enrichedItems.length > 1 ? "s" : ""}
                </span>
              </p>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 px-3 py-2 rounded-xl hover:border-gray-300 transition-all">
                  <Filter className="w-3.5 h-3.5" />
                  Trier : Plus récent
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Grid */}
            {enrichedItems.length === 0 ? (
              <div className="py-10 text-sm text-gray-600">
                Vous n'avez pas encore de produits dans votre liste de souhaits.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {enrichedItems.map((item) => {
                  const status =
                    statusBadge[item.status as keyof typeof statusBadge] ??
                    statusBadge["in-stock"];
                  const discount = item.originalPrice
                    ? Math.round(
                        ((item.originalPrice - item.price) /
                          item.originalPrice) *
                          100
                      )
                    : null;
                  return (
                  <div key={item.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative">
                    {/* Remove btn */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>

                    {/* Image */}
                    <div className="aspect-square bg-[#f6f7f8] relative overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {discount && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          -{discount}%
                        </span>
                      )}
                    </div>

                    <div className="p-4">
                      <p className="text-xs text-[#137fec] font-semibold mb-1">{item.category}</p>
                      <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-2">{item.name}</h3>

                      {/* Stars */}
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3 h-3 ${s <= Math.floor(item.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}`} />
                        ))}
                      </div>

                      {/* Status badges */}
                      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                        {item.badge && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#137fec]/10 text-[#137fec] flex items-center gap-1">
                            {item.badge === "Alerte baisse de prix" && <TrendingDown className="w-3 h-3" />}
                            {item.badge === "Stock limité" && <AlertTriangle className="w-3 h-3" />}
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="font-black text-gray-900">
                          {item.price.toLocaleString("fr-FR")} GNF
                        </span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            {item.originalPrice.toLocaleString("fr-FR")} GNF
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          className="flex-1 bg-[#137fec] hover:bg-[#0a6fd4] text-white text-xs font-semibold py-2 rounded-xl transition-all flex items-center justify-center gap-1.5"
                          onClick={() =>
                            addItem({
                              id: item.id,
                              name: item.name,
                              price: item.price,
                              image: item.image,
                            })
                          }
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Ajouter au panier
                        </button>
                        <button
                          className="px-3 py-2 border border-gray-200 rounded-xl hover:border-[#137fec] hover:text-[#137fec] transition-all"
                          onClick={() => {
                            const url = `${window.location.origin}/produit/${item.id}`;
                            if (navigator.share) {
                              navigator
                                .share({
                                  title: item.name,
                                  text: "Découvre ce produit sur AGS",
                                  url,
                                })
                                .catch(() => {});
                            } else if (navigator.clipboard) {
                              navigator.clipboard.writeText(url).then(
                                () => {
                                  alert("Lien du produit copié dans le presse-papiers.");
                                },
                                () => {
                                  alert("Impossible de copier le lien.");
                                },
                              );
                            } else {
                              alert(url);
                            }
                          }}
                        >
                          <Share2 className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Recommendations */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-base font-black text-[#101922] mb-4">
                Recommandé pour vous
              </h3>
              {recsLoading ? (
                <div className="py-4 text-xs text-gray-500">
                  Chargement des recommandations...
                </div>
              ) : sidebarRecs.length === 0 ? (
                <div className="py-4 text-xs text-gray-500">
                  Aucune recommandation disponible pour le moment.
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {sidebarRecs.map((rec) => (
                      <Link
                        key={rec.id}
                        to={`/produit/${rec.id}`}
                        className="flex items-center gap-3 group"
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#f6f7f8] flex-shrink-0">
                          <img
                            src={rec.image}
                            alt={rec.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 line-clamp-2 group-hover:text-[#137fec] transition-colors">
                            {rec.name}
                          </p>
                          <p className="text-xs font-bold text-[#137fec] mt-0.5">
                            {rec.price.toLocaleString("fr-FR")} GNF
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <button
                    className="mt-4 w-full py-2 text-xs font-semibold text-[#137fec] border border-[#137fec]/30 rounded-xl hover:bg-[#137fec] hover:text-white transition-all"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    Voir plus de produits
                  </button>
                </>
              )}
            </div>

            {/* Gift widget */}
            <div className="bg-gradient-to-br from-[#137fec] to-[#0a5fb8] rounded-2xl p-5 text-white">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                <Gift className="w-5 h-5" />
              </div>
              <h3 className="font-black text-base mb-1">Offrir à un ami ?</h3>
              <p className="text-white/70 text-xs mb-4">
                Partagez votre liste ou créez un lien cadeau personnalisé.
              </p>
              <button className="w-full py-2.5 bg-white text-[#137fec] font-bold text-xs rounded-xl hover:shadow-md transition-all">
                Créer un lien cadeau
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
