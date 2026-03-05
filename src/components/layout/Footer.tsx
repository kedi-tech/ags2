import { Link } from "react-router-dom";
import { Mail, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer className="bg-blue-900 text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
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
              {[
                { name: "À propos", href: "#" },
                { name: "Contact", href: "#" },
                { name: "Politique de confidentialité", href: "#" },
                { name: "CGU", href: "#" },
                { name: "Toutes les catégories", href: "/categories" },
              ].map((link) => (
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
              {[
                { name: "Livraison", href: "/aide" },
                { name: "Retours & Remboursements", href: "/aide" },
                { name: "FAQ", href: "/aide" },
                { name: "Suivi de commande", href: "/compte" },
                { name: "Centre d'aide", href: "/aide" },
              ].map((link) => (
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
          <div>
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
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="text-base">🔒</span> Paiement sécurisé SSL
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-base">🚚</span> Livraison express disponible
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-base">↩️</span> Retours gratuits 30 jours
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-base">⭐</span> +50 000 clients satisfaits
              </span>
            </div>
            <p className="text-xs text-gray-500">
              © 2024 AGS E-commerce. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
