import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Écoute",
    description:
      "Un premier rendez-vous de 30 minutes pour comprendre votre situation, vos projets et vos préoccupations. Gratuit et sans engagement.",
  },
  {
    number: "02",
    title: "Audit",
    description:
      "Analyse complète de votre patrimoine : actifs, passifs, fiscalité, prévoyance, régimes matrimoniaux. Nous regardons tout.",
  },
  {
    number: "03",
    title: "Stratégie",
    description:
      "Rédaction d'une lettre de recommandations structurée, avec simulations chiffrées et scénarios comparés.",
  },
  {
    number: "04",
    title: "Mise en œuvre",
    description:
      "Sélection des meilleurs contrats et supports du marché, ouverture des comptes, coordination avec vos autres conseils.",
  },
  {
    number: "05",
    title: "Suivi",
    description:
      "Un rendez-vous annuel de bilan, des alertes en cas de changement législatif, un interlocuteur disponible toute l'année.",
  },
];

export default function MethodePinned() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

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
              <li key={s.number} className="glass-dark rounded-2xl p-6">
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="text-2xl font-heading font-light text-[hsl(var(--electric-soft))]">{s.number}</span>
                  <h3 className="font-heading text-xl text-white">{s.title}</h3>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{s.description}</p>
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

              {/* Vertical stepper */}
              <ol className="space-y-3">
                {steps.map((s, i) => {
                  const start = i / steps.length;
                  const end = (i + 1) / steps.length;
                  const isActive = useTransform(scrollYProgress, (v) => v >= start - 0.05 && v < end + 0.05);
                  return (
                    <StepRow key={s.number} number={s.number} title={s.title} progress={scrollYProgress} start={start} end={end} />
                  );
                })}
              </ol>

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

            {/* Right : active step card */}
            <div className="col-span-7 relative h-[460px]">
              {steps.map((s, i) => {
                const start = i / steps.length;
                const end = (i + 1) / steps.length;
                const opacity = useTransform(
                  scrollYProgress,
                  [start - 0.06, start, end, end + 0.06],
                  [0, 1, 1, 0]
                );
                const yMv = reduce
                  ? useTransform(scrollYProgress, () => 0)
                  : useTransform(scrollYProgress, [start - 0.06, start, end, end + 0.06], [40, 0, 0, -40]);
                const scale = reduce
                  ? useTransform(scrollYProgress, () => 1)
                  : useTransform(scrollYProgress, [start - 0.06, start, end, end + 0.06], [0.96, 1, 1, 0.97]);

                return (
                  <motion.article
                    key={s.number}
                    style={{ opacity, y: yMv, scale }}
                    className="absolute inset-0 glass-dark rounded-[2rem] p-12 lg:p-16 flex flex-col justify-center"
                  >
                    {/* Giant ghost number */}
                    <span
                      aria-hidden
                      className="absolute -top-6 -right-2 font-heading font-light text-white/[0.04] select-none pointer-events-none leading-none"
                      style={{ fontSize: "clamp(10rem, 22vw, 22rem)" }}
                    >
                      {s.number}
                    </span>

                    <div className="relative z-10 max-w-xl">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-xs tracking-[0.3em] uppercase text-[hsl(var(--electric-soft))] font-medium">
                          Étape {s.number}
                        </span>
                        <span className="h-px flex-1 bg-white/10" />
                      </div>
                      <h3 className="font-heading text-4xl lg:text-5xl font-light text-white tracking-tight mb-6">
                        {s.title}
                      </h3>
                      <p className="text-white/70 text-base lg:text-lg leading-relaxed font-light">
                        {s.description}
                      </p>
                    </div>
                  </motion.article>
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
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  start: number;
  end: number;
}) {
  const opacity = useTransform(progress, [start - 0.05, start, end, end + 0.05], [0.35, 1, 1, 0.35]);
  const x = useTransform(progress, [start - 0.05, start, end, end + 0.05], [-6, 0, 0, -6]);
  return (
    <motion.li style={{ opacity, x }} className="flex items-baseline gap-4 text-white">
      <span className="text-sm font-heading font-light text-[hsl(var(--electric-soft))] w-8">{number}</span>
      <span className="text-base lg:text-lg font-light tracking-wide">{title}</span>
    </motion.li>
  );
}
