import { Link } from "react-router-dom";

const expertises = [
  {
    tag: "Épargne & placements",
    title: "Gestion patrimoniale",
    description: "Allocation d'actifs, assurance-vie, PER, compte-titres, SCPI — une stratégie d'épargne construite pour durer.",
    benefit: "Faire travailler votre capital en cohérence avec vos projets de vie.",
    href: "/gestion-patrimoniale",
    featured: true,
  },
  {
    tag: "Fiscalité",
    title: "Fiscalité du patrimoine",
    description: "Audit fiscal, IFI, revenus fonciers, structuration — réduire votre pression fiscale sans prendre de risques inutiles.",
    benefit: "Identifier vos marges de manœuvre fiscales réelles.",
    href: "/fiscalite",
    featured: true,
  },
  {
    tag: "Dirigeants",
    title: "Patrimoine professionnel",
    description: "Rémunération du dirigeant, trésorerie d'entreprise, holding, prévoyance, cession et transmission d'activité.",
    benefit: "Articuler patrimoine privé et professionnel avec méthode.",
    href: "/patrimoine-professionnel",
  },
  {
    tag: "Financement",
    title: "Financement & crédit",
    description: "Courtage indépendant, négociation des meilleures conditions, montages patrimoniaux adaptés à chaque projet.",
    benefit: "Obtenir les conditions de crédit les plus compétitives.",
    href: "/financement",
  },
  {
    tag: "Succession",
    title: "Transmission & prévoyance",
    description: "Donation, démembrement, assurance-vie, pacte Dutreil — anticiper pour protéger ceux qui comptent.",
    benefit: "Préparer la transmission en maîtrisant la fiscalité.",
    href: "/transmission-patrimoine-famille",
  },
  {
    tag: "Immobilier",
    title: "Immobilier patrimonial",
    description: "Résidence principale, locatif, SCI, nue-propriété — chaque investissement pensé dans une logique globale.",
    benefit: "Structurer vos actifs immobiliers intelligemment.",
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

        {/* Featured cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {expertises.filter((e) => e.featured).map((item, i) => (
            <Link
              to={item.href}
              key={item.title}
              className={`reveal reveal-delay-${i + 1} group glass-card block p-8 md:p-10 reflection-sweep`}
            >
              <div className="relative z-10">
                <div className="mb-6">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-foreground/50 font-medium">
                    {item.tag}
                  </span>
                </div>
                <h3 className="font-heading text-2xl md:text-3xl font-light text-foreground mb-4 tracking-tight transition-colors duration-300 group-hover:text-[hsl(var(--electric))]">
                  {item.title}
                </h3>
                <p className="text-foreground/65 leading-relaxed text-sm mb-3 font-light">
                  {item.description}
                </p>
                <p className="text-foreground/85 text-sm font-normal mb-7">
                  {item.benefit}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground/80 group-hover:text-[hsl(var(--electric))] transition-all duration-300">
                  Découvrir l'expertise
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Secondary cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {expertises.filter((e) => !e.featured).map((item, i) => (
            <Link
              to={item.href}
              key={item.title}
              className={`reveal reveal-delay-${i + 1} group glass-card block p-6 reflection-sweep`}
            >
              <div className="relative z-10">
                <div className="mb-4">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-foreground/50 font-medium">
                    {item.tag}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-light text-foreground mb-3 tracking-tight transition-colors duration-300 group-hover:text-[hsl(var(--electric))]">
                  {item.title}
                </h3>
                <p className="text-foreground/60 leading-relaxed text-[13px] mb-4 font-light">
                  {item.description}
                </p>
                <span className="inline-flex items-center gap-1 text-[12px] text-foreground/70 group-hover:text-[hsl(var(--electric))] transition-all duration-300">
                  En savoir plus
                  <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
