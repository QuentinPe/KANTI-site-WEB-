import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

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

const N = problematics.length;

/* Slot positions: -1 = exiting, 0 = active front, 1 = next, 2 = back */
const SLOTS: Record<string, { y: number; x: number; scale: number; opacity: number; rotateZ: number }> = {
  "-1": { y: -210, x: 0,  scale: 0.84, opacity: 0,    rotateZ: -2   },
   "0": { y: 0,    x: 0,  scale: 1,    opacity: 1,    rotateZ: 0    },
   "1": { y: 20,   x: 14, scale: 0.944,opacity: 0.64, rotateZ: 1.4  },
   "2": { y: 40,   x: 28, scale: 0.889,opacity: 0.33, rotateZ: 2.8  },
};
const HIDDEN_SLOT = { y: 68, x: 36, scale: 0.83, opacity: 0, rotateZ: 4 };

/* ── ProblemCard ─────────────────────────────────────────────────── */
function ProblemCard({ item, slot }: { item: typeof problematics[0]; slot: number }) {
  const isActive = slot === 0;
  const s = SLOTS[String(slot)] ?? HIDDEN_SLOT;
  const [titleFirst, ...titleRest] = item.title.split(" ");

  return (
    <motion.div
      animate={{ y: s.y, x: s.x, scale: s.scale, opacity: s.opacity, rotateZ: s.rotateZ }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0"
      style={{
        zIndex: isActive ? 10 : slot === 1 ? 4 : 1,
        transformOrigin: "center bottom",
        pointerEvents: isActive ? "auto" : "none",
      }}
    >
      <div
        className="w-full h-full relative overflow-hidden"
        style={{
          borderRadius: 28,
          padding: "clamp(28px, 4vw, 40px) clamp(28px, 4vw, 44px)",
          background:
            "linear-gradient(148deg, hsl(222 52% 10% / 0.97) 0%, hsl(224 60% 15% / 0.99) 100%)",
          backdropFilter: "blur(32px) saturate(160%)",
          WebkitBackdropFilter: "blur(32px) saturate(160%)",
          boxShadow: isActive
            ? [
                "0 48px 100px -20px hsl(224 55% 8% / 0.65)",
                "0 16px 40px -8px hsl(224 55% 8% / 0.28)",
                "inset 0 1.5px 0 hsl(0 0% 100% / 0.10)",
                "inset 1px 0 0 hsl(0 0% 100% / 0.04)",
                "0 0 0 0.5px hsl(0 0% 100% / 0.06)",
              ].join(", ")
            : "0 24px 50px -14px hsl(224 40% 8% / 0.30)",
        }}
      >
        {/* Ghost number — lower right */}
        <span
          aria-hidden
          className="absolute pointer-events-none select-none font-heading font-light leading-none"
          style={{
            fontSize: "clamp(9rem, 14vw, 14rem)",
            right: "-8px",
            bottom: "-14px",
            color: "hsl(0 0% 100% / 0.030)",
            letterSpacing: "-0.04em",
          }}
        >
          {item.n}
        </span>

        {/* Tag pill */}
        <div className="mb-9">
          <span
            className="inline-block text-[9px] tracking-[0.35em] uppercase font-medium px-3 py-1.5 rounded-full"
            style={{
              background: "hsl(0 0% 100% / 0.07)",
              border: "1px solid hsl(0 0% 100% / 0.10)",
              color: "hsl(0 0% 100% / 0.46)",
            }}
          >
            {item.tag}
          </span>
        </div>

        {/* Title */}
        <h2
          className="font-heading font-light tracking-tight leading-[1.07] mb-7"
          style={{ fontSize: "clamp(1.75rem, 2.7vw, 2.4rem)", color: "hsl(0 0% 100% / 0.92)" }}
        >
          <span style={{ fontStyle: "italic", color: "hsl(0 0% 100% / 0.44)" }}>
            {titleFirst}
          </span>{" "}
          {titleRest.join(" ")}
        </h2>

        {/* Separator */}
        <div style={{ height: 1, background: "hsl(0 0% 100% / 0.07)", marginBottom: 22 }} />

        {/* Description */}
        <p
          className="font-light leading-relaxed"
          style={{ fontSize: "0.9375rem", color: "hsl(0 0% 100% / 0.48)", maxWidth: "85%" }}
        >
          {item.line}
        </p>
      </div>
    </motion.div>
  );
}

/* ── DesktopIdentification ───────────────────────────────────────── */
function DesktopIdentification() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const slideFloat = useTransform(scrollYProgress, [0, 1], [0, N]);
  useMotionValueEvent(slideFloat, "change", (v) => {
    setActive(Math.min(N - 1, Math.floor(v)));
  });

  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  const exitOverlay = useTransform(scrollYProgress, [0.87, 1], [0, 0.88]);

  return (
    <section
      ref={ref}
      id="problematiques"
      aria-label="Vos enjeux patrimoniaux"
      style={{ height: `${N * 100}vh` }}
    >
      <motion.div
        className="sticky top-0 h-screen overflow-hidden texture-paper flex flex-col"
        style={{ opacity: contentOpacity }}
      >
        {/* Dark exit overlay */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none z-40"
          style={{ opacity: exitOverlay, background: "hsl(var(--navy-deep))" }}
        />

        {/* Scroll progress bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] z-20"
          style={{ background: "hsl(var(--foreground) / 0.07)" }}
        >
          <motion.div
            className="h-full origin-left"
            style={{ width: progressWidth, background: "hsl(var(--foreground) / 0.30)" }}
          />
        </div>

        {/* Header row */}
        <div className="flex items-end justify-between px-10 lg:px-20 pt-14 pb-0 flex-shrink-0 z-10">
          <div>
            <div className="electric-line mb-3" />
            <p
              className="text-[11px] tracking-[0.3em] uppercase font-medium"
              style={{ color: "hsl(var(--foreground) / 0.45)" }}
            >
              Vous vous reconnaissez ?
            </p>
          </div>
          <AnimatePresence mode="wait">
            <motion.span
              key={`counter-${active}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="font-heading font-light tabular-nums"
              style={{ fontSize: "0.875rem", color: "hsl(var(--foreground) / 0.22)" }}
            >
              {String(active + 1).padStart(2, "0")}&thinsp;/&thinsp;{String(N).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Two-column content area */}
        <div className="flex-1 flex items-stretch min-h-0">

          {/* Left column — animated text, XL screens only */}
          <div className="hidden xl:flex flex-col justify-center pl-20 pr-10 w-[40%] flex-shrink-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={`left-${active}`}
                initial={{ opacity: 0, x: -24, filter: "blur(8px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: 24, filter: "blur(8px)" }}
                transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
              >
                <p
                  className="text-[10px] tracking-[0.28em] uppercase font-medium mb-5"
                  style={{ color: "hsl(var(--foreground) / 0.34)" }}
                >
                  Votre situation
                </p>
                <h3
                  className="font-heading font-light leading-[1.09] tracking-tight"
                  style={{ fontSize: "clamp(1.9rem, 2.5vw, 2.8rem)", color: "hsl(var(--foreground))" }}
                >
                  <span style={{ fontStyle: "italic", color: "hsl(var(--foreground) / 0.45)" }}>
                    {problematics[active].title.split(" ")[0]}
                  </span>{" "}
                  {problematics[active].title.split(" ").slice(1).join(" ")}
                </h3>
                <div className="separator-fine my-7" style={{ opacity: 0.15 }} />
                <p
                  className="font-light leading-relaxed"
                  style={{ fontSize: "0.9375rem", color: "hsl(var(--foreground) / 0.52)", maxWidth: 360 }}
                >
                  {problematics[active].line}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right column — card stack */}
          <div className="flex-1 flex items-center justify-center relative py-8">
            {/* Ambient glow behind stack */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none flex items-center justify-center"
            >
              <div
                style={{
                  width: 480,
                  height: 360,
                  borderRadius: "50%",
                  background: "radial-gradient(ellipse, hsl(224 60% 40% / 0.07) 0%, transparent 70%)",
                  filter: "blur(50px)",
                }}
              />
            </div>

            {/* 3D perspective context + card stack */}
            <div style={{ perspective: "1400px", perspectiveOrigin: "50% 40%", flexShrink: 0 }}>
              <div
                className="relative"
                style={{ width: "min(520px, 85vw)", height: 420 }}
              >
                {problematics.map((item, i) => {
                  const slot = i - active;
                  if (slot < -1 || slot > 2) return null;
                  return <ProblemCard key={item.n} item={item} slot={slot} />;
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2.5 pb-10 flex-shrink-0 z-10">
          {problematics.map((_, i) => (
            <motion.span
              key={i}
              className="rounded-full block"
              animate={{
                width: i === active ? 32 : 6,
                height: 6,
                backgroundColor:
                  i === active
                    ? "hsl(var(--foreground) / 0.60)"
                    : "hsl(var(--foreground) / 0.14)",
              }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ── MobileIdentification (unchanged) ───────────────────────────── */
function MobileIdentification() {
  const reduce = useReducedMotion();
  return (
    <section
      id="problematiques"
      className="relative texture-paper section-padding"
      aria-label="Vos enjeux patrimoniaux"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="max-w-2xl mb-14">
          <div className="electric-line mb-4" />
          <p
            className="text-[11px] tracking-[0.3em] uppercase mb-4 font-medium"
            style={{ color: "hsl(var(--foreground) / 0.5)" }}
          >
            Vos enjeux
          </p>
          <h2
            className="font-heading font-light tracking-tight leading-[1.15]"
            style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)", color: "hsl(var(--foreground))" }}
          >
            Vous vous reconnaissez
            <br />
            <span style={{ fontStyle: "italic", color: "hsl(var(--foreground) / 0.65)" }}>
              dans l'une de ces situations&nbsp;?
            </span>
          </h2>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {problematics.map((item, i) => (
            <motion.li
              key={item.n}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                duration: 0.7,
                delay: 0.05 + (i % 2) * 0.09,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative rounded-[1.5rem] p-7 overflow-hidden bg-card border border-foreground/10"
              style={{ boxShadow: "0 10px 30px -12px hsl(var(--foreground) / 0.08)" }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-8 -right-3 font-heading font-light leading-none select-none text-[8rem] tracking-tighter"
                style={{ color: "hsl(var(--foreground) / 0.05)" }}
              >
                {item.n}
              </span>
              <div className="flex items-center justify-between mb-3">
                <p
                  className="text-[10px] tracking-[0.3em] uppercase font-medium"
                  style={{ color: "hsl(var(--foreground) / 0.45)" }}
                >
                  Enjeu N°{item.n}
                </p>
                <span
                  className="text-[9px] tracking-[0.25em] uppercase font-medium px-2 py-0.5 rounded-full border"
                  style={{
                    color: "hsl(var(--foreground) / 0.55)",
                    borderColor: "hsl(var(--foreground) / 0.15)",
                  }}
                >
                  {item.tag}
                </span>
              </div>
              <h3
                className="font-heading text-xl font-light tracking-tight mb-3 leading-[1.2]"
                style={{ color: "hsl(var(--foreground))" }}
              >
                <span style={{ fontStyle: "italic" }}>{item.title.split(" ")[0]}</span>{" "}
                {item.title.split(" ").slice(1).join(" ")}
              </h3>
              <div className="separator-fine mb-3" style={{ opacity: 0.3 }} />
              <p
                className="text-sm leading-relaxed font-light"
                style={{ color: "hsl(var(--foreground) / 0.65)" }}
              >
                {item.line}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function Identification() {
  const isMobile = useIsMobile();
  const reduce = useReducedMotion();
  return isMobile || reduce ? <MobileIdentification /> : <DesktopIdentification />;
}
