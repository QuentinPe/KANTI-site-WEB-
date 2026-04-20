import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const expertises = [
  {
    tag: "Épargne & placements",
    title: "Gestion patrimoniale",
    description:
      "Allocation d'actifs, assurance-vie, PER, compte-titres, SCPI — une stratégie d'épargne construite pour durer.",
    benefit: "Faire travailler votre capital en cohérence avec vos projets de vie.",
    href: "/gestion-patrimoniale",
  },
  {
    tag: "Fiscalité",
    title: "Fiscalité du patrimoine",
    description:
      "Audit fiscal, IFI, revenus fonciers, structuration — réduire votre pression fiscale sans prendre de risques inutiles.",
    benefit: "Identifier vos marges de manœuvre fiscales réelles.",
    href: "/fiscalite",
  },
  {
    tag: "Dirigeants",
    title: "Patrimoine professionnel",
    description:
      "Rémunération du dirigeant, trésorerie d'entreprise, holding, prévoyance, cession et transmission d'activité.",
    benefit: "Articuler patrimoine privé et professionnel avec méthode.",
    href: "/patrimoine-professionnel",
  },
  {
    tag: "Financement",
    title: "Financement & crédit",
    description:
      "Courtage indépendant, négociation des meilleures conditions, montages patrimoniaux adaptés à chaque projet.",
    benefit: "Obtenir les conditions de crédit les plus compétitives.",
    href: "/financement",
  },
  {
    tag: "Succession",
    title: "Transmission & prévoyance",
    description:
      "Donation, démembrement, assurance-vie, pacte Dutreil — anticiper pour protéger ceux qui comptent.",
    benefit: "Préparer la transmission en maîtrisant la fiscalité.",
    href: "/transmission-patrimoine-famille",
  },
  {
    tag: "Immobilier",
    title: "Immobilier patrimonial",
    description:
      "Résidence principale, locatif, SCI, nue-propriété — chaque investissement pensé dans une logique globale.",
    benefit: "Structurer vos actifs immobiliers intelligemment.",
    href: "/patrimoine-immobilier-strategie",
  },
];

export default function ExpertisesStacked() {
  return (
    <section id="expertises" className="section-glass texture-paper relative">
      {/* Header */}
      <div className="section-padding pb-0">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
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
        </div>
      </div>

      {/* Stacked cards */}
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        {expertises.map((item, i) => (
          <StackCard key={item.title} item={item} index={i} total={expertises.length} />
        ))}
      </div>
    </section>
  );
}

function StackCard({
  item,
  index,
  total,
}: {
  item: (typeof expertises)[number] & { benefit: string };
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Scale slightly down + translate as next card stacks on top
  const scale = reduce
    ? useTransform(scrollYProgress, () => 1)
    : useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [0.4, 1, 1, 0.85]);

  // Sticky offset — slight stagger so cards stack with depth
  const top = `${80 + index * 18}px`;

  return (
    <div ref={ref} className="sticky" style={{ top, marginBottom: index === total - 1 ? 0 : "2rem" }}>
      <motion.article
        style={{ scale, opacity }}
        className="group glass-card rounded-[2rem] p-8 md:p-12 lg:p-14 reflection-sweep relative overflow-hidden"
      >
        {/* Accent index */}
        <span
          aria-hidden
          className="absolute top-6 right-8 text-[11px] font-medium tracking-[0.3em] uppercase text-foreground/30"
        >
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>

        <div className="relative z-10 grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-7">
            <p className="text-[10px] tracking-[0.25em] uppercase text-foreground/50 font-medium mb-5">
              {item.tag}
            </p>
            <h3 className="font-heading text-3xl md:text-4xl lg:text-5xl font-light text-foreground tracking-tight mb-5 transition-colors duration-500 group-hover:text-[hsl(var(--accent))]">
              {item.title}
            </h3>
            <p className="text-foreground/65 text-base leading-relaxed font-light mb-3 max-w-xl">
              {item.description}
            </p>
            <p className="text-foreground/85 text-base font-normal max-w-xl">{item.benefit}</p>
          </div>

          <div className="md:col-span-5 flex md:justify-end">
            <Link
              to={item.href}
              data-magnetic
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-foreground text-background text-sm font-medium tracking-wide reflection-sweep hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5"
            >
              Découvrir l'expertise
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </motion.article>
    </div>
  );
}
