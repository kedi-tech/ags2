import { Link } from "react-router-dom";
import { ChevronDown, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);

export default function Footer() {
  const [openSection, setOpenSection] = useState<"links" | "support" | null>(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const quickLinks = [
    { name: "À propos", href: "/aide" },
    { name: "Contact", href: "/aide" },
    { name: "Politique de confidentialité", href: "/legal/confidentialite" },
    { name: "CGU", href: "/legal/cgu" },
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
    <>
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
              {[
                { href: "https://www.facebook.com/share/18G2ECGeek/", Icon: ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
                { href: "https://www.tiktok.com/@a_s_g568?_r=1&_t=ZS-95OqrHANNi9", Icon: TikTokIcon },
                { href: "https://www.instagram.com/asg_shop224?igsh=b2xxMzN4cng4OGw2&utm_source=qr", Icon: ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg> },
                { href: "https://wa.me/224612683764", Icon: WhatsAppIcon },
              ].map(({ href, Icon }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
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
              {[
                { href: "https://www.facebook.com/share/18G2ECGeek/", Icon: ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
                { href: "https://www.tiktok.com/@a_s_g568?_r=1&_t=ZS-95OqrHANNi9", Icon: TikTokIcon },
                { href: "https://www.instagram.com/asg_shop224?igsh=b2xxMzN4cng4OGw2&utm_source=qr", Icon: ({ className }: { className?: string }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg> },
                { href: "https://wa.me/224612683764", Icon: WhatsAppIcon },
              ].map(({ href, Icon }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
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

    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Retour en haut"
      className={`fixed bottom-6 right-6 z-50 w-11 h-11 bg-[#137fec] hover:bg-[#0a6fd4] text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
        showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
    </>
  );
}
