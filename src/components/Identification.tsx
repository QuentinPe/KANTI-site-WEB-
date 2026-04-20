import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

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
            Vous vous reconnaissez<br />
            <span className="italic text-foreground/70">dans l'une de ces situations ?</span>
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
      className="group glass-card rounded-[1.5rem] p-7 md:p-8 reflection-sweep relative overflow-hidden hover:-translate-y-1 transition-transform duration-500"
    >
      <div className="flex items-start justify-between mb-8">
        <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-foreground/35">
          {item.n}
        </span>
        <span className="w-8 h-[1px] bg-foreground/20 mt-2 transition-all duration-500 group-hover:w-12 group-hover:bg-[hsl(var(--accent))]" />
      </div>
      <h3 className="font-heading text-2xl md:text-[1.7rem] font-light text-foreground tracking-tight mb-4 leading-[1.2]">
        {item.title}
      </h3>
      <p className="text-foreground/60 text-[15px] leading-relaxed font-light">
        {item.line}
      </p>
    </motion.article>
  );
}