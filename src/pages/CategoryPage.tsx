import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/shared/Breadcrumb";
import ProductCard from "@/components/shared/ProductCard";
import {
  SlidersHorizontal,
  Grid3X3,
  List,
  ChevronDown,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const PRODUCTS = [
  {
    id: 50,
    name: "MacBook Pro M3 14\"",
    category: "Ordinateurs",
    brand: "Apple",
    processor: "Apple M3",
    price: 1999,
    originalPrice: 2299,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
    rating: 4.9,
    reviews: 876,
    badge: "Nouvelle Arrivée",
    badgeColor: "bg-[#137fec]",
  },
  {
    id: 51,
    name: "Dell XPS 15",
    category: "Ordinateurs",
    brand: "Dell",
    processor: "Intel Core i7",
    price: 1599,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80",
    rating: 4.7,
    reviews: 543,
  },
  {
    id: 52,
    name: "Razer Blade 15",
    category: "Gaming",
    brand: "Razer",
    processor: "AMD Ryzen 9",
    price: 2299,
    originalPrice: 2599,
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&q=80",
    rating: 4.8,
    reviews: 312,
    badge: "Soldes",
    badgeColor: "bg-red-500",
  },
  {
    id: 53,
    name: "Surface Laptop 5",
    category: "Ordinateurs",
    brand: "Microsoft",
    processor: "Intel Core i7",
    price: 1299,
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80",
    rating: 4.6,
    reviews: 234,
  },
  {
    id: 54,
    name: "ASUS ROG Zephyrus",
    category: "Gaming",
    brand: "ASUS",
    processor: "AMD Ryzen 7",
    price: 1799,
    originalPrice: 2099,
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&q=80",
    rating: 4.8,
    reviews: 456,
    badge: "Soldes",
    badgeColor: "bg-red-500",
  },
  {
    id: 55,
    name: "Lenovo Yoga 9i",
    category: "Ordinateurs",
    brand: "Lenovo",
    processor: "Intel Core i9",
    price: 1399,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&q=80",
    rating: 4.7,
    reviews: 189,
  },
];

const categoryNames: Record<string, string> = {
  electronique: "Électronique",
  ordinateurs: "Ordinateurs Haute Performance",
  "maison-jardin": "Maison & Jardin",
  mode: "Mode",
  jouets: "Jouets",
  beaute: "Beauté",
  sport: "Sport",
  promotions: "Promotions",
  audio: "Audio & Vidéo",
  telephones: "Téléphones & Tablettes",
  wearables: "Wearables",
};

const slugToProductCategories: Record<string, string[]> = {
  electronique: ["Ordinateurs", "Gaming"],
  ordinateurs: ["Ordinateurs"],
  gaming: ["Gaming"],
};

const brands = ["Apple", "Dell", "Razer", "Microsoft", "ASUS", "Lenovo", "HP", "Samsung"];
const processors = ["Intel Core i9", "Intel Core i7", "AMD Ryzen 9", "Apple M3", "AMD Ryzen 7"];

export default function CategoryPage() {
  const { slug = "electronique" } = useParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedProcessors, setSelectedProcessors] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  const categoryName = categoryNames[slug] || "Catégorie";

  const applicableCategories = slugToProductCategories[slug] || [];

  const baseProducts =
    applicableCategories.length === 0
      ? PRODUCTS
      : PRODUCTS.filter((product) => applicableCategories.includes(product.category));

  const categoryFacets = Array.from(
    baseProducts.reduce((map, product) => {
      const current = map.get(product.category) ?? 0;
      map.set(product.category, current + 1);
      return map;
    }, new Map<string, number>())
  ).map(([name, count]) => ({ name, count }));

  const filteredProducts = baseProducts
    .filter((product) =>
      selectedCategory ? product.category === selectedCategory : true
    )
    .filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
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
  }, [slug, sortBy, priceRange, selectedBrands, selectedProcessors, minRating]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

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

        <div className="flex gap-6">
          {/* Sidebar filters - desktop */}
          <aside className="hidden xl:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24 space-y-6">
              <h2 className="font-black text-gray-800">Filtres</h2>

              {/* Categories */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Catégories</h3>
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
                    <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">{cat.count}</span>
                  </button>
                ))}
              </div>

              {/* Price range */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Prix</h3>
                <div className="flex items-center justify-between text-sm font-semibold text-gray-700 mb-2">
                  <span>{priceRange[0].toLocaleString("fr-FR")} GNF</span>
                  <span>{priceRange[1].toLocaleString("fr-FR")} GNF</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={5000}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-[#137fec]"
                />
              </div>

              {/* Brands */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Marques</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
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
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Processeur</h3>
                <div className="flex flex-wrap gap-1.5">
                  {processors.map((proc) => (
                    <button
                      key={proc}
                      onClick={() =>
                        setSelectedProcessors((prev) =>
                          prev.includes(proc) ? prev.filter((p) => p !== proc) : [...prev, proc]
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

              {/* Rating */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Note minimale</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((stars) => (
                    <label key={stars} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        className="accent-[#137fec]"
                        checked={minRating === stars}
                        onChange={() =>
                          setMinRating((current) =>
                            current === stars ? null : stars
                          )
                        }
                      />
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= stars ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}`} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">& plus</span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="w-full py-2.5 bg-[#137fec] text-white font-semibold text-sm rounded-xl hover:bg-[#0a6fd4] transition-colors">
                Appliquer les filtres
              </button>
            </div>
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
                Filtres
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
              <div className="relative">
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
              </div>
            </div>

            {/* Active filter chips */}
            {(selectedCategory || selectedBrands.length > 0 || selectedProcessors.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {[...(selectedCategory ? [selectedCategory] : []), ...selectedBrands, ...selectedProcessors].map((filter) => (
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
                    setSelectedBrands([]);
                    setSelectedProcessors([]);
                  }}
                  className="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors px-2"
                >
                  Tout effacer
                </button>
              </div>
            )}

            {/* Products grid */}
            <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

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
