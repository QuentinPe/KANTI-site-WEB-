import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const fragments = [
  { t: "À taille humaine,", em: true },
  { t: " une vision globale", em: false },
  { t: " · et la conviction qu'un patrimoine", em: false },
  { t: " se construit dans la durée.", em: true },
];

export default function Promesse() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-50, 50]);

  return (
    <section
      ref={ref}
      id="promesse"
      className="relative overflow-hidden"
      style={{ background: "hsl(var(--navy-deep))" }}
    >
      {/* ── Background image ── */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          style={{
            y: imageY,
            backgroundImage: "url(/promesse-bg.png)",
            scale: 1.1,
          }}
          className="absolute inset-0 bg-cover bg-[65%_center] will-change-transform"
        />

        {/* Top blend · seamless continuation from Identification exit (navy-deep) */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, hsl(var(--navy-deep)) 0%, hsl(224 60% 7% / 0.65) 18%, transparent 40%)",
          }}
        />

        {/* Left gradient · text readability over the dark wall area */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, hsl(224 60% 7%) 0%, hsl(224 60% 7% / 0.90) 32%, hsl(224 60% 7% / 0.40) 62%, transparent 100%)",
          }}
        />

        {/* Overall atmospheric scrim */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "hsl(224 55% 5% / 0.28)" }}
        />

        {/* Bottom fade · transition out */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, hsl(var(--navy-deep)) 0%, transparent 28%)",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-36 md:py-52">
        <div className="max-w-2xl">
          <div
            className="electric-line mb-6"
            style={{ background: "hsl(var(--gold) / 0.6)" }}
          />
          <p
            className="text-[10px] tracking-[0.35em] uppercase font-medium mb-8"
            style={{ color: "hsl(0 0% 100% / 0.45)" }}
          >
            Notre promesse
          </p>

          <h2 className="font-heading text-3xl md:text-5xl lg:text-[3.2rem] font-light text-white leading-[1.18] tracking-tight">
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
                style={{
                  display: "inline-block",
                  willChange: "transform, filter, opacity",
                  whiteSpace: "pre-wrap",
                }}
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
            className="mt-10 text-base leading-relaxed font-light max-w-lg"
            style={{ color: "hsl(0 0% 100% / 0.60)" }}
          >
            Inscrits à l'ORIAS, sans lien capitalistique avec aucune banque ni
            assureur. Votre intérêt est notre seule boussole · pour dix, vingt,
            trente ans.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
