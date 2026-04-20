import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion, MotionValue } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Découverte",
    description:
      "Un premier rendez-vous de 30 minutes pour comprendre votre situation, vos projets et vos préoccupations. Gratuit et sans engagement.",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80",
  },
  {
    number: "02",
    title: "Bilan patrimonial",
    description:
      "Audit complet de votre patrimoine : actifs, passifs, fiscalité, prévoyance, régimes matrimoniaux. Nous regardons tout, sans angle mort.",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1600&q=80",
  },
  {
    number: "03",
    title: "Objectifs",
    description:
      "Nous formalisons ensemble vos priorités : revenus, retraite, transmission, fiscalité, projets de vie. Une carte claire avant toute décision.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80",
  },
  {
    number: "04",
    title: "Préconisations",
    description:
      "Une lettre de recommandations structurée, avec simulations chiffrées et scénarios comparés. Vous gardez la main, nous éclairons les choix.",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80",
  },
  {
    number: "05",
    title: "Mise en œuvre",
    description:
      "Sélection des meilleurs contrats et supports du marché, ouverture des comptes, coordination avec vos autres conseils (notaire, expert-comptable, avocat).",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80",
  },
  {
    number: "06",
    title: "Suivi annuel",
    description:
      "Un rendez-vous annuel de bilan, des alertes en cas de changement législatif, un interlocuteur disponible toute l'année. La relation s'inscrit dans la durée.",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
  },
];

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}
/**
 * Crossfade keyframes for the [start, end] slot. Short fade tails meet at
 * the boundary — one card dominant at a time, no opacity gap.
 */
function buildKeyframes(start: number, end: number, fade = 0.04) {
  const a = clamp01(start - fade);
  const b = clamp01(Math.max(a + 0.0001, start));
  const c = clamp01(Math.max(b + 0.0001, end));
  const d = clamp01(Math.max(c + 0.0001, end + fade));
  return [a, b, c, d] as const;
}

export default function MethodePinned() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Vertical progress bar fill on the left
  const railFill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="methode" className="section-dark relative">
      {/* Mobile fallback : simple stack */}
      <div className="md:hidden section-padding">
        <div className="max-w-2xl mx-auto">
          <p className="text-[11px] tracking-[0.3em] uppercase text-white/50 mb-5 font-medium">Méthode</p>
          <h2 className="text-4xl font-heading font-light mb-12 tracking-tight leading-[1.1]">
            Comment nous<br />
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
                    <span className="text-2xl font-heading font-light text-[hsl(var(--electric-soft))]">{s.number}</span>
                    <h3 className="font-heading text-xl text-white">{s.title}</h3>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">{s.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Desktop : pinned storytelling */}
      <div ref={ref} className="hidden md:block relative" style={{ height: `${steps.length * 90}vh` }}>
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          {/* Ambient orbs */}
          <div
            className="absolute top-[10%] right-[10%] w-[480px] h-[480px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, hsl(210 100% 60% / 0.18) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            className="absolute bottom-[10%] left-[5%] w-[380px] h-[380px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, hsl(38 35% 60% / 0.10) 0%, transparent 70%)",
              filter: "blur(70px)",
            }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-12 gap-8 items-center">
            {/* Left : intro + active step text */}
            <div className="col-span-5">
              <div className="electric-line mb-5" style={{ background: "linear-gradient(90deg, hsl(210 100% 70%), hsl(210 100% 70% / 0.2))" }} />
              <p className="text-[11px] tracking-[0.3em] uppercase text-white/50 mb-5 font-medium">Méthode</p>
              <h2 className="text-5xl lg:text-6xl font-heading font-light mb-8 tracking-tight leading-[1.05]">
                Comment nous<br />
                <span className="italic text-white/75">travaillons</span>
              </h2>
              <p className="text-white/60 text-base lg:text-lg font-light max-w-md leading-relaxed mb-10">
                Pas de formule standard, mais un processus clair, reproductible, qui respecte votre temps et vos priorités.
              </p>

              {/* Vertical timeline with progressive fill */}
              <div className="relative pl-8">
                <div className="absolute left-1.5 top-2 bottom-2 w-px bg-white/10 overflow-hidden">
                  <motion.div
                    style={{ height: railFill }}
                    className="w-full bg-gradient-to-b from-[hsl(var(--electric-soft))] via-[hsl(var(--electric))] to-[hsl(var(--electric))/0.4]"
                  />
                </div>
                <ol className="space-y-3.5">
                  {steps.map((s, i) => {
                    const start = i / steps.length;
                    const end = (i + 1) / steps.length;
                    return (
                      <StepRow
                        key={s.number}
                        number={s.number}
                        title={s.title}
                        progress={scrollYProgress}
                        start={start}
                        end={end}
                      />
                    );
                  })}
                </ol>
              </div>

              <Link
                to="/notre-methode"
                data-magnetic
                className="mt-10 inline-flex items-center gap-2 px-6 py-3 btn-glass text-white text-sm tracking-wide"
              >
                Découvrir notre méthode en détail
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            {/* Right : active step card with editorial image + text */}
            <div className="col-span-7 relative h-[540px]">
              {steps.map((s, i) => {
                const start = i / steps.length;
                const end = (i + 1) / steps.length;
                return (
                  <StepCard
                    key={s.number}
                    step={s}
                    index={i}
                    progress={scrollYProgress}
                    start={start}
                    end={end}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepRow({
  number,
  title,
  progress,
  start,
  end,
}: {
  number: string;
  title: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const kf = buildKeyframes(start, end, 0.03);
  const opacity = useTransform(progress, [...kf], [0.35, 1, 1, 0.45]);
  const x = useTransform(progress, [...kf], [-6, 0, 0, -6]);
  const dotScale = useTransform(progress, [...kf], [0.7, 1.4, 1.4, 0.9]);
  const dotOpacity = useTransform(progress, [...kf], [0.4, 1, 1, 0.6]);

  return (
    <motion.li style={{ opacity, x }} className="relative flex items-baseline gap-4 text-white">
      <motion.span
        style={{ scale: dotScale, opacity: dotOpacity }}
        className="absolute -left-[30px] top-[10px] w-2.5 h-2.5 rounded-full bg-[hsl(var(--electric-soft))] origin-center shadow-[0_0_12px_hsl(var(--electric)/0.6)]"
      />
      <span className="text-sm font-heading font-light text-[hsl(var(--electric-soft))] w-8">{number}</span>
      <span className="text-base lg:text-lg font-light tracking-wide">{title}</span>
    </motion.li>
  );
}

function StepCard({
  step,
  index,
  progress,
  start,
  end,
}: {
  step: (typeof steps)[number];
  index: number;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const reduce = useReducedMotion();
  const kf = buildKeyframes(start, end, 0.04);
  const opacity = useTransform(progress, [...kf], [0, 1, 1, 0]);
  const y = useTransform(progress, [...kf], reduce ? [0, 0, 0, 0] : [50, 0, 0, -50]);
  const scale = useTransform(progress, [...kf], reduce ? [1, 1, 1, 1] : [0.96, 1, 1, 0.97]);
  const imgScale = useTransform(progress, [...kf], reduce ? [1, 1, 1, 1] : [1.1, 1, 1, 1.1]);

  return (
    <motion.article
      style={{ opacity, y, scale, zIndex: index }}
      className="absolute inset-0 glass-dark rounded-[2rem] overflow-hidden flex flex-col"
    >
      {/* Editorial image */}
      <div className="relative h-[55%] overflow-hidden">
        <motion.div
          style={{ backgroundImage: `url(${step.image})`, scale: imgScale }}
          className="absolute inset-0 bg-cover bg-center will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--navy-deep))/0.85] via-[hsl(var(--navy-deep))/0.2] to-transparent" />
        <span
          aria-hidden
          className="absolute top-5 left-6 text-[10px] font-medium tracking-[0.3em] uppercase text-white/85 px-3 py-1 rounded-full bg-black/30 backdrop-blur-md"
        >
          Étape {step.number}
        </span>
      </div>

      {/* Text */}
      <div className="relative z-10 p-8 lg:p-10 flex-1 flex flex-col justify-center">
        {/* Giant ghost number */}
        <span
          aria-hidden
          className="absolute -top-10 -right-2 font-heading font-light text-white/[0.04] select-none pointer-events-none leading-none"
          style={{ fontSize: "clamp(8rem, 16vw, 16rem)" }}
        >
          {step.number}
        </span>
        <h3 className="font-heading text-3xl lg:text-[2.4rem] font-light text-white tracking-tight leading-[1.1] mb-4 max-w-lg">
          {step.title}
        </h3>
        <p className="text-white/70 text-[15px] lg:text-base leading-relaxed font-light max-w-lg">
          {step.description}
        </p>
      </div>
    </motion.article>
  );
}
