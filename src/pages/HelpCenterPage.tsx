import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Search,
  Package,
  RefreshCw,
  CreditCard,
  User,
  Info,
  Shield,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Mail,
  Phone,
  ThumbsUp,
} from "lucide-react";

const helpCategories = [
  { icon: Package, title: "Livraison & Expédition", count: 12, desc: "Délais, transporteurs, adresses" },
  { icon: RefreshCw, title: "Retours & Remboursements", count: 8, desc: "Politique de retour, remboursements" },
  { icon: CreditCard, title: "Commandes & Paiement", count: 15, desc: "Annulation, facturation, paiements" },
  { icon: User, title: "Mon Compte", count: 10, desc: "Profil, sécurité, préférences" },
  { icon: Info, title: "Info Produit", count: 6, desc: "Garanties, spécifications, disponibilité" },
  { icon: Shield, title: "Sécurité & Confidentialité", count: 7, desc: "Protection des données, fraude" },
];

const faqItems = [
  {
    q: "Comment suivre ma commande ?",
    a: "Vous pouvez suivre votre commande depuis votre tableau de bord compte, section 'Historique commandes'. Un email de suivi vous a également été envoyé avec le lien de tracking de votre transporteur.",
    open: true,
  },
  {
    q: "Quelle est la politique de retour ?",
    a: "Vous disposez de 30 jours à compter de la réception pour retourner un article. Le produit doit être dans son état d'origine, non utilisé et dans son emballage d'origine. Les frais de retour sont gratuits pour les membres AGS Premium.",
    open: false,
  },
  {
    q: "Comment modifier ou annuler ma commande ?",
    a: "Une commande peut être modifiée ou annulée dans les 2 heures suivant sa passation, avant qu'elle ne soit prise en charge par notre entrepôt. Contactez notre support ou rendez-vous dans votre espace compte.",
    open: false,
  },
  {
    q: "Quels moyens de paiement acceptez-vous ?",
    a: "Nous acceptons trois modes de paiement : le paiement en espèces (cash) à la livraison, le paiement par Mobile Money, et le paiement par carte bancaire.",
    open: false,
  },
];

const popularTags = ["Suivre commande", "Politique retour", "Paiements", "Garantie", "Livraison express", "Annulation"];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number[]>([0]);

  const toggleFaq = (idx: number) => {
    setOpenFaq((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#137fec]/5 to-[#f6f7f8] border-b border-[#137fec]/10 py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-[#101922] mb-3">
            Comment pouvons-nous vous aider ?
          </h1>
          <p className="text-gray-500 mb-8">
            Trouvez rapidement des réponses à vos questions.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Décrivez votre problème..."
              className="w-full pl-12 pr-32 py-4 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#137fec]/30 focus:border-[#137fec] shadow-sm"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#137fec] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#0a6fd4] transition-colors">
              Rechercher
            </button>
          </div>

          {/* Popular tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            <span className="text-xs text-gray-400 font-medium">Populaire :</span>
            {popularTags.map((tag) => (
              <button
                key={tag}
                className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-[#137fec] hover:text-[#137fec] transition-all font-medium"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Help categories */}
        <h2 className="text-2xl font-black text-[#101922] mb-6">Catégories d'aide</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {helpCategories.map((cat) => (
            <button
              key={cat.title}
              className="bg-white rounded-2xl border border-gray-100 p-5 text-left hover:border-[#137fec]/40 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#137fec]/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#137fec]/20 transition-colors">
                  <cat.icon className="w-5 h-5 text-[#137fec]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800 group-hover:text-[#137fec] transition-colors mb-0.5">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-gray-400">{cat.desc}</p>
                  <p className="text-xs text-[#137fec] font-semibold mt-1">{cat.count} articles</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* FAQ + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-black text-[#101922] mb-6">Questions fréquentes</h2>
            <div className="space-y-3">
              {faqItems.map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="text-sm font-bold text-gray-800 pr-4">{item.q}</span>
                    {openFaq.includes(idx) ? (
                      <ChevronUp className="w-4 h-4 text-[#137fec] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq.includes(idx) && (
                    <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Feedback widget */}
            <div className="mt-6 bg-gradient-to-r from-[#137fec] to-[#0a5fb8] rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <ThumbsUp className="w-6 h-6" />
                <h3 className="font-black text-lg">Votre avis compte</h3>
              </div>
              <p className="text-white/80 text-sm mb-4">
                Aidez-nous à améliorer nos articles d'aide en partageant votre expérience.
              </p>
              <button className="bg-white text-[#137fec] font-bold px-5 py-2.5 rounded-xl text-sm hover:shadow-lg transition-all">
                Donner un avis
              </button>
            </div>
          </div>

          {/* Contact sidebar */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-black text-[#101922] mb-6">Nous contacter</h2>
            <div className="space-y-4">
              {[
                {
                  icon: MessageCircle,
                  title: "Chat en direct",
                  sub: "Disponible 24h/24, 7j/7",
                  action: "Démarrer le chat",
                  color: "bg-green-500",
                  badge: "En ligne",
                  badgeColor: "bg-green-100 text-green-700",
                },
                {
                  icon: Mail,
                  title: "Email",
                  sub: "Réponse sous 24 heures",
                  action: "Envoyer un email",
                  color: "bg-[#137fec]",
                  badge: null,
                  badgeColor: "",
                },
                {
                  icon: Phone,
                  title: "Téléphone",
                  sub: "Lun-Ven : 9h00 - 18h00",
                  action: "Appeler maintenant",
                  color: "bg-purple-500",
                  badge: null,
                  badgeColor: "",
                },
              ].map((contact) => (
                <div key={contact.title} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-10 h-10 ${contact.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <contact.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-gray-800">{contact.title}</h3>
                        {contact.badge && (
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${contact.badgeColor}`}>
                            {contact.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{contact.sub}</p>
                    </div>
                  </div>
                  <button className="w-full py-2 text-xs font-semibold text-[#137fec] border border-[#137fec]/30 rounded-xl hover:bg-[#137fec] hover:text-white transition-all">
                    {contact.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
