import { useRef } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePinnedSectionProgress } from "@/hooks/usePinnedSectionProgress";
import SplitText from "./motion/SplitText";
import NoiseGrain from "./motion/NoiseGrain";

const steps = [
  {
    number: "01",
    title: "Découverte",
    description:
      "Un premier rendez-vous de 30 minutes pour comprendre votre situation, vos projets et vos préoccupations. Gratuit et sans engagement.",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=2000&q=80",
  },
  {
    number: "02",
    title: "Bilan patrimonial",
    description:
      "Audit complet de votre patrimoine : actifs, passifs, fiscalité, prévoyance, régimes matrimoniaux. Nous regardons tout, sans angle mort.",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=2000&q=80",
  },
  {
    number: "03",
    title: "Objectifs",
    description:
      "Nous formalisons ensemble vos priorités : revenus, retraite, transmission, fiscalité, projets de vie. Une carte claire avant toute décision.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2000&q=80",
  },
  {
    number: "04",
    title: "Préconisations",
    description:
      "Une lettre de recommandations structurée, avec simulations chiffrées et scénarios comparés. Vous gardez la main, nous éclairons les choix.",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=2000&q=80",
  },
  {
    number: "05",
    title: "Mise en œuvre",
    description:
      "Sélection des meilleurs contrats et supports du marché, ouverture des comptes, coordination avec vos autres conseils, notaire, expert-comptable, avocat.",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80",
  },
  {
    number: "06",
    title: "Suivi annuel",
    description:
      "Un rendez-vous annuel de bilan, des alertes en cas de changement législatif, un interlocuteur disponible toute l'année. La relation s'inscrit dans la durée.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80",
  },
];

export default function MethodePinned() {
  const ref = useRef<HTMLDivElement>(null);
  const { activeIndex, progress, stepProgress } = usePinnedSectionProgress(
    ref,
    steps.length,
  );
  const activeStep = steps[activeIndex];
  const reduce = useReducedMotion();

  const scrollToStep = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const travel = el.offsetHeight - window.innerHeight;
    const target =
      el.getBoundingClientRect().top +
      window.scrollY +
      (i / steps.length) * travel +
      travel * 0.02;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <section id="methode" className="relative">
      {/* ===== MOBILE FALLBACK (unchanged simple stack) ===== */}
      <div className="md:hidden section-padding bg-[hsl(var(--navy-deep))] text-white">
        <div className="max-w-2xl mx-auto">
          <p className="text-[11px] tracking-[0.3em] uppercase text-white/50 mb-5 font-medium">
            Méthode
          </p>
          <h2 className="text-4xl font-heading font-light mb-12 tracking-tight leading-[1.1]">
            Comment nous
            <br />
            <span className="italic text-white/75">travaillons</span>
          </h2>
          <ol className="space-y-8">
            {steps.map((s) => (
              <li key={s.number} className="glass-dark rounded-2xl overflow-hidden">
                <div
                  className="aspect-[16/9] bg-cover bg-center"
                  style={{ backgroundImage: `url(${s.image})` }}
                />
                <div className="p-6">
                  <div className="flex items-baseline gap-4 mb-3">
                    <span className="text-2xl font-heading font-light text-[hsl(var(--electric-soft))]">
                      {s.number}
                    </span>
                    <h3 className="font-heading text-xl text-white">{s.title}</h3>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ===== DESKTOP : IMMERSIVE CINEMA ===== */}
      <div
        ref={ref}
        className="hidden md:block relative text-white"
        style={{
          height: `${100 + steps.length * 90}vh`,
          background: "hsl(var(--navy-deep))",
        }}
      >
        {/* Top mask reveal, black curtain that drops as we enter the section */}
        <div
          aria-hidden
          className="sticky top-0 h-0 z-30 pointer-events-none"
        />

        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* ── Background image stack with crossfade + ken-burns ── */}
          <div className="absolute inset-0">
            <AnimatePresence mode="sync">
              <motion.div
                key={`bg-${activeStep.number}`}
                aria-hidden
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.08 }}
                animate={
                  reduce
                    ? { opacity: 1 }
                    : {
                        opacity: 1,
                        scale: 1.18,
                        x: ["0%", "-2%"],
                        y: ["0%", "1.5%"],
                      }
                }
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { duration: 1.4, ease: [0.22, 1, 0.36, 1] },
                  scale: { duration: 14, ease: "linear" },
                  x: { duration: 14, ease: "linear" },
                  y: { duration: 14, ease: "linear" },
                }}
                className="absolute inset-0 will-change-transform"
                style={{
                  backgroundImage: `url(${activeStep.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </AnimatePresence>

            {/* Cinematic gradient overlays */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, hsl(var(--navy-deep) / 0.55) 0%, hsl(var(--navy-deep) / 0.78) 45%, hsl(var(--navy-deep) / 0.95) 100%)",
              }}
            />
            {/* Vignette */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 35%, hsl(var(--navy-deep) / 0.85) 100%)",
              }}
            />
          </div>

          {/* Pulsing electric halo behind the giant number */}
          <motion.div
            aria-hidden
            className="absolute left-[-8%] top-1/2 -translate-y-1/2 w-[55vw] h-[55vw] rounded-full pointer-events-none"
            animate={
              reduce
                ? {}
                : { opacity: [0.35, 0.55, 0.35], scale: [1, 1.06, 1] }
            }
            transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
            style={{
              background:
                "radial-gradient(circle, hsl(210 100% 60% / 0.22) 0%, transparent 60%)",
              filter: "blur(60px)",
            }}
          />

          {/* Film grain overlay */}
          <NoiseGrain opacity={0.07} blendMode="overlay" />

          {/* ── Top bar : cinema counter ── */}
          <div className="absolute top-8 left-0 right-0 z-20 px-12 lg:px-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="block w-1.5 h-1.5 rounded-full bg-[hsl(var(--electric-soft))] animate-pulse shadow-[0_0_10px_hsl(var(--electric))]" />
              <p className="text-[10px] tracking-[0.4em] uppercase text-white/55 font-medium">
                Méthode · Notre processus
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[11px] tracking-[0.25em] text-white/70 tabular-nums">
                {activeStep.number} / {String(steps.length).padStart(2, "0")}
              </span>
              <div className="w-24 h-px bg-white/15 overflow-hidden">
                <motion.div
                  animate={{ width: `${stepProgress * 100}%` }}
                  transition={{ duration: 0.18, ease: "linear" }}
                  className="h-full bg-[hsl(var(--electric-soft))] shadow-[0_0_8px_hsl(var(--electric))]"
                />
              </div>
            </div>
          </div>

          {/* ── Giant ghost number ── */}
          <motion.span
            key={`num-${activeStep.number}`}
            aria-hidden
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-[-2vw] top-1/2 -translate-y-1/2 font-heading font-light text-white/[0.06] select-none pointer-events-none leading-none tracking-tighter z-10"
            style={{ fontSize: "clamp(18rem, 28vw, 32rem)" }}
          >
            {activeStep.number}
          </motion.span>

          {/* ── Center editorial content ── */}
          <div className="relative z-20 h-full flex items-center justify-center px-12 lg:px-20">
            <div className="max-w-3xl text-center">
              <motion.div
                key={`tag-${activeStep.number}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md mb-8"
              >
                <span className="text-[10px] tracking-[0.35em] uppercase text-[hsl(var(--electric-soft))] font-medium">
                  Étape {activeStep.number}
                </span>
                <span className="block w-1 h-1 rounded-full bg-white/40" />
                <span className="text-[10px] tracking-[0.25em] uppercase text-white/60 font-medium">
                  {activeIndex === 0
                    ? "Premier contact"
                    : activeIndex === steps.length - 1
                      ? "Dans la durée"
                      : "Construction"}
                </span>
              </motion.div>

              <h2
                key={`title-${activeStep.number}`}
                className="font-heading font-light tracking-tight leading-[1.02] mb-8 text-white"
                style={{ fontSize: "clamp(3rem, 6vw, 5.5rem)" }}
              >
                <SplitText
                  text={activeStep.title}
                  by="word"
                  stagger={0.08}
                  duration={0.85}
                  itemClassName="italic text-white"
                />
              </h2>

              <motion.p
                key={`desc-${activeStep.number}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="text-white/75 text-lg lg:text-xl leading-relaxed font-light max-w-2xl mx-auto"
              >
                {activeStep.description}
              </motion.p>

              {activeIndex === steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="mt-12"
                >
                  <Link
                    to="/contact"
                    data-magnetic
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-[hsl(var(--navy-deep))] text-sm font-medium tracking-wide hover:bg-white/90 transition-colors shadow-[0_20px_60px_-15px_hsl(var(--electric)/0.5)]"
                  >
                    Démarrer la conversation
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.6}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </Link>
                </motion.div>
              )}
            </div>
          </div>

          {/* ── Bottom horizontal timeline ── */}
          <div className="absolute bottom-10 left-0 right-0 z-20 px-12 lg:px-20">
            <div className="max-w-5xl mx-auto">
              {/* Active step label */}
              <div className="flex items-end justify-between mb-4">
                <motion.p
                  key={`label-${activeStep.number}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-[11px] tracking-[0.3em] uppercase text-white/60 font-medium"
                >
                  En cours · <span className="text-white">{activeStep.title}</span>
                </motion.p>
                <Link
                  to="/notre-methode"
                  className="text-[11px] tracking-[0.25em] uppercase text-white/55 hover:text-white transition-colors font-medium inline-flex items-center gap-2"
                >
                  Voir la méthode complète
                  <svg
                    className="w-3 h-3"
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

              {/* Timeline rail */}
              <div className="relative h-px bg-white/10">
                <motion.div
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.18, ease: "linear" }}
                  className="absolute top-0 left-0 h-px bg-gradient-to-r from-[hsl(var(--electric-soft))] to-[hsl(var(--electric))] shadow-[0_0_12px_hsl(var(--electric)/0.7)]"
                />
                <div className="absolute inset-0 flex justify-between items-center -translate-y-1/2">
                  {steps.map((s, i) => {
                    const isActive = i === activeIndex;
                    const isPassed = i < activeIndex;
                    return (
                      <button
                        key={s.number}
                        type="button"
                        onClick={() => scrollToStep(i)}
                        aria-label={`Aller à l'étape ${s.number}, ${s.title}`}
                        aria-current={isActive ? "step" : undefined}
                        className="group relative flex flex-col items-center cursor-pointer focus:outline-none"
                      >
                        <motion.span
                          animate={{
                            scale: isActive ? 1.6 : 1,
                            backgroundColor: isActive || isPassed
                              ? "hsl(var(--electric-soft))"
                              : "hsl(0 0% 100% / 0.3)",
                          }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="block w-2 h-2 rounded-full"
                          style={{
                            boxShadow: isActive
                              ? "0 0 16px hsl(var(--electric) / 0.9)"
                              : undefined,
                          }}
                        />
                        <span
                          className={`absolute top-5 font-mono text-[10px] tabular-nums tracking-[0.2em] transition-colors ${
                            isActive ? "text-white" : "text-white/35 group-hover:text-white/70"
                          }`}
                        >
                          {s.number}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
