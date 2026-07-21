import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import SplitText from "./motion/SplitText";
import derAsset from "@/assets/der-kanti-2026.pdf.asset.json";

function useCountUp(target: number, suffix = "", duration = 2000, delay = 0) {
  const [value, setValue] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startAt = performance.now() + delay;
          const animate = (now: number) => {
            if (now < startAt) {
              requestAnimationFrame(animate);
              return;
            }
            const progress = Math.min((now - startAt) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            setValue(current + suffix);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, suffix, duration, delay]);

  return { ref, value };
}

export default function About() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const years = "Depuis 2020";
  const clients = useCountUp(250, "+", 2000, 350);
  const fidelity = useCountUp(98, " %", 1800, 700);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const ghostY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-40, 40]);
  const ghostOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={sectionRef} id="about" className="section-padding texture-paper relative overflow-hidden">

      {/* Top blend · smooth transition from Promesse (navy-deep) to this light section */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "260px",
          background: "linear-gradient(to bottom, hsl(224 60% 7%) 0%, transparent 100%)",
          zIndex: 5,
        }}
      />

      {/* Parallax ghost word */}
      <motion.div
        aria-hidden
        className="absolute -right-8 top-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{ y: ghostY, opacity: ghostOpacity }}
      >
        <span
          className="font-heading font-light tracking-tighter leading-none block"
          style={{
            fontSize: "clamp(12rem, 25vw, 28rem)",
            color: "hsl(var(--foreground) / 0.028)",
            lineHeight: 1,
          }}
        >
          KANTI
        </span>
      </motion.div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-3 reveal">
            <h2 className="text-4xl md:text-5xl font-heading font-light text-foreground leading-[1.1] mb-8 tracking-tight">
              <SplitText text="Un regard global" by="word" stagger={0.07} />
              <br />
              <SplitText
                text="sur votre patrimoine"
                by="word"
                stagger={0.05}
                delay={0.25}
                itemClassName="italic text-foreground/70"
              />
            </h2>
            <p className="text-foreground/65 leading-relaxed mb-5 text-[17px] font-light">
              La plupart des conseils patrimoniaux partent d'un produit. Chez KANTI, nous partons de vous : votre situation familiale, vos revenus, votre fiscalité, vos projets, vos inquiétudes. Ensuite seulement, nous cherchons les bonnes réponses.
            </p>
            <p className="text-foreground/65 leading-relaxed mb-10 text-[17px] font-light">
              Cabinet inscrit à l'ORIAS et adhérent de la CNCEF, nous travaillons en architecture ouverte, sans lien capitalistique avec un réseau bancaire ou un groupe financier. Cette liberté nous permet de travailler exclusivement dans votre intérêt, et de vous le démontrer, année après année.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <Link
                to="/cabinet"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground link-underline pb-1"
              >
                En savoir plus sur le cabinet
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <a
                href={derAsset.url}
                target="_blank"
                rel="noopener noreferrer"
                data-magnetic
                className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-foreground transition-all duration-500 hover:-translate-y-0.5"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--foreground) / 0.08) 0%, hsl(var(--foreground) / 0.03) 100%)",
                  backdropFilter: "blur(16px) saturate(140%)",
                  WebkitBackdropFilter: "blur(16px) saturate(140%)",
                  boxShadow:
                    "inset 0 1px 0 hsl(var(--foreground) / 0.12), inset 0 -1px 0 hsl(var(--foreground) / 0.04), 0 8px 24px -10px hsl(var(--foreground) / 0.2)",
                  border: "1px solid hsl(var(--foreground) / 0.12)",
                }}
              >
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(120deg, transparent 20%, hsl(var(--foreground) / 0.1) 50%, transparent 80%)",
                  }}
                />
                <svg
                  className="w-4 h-4 relative z-10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"
                  />
                </svg>
                <span className="relative z-10">Télécharger notre DER</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 reveal reveal-delay-2 space-y-8">
            <div className="glass-float p-8 md:p-10 space-y-8 relative overflow-hidden">
              <div className="relative pl-5">
                <motion.span
                  aria-hidden
                  className="absolute left-0 top-1 bottom-1 w-px bg-foreground/25 origin-top"
                  initial={{ scaleY: reduce ? 1 : 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, margin: "-20%" }}
                  transition={{ duration: 0.9, delay: 0, ease: [0.22, 1, 0.36, 1] }}
                />
                <p className="text-4xl font-heading font-light text-foreground tracking-tight">
                  {years}
                </p>
                <p className="text-sm text-foreground/55 mt-1 font-light">d'exercice à Bordeaux</p>
              </div>
              <div className="separator-fine opacity-30" />
              <Stat
                refEl={clients.ref}
                value={clients.value}
                label="familles et dirigeants accompagnés"
                delay={0.35}
                reduce={!!reduce}
              />
              <div className="separator-fine opacity-30" />
              <Stat
                refEl={fidelity.ref}
                value={fidelity.value}
                label="de clients fidèles chaque année"
                delay={0.7}
                reduce={!!reduce}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  refEl,
  value,
  label,
  delay,
  reduce,
}: {
  refEl: React.RefObject<HTMLDivElement>;
  value: string;
  label: string;
  delay: number;
  reduce: boolean;
}) {
  return (
    <div ref={refEl} className="relative pl-5">
      {/* Traced vertical line accent */}
      <motion.span
        aria-hidden
        className="absolute left-0 top-1 bottom-1 w-px bg-foreground/25 origin-top"
        initial={{ scaleY: reduce ? 1 : 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      />
      <p className="text-4xl font-heading font-light text-foreground tracking-tight">
        {value}
      </p>
      <p className="text-sm text-foreground/55 mt-1 font-light">{label}</p>
    </div>
  );
}
