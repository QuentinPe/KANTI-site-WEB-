import { motion, useReducedMotion } from "framer-motion";
import SplitText from "./motion/SplitText";

const problematics = [
  {
    n: "01",
    title: "Optimiser mon épargne",
    line: "Faire travailler un capital qui dort, sans prendre de risque mal calibré.",
    tag: "Épargne",
  },
  {
    n: "02",
    title: "Structurer mon patrimoine",
    line: "Mettre de la cohérence entre l'immobilier, le financier et le professionnel.",
    tag: "Stratégie globale",
  },
  {
    n: "03",
    title: "Préparer ma retraite",
    line: "Construire des revenus complémentaires solides et fiscalement maîtrisés.",
    tag: "Retraite",
  },
  {
    n: "04",
    title: "Réduire ma pression fiscale",
    line: "Identifier les marges de manœuvre réelles, pas les niches risquées.",
    tag: "Fiscalité",
  },
  {
    n: "05",
    title: "Financer un projet",
    line: "Obtenir un crédit aux meilleures conditions et au bon montage.",
    tag: "Financement",
  },
  {
    n: "06",
    title: "Préparer la transmission",
    line: "Anticiper la fiscalité et protéger ceux qui comptent.",
    tag: "Transmission",
  },
];

export default function Identification() {
  const reduce = useReducedMotion();
  return (
    <section id="problematiques" className="section-padding texture-paper relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="max-w-3xl mb-12 md:mb-16 px-6 md:px-0">
          <div className="electric-line mb-5" />
          <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-5 font-medium">
            Vos enjeux
          </p>
          <h2 className="text-4xl md:text-6xl font-heading font-light text-foreground mb-6 leading-[1.1] tracking-tight">
            <SplitText text="Vous vous reconnaissez" by="word" stagger={0.07} />
            <br />
            <SplitText
              text="dans l'une de ces situations ?"
              by="word"
              stagger={0.05}
              delay={0.25}
              itemClassName="italic text-foreground/70"
            />
          </h2>
          <p className="text-foreground/60 text-lg leading-relaxed font-light">
            Chaque parcours patrimonial commence par une question concrète. Nous partons toujours de la vôtre.
          </p>
        </div>
      </div>

      {/* Invisible carousel — horizontal scroll, no scrollbar, drag & swipe */}
      <div
        className="relative -mx-6 md:mx-0 overflow-x-auto overflow-y-hidden scrollbar-none cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        aria-label="Liste de situations patrimoniales — défilement horizontal"
      >
        <style>{`.scrollbar-none::-webkit-scrollbar{display:none}`}</style>
        <ul className="flex gap-5 md:gap-6 px-6 md:px-[max(1.5rem,calc((100vw-72rem)/2))] py-6 snap-x snap-mandatory">
          {problematics.map((p, i) => (
            <li
              key={p.n}
              className="snap-start shrink-0 w-[80vw] sm:w-[55vw] md:w-[360px] lg:w-[380px]"
            >
              <ProblemCard item={p} index={i} reduce={!!reduce} />
            </li>
          ))}
        </ul>
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-background to-transparent" />
      </div>

      {/* Subtle hint */}
      <p className="max-w-6xl mx-auto px-6 md:px-0 mt-6 text-[11px] tracking-[0.25em] uppercase text-foreground/35 font-medium">
        ← Faites défiler pour explorer →
      </p>
    </section>
  );
}

function ProblemCard({
  item,
  index,
  reduce,
}: {
  item: (typeof problematics)[number];
  index: number;
  reduce: boolean;
}) {
  // Fan rotation across the row of 6 cards (-2.5 → +2.5)
  const baseRot = ((index - (problematics.length - 1) / 2) / ((problematics.length - 1) / 2)) * 2.5;

  return (
    <motion.article
      initial={
        reduce
          ? { opacity: 0 }
          : { opacity: 0, y: 50, rotate: baseRot - 1 }
      }
      whileInView={{ opacity: 1, y: 0, rotate: baseRot }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.9,
        delay: 0.05 + index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={
        reduce
          ? {}
          : {
              rotate: 0,
              y: -8,
              transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
            }
      }
      className="group/card relative glass-card rounded-[1.5rem] p-7 md:p-8 overflow-hidden h-full transition-shadow duration-500 hover:shadow-[0_30px_80px_-20px_hsl(var(--accent)/0.25)] [transform-style:preserve-3d]"
    >
      {/* Ghost number */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-6 -right-2 font-heading font-light leading-none select-none text-[8rem] md:text-[10rem] text-foreground/[0.04] tracking-tighter"
      >
        {item.n}
      </span>

      {/* Header — dossier style */}
      <div className="relative flex items-center justify-between mb-4">
        <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/45 font-medium">
          Enjeu N°{item.n}
        </p>
        <span className="text-[9px] tracking-[0.25em] uppercase text-[hsl(var(--electric))] font-medium px-2 py-0.5 rounded-full border border-[hsl(var(--electric))/0.3]">
          {item.tag}
        </span>
      </div>

      <h3 className="relative font-heading text-2xl md:text-[1.7rem] font-light text-foreground tracking-tight mb-4 leading-[1.2]">
        <span className="italic font-normal text-foreground/95">
          {item.title.split(" ")[0]}
        </span>
        <span> {item.title.split(" ").slice(1).join(" ")}</span>
      </h3>

      <div className="separator-fine my-4" />

      <p className="relative text-foreground/65 text-sm leading-relaxed font-light">
        {item.line}
      </p>
    </motion.article>
  );
}