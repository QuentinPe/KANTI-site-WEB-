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
  "-1": { y: -230, x: 0,  scale: 0.84, opacity: 0,    rotateZ: -1.5 },
   "0": { y: 0,    x: 0,  scale: 1,    opacity: 1,    rotateZ: 0    },
   "1": { y: 18,   x: 16, scale: 0.944,opacity: 0.62, rotateZ: 1.6  },
   "2": { y: 36,   x: 32, scale: 0.889,opacity: 0.32, rotateZ: 3.2  },
};
const HIDDEN_SLOT = { y: 60, x: 44, scale: 0.83, opacity: 0, rotateZ: 4.5 };

/* ── ProblemCard — liquid glass ──────────────────────────────────── */
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
        className="w-full h-full flex flex-col relative overflow-hidden"
        style={{
          borderRadius: 20,
          /* ── Liquid glass surface ── */
          background: "hsl(0 0% 100% / 0.08)",
          backdropFilter: "blur(28px) saturate(200%)",
          WebkitBackdropFilter: "blur(28px) saturate(200%)",
          border: "0.5px solid hsl(0 0% 100% / 0.18)",
          boxShadow: isActive
            ? [
                "0 32px 72px -16px hsl(224 60% 4% / 0.70)",
                "0 8px 24px -4px hsl(224 60% 4% / 0.30)",
                /* Inner specular highlights — simulate glass refraction */
                "inset 0 1.5px 0 hsl(0 0% 100% / 0.30)",
                "inset 0 -0.5px 0 hsl(0 0% 100% / 0.05)",
                "inset 1px 0 0 hsl(0 0% 100% / 0.08)",
                "inset -1px 0 0 hsl(0 0% 100% / 0.08)",
                "0 0 0 0.5px hsl(0 0% 100% / 0.09)",
              ].join(", ")
            : [
                "0 20px 44px -12px hsl(224 60% 4% / 0.45)",
                "inset 0 1px 0 hsl(0 0% 100% / 0.14)",
                "0 0 0 0.5px hsl(0 0% 100% / 0.06)",
              ].join(", "),
        }}
      >
        {/* Upper glass reflection — blurred light catch */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: "44%",
            background:
              "linear-gradient(180deg, hsl(0 0% 100% / 0.09) 0%, hsl(0 0% 100% / 0.02) 55%, transparent 100%)",
            borderRadius: "20px 20px 0 0",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Specular line — top edge bright highlight */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "0.5px",
            left: "7%", right: "7%",
            height: "1.5px",
            background:
              "linear-gradient(to right, transparent 0%, hsl(0 0% 100% / 0.50) 22%, hsl(0 0% 100% / 0.72) 50%, hsl(0 0% 100% / 0.50) 78%, transparent 100%)",
            borderRadius: "100%",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Card content */}
        <div className="flex flex-col flex-1 p-10 lg:p-12" style={{ position: "relative", zIndex: 1 }}>

          {/* Header: tag (left) + number (right) */}
          <div className="flex items-start justify-between mb-10">
            <span
              style={{
                fontSize: "7.5px",
                letterSpacing: "0.50em",
                textTransform: "uppercase",
                fontWeight: 500,
                color: "hsl(0 0% 100% / 0.55)",
                lineHeight: 1,
              }}
            >
              {item.tag}
            </span>
            <span
              style={{
                fontSize: "9px",
                fontFamily: "ui-monospace, 'Cascadia Code', monospace",
                letterSpacing: "0.06em",
                color: "hsl(0 0% 100% / 0.22)",
                lineHeight: 1,
              }}
            >
              {item.n}
            </span>
          </div>

          {/* Title */}
          <h2
            className="font-heading font-light tracking-tight leading-[1.06]"
            style={{
              fontSize: "clamp(1.8rem, 2.65vw, 2.4rem)",
              color: "hsl(0 0% 100% / 0.94)",
              marginBottom: "clamp(22px, 2.8vw, 34px)",
            }}
          >
            <span style={{ fontStyle: "italic", color: "hsl(0 0% 100% / 0.46)" }}>
              {titleFirst}
            </span>{" "}
            {titleRest.join(" ")}
          </h2>

          {/* Short structural rule */}
          <div
            style={{
              width: 28,
              height: 1,
              background: "hsl(0 0% 100% / 0.24)",
              marginBottom: "clamp(16px, 2.2vw, 24px)",
              flexShrink: 0,
            }}
          />

          {/* Description */}
          <p
            className="font-light leading-relaxed"
            style={{
              fontSize: "clamp(0.875rem, 1.05vw, 0.9625rem)",
              color: "hsl(0 0% 100% / 0.58)",
              maxWidth: "88%",
            }}
          >
            {item.line}
          </p>
        </div>
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
  /* Subtle background parallax — waves drift slowly upward as you scroll */
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-7%"]);
  /* Navy fade at ENTRY — starts full, reveals the scene as you scroll in */
  const entryOverlay = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  /* Navy fade at EXIT — smoothly blends into Promesse */
  const exitOverlay = useTransform(scrollYProgress, [0.76, 1], [0, 1]);

  return (
    <section
      ref={ref}
      id="problematiques"
      aria-label="Vos enjeux patrimoniaux"
      style={{ height: `${N * 100}vh`, background: "hsl(var(--navy-deep))" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">

        {/* ── Layer 1: Background image ── */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.img
            src="/identification-bg.png"
            alt=""
            aria-hidden
            fetchPriority="low"
            className="w-full h-full object-cover object-center will-change-transform"
            style={{ y: bgY, scale: 1.08 }}
          />
          {/* Very subtle dark scrim — image is already dark, just a whisper */}
          <div
            className="absolute inset-0"
            style={{ background: "hsl(224 55% 5% / 0.18)" }}
          />
        </div>

        {/* ── Entry overlay — deep navy fades away as section enters ── */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none z-30"
          style={{ opacity: entryOverlay, background: "hsl(var(--navy-deep))" }}
        />

        {/* ── Exit overlay — fades to navy-deep for seamless Promesse transition ── */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none z-30"
          style={{ opacity: exitOverlay, background: "hsl(var(--navy-deep))" }}
        />

        {/* ── Scroll progress bar ── */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] z-20"
          style={{ background: "hsl(0 0% 100% / 0.08)" }}
        >
          <motion.div
            className="h-full origin-left"
            style={{ width: progressWidth, background: "hsl(0 0% 100% / 0.35)" }}
          />
        </div>

        {/* ── Header row ── */}
        <div className="flex items-end justify-between px-10 lg:px-20 pt-14 pb-0 flex-shrink-0 z-10">
          <div>
            <div
              className="electric-line mb-3"
              style={{ background: "hsl(0 0% 100% / 0.30)" }}
            />
            <p
              className="text-[11px] tracking-[0.3em] uppercase font-medium"
              style={{ color: "hsl(0 0% 100% / 0.50)" }}
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
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="font-heading font-light tabular-nums"
              style={{ fontSize: "0.875rem", color: "hsl(0 0% 100% / 0.26)" }}
            >
              {String(active + 1).padStart(2, "0")}&thinsp;/&thinsp;{String(N).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* ── Two-column content area ── */}
        <div className="flex-1 flex items-stretch min-h-0">

          {/* Left column — XL screens — white text on dark background */}
          <div className="hidden xl:flex flex-col justify-center pl-20 pr-12 w-[38%] flex-shrink-0 z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={`left-${active}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Eyebrow */}
                <p
                  style={{
                    fontSize: "8px",
                    letterSpacing: "0.50em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    color: "hsl(0 0% 100% / 0.42)",
                    marginBottom: "1.5rem",
                    lineHeight: 1,
                  }}
                >
                  Votre enjeu
                </p>

                {/* Large title */}
                <h3
                  className="font-heading font-light leading-[1.07] tracking-tight"
                  style={{
                    fontSize: "clamp(2rem, 2.55vw, 2.85rem)",
                    color: "hsl(0 0% 100% / 0.95)",
                  }}
                >
                  <span style={{ fontStyle: "italic", color: "hsl(0 0% 100% / 0.48)" }}>
                    {problematics[active].title.split(" ")[0]}
                  </span>{" "}
                  {problematics[active].title.split(" ").slice(1).join(" ")}
                </h3>

                {/* Separator — short, white */}
                <div
                  style={{
                    height: 1,
                    background: "hsl(0 0% 100% / 0.14)",
                    margin: "28px 0",
                    maxWidth: 260,
                  }}
                />

                {/* Description */}
                <p
                  className="font-light leading-relaxed"
                  style={{
                    fontSize: "0.9375rem",
                    color: "hsl(0 0% 100% / 0.60)",
                    maxWidth: 330,
                    lineHeight: 1.7,
                  }}
                >
                  {problematics[active].line}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right column — card stack */}
          <div className="flex-1 flex items-center justify-center relative py-8 z-10">
            <div style={{ perspective: "1400px", perspectiveOrigin: "50% 40%", flexShrink: 0 }}>
              <div
                className="relative"
                style={{ width: "min(500px, 84vw)", height: 400 }}
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

        {/* ── Progress dots ── */}
        <div className="flex items-center justify-center gap-2.5 pb-10 flex-shrink-0 z-10">
          {problematics.map((_, i) => (
            <motion.span
              key={i}
              className="rounded-full block"
              animate={{
                width: i === active ? 28 : 5,
                height: 5,
                backgroundColor:
                  i === active
                    ? "hsl(0 0% 100% / 0.65)"
                    : "hsl(0 0% 100% / 0.18)",
              }}
              transition={{ duration: 0.40, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </div>
      </div>
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
