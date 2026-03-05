import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Search, ArrowRight, ChevronRight } from "lucide-react";

const categorySections = [
  {
    letter: "É",
    name: "Électronique",
    slug: "electronique",
    subcategories: [
      { name: "Ordinateurs", slug: "ordinateurs", count: 234 },
      { name: "Maison Connectée", slug: "maison-connectee", count: 89 },
      { name: "Audio & Vidéo", slug: "audio", count: 156 },
      { name: "Appareils Photo", slug: "appareils-photo", count: 67 },
    ],
  },
  {
    letter: "M",
    name: "Maison & Jardin",
    slug: "maison-jardin",
    subcategories: [
      { name: "Cuisine", slug: "cuisine", count: 189 },
      { name: "Mobilier", slug: "mobilier", count: 234 },
      { name: "Décoration", slug: "decoration", count: 312 },
      { name: "Jardin", slug: "jardin", count: 98 },
    ],
  },
  {
    letter: "M",
    name: "Mode",
    slug: "mode",
    subcategories: [
      { name: "Femme", slug: "femme", count: 567 },
      { name: "Homme", slug: "homme", count: 489 },
      { name: "Enfants", slug: "enfants", count: 234 },
      { name: "Bagages", slug: "bagages", count: 78 },
    ],
  },
  {
    letter: "J",
    name: "Jouets & Enfants",
    slug: "jouets",
    subcategories: [
      { name: "Jeux de société", slug: "jeux-societe", count: 145 },
      { name: "Jeux éducatifs", slug: "jeux-educatifs", count: 89 },
      { name: "Figurines", slug: "figurines", count: 67 },
      { name: "Jeux vidéo", slug: "jeux-video", count: 234 },
    ],
  },
  {
    letter: "B",
    name: "Beauté & Santé",
    slug: "beaute",
    subcategories: [
      { name: "Soins visage", slug: "soins-visage", count: 178 },
      { name: "Maquillage", slug: "maquillage", count: 289 },
      { name: "Parfums", slug: "parfums", count: 156 },
      { name: "Bien-être", slug: "bien-etre", count: 98 },
    ],
  },
  {
    letter: "S",
    name: "Sport & Loisirs",
    slug: "sport",
    subcategories: [
      { name: "Fitness", slug: "fitness", count: 234 },
      { name: "Randonnée", slug: "randonnee", count: 89 },
      { name: "Natation", slug: "natation", count: 67 },
      { name: "Vélo", slug: "velo", count: 145 },
    ],
  },
];

const popularCollections = [
  {
    name: "Chaussures Sport",
    slug: "sport",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    count: "280+",
  },
  {
    name: "Vie Minimaliste",
    slug: "maison-jardin",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
    count: "145+",
  },
  {
    name: "Montres de Luxe",
    slug: "electronique",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
    count: "89+",
  },
  {
    name: "Cuisine Moderne",
    slug: "maison-jardin",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
    count: "200+",
  },
];

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("");

export default function AllCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");

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
          {categorySections
            .filter((section) =>
              !searchQuery ||
              section.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              section.subcategories.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
            )
            .map((section) => (
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
                      <p className="text-xs text-gray-400">{sub.count} articles</p>
                    </Link>
                  ))}
                </div>
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
                  <p className="text-white/70 text-xs">{collection.count} produits</p>
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
