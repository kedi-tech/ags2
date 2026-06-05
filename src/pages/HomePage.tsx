import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/shared/ProductCard";
import ProductCardSkeleton from "@/components/shared/ProductCardSkeleton";
import { getCategories } from "@/api/category";
import { getProducts } from "@/api/products";
import { getBanners, type Banner } from "@/api/banners";
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
  Phone,
  Mail,
} from "lucide-react";

type ApiCategory = {
  id: number | string;
  name: string;
  slug?: string;
  icon?: string;
  imageUrl?: string | null;
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


export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [featuredPromos, setFeaturedPromos] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [categoriesData, productsData, bannersData] = await Promise.all([
          getCategories(),
          getProducts(),
          getBanners().catch(() => []),
        ]);
        if (!isMounted) return;

        setCategories(categoriesData || []);
        setBanners((bannersData || []).filter((b: Banner) => b.isActive !== false));

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
            const firstVideoUrl =
              p.videos && p.videos.length > 0 ? p.videos[0].url : undefined;
            return {
              id: p.id,
              name: p.name,
              category: p.category?.name ?? "Produits",
              price: p.price ?? 0,
              image: firstImageUrl || p.imageUrl || "",
              video: firstVideoUrl,
            };
          });

        setNewArrivals(sorted);

        const promos = (productsData || [])
          .filter((p: any) => p.isPromotional === true && p.promotionalPrice != null)
          .slice()
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 2)
          .map((p: any) => {
            const firstImageUrl =
              p.images && p.images.length > 0 ? p.images[0].url : undefined;
            const firstVideoUrl =
              p.videos && p.videos.length > 0 ? p.videos[0].url : undefined;
            return {
              id: p.id,
              name: p.name,
              category: p.category?.name ?? "Produits",
              price: p.promotionalPrice,
              originalPrice: p.price,
              image: firstImageUrl || p.imageUrl || "",
              video: firstVideoUrl,
            };
          });

        setFeaturedPromos(promos);

        const all = (productsData || []).map((p: any) => {
          const firstImageUrl =
            p.images && p.images.length > 0 ? p.images[0].url : undefined;
          const firstVideoUrl =
            p.videos && p.videos.length > 0 ? p.videos[0].url : undefined;
          return {
            id: p.id,
            name: p.name,
            category: p.category?.name ?? "Produits",
            price: p.price ?? 0,
            originalPrice: p.companyPrice,
            image: firstImageUrl || p.imageUrl || "",
            video: firstVideoUrl,
          };
        });
        for (let i = all.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [all[i], all[j]] = [all[j], all[i]];
        }
        setAllProducts(all);
      } catch (error) {
        console.error("Failed to load home data", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const hasMore = visibleCount < allProducts.length;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVisibleCount((prev) => prev + 8);
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, visibleCount]);

  const prevSlide = () => setCurrentSlide((s) => (s - 1 + banners.length) % banners.length);
  const nextSlide = () => setCurrentSlide((s) => (s + 1) % banners.length);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((s) => (s + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      <Header />

      {/* Hero Section */}
      {!loading && (
        <section className="relative w-full overflow-hidden" style={{ aspectRatio: "21/9", minHeight: "300px", maxHeight: "580px" }}>
          {banners.length === 0 ? (
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"
                alt="Alliance Solution"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#101922]/80 via-[#101922]/40 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-xl">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
                      Élevez Votre Style de Vie
                    </h1>
                    <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-6 max-w-md">
                      Découvrez notre sélection premium de produits tech, mode et maison avec des offres exceptionnelles.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to="/categories"
                        className="inline-flex items-center gap-2 bg-[#137fec] hover:bg-[#0a6fd4] text-white font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-[#137fec]/30 text-sm"
                      >
                        Voir la Collection
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            banners.map((banner, idx) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ${idx === currentSlide ? "opacity-100" : "opacity-0"}`}
            >
              <img
                src={banner.imageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#101922]/80 via-[#101922]/40 to-transparent" />

              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-xl">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
                      {banner.title}
                    </h1>
                    {banner.description && (
                      <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-6 max-w-md">
                        {banner.description}
                      </p>
                    )}
                    {banner.btnLink && (
                      <div className="flex flex-wrap gap-3">
                        <Link
                          to={`/${banner.btnLink}`}
                          className="inline-flex items-center gap-2 bg-[#137fec] hover:bg-[#0a6fd4] text-white font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-[#137fec]/30 text-sm"
                        >
                          Voir la Collection
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
          )}

          {banners.length > 1 && (
            <>
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
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_, idx) => (
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
            </>
          )}
        </section>
      )}

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

      {/* Contact card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#137fec] mb-1">Besoin d'aide ?</p>
            <h3 className="text-base font-black text-[#101922]">Contactez-nous</h3>
            <p className="text-xs text-gray-400 mt-0.5">Notre équipe est disponible pour vous aider</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <a
              href="tel:+224612683764"
              className="flex items-center justify-center gap-2 bg-[#137fec]/10 text-[#137fec] font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#137fec]/20 transition-colors"
            >
              <Phone className="w-4 h-4" />
              +224 612683764
            </a>
            <a
              href="mailto:alliancesolutiongroup224@gmail.com"
              className="flex items-center justify-center gap-2 bg-[#101922]/5 text-[#101922] font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#101922]/10 transition-colors"
            >
              <Mail className="w-4 h-4" />
              alliancesolutiongroup224@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#101922]">Acheter par Catégorie</h2>
            <p className="text-gray-500 text-sm mt-1">Explorez nos collections par univers</p>
          </div>
        </div>

        <div className="-mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto sm:overflow-visible pb-3 sm:pb-0">
          <div className="grid gap-3 [grid-template-rows:repeat(2,auto)] [grid-auto-flow:column] [grid-auto-columns:5rem] sm:grid-cols-4 sm:[grid-template-rows:unset] sm:[grid-auto-flow:unset] sm:[grid-auto-columns:unset] md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
            {categories.map((cat) => {
              const Icon = (cat.icon && iconMap[cat.icon]) || Monitor;
              const slug = cat.slug ?? String(cat.id);
              const count = cat.products?.length ?? 0;
              return (
                <Link
                  key={slug}
                  to={`/categorie/${slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 text-center hover:border-[#137fec]/30 hover:shadow-lg transition-all duration-300 w-20 sm:w-full"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform overflow-hidden">
                    {cat.imageUrl ? (
                      <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-[10px] sm:text-xs font-bold text-gray-800 group-hover:text-[#137fec] transition-colors line-clamp-2 leading-tight">
                    {cat.name}
                  </h3>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5">
                    {count} produit{count > 1 ? "s" : ""}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Promotions */}
      {featuredPromos.length > 0 && <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#101922]">Promotions en Vedette</h2>
            <p className="text-gray-500 text-sm mt-1">Offres limitées dans le temps</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredPromos.map((promo) => {
            const discountPercent =
              promo.originalPrice && promo.originalPrice > promo.price
                ? Math.round(((promo.originalPrice - promo.price) / promo.originalPrice) * 100)
                : null;
            return (
              <div key={promo.id} className="relative rounded-2xl overflow-hidden group" style={{ height: "300px" }}>
                <img
                  src={promo.image}
                  alt={promo.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#101922]/70 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center p-8">
                  <span className="text-[#137fec] text-xs font-bold uppercase tracking-widest mb-2">{promo.category}</span>
                  <h3 className="text-2xl font-black text-white mb-2 line-clamp-2">{promo.name}</h3>
                  <p className="text-white/70 text-sm mb-1">
                    {Number(promo.price).toLocaleString("fr-FR")} GNF
                    {promo.originalPrice && (
                      <span className="ml-2 line-through text-white/40">{Number(promo.originalPrice).toLocaleString("fr-FR")} GNF</span>
                    )}
                  </p>
                  {discountPercent && (
                    <p className="text-orange-400 text-xs font-semibold mb-4">-{discountPercent}% de réduction</p>
                  )}
                  <Link
                    to={`/produit/${promo.id}`}
                    className="inline-flex items-center gap-2 bg-white text-[#101922] font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-[#137fec] hover:text-white transition-all w-fit"
                  >
                    Voir l'offre <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>}

      {/* New Arrivals */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#101922]">Nouvelles Arrivées</h2>
              <p className="text-gray-500 text-sm mt-1">Les derniers produits ajoutés à notre catalogue</p>
            </div>
            <Link
              to="/categories"
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-[#137fec] hover:underline"
            >
              Tout voir <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="sm:grid sm:grid-cols-2 lg:grid-cols-5 sm:gap-4">
            <div className="-mx-4 px-4 flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-px-4 sm:mx-0 sm:px-0 sm:overflow-visible sm:pb-0 sm:contents">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[220px] min-w-[220px] min-[420px]:w-[240px] min-[420px]:min-w-[240px] flex-shrink-0 snap-start sm:w-auto sm:min-w-0 sm:flex-shrink"
                  >
                    <ProductCardSkeleton />
                  </div>
                ))
              : newArrivals.map((product) => (
                  <div
                    key={product.id}
                    className="w-[220px] min-w-[220px] min-[420px]:w-[240px] min-[420px]:min-w-[240px] flex-shrink-0 snap-start sm:w-auto sm:min-w-0 sm:flex-shrink"
                  >
                    <ProductCard {...product} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nos produits */}
      {!loading && allProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#101922]">Nos Produits</h2>
              <p className="text-gray-500 text-sm mt-1">Découvrez toute nos produits</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {allProducts.slice(0, visibleCount).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {hasMore && (
            <div ref={sentinelRef} className="flex justify-center py-8">
              <div className="w-6 h-6 rounded-full border-2 border-[#137fec] border-t-transparent animate-spin" />
            </div>
          )}
        </section>
      )}

      <Footer />
    </div>
  );
}
