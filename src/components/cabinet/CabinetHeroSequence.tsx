import { useRef } from "react";
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
  const activeIndex = useTransform(scrollYProgress, (v) =>
    Math.min(total - 1, Math.max(0, Math.floor(v * total)))
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Séquence cinématique bordelaise"
      className="relative bg-paper"
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

        {/* Paper overlay — subtle warm wash */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-multiply"
          style={{ background: "hsl(var(--paper) / 0.10)" }}
          aria-hidden
        />
        {/* Bottom vignette for legibility of caption */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, hsl(var(--ink) / 0.35) 0%, transparent 25%, transparent 55%, hsl(var(--ink) / 0.75) 100%)",
          }}
          aria-hidden
        />

        {/* Editorial chrome */}
        <div className="absolute inset-0 flex flex-col justify-between px-6 md:px-12 py-10 md:py-14 text-paper">
          {/* Top row — plan numeral + place */}
          <div className="flex items-start justify-between text-paper">
            <div className="flex items-baseline gap-4">
              {PLANS.map((plan, i) => {
                const active = useTransform(activeIndex, (v) => (v === i ? 1 : 0.28));
                return (
                  <motion.span
                    key={plan.num}
                    style={{ opacity: active }}
                    className="font-editorial text-[13px] tracking-[0.3em]"
                  >
                    {plan.num}
                  </motion.span>
                );
              })}
            </div>
            <p className="font-editorial italic text-[11px] tracking-[0.28em] text-paper/75 hidden md:block">
              Séquence cinématique &nbsp;·&nbsp; I — IV
            </p>
          </div>

          {/* Bottom — headline + caption */}
          <div className="max-w-4xl">
            <div className="mb-8">
              {PLANS.map((plan, i) => (
                <motion.div
                  key={plan.num}
                  style={{ opacity: opacities[i] }}
                  className="absolute max-w-3xl"
                >
                  <p className="font-editorial text-[10px] tracking-[0.32em] uppercase text-paper/70 mb-3">
                    Plan {plan.num} &nbsp;·&nbsp; {plan.place}
                  </p>
                  <p className="font-editorial italic text-2xl md:text-3xl lg:text-[34px] leading-[1.15] text-paper max-w-2xl">
                    « {plan.caption} »
                  </p>
                </motion.div>
              ))}
              {/* Reserve height so absolute captions don't collapse layout */}
              <div aria-hidden className="invisible font-editorial italic text-2xl md:text-3xl lg:text-[34px] leading-[1.15]">
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
              </div>
            </div>

            <div className="pt-6 border-t border-paper/25 flex items-end justify-between gap-6">
              <div>
                <p className="font-editorial text-[10px] tracking-[0.35em] uppercase text-paper/70 mb-2">
                  Le Cabinet
                </p>
                <h1 className="font-editorial text-3xl md:text-5xl lg:text-6xl font-normal text-paper leading-[1.02] tracking-tight">
                  Ancré à Bordeaux.
                  <br />
                  <span className="italic text-paper/85">Exigeant partout ailleurs.</span>
                </h1>
              </div>
              <p className="hidden md:block font-editorial italic text-[11px] tracking-[0.28em] text-paper/60 whitespace-nowrap">
                — défiler pour lire —
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}