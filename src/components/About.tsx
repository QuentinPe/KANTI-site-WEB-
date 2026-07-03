import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SplitText from "./motion/SplitText";

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
  const years = useCountUp(15, " ans", 1800, 0);
  const clients = useCountUp(500, "+", 2000, 350);
  const fidelity = useCountUp(98, " %", 1800, 700);

  return (
    <section id="about" className="section-padding texture-paper relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-3 reveal">
            <div className="electric-line mb-5" />
            <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-5 font-medium">
              Le cabinet
            </p>
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
              Cabinet indépendant inscrit à l'ORIAS et adhérent de la CNCEF, nous ne dépendons d'aucun réseau bancaire ni d'aucun groupe financier. Cette liberté nous permet de travailler exclusivement dans votre intérêt — et de vous le démontrer, année après année.
            </p>
            <Link
              to="/cabinet"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground link-underline pb-1"
            >
              En savoir plus sur le cabinet
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="lg:col-span-2 reveal reveal-delay-2 space-y-8">
            <div className="glass-float p-8 md:p-10 space-y-8 relative overflow-hidden">
              <Stat
                refEl={years.ref}
                value={years.value}
                label="d'exercice à Biarritz"
                delay={0}
                reduce={!!reduce}
              />
              <div className="separator-fine" />
              <Stat
                refEl={clients.ref}
                value={clients.value}
                label="familles et dirigeants accompagnés"
                delay={0.35}
                reduce={!!reduce}
              />
              <div className="separator-fine" />
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
        className="absolute left-0 top-1 bottom-1 w-px bg-[hsl(var(--accent))] origin-top"
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
