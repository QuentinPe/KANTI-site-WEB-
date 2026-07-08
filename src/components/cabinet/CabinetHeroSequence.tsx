import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, MotionValue } from "framer-motion";
import seq1 from "@/assets/cabinet-seq-01-bordeaux.jpg";
import seq2 from "@/assets/cabinet-seq-02-triangle.jpg";
import seq3 from "@/assets/cabinet-seq-03-facade.jpg";
import seq4 from "@/assets/cabinet-seq-04-detail.jpg";

const PLANS = [
  {
    num: "I",
    src: seq1,
    alt: "Place de la Bourse à Bordeaux au crépuscule, reflets sur le Miroir d'eau",
    caption: "Une ville qui a inventé le négoce moderne.",
    place: "Place de la Bourse — Bordeaux",
  },
  {
    num: "II",
    src: seq2,
    alt: "Rue haussmannienne du Triangle d'Or à Bordeaux, façades en pierre blonde",
    caption: "Un quartier où l'on parle patrimoine depuis trois siècles.",
    place: "Triangle d'Or",
  },
  {
    num: "III",
    src: seq3,
    alt: "Porte cochère du cabinet, bois patiné et plaque de laiton",
    caption: "Une adresse. Pas une vitrine.",
    place: "Le seuil du cabinet",
  },
  {
    num: "IV",
    src: seq4,
    alt: "Main écrivant à la plume sur un dossier patrimonial",
    caption: "Ici, on écrit les décisions à la main d'abord.",
    place: "Salle de travail",
  },
];

function usePlanOpacity(progress: MotionValue<number>, index: number, total: number) {
  // Each plan owns a slot [i/total, (i+1)/total]. Crossfade over 20% of a slot.
  const slot = 1 / total;
  const start = index * slot;
  const end = (index + 1) * slot;
  const inRamp = Math.max(0, start - slot * 0.2);
  const outRamp = Math.min(1, end + slot * 0.2);
  if (index === 0) {
    return useTransform(progress, [start, end, outRamp], [1, 1, 0]);
  }
  if (index === total - 1) {
    return useTransform(progress, [inRamp, start, end], [0, 1, 1]);
  }
  return useTransform(progress, [inRamp, start, end, outRamp], [0, 1, 1, 0]);
}

export default function CabinetHeroSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const total = PLANS.length;
  const op0 = usePlanOpacity(scrollYProgress, 0, total);
  const op1 = usePlanOpacity(scrollYProgress, 1, total);
  const op2 = usePlanOpacity(scrollYProgress, 2, total);
  const op3 = usePlanOpacity(scrollYProgress, 3, total);
  const opacities = [op0, op1, op2, op3];

  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.02, 1.08]);
  const numeralOp0 = useTransform(scrollYProgress, (v) => (Math.floor(v * total) === 0 ? 1 : 0.28));
  const numeralOp1 = useTransform(scrollYProgress, (v) => (Math.floor(v * total) === 1 ? 1 : 0.28));
  const numeralOp2 = useTransform(scrollYProgress, (v) => (Math.floor(v * total) === 2 ? 1 : 0.28));
  const numeralOp3 = useTransform(scrollYProgress, (v) => (Math.min(total - 1, Math.floor(v * total)) === 3 ? 1 : 0.28));
  const numeralOps = [numeralOp0, numeralOp1, numeralOp2, numeralOp3];

  useEffect(() => {
    if (reduce) return;
    const handler = (e: MouseEvent) => {
      if (!orbRef.current) return;
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      orbRef.current.style.background = `radial-gradient(circle at ${x}% ${y}%, hsl(0 0% 100% / 0.10) 0%, transparent 50%)`;
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [reduce]);

  return (
    <section
      ref={sectionRef}
      aria-label="Séquence cinématique bordelaise"
      className="relative bg-navy-deep"
      style={{ height: `${total * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Stacked images, crossfaded */}
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.num}
            className="absolute inset-0 will-change-[opacity,transform]"
            style={{ opacity: opacities[i], scale }}
            aria-hidden={i > 0}
          >
            <img
              src={plan.src}
              alt={plan.alt}
              loading={i === 0 ? "eager" : "lazy"}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}

        {/* Navy overlay — DA liquid glass */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, hsl(224 60% 7% / 0.80) 0%, hsl(222 50% 11% / 0.55) 40%, hsl(222 50% 11% / 0.70) 70%, hsl(224 60% 7% / 0.92) 100%)",
          }}
          aria-hidden
        />
        {/* Cursor-tracked orb */}
        <div
          ref={orbRef}
          className="absolute inset-0 pointer-events-none transition-all duration-700"
          aria-hidden
        />
        {/* Ambient gold halos */}
        <div
          aria-hidden
          className="absolute top-[16%] right-[8%] w-[440px] h-[440px] rounded-full pointer-events-none float-soft"
          style={{
            background: "radial-gradient(circle, hsl(var(--gold) / 0.14) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          aria-hidden
          className="absolute bottom-[12%] left-[6%] w-[340px] h-[340px] rounded-full pointer-events-none float-slow"
          style={{
            background: "radial-gradient(circle, hsl(0 0% 100% / 0.06) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />

        {/* Editorial chrome */}
        <div className="absolute inset-0 flex flex-col justify-between px-6 md:px-12 py-10 md:py-14 text-ivory">
          {/* Top row — plan numerals as glass pills */}
          <div className="flex items-start justify-between gap-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark">
              {PLANS.map((plan, i) => (
                <motion.span
                  key={plan.num}
                  style={{ opacity: numeralOps[i] }}
                  className="font-heading italic text-gold text-[13px] tracking-[0.3em] px-1"
                >
                  {plan.num}
                </motion.span>
              ))}
            </div>
            <div className="hidden md:inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" aria-hidden />
              <p className="text-[10px] tracking-[0.28em] uppercase text-ivory/75 font-medium">
                Séquence cinématique &nbsp;·&nbsp; I — IV
              </p>
            </div>
          </div>

          {/* Bottom — caption card + headline */}
          <div className="max-w-5xl">
            {/* Caption glass card, crossfaded */}
            <div className="relative mb-10 min-h-[128px] md:min-h-[112px]">
              {PLANS.map((plan, i) => (
                <motion.div
                  key={plan.num}
                  style={{ opacity: opacities[i] }}
                  className="absolute inset-x-0 top-0 max-w-2xl rounded-2xl glass-dark px-6 py-5 md:px-7 md:py-6"
                >
                  <p className="text-[10px] tracking-[0.32em] uppercase text-gold/80 mb-2 font-medium">
                    Plan {plan.num} &nbsp;·&nbsp; {plan.place}
                  </p>
                  <p className="font-heading italic text-xl md:text-2xl lg:text-[26px] leading-[1.25] text-ivory">
                    « {plan.caption} »
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="pt-8 border-t border-ivory/15 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="flex gap-6 items-stretch">
                <div className="hairline-gold-v w-px self-stretch" aria-hidden />
                <div>
                  <p className="text-[10px] tracking-[0.35em] uppercase text-gold mb-3 font-medium">
                    Le Cabinet
                  </p>
                  <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-light text-white leading-[1.02] tracking-tight">
                    Ancré à Bordeaux.
                    <br />
                    <span className="italic text-white/85">Exigeant partout ailleurs.</span>
                  </h1>
                </div>
              </div>
              <p className="hidden md:block font-heading italic text-[11px] tracking-[0.28em] text-ivory/55 whitespace-nowrap">
                — défiler pour lire —
              </p>
            </div>
          </div>
        </div>

        {/* Scroll indicator — bottom */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0"
          style={{ animation: "fade-in 1s ease-out 1.4s forwards" }}
          aria-hidden
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-[0.3em] uppercase text-ivory/40">Découvrir</span>
            <div className="w-[1px] h-10 bg-gradient-to-b from-ivory/40 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}