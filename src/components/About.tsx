import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, suffix = "", duration = 2000) {
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
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
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
  }, [target, suffix, duration]);

  return { ref, value };
}

export default function About() {
  const years = useCountUp(15, " ans");
  const clients = useCountUp(500, "+");
  const fidelity = useCountUp(98, " %");

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
              Un regard global<br />
              <span className="italic text-foreground/70">sur votre patrimoine</span>
            </h2>
            <p className="text-foreground/65 leading-relaxed mb-5 text-[17px] font-light">
              La plupart des conseils patrimoniaux partent d'un produit. Chez KANTI, nous partons de vous : votre situation familiale, vos revenus, votre fiscalité, vos projets, vos inquiétudes. Ensuite seulement, nous cherchons les bonnes réponses.
            </p>
            <p className="text-foreground/65 leading-relaxed mb-10 text-[17px] font-light">
              Cabinet indépendant inscrit à l'ORIAS et membre de la CNCGP, nous ne dépendons d'aucun réseau bancaire ni d'aucun groupe financier. Cette liberté nous permet de travailler exclusivement dans votre intérêt — et de vous le démontrer, année après année.
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

          <div className="lg:col-span-2 reveal reveal-delay-2">
            <div className="glass-float p-8 md:p-10 space-y-8">
              <div ref={years.ref}>
                <p className="text-4xl font-heading font-light text-foreground tracking-tight">
                  {years.value}
                </p>
                <p className="text-sm text-foreground/55 mt-1 font-light">
                  d'exercice à Bordeaux
                </p>
              </div>
              <div className="separator-fine" />
              <div ref={clients.ref}>
                <p className="text-4xl font-heading font-light text-foreground tracking-tight">
                  {clients.value}
                </p>
                <p className="text-sm text-foreground/55 mt-1 font-light">
                  familles et dirigeants accompagnés
                </p>
              </div>
              <div className="separator-fine" />
              <div ref={fidelity.ref}>
                <p className="text-4xl font-heading font-light text-foreground tracking-tight">
                  {fidelity.value}
                </p>
                <p className="text-sm text-foreground/55 mt-1 font-light">
                  de clients fidèles chaque année
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
