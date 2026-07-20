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

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-7%"]);
  const entryOverlay = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const exitOverlay = useTransform(scrollYProgress, [0.97, 1], [0, 1]);

  const item = problematics[active];

  return (
    <section
      ref={ref}
      id="problematiques"
      aria-label="Vos enjeux patrimoniaux"
      style={{ height: `${N * 100}vh`, background: "hsl(var(--navy-deep))" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ── Background image with parallax ── */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.img
            src="/identification-bg.png"
            alt=""
            aria-hidden
            fetchPriority="low"
            className="w-full h-full object-cover object-center"
            style={{ y: bgY, scale: 1.08 }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "hsl(224 55% 5% / 0.22)" }}
          />
        </div>

        {/* ── Entry overlay ── */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none z-30"
          style={{ opacity: entryOverlay, background: "hsl(var(--navy-deep))" }}
        />
        {/* ── Exit overlay ── */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none z-30"
          style={{ opacity: exitOverlay, background: "hsl(var(--navy-deep))" }}
        />

        {/* ── Content layout ── */}
        <div
          className="relative z-10 h-full flex flex-col"
          style={{ padding: "clamp(2rem, 4vh, 3.5rem) clamp(2rem, 6vw, 6rem)" }}
        >

          {/* Top row: eyebrow */}
          <div className="flex-shrink-0">
            <div
              className="electric-line mb-3"
              style={{ background: "hsl(0 0% 100% / 0.28)" }}
            />
            <p
              className="text-[10px] tracking-[0.35em] uppercase font-medium"
              style={{ color: "hsl(0 0% 100% / 0.42)" }}
            >
              Vos enjeux
            </p>
          </div>

          {/* Middle: section title (left) + card (right) */}
          <div className="flex-1 flex items-center gap-16 xl:gap-24 min-h-0 mt-8">

            {/* Left column — visible on XL+ */}
            <div className="hidden xl:flex flex-col justify-center flex-shrink-0" style={{ width: "36%" }}>
              <h2
                className="font-heading font-light tracking-tight"
                style={{
                  fontSize: "clamp(2.4rem, 3vw, 3.6rem)",
                  lineHeight: 1.08,
                  color: "hsl(0 0% 100% / 0.92)",
                }}
              >
                Vous vous<br />
                <span style={{ fontStyle: "italic", color: "hsl(0 0% 100% / 0.40)" }}>
                  reconnaissez&nbsp;?
                </span>
              </h2>

              <div
                style={{
                  width: 40,
                  height: 1,
                  background: "hsl(0 0% 100% / 0.16)",
                  margin: "2rem 0 1.75rem",
                }}
              />

              <p
                className="font-light leading-relaxed"
                style={{
                  fontSize: "0.9375rem",
                  color: "hsl(0 0% 100% / 0.48)",
                  maxWidth: 300,
                  lineHeight: 1.72,
                }}
              >
                Chacun de ces enjeux mérite une réponse structurée,
                pas un produit standard.
              </p>
            </div>

            {/* Card area */}
            <div className="flex-1 flex items-center justify-center">
              <div style={{ width: "min(580px, 90vw)" }}>
                <AnimatePresence mode="wait">
                  <motion.article
                    key={active}
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -22 }}
                    transition={{ duration: 0.50, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      borderRadius: 22,
                      background: "hsl(0 0% 100% / 0.07)",
                      backdropFilter: "blur(32px) saturate(200%)",
                      WebkitBackdropFilter: "blur(32px) saturate(200%)",
                      border: "0.5px solid hsl(0 0% 100% / 0.16)",
                      overflow: "hidden",
                      position: "relative",
                      boxShadow: [
                        "0 32px 80px -20px hsl(224 60% 4% / 0.65)",
                        "0 8px 24px -6px hsl(224 60% 4% / 0.28)",
                        "inset 0 1.5px 0 hsl(0 0% 100% / 0.28)",
                        "inset 0 -0.5px 0 hsl(0 0% 100% / 0.04)",
                        "0 0 0 0.5px hsl(0 0% 100% / 0.08)",
                      ].join(", "),
                    }}
                  >
                    {/* Glass sheen */}
                    <div
                      aria-hidden
                      style={{
                        position: "absolute",
                        top: 0, left: 0, right: 0,
                        height: "45%",
                        background:
                          "linear-gradient(180deg, hsl(0 0% 100% / 0.085) 0%, transparent 100%)",
                        borderRadius: "22px 22px 0 0",
                        pointerEvents: "none",
                      }}
                    />
                    {/* Specular top edge */}
                    <div
                      aria-hidden
                      style={{
                        position: "absolute",
                        top: "0.5px",
                        left: "6%", right: "6%",
                        height: "1px",
                        background:
                          "linear-gradient(to right, transparent, hsl(0 0% 100% / 0.60) 30%, hsl(0 0% 100% / 0.80) 50%, hsl(0 0% 100% / 0.60) 70%, transparent)",
                        pointerEvents: "none",
                      }}
                    />

                    <div
                      style={{
                        padding: "clamp(36px, 5vw, 64px)",
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      {/* Tag */}
                      <p
                        style={{
                          fontSize: "9px",
                          letterSpacing: "0.48em",
                          textTransform: "uppercase",
                          fontWeight: 500,
                          color: "hsl(0 0% 100% / 0.50)",
                          marginBottom: "2rem",
                          lineHeight: 1,
                        }}
                      >
                        {item.tag}
                      </p>

                      {/* Title */}
                      <h3
                        className="font-heading font-light tracking-tight"
                        style={{
                          fontSize: "clamp(1.9rem, 2.8vw, 2.8rem)",
                          lineHeight: 1.07,
                          color: "hsl(0 0% 100% / 0.94)",
                          marginBottom: "clamp(20px, 2.8vw, 34px)",
                        }}
                      >
                        <span style={{ fontStyle: "italic", color: "hsl(0 0% 100% / 0.40)" }}>
                          {item.title.split(" ")[0]}
                        </span>{" "}
                        {item.title.split(" ").slice(1).join(" ")}
                      </h3>

                      {/* Separator */}
                      <div
                        style={{
                          width: 32,
                          height: 1,
                          background: "hsl(0 0% 100% / 0.20)",
                          marginBottom: "clamp(14px, 2vw, 24px)",
                        }}
                      />

                      {/* Description */}
                      <p
                        className="font-light leading-relaxed"
                        style={{
                          fontSize: "clamp(0.875rem, 1.05vw, 0.9625rem)",
                          color: "hsl(0 0% 100% / 0.58)",
                          maxWidth: 460,
                          lineHeight: 1.75,
                        }}
                      >
                        {item.line}
                      </p>
                    </div>
                  </motion.article>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Bottom: progress dots */}
          <div className="flex items-center justify-center gap-2.5 flex-shrink-0 mt-8">
            {problematics.map((_, i) => (
              <motion.span
                key={i}
                className="rounded-full block"
                animate={{
                  width: i === active ? 28 : 5,
                  height: 5,
                  backgroundColor:
                    i === active
                      ? "hsl(0 0% 100% / 0.60)"
                      : "hsl(0 0% 100% / 0.16)",
                }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── MobileIdentification ────────────────────────────────────────── */
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
