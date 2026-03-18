import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCategories } from "@/api/category";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Laptop,
  Smartphone,
  Headphones,
  Camera,
  Zap,
} from "lucide-react";

type HeaderSubCategory = {
  id: string;
  name: string;
  slug: string;
};

type HeaderCategory = {
  id?: number | string;
  name: string;
  slug: string;
  isPromo?: boolean;
  hasMegaMenu?: boolean;
  allCategories?: boolean;
  subCategories?: HeaderSubCategory[];
};

const megaMenuItems = [
  { icon: Laptop, name: "Ordinateurs", slug: "ordinateurs" },
  { icon: Smartphone, name: "Téléphones & Tablettes", slug: "telephones-tablettes" },
  { icon: Headphones, name: "Audio", slug: "audio" },
  { icon: Camera, name: "Appareils Photo", slug: "appareils-photo" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<HeaderCategory[]>([]);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileToggleRef = useRef<HTMLButtonElement | null>(null);
  const navigate = useNavigate();
  const { items: cartItems } = useCart();
  const { client, logout } = useAuth();
  const { items: wishlistItems } = useWishlist();

  const displayName =
    (client &&
      (client.name ||
        client.fullName ||
        client.full_name ||
        client.username ||
        client.email)) ||
    "Mon compte";

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const data = await getCategories();
        if (!isMounted) return;

        let mapped: HeaderCategory[] = (data || []).map((cat: any) => ({
          id: cat.id,
          name: cat.name ?? cat.label ?? "Catégorie",
          slug: cat.slug ?? String(cat.id ?? "").toLowerCase(),
          isPromo: cat.isPromo ?? cat.is_promo ?? false,
          hasMegaMenu:
            cat.hasMegaMenu ??
            cat.has_mega_menu ??
            (cat.slug === "electronique" || cat.name === "Électronique"),
          subCategories: Array.isArray(cat.subCategories)
            ? cat.subCategories.map((sub: any) => ({
                id: String(sub.id),
                name: sub.name ?? "Sous-catégorie",
                slug: sub.slug ?? String(sub.id),
              }))
            : [],
        }));

        const hasPromotions = mapped.some(
          (cat) =>
            cat.slug === "promotions" ||
            cat.name.toLowerCase() === "promotions"
        );

        // Ensure "All products" entry is present at the beginning
        const allEntry: HeaderCategory = {
          name: "Tous les produits",
          slug: "all",
        };

        mapped = [allEntry, ...mapped];

        if (!hasPromotions) {
          mapped = [
            ...mapped,
            {
              name: "Promotions",
              slug: "promotions",
              isPromo: true,
            },
          ];
        }

        setCategories(mapped);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  // Close mobile menu on outside click / Escape
  useEffect(() => {
    if (!mobileOpen) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      const menuEl = mobileMenuRef.current;
      const toggleEl = mobileToggleRef.current;

      if (menuEl && menuEl.contains(target)) return;
      if (toggleEl && toggleEl.contains(target)) return;

      setMobileOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown, { capture: true });
    document.addEventListener("touchstart", onPointerDown, { capture: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown, { capture: true } as any);
      document.removeEventListener("touchstart", onPointerDown, { capture: true } as any);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/categorie/recherche?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      {/* Top bar */}
      <div className="bg-[#101922] text-white text-xs py-1.5 text-center">
        <span>🚚 Livraison gratuite dès 500&nbsp;000 GNF d'achat · Retours gratuits 30 jours</span>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img
              src="/ags_logo.png"
              alt="Alliance Solution Group"
              className="h-20 w-auto sm:h-24 object-contain"
            />
            
          </Link>

          {/* Search bar - hidden on mobile */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher des produits, marques..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#f6f7f8] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#137fec]/30 focus:border-[#137fec] transition-all"
              />
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto">
            <Link
              to="/souhaits"
              className="relative p-2.5 rounded-xl hover:bg-[#f6f7f8] transition-colors group"
              title="Mes favoris"
            >
              <Heart className="w-5 h-5 text-gray-600 group-hover:text-[#137fec] transition-colors" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-pink-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold leading-none">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link
              to="/panier"
              className="relative p-2.5 rounded-xl hover:bg-[#f6f7f8] transition-colors group"
              title="Panier"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-[#137fec] transition-colors" />
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#137fec] text-white text-xs rounded-full flex items-center justify-center font-bold leading-none">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </Link>

            {client ? (
              <button
                onClick={() => navigate("/compte")}
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#f6f7f8] transition-colors ml-1"
                title="Mon compte"
              >
                <div className="w-8 h-8 bg-[#137fec]/10 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-[#137fec]" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden lg:block">
                  {displayName}
                </span>
              </button>
            ) : (
              <Link
                to="/compte"
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#f6f7f8] transition-colors ml-1"
              >
                <div className="w-8 h-8 bg-[#137fec]/10 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-[#137fec]" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden lg:block">Se connecter</span>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              ref={mobileToggleRef}
              className="md:hidden p-2.5 rounded-xl hover:bg-[#f6f7f8] transition-colors ml-1"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Category navigation - desktop */}
        <nav className="hidden lg:flex items-center gap-1 py-2 border-t border-gray-100">
          {categories.map((cat) => {
            const hasSubCategories =
              Array.isArray(cat.subCategories) && cat.subCategories.length > 0;

            // "Tous les produits" and "Promotions" stay as simple links
            const isSimple =
              cat.slug === "all" || cat.slug === "promotions" || !hasSubCategories;

            if (isSimple) {
              return (
                <Link
                  key={cat.slug}
                  to={`/categorie/${cat.slug}`}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    cat.isPromo
                      ? "text-orange-500 hover:bg-orange-50"
                      : "text-gray-600 hover:text-[#137fec] hover:bg-[#137fec]/5"
                  }`}
                >
                  {cat.name}
                  {cat.isPromo && <Zap className="w-3 h-3 fill-current" />}
                </Link>
              );
            }

            return (
              <div
                key={cat.slug}
                className="relative"
                onMouseEnter={() => setMegaMenuOpen(cat.slug)}
                onMouseLeave={() => setMegaMenuOpen((prev) => (prev === cat.slug ? null : prev))}
              >
                <button
                  type="button"
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    cat.isPromo
                      ? "text-orange-500 hover:bg-orange-50"
                      : "text-gray-600 hover:text-[#137fec] hover:bg-[#137fec]/5"
                  }`}
                >
                  {cat.name}
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {megaMenuOpen === cat.slug && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 w-56 z-50">
                    <div className="px-3 pb-2 border-b border-gray-100">
                      <Link
                        to={`/categorie/${cat.slug}`}
                        className="flex items-center justify-between text-xs font-semibold text-gray-700 px-2 py-1.5 rounded-lg hover:bg-[#137fec]/5 hover:text-[#137fec]"
                      >
                        Voir tout {cat.name}
                      </Link>
                    </div>
                    <div className="max-h-72 overflow-y-auto py-1">
                      {cat.subCategories?.map((sub) => (
                        <Link
                          key={sub.id}
                          to={`/categorie/${sub.slug}`}
                          className="block px-4 py-1.5 text-sm text-gray-600 hover:bg-[#137fec]/5 hover:text-[#137fec] transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden bg-white border-t border-gray-100 shadow-lg"
        >
          {/* Mobile search */}
          <div className="px-4 py-3 border-b border-gray-100">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f6f7f8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#137fec]/30"
                />
              </div>
            </form>
          </div>

          {/* Mobile categories */}
          <div className="px-4 py-3 space-y-1">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/categorie/${cat.slug}`}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-[#137fec]/5 hover:text-[#137fec] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {cat.name}
                {cat.isPromo && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Promo</span>}
              </Link>
            ))}
          </div>

          {/* Mobile account */}
          <div className="px-4 py-3 border-t border-gray-100">
            {client ? (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/compte");
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-[#137fec]/5 hover:text-[#137fec] transition-colors"
              >
                <User className="w-4 h-4" />
                {displayName}
              </button>
            ) : (
              <Link
                to="/compte"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-[#137fec]/5 hover:text-[#137fec] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <User className="w-4 h-4" />
                Se connecter
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
