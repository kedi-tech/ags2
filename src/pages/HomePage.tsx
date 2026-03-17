import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/shared/ProductCard";
import { getCategories } from "@/api/category";
import { getProducts } from "@/api/products";
import {
  Monitor,
  Home as HomeIcon,
  Shirt,
  Gamepad2,
  Sparkles,
  Dumbbell,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";

type ApiCategory = {
  id: number | string;
  name: string;
  slug?: string;
  icon?: string;
  products?: { id: number | string }[];
  description?: string;
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  devices: Monitor,
  home: HomeIcon,
  spa: Sparkles,
  fashion: Shirt,
  games: Gamepad2,
  sport: Dumbbell,
};

const heroSlides = [
  {
    badge: "Vente Tech Été",
    title: "Élevez Votre Style de Vie",
    subtitle: "Découvrez notre sélection premium de produits tech, mode et maison avec des offres exceptionnelles.",
    bg: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80",
    cta: "/categorie/electronique",
  },
  {
    badge: "Nouveautés Mode",
    title: "La Mode Selon Vous",
    subtitle: "Exprimez votre style avec les dernières tendances de la saison.",
    bg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80",
    cta: "/categorie/mode",
  },
  {
    badge: "Maison & Déco",
    title: "Votre Intérieur de Rêve",
    subtitle: "Transformez votre espace avec notre collection maison connectée.",
    bg: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=80",
    cta: "/categorie/maison-jardin",
  },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [categoriesData, productsData] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);
        if (!isMounted) return;

        setCategories(categoriesData || []);

        const sorted = (productsData || [])
          .slice()
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          )
          .slice(0, 5)
          .map((p: any) => {
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

        setNewArrivals(sorted);
      } catch (error) {
        console.error("Failed to load home data", error);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const prevSlide = () => setCurrentSlide((s) => (s - 1 + heroSlides.length) % heroSlides.length);
  const nextSlide = () => setCurrentSlide((s) => (s + 1) % heroSlides.length);

  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden" style={{ aspectRatio: "21/9", minHeight: "300px", maxHeight: "580px" }}>
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ${idx === currentSlide ? "opacity-100" : "opacity-0"}`}
          >
            <img
              src={slide.bg}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#101922]/80 via-[#101922]/40 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-xl">
                  <span className="inline-flex items-center gap-2 bg-[#137fec] text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wide">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    {slide.badge}
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-6 max-w-md">
                    {slide.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to={slide.cta}
                      className="inline-flex items-center gap-2 bg-[#137fec] hover:bg-[#0a6fd4] text-white font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-[#137fec]/30 text-sm"
                    >
                      Voir la Collection
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/categorie/promotions"
                      className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl transition-all border border-white/20 text-sm"
                    >
                      Voir les Offres
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all rounded-full ${
                idx === currentSlide
                  ? "w-6 h-2 bg-white"
                  : "w-2 h-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: "50K+", label: "Clients satisfaits" },
              { value: "10K+", label: "Produits disponibles" },
              { value: "24/7", label: "Support client" },
              { value: "98%", label: "Avis positifs" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl font-black text-[#137fec]">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#101922]">Acheter par Catégorie</h2>
            <p className="text-gray-500 text-sm mt-1">Explorez nos collections par univers</p>
          </div>
          <Link
            to="/categories"
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-[#137fec] hover:underline"
          >
            Tout voir <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon =
              (cat.icon && iconMap[cat.icon]) ||
              Monitor;
            const slug = cat.slug ?? String(cat.id);
            const count = cat.products?.length ?? 0;
            return (
              <Link
                key={slug}
                to={`/categorie/${slug}`}
                className="group bg-white rounded-2xl border border-gray-100 p-5 text-center hover:border-[#137fec]/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-gray-800 group-hover:text-[#137fec] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {count} produit{count > 1 ? "s" : ""}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Promotions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#101922]">Promotions en Vedette</h2>
            <p className="text-gray-500 text-sm mt-1">Offres limitées dans le temps</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="relative rounded-2xl overflow-hidden group" style={{ height: "300px" }}>
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
              alt="Audio Premium"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#101922]/70 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center p-8">
              <span className="text-[#137fec] text-xs font-bold uppercase tracking-widest mb-2">Audio Premium</span>
              <h3 className="text-2xl font-black text-white mb-2">Pure Expérience Sonore</h3>
              <p className="text-white/70 text-sm mb-5">Jusqu'à -40% sur les casques haut de gamme</p>
              <Link
                to="/categorie/audio"
                className="inline-flex items-center gap-2 bg-white text-[#101922] font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-[#137fec] hover:text-white transition-all w-fit"
              >
                Explorer <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative rounded-2xl overflow-hidden group" style={{ height: "300px" }}>
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
              alt="Maison Connectée"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#101922]/70 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center p-8">
              <span className="text-green-400 text-xs font-bold uppercase tracking-widest mb-2">Maison Connectée</span>
              <h3 className="text-2xl font-black text-white mb-2">Connectez Votre Vie</h3>
              <p className="text-white/70 text-sm mb-5">Smart home dès 290&nbsp;000 GNF · Livraison gratuite</p>
              <Link
                to="/categorie/maison-jardin"
                className="inline-flex items-center gap-2 bg-white text-[#101922] font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-[#137fec] hover:text-white transition-all w-fit"
              >
                Acheter <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#101922]">Nouvelles Arrivées</h2>
              <p className="text-gray-500 text-sm mt-1">Les derniers produits ajoutés à notre catalogue</p>
            </div>
            <Link
              to="/categorie/electronique"
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-[#137fec] hover:underline"
            >
              Tout voir <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="flex gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-5 sm:overflow-visible sm:pb-0">
            {newArrivals.map((product) => (
              <div key={product.id} className="min-w-[260px] sm:min-w-0 flex-shrink-0 sm:flex-shrink">
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-[#101922] to-[#137fec] rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="relative">
            <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wide">
              Programme fidélité
            </span>
            <h2 className="text-2xl sm:text-4xl font-black mb-3">Rejoignez AGS Premium</h2>
            <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto mb-6">
              Accédez à des offres exclusives, une livraison gratuite illimitée et un support prioritaire 24/7.
            </p>
            <Link
              to="/compte"
              className="inline-flex items-center gap-2 bg-white text-[#137fec] font-bold px-8 py-3 rounded-xl hover:shadow-xl transition-all text-sm sm:text-base"
            >
              Commencer maintenant <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
