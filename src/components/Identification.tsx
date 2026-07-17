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
  // Smooth fade-in at section entry, fade-out to dark at section exit
  const contentOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  const exitOverlay = useTransform(scrollYProgress, [0.87, 1], [0, 0.88]);

  const item = problematics[active];

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
        {/* Dark exit overlay — fades section to navy before MarqueeStrip */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none z-40"
          style={{
            opacity: exitOverlay,
            background: "hsl(var(--navy-deep))",
          }}
        />

        {/* Scroll progress bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] z-20"
          style={{ background: "hsl(var(--foreground) / 0.07)" }}
        >
          <motion.div
            className="h-full origin-left"
            style={{
              width: progressWidth,
              background: "hsl(var(--foreground) / 0.3)",
            }}
          />
        </div>

        {/* Header row */}
        <div className="flex items-end justify-between px-10 lg:px-20 pt-14 pb-0 flex-shrink-0">
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

        {/* Main content area */}
        <div className="flex-1 flex items-center w-full max-w-[1440px] mx-auto px-10 lg:px-20 gap-10 lg:gap-16">
          {/* Ghost number — left, large */}
          <div
            className="hidden lg:flex w-[36%] flex-shrink-0 items-center"
            aria-hidden
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={`num-${active}`}
                initial={{ opacity: 0, scale: 0.88, filter: "blur(32px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.12, filter: "blur(32px)" }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="block font-heading font-light leading-none tracking-tighter select-none pointer-events-none"
                style={{
                  fontSize: "clamp(9rem, 22vw, 21rem)",
                  color: "hsl(var(--foreground) / 0.052)",
                  lineHeight: 0.88,
                }}
              >
                {item.n}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Content — right */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={`slide-${active}`}
                initial={{ opacity: 0, y: 44, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -44, filter: "blur(10px)" }}
                transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2
                  className="font-heading font-light tracking-tight leading-[1.1] mb-9"
                  style={{
                    fontSize: "clamp(2.5rem, 4.5vw, 4.25rem)",
                    color: "hsl(var(--foreground))",
                  }}
                >
                  <span
                    style={{
                      fontStyle: "italic",
                      color: "hsl(var(--foreground) / 0.55)",
                    }}
                  >
                    {item.title.split(" ")[0]}
                  </span>{" "}
                  {item.title.split(" ").slice(1).join(" ")}
                </h2>

                <div
                  className="separator-fine mb-9"
                  style={{ opacity: 0.18 }}
                />

                <p
                  className="font-light leading-relaxed max-w-[480px]"
                  style={{
                    fontSize: "clamp(1.05rem, 1.4vw, 1.25rem)",
                    color: "hsl(var(--foreground) / 0.58)",
                  }}
                >
                  {item.line}
                </p>

                <div className="mt-9">
                  <span
                    className="text-[9px] tracking-[0.35em] uppercase font-medium px-3 py-1.5 rounded-full"
                    style={{
                      color: "hsl(var(--foreground) / 0.42)",
                      border: "1px solid hsl(var(--foreground) / 0.12)",
                    }}
                  >
                    {item.tag}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress dots — bottom */}
        <div className="flex items-center justify-center gap-2.5 pb-10 flex-shrink-0">
          {problematics.map((_, i) => (
            <motion.span
              key={i}
              className="rounded-full block"
              animate={{
                width: i === active ? 32 : 6,
                height: 6,
                backgroundColor:
                  i === active
                    ? "hsl(var(--foreground) / 0.6)"
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
