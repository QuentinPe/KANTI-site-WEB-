import { Link } from "react-router-dom";
import FlipCard from "./FlipCard";

/**
 * Each "expertise" exposes a flagship product on its FlipCard verso,
 * + a link to the full expertise page.
 */
const expertises = [
  {
    tag: "Épargne & placements",
    title: "Gestion patrimoniale",
    pitch: "Allocation d'actifs sur mesure : faire travailler votre capital en cohérence avec vos projets de vie.",
    forWhom: "Particuliers, cadres dirigeants et familles construisant un patrimoine sur la durée.",
    benefits: [
      "Architecture 100 % ouverte",
      "Aucun produit maison",
      "Allocation revue chaque année",
      "Assurance-vie, PER, SCPI, PE",
    ],
    fiscality: "Optimisation par enveloppe : assurance-vie, PER, PEA, chaque support adapté à votre TMI et horizon.",
    horizon: "Long terme",
    href: "/gestion-patrimoniale",
    featured: true,
  },
  {
    tag: "Fiscalité",
    title: "Fiscalité du patrimoine",
    pitch: "Réduire votre pression fiscale sans prendre de risque inutile, ni promesse irréaliste.",
    forWhom: "Foyers à TMI 30 %+, contribuables IFI, dirigeants en arbitrage rémunération.",
    benefits: [
      "Audit fiscal complet",
      "Stratégie IFI structurée",
      "Optimisation revenus fonciers",
      "Holding patrimoniale",
    ],
    fiscality: "Conformité totale (AMF, BOFIP). Aucun montage à risque, traçabilité documentée.",
    horizon: "Annuel",
    href: "/fiscalite",
    featured: true,
  },
  {
    tag: "Dirigeants",
    title: "Patrimoine professionnel",
    pitch: "Articuler patrimoine privé et professionnel avec une méthode dédiée aux dirigeants.",
    forWhom: "Chefs d'entreprise, associés, professions libérales.",
    benefits: [
      "Arbitrage salaire / dividendes",
      "Holding & trésorerie",
      "Prévoyance homme-clé",
      "Cession & transmission",
    ],
    fiscality: "Optimisation IS / IR croisée. Coordination expert-comptable & avocat.",
    href: "/patrimoine-professionnel",
  },
  {
    tag: "Financement",
    title: "Financement & crédit",
    pitch: "Le crédit comme outil patrimonial : effet de levier, fiscalité, capacité d'investissement.",
    forWhom: "Acquéreurs, investisseurs locatifs, dirigeants en projet de croissance.",
    benefits: [
      "20+ banques partenaires",
      "Courtage indépendant",
      "Délégation d'assurance",
      "Crédit lombard",
    ],
    fiscality: "Intérêts déductibles selon usage (locatif, pro). Optimisation du coût total du crédit.",
    href: "/financement",
  },
  {
    tag: "Succession",
    title: "Transmission & prévoyance",
    pitch: "Anticiper pour protéger ceux qui comptent, en maîtrisant la fiscalité.",
    forWhom: "Familles, parents souhaitant organiser leur succession, dirigeants familiaux.",
    benefits: [
      "Donation-partage",
      "Démembrement",
      "Clause bénéficiaire sur mesure",
      "Pacte Dutreil",
    ],
    fiscality: "Abattements 100 000 € / 15 ans, AV 152 500 € / bénéficiaire, Dutreil −75 %.",
    href: "/transmission-patrimoine-famille",
  },
  {
    tag: "Immobilier",
    title: "Immobilier patrimonial",
    pitch: "Chaque décision immobilière pensée dans une logique patrimoniale globale.",
    forWhom: "Acquéreurs RP, investisseurs locatifs, familles en projet SCI.",
    benefits: [
      "Résidence principale & locatif",
      "SCI patrimoniale (IR / IS)",
      "Nue-propriété démembrée",
      "SCPI en direct ou en AV",
    ],
    fiscality: "Choix nu / meublé / LMNP. Régime adapté à votre TMI et vos objectifs.",
    href: "/patrimoine-immobilier-strategie",
  },
];

export default function Expertises() {
  return (
    <section id="expertises" className="section-padding section-glass texture-paper relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-20 reveal max-w-3xl">
          <div className="electric-line mb-5" />
          <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-5 font-medium">
            Nos expertises
          </p>
          <h2 className="text-4xl md:text-6xl font-heading font-light text-foreground mb-6 leading-[1.1] tracking-tight">
            Ce que nous faisons,<br className="hidden md:block" />
            <span className="italic text-foreground/70">concrètement</span>
          </h2>
          <p className="text-foreground/60 text-lg leading-relaxed font-light">
            Chaque domaine est traité en lien avec les autres. C'est cette approche transversale qui fait la différence.
          </p>
        </div>

        {/* Liquid-glass flip cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {expertises.map((item, i) => (
            <div
              key={item.title}
              className={`reveal reveal-delay-${(i % 3) + 1}`}
            >
              <FlipCard
                tag={item.tag}
                title={item.title}
                pitch={item.pitch}
                forWhom={item.forWhom}
                benefits={item.benefits}
                fiscality={item.fiscality}
                horizon={item.horizon}
                href={item.href}
              />
            </div>
          ))}
        </div>

        <div className="mt-14 text-center reveal">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground link-underline"
          >
            Discuter de votre situation
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
