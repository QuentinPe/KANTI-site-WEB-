import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import MagneticCard from "./motion/MagneticCard";
import SplitText from "./motion/SplitText";

const problematics = [
  {
    n: "01",
    title: "Optimiser mon épargne",
    line: "Faire travailler un capital qui dort, sans prendre de risque mal calibré.",
  },
  {
    n: "02",
    title: "Structurer mon patrimoine",
    line: "Mettre de la cohérence entre l'immobilier, le financier et le professionnel.",
  },
  {
    n: "03",
    title: "Préparer ma retraite",
    line: "Construire des revenus complémentaires solides et fiscalement maîtrisés.",
  },
  {
    n: "04",
    title: "Réduire ma pression fiscale",
    line: "Identifier les marges de manœuvre réelles, pas les niches risquées.",
  },
  {
    n: "05",
    title: "Financer un projet",
    line: "Obtenir un crédit aux meilleures conditions et au bon montage.",
  },
  {
    n: "06",
    title: "Préparer la transmission",
    line: "Anticiper la fiscalité et protéger ceux qui comptent.",
  },
];

export default function Identification() {
  return (
    <section id="problematiques" className="section-padding texture-paper relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="max-w-3xl mb-16 md:mb-20">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {problematics.map((p, i) => (
            <ProblemCard key={p.n} item={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemCard({
  item,
  index,
}: {
  item: (typeof problematics)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 60%"],
  });

  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  return (
    <motion.article
      ref={ref}
      style={{ y, opacity, transitionDelay: `${index * 40}ms` }}
      className=""
    >
      <MagneticCard
        intensity={4}
        glow="var(--accent)"
        className="group glass-card rounded-[1.5rem] p-7 md:p-8 reflection-sweep relative overflow-hidden transition-shadow duration-500 hover:shadow-[0_30px_80px_-20px_hsl(var(--accent)/0.25)]"
      >
        {/* Ghost number — large, in background, clipped by card */}
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-6 -right-2 font-heading font-light leading-none select-none text-[8rem] md:text-[10rem] text-foreground/[0.04] tracking-tighter"
        >
          {item.n}
        </span>

        <div className="relative flex items-start justify-between mb-8">
          <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-foreground/35">
            {item.n}
          </span>
          {/* SVG line that traces in on view */}
          <svg
            className="mt-2"
            width="48"
            height="2"
            viewBox="0 0 48 2"
            fill="none"
            aria-hidden
          >
            <motion.line
              x1="0"
              y1="1"
              x2="48"
              y2="1"
              stroke="currentColor"
              strokeWidth="1"
              className="text-foreground/25 group-hover:text-[hsl(var(--accent))] transition-colors duration-500"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.9, delay: 0.2 + index * 0.05, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
        </div>
        <h3 className="relative font-heading text-2xl md:text-[1.7rem] font-light text-foreground tracking-tight mb-4 leading-[1.2]">
          <span className="group-hover:[&>em]:not-italic">
            <span className="italic font-normal text-foreground/95">
              {item.title.split(" ")[0]}
            </span>
            <span> {item.title.split(" ").slice(1).join(" ")}</span>
          </span>
        </h3>
        <p className="relative text-foreground/60 text-[15px] leading-relaxed font-light">
          {item.line}
        </p>
      </MagneticCard>
    </motion.article>
  );
}