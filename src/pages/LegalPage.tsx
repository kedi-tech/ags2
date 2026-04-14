import { useParams, Navigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Shield, FileText } from "lucide-react";

const content: Record<string, { title: string; icon: typeof Shield; sections: { heading: string; body: string }[] }> = {
  confidentialite: {
    title: "Politique de confidentialité",
    icon: Shield,
    sections: [
      {
        heading: "Collecte des données",
        body: "Nous collectons les informations que vous nous fournissez lors de la création de votre compte, de vos commandes ou de vos interactions avec notre service client : nom, prénom, adresse email, adresse de livraison et informations de paiement.",
      },
      {
        heading: "Utilisation des données",
        body: "Vos données sont utilisées exclusivement pour traiter vos commandes, personnaliser votre expérience d'achat, vous envoyer des communications relatives à vos commandes et améliorer nos services. Nous ne vendons jamais vos données à des tiers.",
      },
      {
        heading: "Sécurité",
        body: "Toutes les données sont transmises via des connexions sécurisées SSL/TLS. Les informations de paiement sont traitées par des prestataires certifiés PCI-DSS et ne sont jamais stockées sur nos serveurs.",
      },
      {
        heading: "Vos droits",
        body: "Conformément à la réglementation en vigueur, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous via notre centre d'aide.",
      },
      {
        heading: "Cookies",
        body: "Nous utilisons des cookies strictement nécessaires au fonctionnement du site (panier, session) et des cookies analytiques anonymisés pour améliorer notre service. Vous pouvez refuser les cookies non essentiels via les paramètres de votre navigateur.",
      },
    ],
  },
  cgu: {
    title: "Conditions Générales d'Utilisation",
    icon: FileText,
    sections: [
      {
        heading: "1. Objet",
        body: "Les présentes Conditions Générales d'Utilisation régissent l'accès et l'utilisation du site ASG E-commerce, plateforme de vente en ligne d'appareils électroniques et d'accessoires opérée par Alliance Solution Group.",
      },
      {
        heading: "2. Compte utilisateur",
        body: "Pour passer commande, vous devez créer un compte avec des informations exactes et à jour. Vous êtes responsable de la confidentialité de vos identifiants. Tout accès effectué avec vos identifiants est réputé être effectué par vous.",
      },
      {
        heading: "3. Commandes et paiement",
        body: "Toute commande passée sur le site vaut acceptation des prix et descriptions des produits disponibles à la vente. Nous acceptons le paiement en espèces à la livraison, par Mobile Money et par carte bancaire. Le paiement est exigible à la commande.",
      },
      {
        heading: "4. Livraison",
        body: "Les délais de livraison sont indiqués à titre indicatif. ASG ne saurait être tenu responsable des retards dus à des événements indépendants de sa volonté. La livraison est gratuite à partir de 500 000 GNF d'achat.",
      },
      {
        heading: "5. Retours et remboursements",
        body: "Vous disposez de 30 jours à compter de la réception de votre commande pour retourner tout article non satisfaisant, dans son état et emballage d'origine. Le remboursement sera effectué sous 14 jours suivant la réception du retour.",
      },
      {
        heading: "6. Propriété intellectuelle",
        body: "L'ensemble des contenus présents sur le site (textes, images, logos) est la propriété exclusive d'ASG ou de ses partenaires et est protégé par le droit d'auteur. Toute reproduction non autorisée est strictement interdite.",
      },
      {
        heading: "7. Droit applicable",
        body: "Les présentes CGU sont soumises au droit de la République de Guinée. Tout litige sera soumis à la juridiction compétente de Conakry.",
      },
    ],
  },
};

export default function LegalPage() {
  const { slug } = useParams<{ slug: string }>();

  if (!slug || !content[slug]) {
    return <Navigate to="/" replace />;
  }

  const { title, icon: Icon, sections } = content[slug];

  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      <Header />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#137fec]/10 rounded-xl flex items-center justify-center">
            <Icon className="w-5 h-5 text-[#137fec]" />
          </div>
          <h1 className="text-2xl font-black text-[#101922]">{title}</h1>
        </div>

        <p className="text-xs text-gray-400 mb-8">Dernière mise à jour : janvier 2025</p>

        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.heading} className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-sm font-bold text-[#101922] mb-3">{section.heading}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
