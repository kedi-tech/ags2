import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [openSection, setOpenSection] = useState<"links" | "support" | null>(
    null,
  );

  const quickLinks = [
    { name: "À propos", href: "#" },
    { name: "Contact", href: "#" },
    { name: "Politique de confidentialité", href: "#" },
    { name: "CGU", href: "#" },
    { name: "Toutes les catégories", href: "/categories" },
  ];

  const supportLinks = [
    { name: "Livraison", href: "/aide" },
    { name: "Retours & Remboursements", href: "/aide" },
    { name: "FAQ", href: "/aide" },
    { name: "Suivi de commande", href: "/compte" },
    { name: "Centre d'aide", href: "/aide" },
  ];

  return (
    <footer className="bg-blue-900 text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mobile layout */}
        <div className="sm:hidden space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <Link to="/" className="flex items-center justify-center">
              <img
                src="/ags_logo.png"
                alt="Alliance Solution Group"
                className="h-24 w-auto object-contain"
              />
            </Link>

            <div className="mt-4 flex items-center justify-center gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center active:scale-[0.98] hover:bg-[#137fec] transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() =>
                setOpenSection((s) => (s === "links" ? null : "links"))
              }
              className="w-full px-5 py-4 flex items-center justify-between text-left"
            >
              <span className="text-sm font-black">Liens rapides</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  openSection === "links" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSection === "links" && (
              <div className="px-5 pb-5">
                <ul className="space-y-3">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="block py-1 text-sm text-gray-200 hover:text-white transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() =>
                setOpenSection((s) => (s === "support" ? null : "support"))
              }
              className="w-full px-5 py-4 flex items-center justify-between text-left"
            >
              <span className="text-sm font-black">Support</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  openSection === "support" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSection === "support" && (
              <div className="px-5 pb-5">
                <ul className="space-y-3">
                  {supportLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="block py-1 text-sm text-gray-200 hover:text-white transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Desktop/tablet layout */}
        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src="/ags_logo.png"
                alt="Alliance Solution Group"
                className="h-36 w-auto object-contain"
              />
            </Link>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#137fec] transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Liens Rapides */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-5">
              Liens Rapides
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    <span className="w-1 h-1 bg-[#137fec] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-5">
              Support
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    <span className="w-1 h-1 bg-[#137fec] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          {/* <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-5">
              Newsletter
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Recevez nos meilleures offres et nouveautés directement dans votre boîte mail.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#137fec]/50 focus:border-[#137fec]/50 transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-[#137fec] hover:bg-[#0a6fd4] text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Rejoindre
              </button>
            </form>
          </div> */}
        </div>
      </div>

      {/* Trust badges */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-4 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
            <div className="grid grid-cols-2 gap-2 text-[11px] text-white/70 sm:flex sm:flex-wrap sm:items-center sm:gap-6 sm:text-xs">
              {[
                { icon: "🔒", label: "Paiement sécurisé SSL" },
                { icon: "🚚", label: "Livraison express disponible" },
                { icon: "↩️", label: "Retours gratuits 30 jours" },
                { icon: "⭐", label: "+50 000 clients satisfaits" },
              ].map((it) => (
                <span
                  key={it.label}
                  className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-3 py-2 sm:bg-transparent sm:border-0 sm:px-0 sm:py-0"
                >
                  <span className="text-base">{it.icon}</span>
                  <span className="font-semibold">{it.label}</span>
                </span>
              ))}
            </div>

            <p className="text-[11px] text-white/60 sm:text-xs sm:text-gray-500">
              © {new Date().getFullYear()} ASG E-commerce. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
