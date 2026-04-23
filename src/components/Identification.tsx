import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, useSpring } from "framer-motion";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Translate horizontally: from 0 to -(trackWidth - viewportWidth)
  // We approximate via vw: 6 cards * (card width + gap) ≈ ~ 6 * 30rem
  // Use percentage based on track width via CSS calc inside component.
  const xRaw = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "-72%"]);
  const x = useSpring(xRaw, { damping: 28, stiffness: 90, mass: 0.6 });

  // Active index for the counter (01 / 06)
  const activeIndex = useTransform(scrollYProgress, (v) =>
    Math.min(problematics.length, Math.max(1, Math.ceil(v * problematics.length) || 1))
  );
  const progressScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="problematiques"
      ref={containerRef}
      className="relative texture-paper"
      // Tall section so we have scroll distance to translate the horizontal track
      style={{ height: reduce ? "auto" : "420vh" }}
      aria-label="Vos enjeux patrimoniaux"
    >
      {/* Sticky stage */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        {/* Header bar */}
        <div className="relative z-20 pt-24 md:pt-28 pb-6 md:pb-8 px-6 md:px-12 lg:px-16">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="electric-line mb-4" />
              <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-4 font-medium">
                Vos enjeux
              </p>
              <h2 className="text-3xl md:text-5xl font-heading font-light text-foreground leading-[1.1] tracking-tight">
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
            </div>

            {/* Counter */}
            <div className="flex items-center gap-4 shrink-0">
              <motion.span className="font-heading text-5xl md:text-6xl font-light text-foreground tabular-nums leading-none">
                {activeIndex}
              </motion.span>
              <span className="text-foreground/30 text-sm">/</span>
              <span className="text-foreground/40 text-sm tabular-nums">
                {String(problematics.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* Horizontal track */}
        <div className="flex-1 relative flex items-center">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex gap-6 md:gap-8 pl-6 md:pl-12 lg:pl-16 pr-[20vw] will-change-transform"
          >
            {problematics.map((p, i) => (
              <ProblemCard
                key={p.n}
                item={p}
                index={i}
                total={problematics.length}
                reduce={!!reduce}
              />
            ))}
          </motion.div>

          {/* Edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10" />
        </div>

        {/* Bottom progress bar + hint */}
        <div className="relative z-20 pb-10 md:pb-12 px-6 md:px-12 lg:px-16">
          <div className="max-w-6xl mx-auto flex items-center gap-6">
            <span className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 font-medium whitespace-nowrap">
              Scrollez pour explorer
            </span>
            <div className="relative h-px flex-1 bg-foreground/10 overflow-hidden">
              <motion.div
                style={{ scaleX: progressScaleX, transformOrigin: "0% 50%" }}
                className="absolute inset-0 bg-foreground"
              />
            </div>
            <svg className="w-5 h-5 text-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </div>
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