import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const categories = [
  { name: "Électronique", slug: "electronique", hasMegaMenu: true },
  { name: "Maison & Jardin", slug: "maison-jardin" },
  { name: "Mode", slug: "mode" },
  { name: "Jouets", slug: "jouets" },
  { name: "Beauté", slug: "beaute" },
  { name: "Sport", slug: "sport" },
  { name: "Promotions", slug: "promotions", isPromo: true },
];

const megaMenuItems = [
  { icon: Laptop, name: "Ordinateurs", slug: "ordinateurs" },
  { icon: Smartphone, name: "Téléphones & Tablettes", slug: "telephones-tablettes" },
  { icon: Headphones, name: "Audio", slug: "audio" },
  { icon: Camera, name: "Appareils Photo", slug: "appareils-photo" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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
            </Link>

            <Link
              to="/panier"
              className="relative p-2.5 rounded-xl hover:bg-[#f6f7f8] transition-colors group"
              title="Panier"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-[#137fec] transition-colors" />
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#137fec] text-white text-xs rounded-full flex items-center justify-center font-bold leading-none">
                3
              </span>
            </Link>

            <Link
              to="/compte"
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#f6f7f8] transition-colors ml-1"
            >
              <div className="w-8 h-8 bg-[#137fec]/10 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-[#137fec]" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden lg:block">Se connecter</span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2.5 rounded-xl hover:bg-[#f6f7f8] transition-colors ml-1"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Category navigation - desktop */}
        <nav className="hidden lg:flex items-center gap-1 py-2 border-t border-gray-100">
          {categories.map((cat) => (
            <div
              key={cat.slug}
              className="relative"
              onMouseEnter={() => cat.hasMegaMenu && setMegaMenuOpen(true)}
              onMouseLeave={() => cat.hasMegaMenu && setMegaMenuOpen(false)}
            >
              <Link
                to={`/categorie/${cat.slug}`}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  cat.isPromo
                    ? "text-orange-500 hover:bg-orange-50"
                    : "text-gray-600 hover:text-[#137fec] hover:bg-[#137fec]/5"
                }`}
              >
                {cat.name}
                {cat.hasMegaMenu && <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
                {cat.isPromo && <Zap className="w-3 h-3 fill-current" />}
              </Link>

              {/* Mega Menu */}
              {cat.hasMegaMenu && megaMenuOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 w-[480px] z-50">
                  <div className="grid grid-cols-2 gap-3">
                    {megaMenuItems.map((item) => (
                      <Link
                        key={item.slug}
                        to={`/categorie/${item.slug}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#137fec]/5 transition-colors group"
                      >
                        <div className="w-10 h-10 bg-[#137fec]/10 rounded-lg flex items-center justify-center group-hover:bg-[#137fec]/20 transition-colors">
                          <item.icon className="w-5 h-5 text-[#137fec]" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-[#137fec] transition-colors">
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                  {/* Featured card */}
                  <div className="mt-4 bg-gradient-to-r from-[#137fec] to-[#0a5fb8] rounded-xl p-4 text-white">
                    <div className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">Nouvelle Arrivée</div>
                    <div className="font-bold text-lg">MacBook Pro M3</div>
                    <div className="text-sm opacity-80 mt-1">À partir de 19 990 000 GNF</div>
                    <Link
                      to="/categorie/ordinateurs"
                      className="inline-block mt-3 text-xs font-semibold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Découvrir →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
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
            <Link
              to="/compte"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-[#137fec]/5 hover:text-[#137fec] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <User className="w-4 h-4" />
              Se connecter
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
