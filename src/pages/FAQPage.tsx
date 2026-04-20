import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import TrustBand from "@/components/TrustBand";

const faqCategories = [
  {
    category: "Le cabinet",
    questions: [
      { q: "Qu'est-ce qu'un conseiller en gestion de patrimoine indépendant ?", a: "Un CGP indépendant est un professionnel enregistré à l'ORIAS, habilité à délivrer des conseils en investissements financiers (CIF), en assurance (COA) et en opérations de banque (COBSP). Contrairement à un conseiller bancaire, il n'a aucun produit maison et travaille en architecture ouverte — il compare l'ensemble du marché pour sélectionner ce qui convient le mieux à votre situation." },
      { q: "Comment êtes-vous rémunérés ?", a: "Nous pouvons travailler en honoraires de conseil (facturation directe pour l'audit et les recommandations) ou en commissions sur les produits souscrits (versées par les compagnies d'assurance ou les sociétés de gestion). Dans tous les cas, notre mode de rémunération est communiqué en amont, de façon transparente, avant toute recommandation." },
      { q: "Êtes-vous contrôlés par un organisme ?", a: "Oui. En tant que membre de la CNCGP (Chambre Nationale des Conseils en Gestion de Patrimoine), nous sommes soumis au contrôle de l'Autorité des Marchés Financiers (AMF) et de l'ACPR. Nous disposons également d'une assurance responsabilité civile professionnelle et d'une garantie financière." },
      { q: "Quelle est la différence avec un banquier privé ?", a: "Un banquier privé distribue les produits de son établissement. Nous, nous n'avons aucune obligation de placement auprès d'un partenaire donné. Notre seul engagement est de vous recommander les solutions les plus adaptées, quel que soit l'émetteur." },
    ],
  },
  {
    category: "Premier rendez-vous",
    questions: [
      { q: "Le premier rendez-vous est-il payant ?", a: "Non. Le premier échange de 30 minutes est gratuit et sans engagement. Il sert à comprendre votre situation et à évaluer ensemble la pertinence d'un accompagnement." },
      { q: "Quels documents apporter ?", a: "Pour le premier échange, rien d'obligatoire. Si nous engageons un audit patrimonial, nous vous demanderons : dernier avis d'imposition, relevés de patrimoine (immobilier, financier), contrats d'assurance-vie ou de prévoyance en cours, régime matrimonial." },
      { q: "Le rendez-vous peut-il se faire à distance ?", a: "Oui. Nous recevons nos clients dans nos locaux au cœur de Bordeaux, mais nous réalisons également des rendez-vous en visioconférence pour les clients éloignés ou les expatriés." },
    ],
  },
  {
    category: "Accompagnement",
    questions: [
      { q: "À partir de quel montant de patrimoine intervenez-vous ?", a: "Nous ne fixons pas de seuil d'entrée formel. En pratique, notre accompagnement est pertinent à partir d'un patrimoine financier et/ou immobilier de 200 000 € environ, ou lorsque la complexité de la situation le justifie (dirigeant, profession libérale, expatriation)." },
      { q: "Combien de temps dure un audit patrimonial ?", a: "En moyenne deux à trois semaines entre la remise des documents et la présentation du rapport. Ce délai peut varier selon la complexité de votre situation et la complétude des documents fournis." },
      { q: "Travaillez-vous avec notre notaire ou notre expert-comptable ?", a: "Oui, systématiquement. La coordination avec vos autres conseils est un élément central de notre méthode. Nous échangeons avec eux (avec votre accord) pour garantir la cohérence des décisions patrimoniales, fiscales et juridiques." },
      { q: "Que se passe-t-il après l'audit ?", a: "Nous vous présentons un rapport de recommandations structuré. Vous décidez ensuite de mettre en œuvre nos préconisations ou non. Si vous nous confiez la mise en œuvre, nous sélectionnons les contrats, ouvrons les comptes et assurons le suivi. Sinon, vous conservez le rapport et êtes libre de l'utiliser avec le professionnel de votre choix." },
    ],
  },
  {
    category: "Fiscalité & placements",
    questions: [
      { q: "Pouvez-vous m'aider à réduire mes impôts ?", a: "Oui, c'est l'un de nos domaines d'expertise. Mais nous ne vendons pas de la défiscalisation — nous construisons une stratégie fiscale cohérente, adaptée à votre situation. Chaque levier est analysé en termes de rapport bénéfice/risque et intégré dans votre stratégie globale." },
      { q: "Quels types de placements proposez-vous ?", a: "En architecture ouverte, nous accédons à l'ensemble des supports du marché : assurance-vie, PER, PEA, compte-titres, SCPI, OPCI, private equity, produits structurés, nue-propriété, etc. La sélection dépend exclusivement de votre profil, de vos objectifs et de votre horizon d'investissement." },
      { q: "Mes placements sont-ils en sécurité ?", a: "Vos actifs sont détenus chez des dépositaires agréés (compagnies d'assurance, banques dépositaires), jamais sur nos comptes. Nous n'avons aucune capacité de détention ou de mouvement sur vos fonds." },
    ],
  },
];

export default function FAQPage() {
  useScrollReveal();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <Header />
      <PageHero
        title="Questions fréquentes"
        subtitle="Les réponses aux questions que nos clients nous posent le plus souvent. Si vous ne trouvez pas ce que vous cherchez, contactez-nous."
        breadcrumb="FAQ"
      />

      <section className="section-padding bg-background texture-paper">
        <div className="max-w-3xl mx-auto">
          {faqCategories.map((cat) => (
            <div key={cat.category} className="mb-14 reveal">
              <p className="text-xs tracking-widest uppercase text-gold mb-6">{cat.category}</p>
              <div className="space-y-0">
                {cat.questions.map((item) => {
                  const key = `${cat.category}-${item.q}`;
                  const isOpen = openItems[key];
                  return (
                    <div key={key} className="border-t border-border">
                      <button
                        onClick={() => toggle(key)}
                        className="w-full py-5 flex items-start justify-between text-left group"
                      >
                        <span className="font-heading text-lg font-semibold text-primary pr-8 group-hover:text-gold transition-colors leading-snug">{item.q}</span>
                        <span className={`text-gold flex-shrink-0 mt-1 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>+</span>
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-60 pb-5" : "max-h-0"}`}>
                        <p className="text-gray-text text-sm leading-relaxed">{item.a}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <TrustBand />
      <PageCTA
        title="Une question qui n'est pas dans la liste ?"
        subtitle="Contactez-nous directement. Nous vous répondons sous 24 heures ouvrées."
        secondaryText="Voir notre méthode"
        secondaryHref="/notre-methode"
      />
      <Footer />
    </>
  );
}
