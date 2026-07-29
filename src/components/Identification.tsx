import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Clock,
  Heart,
  Briefcase,
  Shield,
  ChevronLeft,
  ChevronRight,
  Compass,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const CARDS = [
  {
    n: "01",
    title: "Transmettre dans les meilleures conditions",
    subtitle: "Protéger ses proches et optimiser la fiscalité",
    icon: Heart,
    image:
      "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=1000&auto=format&fit=crop&q=80",
    link: "/transmission-patrimoine-famille",
  },
  {
    n: "02",
    title: "Préparer ma retraite sereinement",
    subtitle: "Anticiper et maintenir mon niveau de vie",
    icon: Clock,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&auto=format&fit=crop&q=80",
    link: "/gestion-patrimoniale",
  },
  {
    n: "03",
    title: "Optimiser mon patrimoine aujourd'hui",
    subtitle: "Faire travailler mon capital et réduire ma fiscalité",
    icon: TrendingUp,
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1000&auto=format&fit=crop&q=80",
    link: "/gestion-patrimoniale",
  },
  {
    n: "04",
    title: "Développer mon activité professionnelle",
    subtitle: "Financer et structurer mes projets",
    icon: Briefcase,
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1000&auto=format&fit=crop&q=80",
    link: "/patrimoine-professionnel",
  },
  {
    n: "05",
    title: "Sécuriser mon avenir et ma famille",
    subtitle: "Me protéger et protéger mes proches",
    icon: Shield,
    image:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1000&auto=format&fit=crop&q=80",
    link: "/gestion-patrimoniale",
  },
];

/* ── Desktop ───────────────────────────────────────────────────────── */
function DesktopIdentification() {
  const [active, setActive] = useState(2);

  const prev = useCallback(() => setActive((i) => Math.max(0, i - 1)), []);
  const next = useCallback(
    () => setActive((i) => Math.min(CARDS.length - 1, i + 1)),
    []
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  return (
    <section
      id="problematiques"
      aria-label="Vos enjeux patrimoniaux"
      style={{ background: "hsl(var(--navy-deep))" }}
      className="py-20 md:py-28 px-6 md:px-14"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header row */}
        <div className="grid lg:grid-cols-2 gap-10 mb-14">
          <div>
            <p
              className="text-[10px] tracking-[0.38em] uppercase font-medium mb-6"
              style={{ color: "hsl(0 0% 100% / 0.38)" }}
            >
              Vous vous reconnaissez&nbsp;?
            </p>
            <h2
              className="font-heading font-light leading-[1.08] tracking-tight"
              style={{
                fontSize: "clamp(1.85rem, 3vw, 3rem)",
                color: "hsl(0 0% 100% / 0.95)",
              }}
            >
              Chaque situation patrimoniale mérite{" "}
              <em style={{ fontStyle: "italic", color: "hsl(0 0% 100% / 0.42)" }}>
                une stratégie sur-mesure.
              </em>
            </h2>
          </div>
          <div className="flex items-end justify-end">
            <p
              className="font-light leading-relaxed max-w-sm text-right"
              style={{
                fontSize: "0.9375rem",
                color: "hsl(0 0% 100% / 0.40)",
                lineHeight: 1.78,
              }}
            >
              Découvrez ci-dessous des situations fréquentes. Identifiez la
              vôtre et explorez comment nous pouvons vous accompagner.
            </p>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="flex gap-3" style={{ height: 320 }}>
            {CARDS.map((card, i) => {
              const isActive = i === active;
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.n}
                  layout
                  onClick={() => !isActive && setActive(i)}
                  className="relative overflow-hidden flex-shrink-0"
                  style={{
                    flex: isActive ? "3 0 0" : "1 0 0",
                    borderRadius: 18,
                    cursor: isActive ? "default" : "pointer",
                    minWidth: 0,
                  }}
                  transition={{ layout: { duration: 0.52, ease: [0.22, 1, 0.36, 1] } }}
                >
                  {/* Background image */}
                  <img
                    src={card.image}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      filter: isActive
                        ? "brightness(0.72)"
                        : "brightness(0.42) saturate(0.62)",
                      transition: "filter 0.5s ease",
                    }}
                  />

                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, hsl(224 60% 5% / 0.90) 0%, hsl(224 60% 5% / 0.18) 52%, transparent 100%)",
                    }}
                  />

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    {/* Number chip */}
                    <div className="self-start">
                      <span
                        className="text-[11px] font-medium tracking-[0.18em]"
                        style={{
                          display: "inline-block",
                          background: "hsl(224 60% 7% / 0.58)",
                          border: "0.5px solid hsl(0 0% 100% / 0.18)",
                          borderRadius: 8,
                          padding: "4px 10px",
                          backdropFilter: "blur(8px)",
                          color: "hsl(0 0% 100% / 0.78)",
                        }}
                      >
                        {card.n}
                      </span>
                    </div>

                    {/* Bottom content */}
                    <div>
                      <h3
                        className="font-heading font-light text-white leading-tight mb-3"
                        style={{
                          fontSize: isActive
                            ? "clamp(1.2rem, 1.75vw, 1.7rem)"
                            : "0.875rem",
                          transition: "font-size 0.45s ease",
                        }}
                      >
                        {card.title}
                      </h3>

                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.28, delay: 0.2 }}
                            className="flex items-center gap-2.5"
                          >
                            <Icon
                              className="w-3.5 h-3.5 flex-shrink-0"
                              style={{ color: "hsl(0 0% 100% / 0.50)" }}
                            />
                            <p
                              className="text-sm font-light"
                              style={{ color: "hsl(0 0% 100% / 0.55)" }}
                            >
                              {card.subtitle}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Nav arrows */}
          <button
            aria-label="Carte précédente"
            onClick={prev}
            disabled={active === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 disabled:opacity-25 disabled:cursor-not-allowed hover:bg-white/15"
            style={{
              background: "hsl(0 0% 100% / 0.10)",
              border: "0.5px solid hsl(0 0% 100% / 0.18)",
              backdropFilter: "blur(12px)",
              color: "hsl(0 0% 100% / 0.72)",
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            aria-label="Carte suivante"
            onClick={next}
            disabled={active === CARDS.length - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 disabled:opacity-25 disabled:cursor-not-allowed hover:bg-white/15"
            style={{
              background: "hsl(0 0% 100% / 0.10)",
              border: "0.5px solid hsl(0 0% 100% / 0.18)",
              backdropFilter: "blur(12px)",
              color: "hsl(0 0% 100% / 0.72)",
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-4 mt-6">
          <span
            className="text-[11px] font-medium tracking-widest tabular-nums"
            style={{ color: "hsl(0 0% 100% / 0.32)" }}
          >
            01
          </span>
          <div
            className="flex-1 h-px relative"
            style={{ background: "hsl(0 0% 100% / 0.10)" }}
          >
            <motion.div
              className="absolute left-0 top-0 h-full"
              style={{ background: "hsl(0 0% 100% / 0.48)" }}
              animate={{ width: `${((active + 1) / CARDS.length) * 100}%` }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <span
            className="text-[11px] font-medium tracking-widest tabular-nums"
            style={{ color: "hsl(0 0% 100% / 0.32)" }}
          >
            0{CARDS.length}
          </span>
        </div>

        {/* CTA bar */}
        <div
          className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5 md:p-6"
          style={{
            background: "hsl(0 0% 100% / 0.05)",
            border: "0.5px solid hsl(0 0% 100% / 0.11)",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center"
              style={{
                background: "hsl(0 0% 100% / 0.08)",
                border: "0.5px solid hsl(0 0% 100% / 0.15)",
              }}
            >
              <Compass
                className="w-4 h-4"
                style={{ color: "hsl(0 0% 100% / 0.55)" }}
              />
            </div>
            <div>
              <p
                className="text-sm font-medium"
                style={{ color: "hsl(0 0% 100% / 0.90)" }}
              >
                Pas sûr de votre situation&nbsp;?
              </p>
              <p
                className="text-[13px] font-light"
                style={{ color: "hsl(0 0% 100% / 0.40)" }}
              >
                Répondez à quelques questions pour y voir plus clair.
              </p>
            </div>
          </div>
          <Link
            to="/bilan-patrimonial-bordeaux"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium tracking-wide transition-opacity duration-200 hover:opacity-90"
            style={{
              background: "hsl(0 0% 100%)",
              color: "hsl(224 60% 12%)",
            }}
          >
            Faire le point sur ma situation
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Mobile ────────────────────────────────────────────────────────── */
function MobileIdentification() {
  const reduce = useReducedMotion();
  return (
    <section
      id="problematiques"
      aria-label="Vos enjeux patrimoniaux"
      style={{ background: "hsl(var(--navy-deep))" }}
      className="py-16 px-6"
    >
      <div className="max-w-2xl mx-auto">
        <p
          className="text-[10px] tracking-[0.38em] uppercase font-medium mb-5"
          style={{ color: "hsl(0 0% 100% / 0.38)" }}
        >
          Vous vous reconnaissez&nbsp;?
        </p>
        <h2
          className="font-heading font-light leading-[1.1] tracking-tight mb-4"
          style={{
            fontSize: "clamp(1.75rem, 6vw, 2.4rem)",
            color: "hsl(0 0% 100% / 0.92)",
          }}
        >
          Chaque situation patrimoniale mérite{" "}
          <em style={{ fontStyle: "italic", color: "hsl(0 0% 100% / 0.42)" }}>
            une stratégie sur-mesure.
          </em>
        </h2>
        <p
          className="font-light leading-relaxed mb-10"
          style={{ fontSize: "0.9375rem", color: "hsl(0 0% 100% / 0.40)" }}
        >
          Découvrez ci-dessous des situations fréquentes. Identifiez la vôtre
          et explorez comment nous pouvons vous accompagner.
        </p>

        <ul className="flex flex-col gap-3">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.li
                key={card.n}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative overflow-hidden rounded-2xl"
                style={{ height: 140 }}
              >
                <img
                  src={card.image}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: "brightness(0.48) saturate(0.65)" }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, hsl(224 60% 5% / 0.92) 0%, hsl(224 60% 5% / 0.28) 60%, transparent 100%)",
                  }}
                />
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                  <span
                    className="self-start text-[10px] font-medium tracking-[0.18em]"
                    style={{
                      background: "hsl(224 60% 7% / 0.55)",
                      border: "0.5px solid hsl(0 0% 100% / 0.14)",
                      borderRadius: 6,
                      padding: "3px 8px",
                      color: "hsl(0 0% 100% / 0.70)",
                    }}
                  >
                    {card.n}
                  </span>
                  <div>
                    <h3 className="font-heading font-light text-white text-[0.95rem] leading-snug mb-1.5">
                      {card.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Icon
                        className="w-3 h-3 flex-shrink-0"
                        style={{ color: "hsl(0 0% 100% / 0.45)" }}
                      />
                      <p
                        className="text-[12px] font-light"
                        style={{ color: "hsl(0 0% 100% / 0.50)" }}
                      >
                        {card.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>

        <Link
          to="/bilan-patrimonial-bordeaux"
          className="mt-6 w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-full text-sm font-medium tracking-wide transition-opacity hover:opacity-90"
          style={{ background: "hsl(0 0% 100%)", color: "hsl(224 60% 12%)" }}
        >
          Faire le point sur ma situation
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}

export default function Identification() {
  const isMobile = useIsMobile();
  const reduce = useReducedMotion();
  return isMobile || reduce ? <MobileIdentification /> : <DesktopIdentification />;
}
