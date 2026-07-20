import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Step {
  number: string;
  title: string;
  description: string;
  deliverable: string;
  checkpoint: string;
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Cadrage",
    description:
      "Analyse du projet, de la situation patrimoniale, de la capacité d'emprunt et des objectifs.",
    deliverable: "Note de faisabilité",
    checkpoint: "Cohérence projet / patrimoine",
  },
  {
    number: "02",
    title: "Faisabilité",
    description:
      "Étude approfondie des revenus, charges, structure de détention, trésorerie et garanties.",
    deliverable: "Plan de financement prévisionnel",
    checkpoint: "Validation des hypothèses",
  },
  {
    number: "03",
    title: "Dossier",
    description:
      "Constitution et vérification complète du dossier. Présentation valorisée auprès des banques.",
    deliverable: "Dossier complet transmis",
    checkpoint: "Pièces complètes et cohérentes",
  },
  {
    number: "04",
    title: "Négociation",
    description:
      "Mise en concurrence des établissements, négociation du taux, de l'assurance et des conditions.",
    deliverable: "Offres comparées",
    checkpoint: "Sélection optimale",
  },
  {
    number: "05",
    title: "Mise en place",
    description:
      "Accompagnement jusqu'à la signature de l'offre et au déblocage des fonds.",
    deliverable: "Offre signée",
    checkpoint: "Financement mis en place",
  },
];

export default function FinancingMethodSection() {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-60px" }}
        >
          <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/45 mb-4 font-medium">
            09 · Parcours KANTI
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-[1.1] tracking-tight max-w-2xl mx-auto">
            De l'analyse au déblocage des fonds.
          </h2>
        </motion.div>

        {/* Desktop: horizontal pipeline */}
        <div className="hidden md:block relative">
          {/* Connector line */}
          <div
            className="absolute top-10 left-[10%] right-[10%] h-px bg-foreground/8"
            aria-hidden
          />

          <div className="grid md:grid-cols-5 gap-0">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                className="relative flex flex-col items-center text-center px-4"
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true, margin: "-40px" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Arrow connector */}
                {i < STEPS.length - 1 && (
                  <div
                    aria-hidden
                    className="absolute top-10 right-0 translate-x-1/2 z-20"
                    style={{ transform: "translateX(50%) translateY(-50%)" }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2 6h8M8 3l3 3-3 3"
                        stroke="hsl(222 35% 12% / 0.2)"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}

                {/* Number node */}
                <div
                  className={`relative z-10 w-20 h-20 rounded-full border flex items-center justify-center mb-5 transition-all duration-300 ${
                    hovered === i
                      ? "border-foreground/25 bg-foreground text-white shadow-lg"
                      : "border-foreground/12 bg-background text-foreground/60"
                  }`}
                >
                  <span className="font-heading text-xl font-light">
                    {step.number}
                  </span>
                </div>

                <h3 className="font-heading text-base font-light text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-foreground/50 text-xs leading-relaxed font-light mb-4">
                  {step.description}
                </p>

                {/* Expanded on hover */}
                <motion.div
                  animate={{ height: hovered === i ? "auto" : 0, opacity: hovered === i ? 1 : 0 }}
                  initial={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden w-full"
                >
                  <div className="border-t border-foreground/8 pt-3 space-y-2">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-foreground/30 mb-0.5">
                        Livrable
                      </p>
                      <p className="text-[11px] text-foreground/65">
                        {step.deliverable}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-foreground/30 mb-0.5">
                        Checkpoint
                      </p>
                      <p className="text-[11px] text-foreground/65">
                        {step.checkpoint}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical */}
        <div className="md:hidden space-y-0">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              className="flex gap-5 pb-8"
              initial={reduce ? false : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-40px" }}
            >
              {/* Left: number + line */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border border-foreground/12 bg-background flex items-center justify-center flex-shrink-0">
                  <span className="font-heading text-base font-light text-foreground/60">
                    {step.number}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-px flex-1 bg-foreground/10 mt-2" />
                )}
              </div>
              {/* Right */}
              <div className="pt-1">
                <h3 className="font-heading text-lg font-light text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-foreground/55 text-sm leading-relaxed mb-3 font-light">
                  {step.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="text-[11px] px-3 py-1 rounded-full bg-foreground/5 text-foreground/55 border border-foreground/8">
                    {step.deliverable}
                  </span>
                  <span className="text-[11px] px-3 py-1 rounded-full bg-foreground/5 text-foreground/55 border border-foreground/8">
                    {step.checkpoint}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
