import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/shared/Breadcrumb";
import ProductCard from "@/components/shared/ProductCard";
import { getCategories } from "@/api/category";
import { getProducts } from "@/api/products";
import { getSubCategories } from "@/api/subCategories";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import {
  SlidersHorizontal,
  Grid3X3,
  List,
  Heart,
  ShoppingCart,
  ChevronDown,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function ProductListRow({ product }: { product: any }) {
  const { addItem } = useCart();
  const { items: wishlistItems, toggleItem } = useWishlist();

  const wishlisted = wishlistItems.some((w) => String(w.id) === String(product.id));

  return (
    <Link
      to={`/produit/${product.id}`}
      className="group block bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all"
    >
      <div className="p-3 sm:p-4 flex gap-3 sm:gap-4">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-[#f6f7f8]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform"
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
              });
            }}
            className="absolute top-2 right-2 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center active:scale-[0.98]"
            aria-label="Ajouter aux favoris"
          >
            <Heart
              className={`w-4 h-4 ${
                wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
          </button>
        </div>

        <div className="min-w-0 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {product.category && (
                <p className="text-[11px] sm:text-xs text-[#137fec] font-semibold uppercase tracking-wide">
                  {product.category}
                </p>
              )}
              <h3 className="mt-0.5 text-sm sm:text-base font-bold text-gray-900 line-clamp-2">
                {product.name}
              </h3>
              {(product.subCategory || product.brand) && (
                <p className="mt-1 text-xs text-gray-500 line-clamp-1">
                  {[product.subCategory, product.brand].filter(Boolean).join(" • ")}
                </p>
              )}
            </div>

            <div className="text-right flex-shrink-0">
              <p className="text-sm sm:text-base font-black text-gray-900">
                {Number(product.price || 0).toLocaleString("fr-FR")} GNF
              </p>
              {typeof product.originalPrice === "number" && product.originalPrice > product.price && (
                <p className="text-xs text-gray-400 line-through">
                  {Number(product.originalPrice).toLocaleString("fr-FR")} GNF
                </p>
              )}
            </div>
          </div>

          <div className="mt-auto pt-3 flex items-center justify-between gap-3">
            <div className="text-xs text-gray-500">
              {typeof product.rating === "number" && (
                <span className="inline-flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-gray-700">
                    {product.rating.toFixed(1)}
                  </span>
                  {typeof product.reviews === "number" && product.reviews > 0 && (
                    <span>({product.reviews})</span>
                  )}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                addItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                });
              }}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#137fec] hover:bg-[#0a6fd4] text-white text-xs font-semibold transition-colors active:scale-[0.99]"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Ajouter
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function CategoryPage() {
  const { slug = "electronique" } = useParams();
  const [categoryName, setCategoryName] = useState("Catégorie");
  const [products, setProducts] = useState<any[]>([]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    if (typeof window === "undefined") return "grid";
    // Tailwind `sm` starts at 640px; below that we default to list view
    return window.matchMedia("(max-width: 639px)").matches ? "list" : "grid";
  });
  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedProcessors, setSelectedProcessors] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  // Keep viewMode aligned with viewport (mobile=list, desktop=grid)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 639px)");

    const apply = () => setViewMode(mq.matches ? "list" : "grid");
    apply();

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }

    mq.addListener(apply);
    return () => mq.removeListener(apply);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadCategoryProducts = async () => {
      try {
        let mappedProducts: any[] = [];

        if (slug === "all") {
          const data = await getProducts();
          if (!isMounted) return;

          setCategoryName("Tous les produits");

          mappedProducts =
            (data || []).map((p: any) => {
              const firstImageUrl =
                p.images && p.images.length > 0 ? p.images[0].url : undefined;

              return {
                id: p.id,
                name: p.name,
                category: p.category?.name ?? "Produits",
                subCategory: p.subCategory?.name,
                brand: p.brand,
                processor: p.processor,
                price: p.price ?? 0,
                originalPrice: p.companyPrice,
                image:
                  firstImageUrl ||
                  p.imageUrl ||
                  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
                rating: p.rating ?? 4.5,
                reviews: p.reviews ?? 0,
              };
            }) || [];
        } else {
          // First try to match a main category
          const categoriesData = await getCategories();
          if (!isMounted) return;

          const activeCategory = (categoriesData || []).find(
            (cat: any) =>
              String(cat.id) === slug ||
              (cat.slug && cat.slug === slug)
          );

          if (activeCategory) {
            setCategoryName(activeCategory.name ?? "Catégorie");

            mappedProducts =
              (activeCategory.products || []).map((p: any) => {
                const firstImageUrl =
                  p.images && p.images.length > 0 ? p.images[0].url : undefined;

                return {
                  id: p.id,
                  name: p.name,
                  category: activeCategory.name,
                    subCategory: p.subCategory?.name,
                  brand: p.brand,
                  processor: p.processor,
                  price: p.price ?? 0,
                  originalPrice: p.companyPrice,
                  image:
                    firstImageUrl ||
                    p.imageUrl ||
                    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
                  rating: p.rating ?? 4.5,
                  reviews: p.reviews ?? 0,
                };
              }) || [];
          } else {
            // If no main category matched, try subcategories endpoint
            const subData = await getSubCategories();
            if (!isMounted) return;

            const activeSub = (subData || []).find(
              (sub: any) =>
                String(sub.id) === slug ||
                (sub.slug && sub.slug === slug)
            );

            if (!activeSub) {
              setCategoryName("Catégorie");
              setProducts([]);
              return;
            }

            setCategoryName(
              activeSub.name ??
                (activeSub.category?.name
                  ? `${activeSub.category.name} · ${activeSub.name}`
                  : "Catégorie")
            );

            mappedProducts =
              (activeSub.products || []).map((p: any) => {
                const firstImageUrl =
                  p.images && p.images.length > 0 ? p.images[0].url : undefined;

                return {
                  id: p.id,
                  name: p.name,
                  category:
                    activeSub.name ??
                    activeSub.category?.name ??
                    "Sous-catégorie",
                  subCategory: activeSub.name,
                  brand: p.brand,
                  processor: p.processor,
                  price: p.price ?? 0,
                  originalPrice: p.companyPrice,
                  image:
                    firstImageUrl ||
                    p.imageUrl ||
                    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
                  rating: p.rating ?? 4.5,
                  reviews: p.reviews ?? 0,
                };
              }) || [];
          }
        }

        setProducts(mappedProducts);

        if (mappedProducts.length > 0) {
          const max = Math.max(...mappedProducts.map((p: any) => p.price || 0));
          setMaxPrice(max);
          setPriceRange([0, max]);
        }
      } catch (error) {
        console.error("Failed to load category products", error);
      }
    };

    loadCategoryProducts();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const baseProducts = products;

  const categoryFacets = Array.from(
    baseProducts.reduce((map, product) => {
      const current = map.get(product.category) ?? 0;
      map.set(product.category, current + 1);
      return map;
    }, new Map<string, number>())
  ).map(([name, count]) => ({ name, count }));

  const subCategoryFacets = Array.from(
    baseProducts.reduce((map, product) => {
      if (!product.subCategory) return map;
      const current = map.get(product.subCategory) ?? 0;
      map.set(product.subCategory, current + 1);
      return map;
    }, new Map<string, number>())
  ).map(([name, count]) => ({ name, count }));

  const brandOptions = Array.from(
    new Set(
      baseProducts
        .map((p) => p.brand as string | undefined)
        .filter((b): b is string => Boolean(b))
    )
  ).sort();

  const processorOptions = Array.from(
    new Set(
      baseProducts
        .map((p) => p.processor as string | undefined)
        .filter((v): v is string => Boolean(v))
    )
  ).sort();

  const filteredProducts = baseProducts
    .filter((product) =>
      selectedCategory ? product.category === selectedCategory : true
    )
    .filter((product) =>
      selectedSubCategory ? product.subCategory === selectedSubCategory : true
    )
    .filter((product) =>
      maxPrice > 0
        ? product.price >= priceRange[0] && product.price <= priceRange[1]
        : true
    )
    .filter((product) =>
      selectedBrands.length > 0 ? selectedBrands.includes(product.brand) : true
    )
    .filter((product) =>
      selectedProcessors.length > 0
        ? selectedProcessors.includes(product.processor)
        : true
    )
    .filter((product) =>
      minRating !== null ? product.rating >= minRating : true
    );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "new":
        return b.id - a.id;
      case "popular":
      default:
        return (b.reviews || 0) - (a.reviews || 0);
    }
  });

  const itemsPerPage = 6;
  const totalPages = Math.max(
    1,
    Math.ceil(sortedProducts.length / itemsPerPage)
  );
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    slug,
    sortBy,
    priceRange,
    selectedBrands,
    selectedProcessors,
    minRating,
    selectedCategory,
    selectedSubCategory,
  ]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const filtersPanel = (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-6">
      <h2 className="font-black text-gray-800">Filtre</h2>

      {/* Categories */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Catégories
        </h3>
        {categoryFacets.map((cat) => (
          <button
            key={cat.name}
            onClick={() =>
              setSelectedCategory((current) =>
                current === cat.name ? null : cat.name
              )
            }
            className={`w-full flex items-center justify-between py-2 text-sm transition-colors ${
              selectedCategory === cat.name
                ? "text-[#137fec] font-semibold"
                : "text-gray-600 hover:text-[#137fec]"
            }`}
          >
            <span>{cat.name}</span>
            <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Sub-categories */}
      {subCategoryFacets.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            Sous-catégories
          </h3>
          {subCategoryFacets.map((sub) => (
            <button
              key={sub.name}
              onClick={() =>
                setSelectedSubCategory((current) =>
                  current === sub.name ? null : sub.name
                )
              }
              className={`w-full flex items-center justify-between py-2 text-sm transition-colors ${
                selectedSubCategory === sub.name
                  ? "text-[#137fec] font-semibold"
                  : "text-gray-600 hover:text-[#137fec]"
              }`}
            >
              <span>{sub.name}</span>
              <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
                {sub.count}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Price range */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Prix
        </h3>
        <div className="flex items-center justify-between text-sm font-semibold text-gray-700 mb-2">
          <span>{priceRange[0].toLocaleString("fr-FR")} GNF</span>
          <span>{priceRange[1].toLocaleString("fr-FR")} GNF</span>
        </div>
        {maxPrice > 0 && (
          <input
            type="range"
            min={0}
            max={maxPrice}
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], parseInt(e.target.value)])
            }
            className="w-full accent-[#137fec]"
          />
        )}
      </div>

      {/* Brands */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Marques
        </h3>
        <div className="space-y-2">
          {brandOptions.map((brand) => (
            <label key={brand} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="accent-[#137fec] w-4 h-4"
              />
              <span className="text-sm text-gray-600">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Processor chips */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Processeur
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {processorOptions.map((proc) => (
            <button
              key={proc}
              onClick={() =>
                setSelectedProcessors((prev) =>
                  prev.includes(proc)
                    ? prev.filter((p) => p !== proc)
                    : [...prev, proc]
                )
              }
              className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-all ${
                selectedProcessors.includes(proc)
                  ? "border-[#137fec] bg-[#137fec]/10 text-[#137fec]"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {proc}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setFilterOpen(false)}
        className="w-full py-2.5 bg-[#137fec] text-white font-semibold text-sm rounded-xl hover:bg-[#0a6fd4] transition-colors"
      >
        Appliquer les Filtre
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb
          items={[
            { name: "Catégories", href: "/categories" },
            { name: categoryName },
          ]}
        />

        {/* Title */}
        <div className="mt-4 mb-6 flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#101922]">{categoryName}</h1>
            <p className="text-gray-400 text-sm mt-1">
              {filteredProducts.length} résultat{filteredProducts.length > 1 ? "s" : ""} trouvé
              {filteredProducts.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Mobile filters drawer */}
        {filterOpen && (
          <div className="xl:hidden fixed inset-0 z-50">
            <button
              type="button"
              aria-label="Fermer les Filtre"
              className="absolute inset-0 bg-black/40"
              onClick={() => setFilterOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-[88%] max-w-sm bg-[#f6f7f8] p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-black text-[#101922]">Filtre</p>
                <button
                  type="button"
                  onClick={() => setFilterOpen(false)}
                  className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>
              {filtersPanel}
            </div>
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar filters - desktop */}
          <aside className="hidden xl:block w-64 flex-shrink-0">
            <div className="sticky top-24">{filtersPanel}</div>
          </aside>

          {/* Products area */}
          <div className="flex-1 min-w-0">
            {/* Controls bar */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 flex items-center gap-3 flex-wrap">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="xl:hidden flex items-center gap-1.5 text-sm font-semibold text-gray-700 border border-gray-200 px-3 py-2 rounded-xl hover:border-[#137fec] hover:text-[#137fec] transition-all"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtre
              </button>

              {/* View toggles */}
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden ml-auto">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${viewMode === "grid" ? "bg-[#137fec] text-white" : "hover:bg-gray-50 text-gray-400"}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${viewMode === "list" ? "bg-[#137fec] text-white" : "hover:bg-gray-50 text-gray-400"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Sort */}
              {/* <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none text-sm font-semibold text-gray-700 bg-[#f6f7f8] border border-gray-200 rounded-xl px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#137fec]/30 cursor-pointer"
                >
                  <option value="popular">Plus populaire</option>
                  <option value="new">Nouveauté</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="rating">Meilleures notes</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div> */}
            </div>

            {/* Active filter chips */}
            {(selectedCategory ||
              selectedSubCategory ||
              selectedBrands.length > 0 ||
              selectedProcessors.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  ...(selectedCategory ? [selectedCategory] : []),
                  ...(selectedSubCategory ? [selectedSubCategory] : []),
                  ...selectedBrands,
                  ...selectedProcessors,
                ].map((filter) => (
                  <span
                    key={filter}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-[#137fec]/10 text-[#137fec] px-3 py-1.5 rounded-full"
                  >
                    {filter}
                    <button
                      onClick={() => {
                        if (filter === selectedCategory) {
                          setSelectedCategory(null);
                        }
                        if (filter === selectedSubCategory) {
                          setSelectedSubCategory(null);
                        }
                        setSelectedBrands((prev) => prev.filter((b) => b !== filter));
                        setSelectedProcessors((prev) => prev.filter((p) => p !== filter));
                      }}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedSubCategory(null);
                    setSelectedBrands([]);
                    setSelectedProcessors([]);
                  }}
                  className="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors px-2"
                >
                  Tout effacer
                </button>
              </div>
            )}

            {/* Products */}
            {viewMode === "grid" ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {paginatedProducts.map((product) => (
                  <ProductListRow key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-white hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                      currentPage === page
                        ? "bg-[#137fec] text-white shadow-sm"
                        : "text-gray-600 hover:bg-white"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(totalPages, page + 1)
                  )
                }
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-white hover:text-gray-700 transition-all"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
