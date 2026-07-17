import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import NoiseGrain from "./motion/NoiseGrain";

const PROMESSE_IMAGE =
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1800&q=80";

const fragments = [
  { t: "Un cabinet ", em: false },
  { t: "à taille humaine", em: true },
  { t: ", une vision ", em: false },
  { t: "globale,", em: true },
  { t: " et la conviction qu'un patrimoine se construit ", em: false },
  { t: "dans la durée.", em: true },
];

export default function Promesse() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-60, 60]);
  const imageScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.1, 1.2]);

  return (
    <section
      ref={ref}
      id="promesse"
      className="relative overflow-hidden"
      style={{ background: "hsl(var(--navy-deep))" }}
    >
      {/* Editorial image, right side, parallax */}
      <div className="absolute inset-y-0 right-0 w-full md:w-[45%] overflow-hidden pointer-events-none">
        <motion.div
          style={{ y: imageY, scale: imageScale, backgroundImage: `url(${PROMESSE_IMAGE})` }}
          className="absolute inset-0 bg-cover bg-center will-change-transform"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, hsl(224 60% 7%) 0%, hsl(224 60% 7% / 0.6) 35%, hsl(224 60% 7% / 0.2) 100%)",
          }}
        />
        {/* Subtle living-window noise */}
        <NoiseGrain opacity={0.08} blendMode="overlay" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 md:py-44">
        <div className="max-w-3xl">
          <div
            className="electric-line mb-6"
            style={{ background: "hsl(var(--gold) / 0.6)" }}
          />
          <p className="text-[11px] tracking-[0.3em] uppercase text-white/55 mb-8 font-medium">
            Notre promesse
          </p>

          <h2 className="font-heading text-3xl md:text-5xl lg:text-[3.4rem] font-light text-white leading-[1.18] tracking-tight">
            {fragments.map((f, i) => (
              <motion.span
                key={i}
                initial={{
                  opacity: 0,
                  y: reduce ? 0 : 24,
                  filter: reduce ? "blur(0px)" : "blur(10px)",
                }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{
                  duration: 1.1,
                  delay: i * 0.09,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={
                  f.em
                    ? "italic font-normal bg-[linear-gradient(110deg,hsl(0_0%_100%/0.7)_0%,hsl(0_0%_100%)_45%,hsl(0_0%_100%/0.7)_100%)] bg-[length:200%_100%] bg-clip-text text-transparent animate-[shimmer_3.2s_ease-in-out_1.2s_1]"
                    : "text-white/85"
                }
                style={{ display: "inline-block", willChange: "transform, filter, opacity", whiteSpace: "pre-wrap" }}
              >
                {f.t}
              </motion.span>
            ))}
          </h2>

          <motion.p
            initial={{
              opacity: 0,
              clipPath: reduce ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
            }}
            whileInView={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.4, delay: 0.9, ease: [0.77, 0, 0.18, 1] }}
            className="mt-12 text-white/65 text-lg leading-relaxed font-light max-w-xl"
          >
            Inscrits à l'ORIAS et adhérents de la CNCEF, nous travaillons sans lien
            capitalistique avec aucune banque ni assureur. Votre intérêt est notre
            seule boussole, et nous nous tenons à vos côtés sur dix, vingt, trente ans.
          </motion.p>
        </div>
      </div>
    </section>
  );
}