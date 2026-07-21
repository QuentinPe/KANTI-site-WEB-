import { motion, useReducedMotion } from "framer-motion";

const CONVICTIONS = [
  {
    number: "01",
    headline: "Un taux bas ne fait pas un bon financement.",
    body: "Le coût réel d'un crédit inclut l'assurance, les garanties, les indemnités de remboursement anticipé et la modularité. Optimiser un seul paramètre sans vision globale peut se révéler coûteux sur la durée.",
  },
  {
    number: "02",
    headline: "L'assurance peut coûter plus que les intérêts.",
    body: "Sur 20 ans, le coût de l'assurance emprunteur peut dépasser celui des intérêts selon le profil et l'âge. La délégation d'assurance reste l'un des leviers les plus puissants · et les moins exploités par les emprunteurs.",
  },
  {
    number: "03",
    headline: "La structure de détention précède le financement.",
    body: "Acquérir en nom propre, en SCI, via une holding : chaque structure modifie les critères d'analyse bancaire, les garanties exigées, la fiscalité et les conditions de sortie. Ce choix se fait avant de solliciter les établissements.",
  },
  {
    number: "04",
    headline: "Un dossier solide vaut plusieurs points de négociation.",
    body: "La qualité de la présentation, la clarté des revenus et la cohérence du projet influencent directement les conditions obtenues. La préparation du dossier est le premier acte de la négociation bancaire.",
  },
];

export default function FinancingArchitectureSection() {
  const reduce = useReducedMotion();

  return (
    <section style={{ background: "hsl(var(--navy-deep))" }} className="section-padding">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          className="mb-16 max-w-xl"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true, margin: "-60px" }}
        >
          <p className="text-[10px] tracking-[0.32em] uppercase text-white/35 mb-5 font-medium">
            01 · Convictions
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-white leading-[1.1] tracking-tight">
            Ce que nous savons sur le financement.
          </h2>
        </motion.div>

        {/* Grid 2 × 2 */}
        <div className="grid md:grid-cols-2 gap-px bg-white/8">
          {CONVICTIONS.map((c, i) => (
            <motion.div
              key={c.number}
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="bg-[hsl(var(--navy-deep))] p-10 md:p-12 flex flex-col gap-6 group hover:bg-white/[0.03] transition-colors duration-300"
            >
              {/* Number */}
              <span
                className="font-heading text-[56px] md:text-[72px] leading-none font-light select-none"
                style={{ color: "hsl(215 40% 50% / 0.45)" }}
              >
                {c.number}
              </span>

              {/* Rule */}
              <div className="w-8 h-px bg-white/20" />

              {/* Headline */}
              <h3 className="font-heading text-xl md:text-2xl font-light text-white leading-snug tracking-tight">
                {c.headline}
              </h3>

              {/* Body */}
              <p className="text-sm font-light leading-relaxed" style={{ color: "hsl(215 25% 72%)" }}>
                {c.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom quote */}
        <motion.p
          className="mt-14 text-center text-sm font-light italic"
          style={{ color: "hsl(215 25% 55%)" }}
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          "Le taux est un outil. La stratégie est une posture."
          <span className="block text-[10px] not-italic tracking-widest uppercase mt-2" style={{ color: "hsl(215 25% 40%)" }}>
            Courtage patrimonial KANTI
          </span>
        </motion.p>

      </div>
    </section>
  );
}
