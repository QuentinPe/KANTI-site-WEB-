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
    <section
      id="problematiques"
      className="relative texture-paper section-padding"
      aria-label="Vos enjeux patrimoniaux"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
        {/* Header */}
        <div className="max-w-2xl mb-14 md:mb-20">
          <div className="electric-line mb-4" />
          <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-4 font-medium">
            Vos enjeux
          </p>
          <h2 className="font-heading font-light text-foreground tracking-tight leading-[1.15]">
            <span className="block text-3xl md:text-5xl">
              <SplitText text="Vous vous reconnaissez" by="word" stagger={0.07} />
            </span>
            <span className="block text-3xl md:text-5xl pb-[0.15em]">
              <SplitText
                text={"dans l'une de ces situations\u00A0?"}
                by="word"
                stagger={0.05}
                delay={0.25}
                itemClassName="italic text-foreground/70"
              />
            </span>
          </h2>
        </div>

        {/* Editorial grid, non scroll-jacking */}
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {problematics.map((item, i) => (
            <motion.li
              key={item.n}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                duration: 0.7,
                delay: 0.05 + (i % 3) * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative rounded-[1.5rem] p-7 md:p-8 overflow-hidden bg-card border border-foreground/10 shadow-[0_10px_30px_-12px_hsl(var(--foreground)/0.08)] hover:shadow-[0_30px_80px_-20px_hsl(var(--foreground)/0.18)] transition-shadow duration-500"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-8 -right-3 font-heading font-light leading-none select-none text-[8rem] md:text-[10rem] text-foreground/[0.05] tracking-tighter"
              >
                {item.n}
              </span>

              <div className="relative flex items-center justify-between mb-3">
                <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/45 font-medium">
                  Enjeu N°{item.n}
                </p>
                <span className="text-[9px] tracking-[0.25em] uppercase text-[hsl(var(--electric))] font-medium px-2 py-0.5 rounded-full border border-[hsl(var(--electric))/0.3]">
                  {item.tag}
                </span>
              </div>

              <h3 className="relative font-heading text-xl md:text-2xl font-light text-foreground tracking-tight mb-3 leading-[1.2]">
                <span className="italic font-normal text-foreground/95">{item.title.split(" ")[0]}</span>
                <span> {item.title.split(" ").slice(1).join(" ")}</span>
              </h3>

              <div className="separator-fine my-3" />

              <p className="relative text-foreground/65 text-sm leading-relaxed font-light">
                {item.line}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
