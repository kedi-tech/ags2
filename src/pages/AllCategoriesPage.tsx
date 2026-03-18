import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Search, ArrowRight, ChevronRight } from "lucide-react";
import { getCategories } from "@/api/category";

type ApiSubCategory = {
  id: string | number;
  name: string;
  slug?: string;
  products?: { id: string | number }[];
};

type ApiCategory = {
  id: string | number;
  name: string;
  slug?: string;
  products?: { id: string | number; images?: { url?: string }[]; imageUrl?: string }[];
  subCategories?: ApiSubCategory[];
};

const DEFAULT_COLLECTION_IMAGE =
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80";

const getSectionLetter = (name: string) => {
  const first = (name || "").trim().charAt(0);
  if (!first) return "#";
  const normalized = first.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const upper = normalized.toUpperCase();
  return /[A-Z]/.test(upper) ? upper : "#";
};

export default function AllCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await getCategories();
        if (!isMounted) return;
        setCategories(Array.isArray(data) ? (data as ApiCategory[]) : []);
      } catch (error) {
        console.error("Failed to load categories", error);
        if (!isMounted) return;
        setCategories([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((cat) => {
      const inCat = String(cat.name || "").toLowerCase().includes(q);
      const inSubs = (cat.subCategories || []).some((s) =>
        String(s.name || "").toLowerCase().includes(q)
      );
      return inCat || inSubs;
    });
  }, [categories, searchQuery]);

  const categorySections = useMemo(() => {
    const mapped = filteredCategories
      .map((cat) => {
        const slug = cat.slug ?? String(cat.id);
        const letter = getSectionLetter(cat.name);
        const subcategories = (cat.subCategories || []).map((sub) => ({
          name: sub.name,
          slug: sub.slug ?? String(sub.id),
          count: Array.isArray(sub.products) ? sub.products.length : 0,
        }));

        return {
          letter,
          name: cat.name,
          slug,
          subcategories,
          totalCount: Array.isArray(cat.products) ? cat.products.length : 0,
          heroImage:
            cat.products && cat.products.length > 0
              ? cat.products[0]?.images?.[0]?.url ||
                (cat.products[0] as any)?.imageUrl ||
                DEFAULT_COLLECTION_IMAGE
              : DEFAULT_COLLECTION_IMAGE,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name, "fr"));

    return mapped;
  }, [filteredCategories]);

  const alphabet = useMemo(() => {
    const letters = new Set(categorySections.map((s) => s.letter));
    const base = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").filter((l) => letters.has(l));
    if (letters.has("#")) base.push("#");
    return base.length > 0 ? base : "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("");
  }, [categorySections]);

  const popularCollections = useMemo(() => {
    return categorySections
      .slice()
      .sort((a, b) => (b.totalCount || 0) - (a.totalCount || 0))
      .slice(0, 4)
      .map((c) => ({
        name: c.name,
        slug: c.slug,
        image: c.heroImage,
        count: c.totalCount,
      }));
  }, [categorySections]);

  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#101922] to-[#1a2940] py-14 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-5xl font-black mb-3">Toutes les Catégories</h1>
          <p className="text-white/60 mb-8 text-sm sm:text-base">
            Explorez notre catalogue complet de produits dans toutes les catégories.
          </p>

          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Chercher une catégorie..."
              className="w-full pl-12 pr-28 py-4 bg-white border-0 rounded-2xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#137fec]/30 shadow-xl"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#137fec] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#0a6fd4] transition-colors">
              Trouver
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Alphabetic nav */}
        <div className="flex flex-wrap gap-1 mb-10">
          {alphabet.map((letter) => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="w-8 h-8 flex items-center justify-center text-xs font-bold text-gray-500 hover:text-[#137fec] hover:bg-[#137fec]/10 rounded-lg transition-all"
            >
              {letter}
            </a>
          ))}
        </div>

        {/* Category sections */}
        <div className="space-y-10">
          {loading && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-sm text-gray-600">
              Chargement des catégories...
            </div>
          )}

          {!loading && categorySections.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-sm text-gray-600">
              Aucune catégorie trouvée.
            </div>
          )}

          {!loading &&
            categorySections.map((section) => (
              <div key={section.slug} id={`letter-${section.letter}`}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#137fec] text-white rounded-lg flex items-center justify-center font-black text-sm">
                      {section.letter}
                    </div>
                    <h2 className="text-xl font-black text-[#101922]">{section.name}</h2>
                  </div>
                  <Link
                    to={`/categorie/${section.slug}`}
                    className="text-sm font-semibold text-[#137fec] hover:underline flex items-center gap-1"
                  >
                    Voir tout <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {section.subcategories.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-4 text-sm text-gray-600">
                    Aucune sous-catégorie disponible pour le moment.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {section.subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        to={`/categorie/${sub.slug}`}
                        className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-[#137fec]/30 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-bold text-gray-800 group-hover:text-[#137fec] transition-colors">
                            {sub.name}
                          </p>
                          <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#137fec] transition-colors" />
                        </div>
                        <p className="text-xs text-gray-400">
                          {sub.count} article{sub.count > 1 ? "s" : ""}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* Popular collections */}
        <div className="mt-16">
          <h2 className="text-2xl font-black text-[#101922] mb-6">Collections Populaires</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {popularCollections.map((collection) => (
              <Link
                key={collection.name}
                to={`/categorie/${collection.slug}`}
                className="relative rounded-2xl overflow-hidden group"
                style={{ height: "200px" }}
              >
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101922]/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-black text-sm">{collection.name}</h3>
                  <p className="text-white/70 text-xs">
                    {collection.count} produit{collection.count > 1 ? "s" : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
