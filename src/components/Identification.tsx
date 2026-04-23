import { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Total rotation across the scroll (one full turn through the 6 cards)
  const rotationRaw = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 360]);
  const rotation = useSpring(rotationRaw, { damping: 30, stiffness: 80, mass: 0.5 });

  // Active index synced with rotation
  const [activeIndex, setActiveIndex] = useState(1);
  useMotionValueEvent(rotation, "change", (v) => {
    const step = 360 / problematics.length;
    const idx = (Math.round(v / step) % problematics.length + problematics.length) % problematics.length;
    setActiveIndex(idx + 1);
  });

  const progressScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="problematiques"
      ref={containerRef}
      className="relative texture-paper mb-24 md:mb-32"
      style={{ height: reduce ? "auto" : "500vh" }}
      aria-label="Vos enjeux patrimoniaux"
    >
      {/* Sticky stage */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        {/* Header bar */}
        <div className="relative z-20 pt-24 md:pt-28 pb-4 px-6 md:px-12 lg:px-16">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
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

            {/* Counter */}
            <div className="flex items-center gap-4 shrink-0">
              <span className="font-heading text-5xl md:text-6xl font-light text-foreground tabular-nums leading-none">
                {String(activeIndex).padStart(2, "0")}
              </span>
              <span className="text-foreground/30 text-sm">/</span>
              <span className="text-foreground/40 text-sm tabular-nums">
                {String(problematics.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* Circular carousel stage — wheel pushed down so active card sits at top center */}
        <div className="flex-1 relative overflow-hidden" style={{ perspective: "1600px" }}>
          <CircularCarousel rotation={rotation} activeIndex={activeIndex} reduce={!!reduce} />
        </div>

        {/* Bottom progress bar + hint */}
        <div className="relative z-20 pb-8 md:pb-10 px-6 md:px-12 lg:px-16">
          <div className="max-w-6xl mx-auto flex items-center gap-6">
            <span className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 font-medium whitespace-nowrap">
              Scrollez pour faire tourner
            </span>
            <div className="relative h-px flex-1 bg-foreground/10 overflow-hidden">
              <motion.div
                style={{ scaleX: progressScaleX, transformOrigin: "0% 50%" }}
                className="absolute inset-0 bg-foreground"
              />
            </div>
            <svg className="w-5 h-5 text-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.69a8.25 8.25 0 00-14.13-4.504L2.985 9.348" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

function CircularCarousel({
  rotation,
  activeIndex,
  reduce,
}: {
  rotation: ReturnType<typeof useSpring>;
  activeIndex: number;
  reduce: boolean;
}) {
  const [radius, setRadius] = useState(420);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setRadius(220);
      else if (w < 1024) setRadius(320);
      else setRadius(420);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Counter-rotate inner circle so the front card stays upright
  const counter = useTransform(rotation, (v) => -v);

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
      style={{
        // Container top = vertical center of stage. Wheel center sits at top + radius,
        // so the TOP of the wheel (active card) lands exactly at the stage's vertical center.
        top: "50%",
        width: radius * 2,
        height: radius * 2,
      }}
    >
      {/* Soft halo behind the wheel */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: radius * 2.2,
          height: radius * 2.2,
          background:
            "radial-gradient(closest-side, hsl(var(--accent) / 0.08), transparent 70%)",
        }}
      />

      {/* Faint guide circle */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/5"
        style={{ width: radius * 2, height: radius * 2 }}
      />

      {/* Rotating wheel */}
      <motion.div
        style={{ rotate: rotation, transformStyle: "preserve-3d" }}
        className="absolute left-1/2 top-1/2 pointer-events-auto"
      >
        {problematics.map((item, i) => {
          const angle = (360 / problematics.length) * i;
          const rad = (angle * Math.PI) / 180;
          const x = Math.sin(rad) * radius;
          const y = -Math.cos(rad) * radius;

          return (
            <motion.div
              key={item.n}
              className="absolute top-0 left-0"
              style={{
                x,
                y,
                translateX: "-50%",
                translateY: "-50%",
              }}
            >
              {/* Counter-rotate card so it stays upright */}
              <motion.div style={{ rotate: counter }}>
                <CircleCard
                  item={item}
                  index={i}
                  isActive={activeIndex === i + 1}
                  reduce={reduce}
                />
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Spotlight indicator at top of circle (where active card sits) */}
      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 -top-7"
      >
        <div className="w-2 h-2 rounded-full bg-[hsl(var(--accent))] shadow-[0_0_20px_hsl(var(--accent))]" />
      </div>
    </div>
  );
}

function CircleCard({
  item,
  isActive,
  reduce,
}: {
  item: (typeof problematics)[number];
  index: number;
  isActive: boolean;
  reduce: boolean;
}) {
  return (
    <motion.article
      animate={
        reduce
          ? {}
          : {
              scale: isActive ? 1.08 : 0.92,
              opacity: isActive ? 1 : 0.55,
            }
      }
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`relative glass-card rounded-[1.5rem] p-6 md:p-7 overflow-hidden w-[260px] md:w-[300px] flex flex-col transition-shadow duration-500 ${
        isActive ? "shadow-[0_30px_80px_-20px_hsl(var(--accent)/0.35)]" : "shadow-none"
      }`}
    >
      {/* Ghost number */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-8 -right-3 font-heading font-light leading-none select-none text-[9rem] md:text-[11rem] text-foreground/[0.05] tracking-tighter"
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
    </motion.article>
  );
}
