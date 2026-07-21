import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const bullets = [
  "Questionnaire conforme aux exigences réglementaires",
  "Score SRI 1 → 7 calculé instantanément",
  "Recommandations personnalisées + export PDF",
];

export default function HomeProfilRisque() {
  return (
    <section
      id="profil-risque"
      className="relative section-padding overflow-hidden"
    >
      {/* Ambient halos */}
      <div
        aria-hidden
        className="absolute -top-32 right-[8%] w-[420px] h-[420px] rounded-full pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(circle, hsl(0 0% 100% / 0.12) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-24 w-[360px] h-[360px] rounded-full pointer-events-none opacity-35"
        style={{
          background:
            "radial-gradient(circle, hsl(0 0% 100% / 0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Left, Editorial copy */}
        <div className="lg:col-span-7 reveal">
          <div className="electric-line mb-6" />
          <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-5 font-medium">
            Outil patrimonial · Conforme aux exigences réglementaires
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-heading font-light text-foreground mb-8 tracking-tight leading-[1.05] text-balance">
            Définir votre <br />
            <span className="italic text-foreground/70">profil de risque.</span>
          </h2>
          <p className="text-foreground/65 text-base lg:text-lg font-light leading-relaxed max-w-xl mb-8">
            Avant toute recommandation, la réglementation impose d'évaluer votre
            tolérance au risque. Notre questionnaire, aligné sur les exigences
            réglementaires en vigueur, calcule votre indicateur synthétique de risque
            <span className="text-foreground"> (SRI) sur une échelle de 1 à 7</span>
            , et vous remet une fiche PDF aux couleurs KANTI.
          </p>

          <ul className="space-y-3 mb-10">
            {bullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 text-foreground/75 text-[15px] font-light"
              >
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground/40 flex-shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/profil-de-risque"
              data-magnetic
              className="group inline-flex items-center gap-3 pl-7 pr-2.5 py-2.5 rounded-full bg-[hsl(var(--navy-deep))] text-white text-sm font-medium tracking-wide reflection-sweep shadow-xl hover:-translate-y-0.5 transition-transform duration-300"
            >
              <span>Démarrer le questionnaire</span>
              <span className="w-9 h-9 rounded-full bg-white text-[hsl(var(--navy-deep))] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </span>
            </Link>
            <span className="inline-flex items-center text-xs text-foreground/45 tracking-wide">
              ~ 4 minutes · Sans inscription
            </span>
          </div>
        </div>

        {/* Right, Visual SRI scale */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5"
        >
          <div className="relative rounded-[2rem] glass-strong p-8 lg:p-10">
            <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 mb-6 font-medium">
              Indicateur Synthétique de Risque
            </p>

            <div className="flex items-end gap-1.5 mb-6">
              {[1, 2, 3, 4, 5, 6, 7].map((n) => {
                // Gradient navy → stone
                const intensity = 0.25 + (n / 7) * 0.7;
                return (
                  <div key={n} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full rounded-md"
                      style={{
                        height: `${24 + n * 10}px`,
                        background: `linear-gradient(180deg, hsl(222 40% ${
                          45 - n * 3
                        }% / ${intensity + 0.1}), hsl(222 50% ${
                          22 - n * 2
                        }% / ${intensity}))`,
                        boxShadow:
                          n === 4
                            ? "0 0 0 1px hsl(0 0% 100% / 0.4), 0 8px 24px -8px hsl(222 50% 11% / 0.2)"
                            : "inset 0 1px 0 hsl(0 0% 100% / 0.25)",
                      }}
                    />
                    <span className="text-[10px] font-medium text-foreground/55">
                      {n}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-6">
              <span>Très faible</span>
              <span>Très élevé</span>
            </div>

            <div className="separator-fine opacity-30 mb-6" />

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="font-heading text-2xl font-light text-foreground">
                  12
                </div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-foreground/50 mt-1">
                  Questions
                </div>
              </div>
              <div>
                <div className="font-heading text-2xl font-light text-foreground">
                  DDA
                </div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-foreground/50 mt-1">
                  Cadre régl.
                </div>
              </div>
              <div>
                <div className="font-heading text-2xl font-light text-foreground">
                  PDF
                </div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-foreground/50 mt-1">
                  Export
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}