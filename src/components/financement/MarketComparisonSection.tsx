import { motion, useReducedMotion } from "framer-motion";
import { X, Check } from "lucide-react";

const TRADITIONAL = [
  "Accès limité à un réseau bancaire restreint",
  "Analyse centrée sur le taux nominal",
  "Recommandation indépendante du projet global",
  "Peu de coordination avec les autres conseils",
  "Suivi post-financement absent",
];

const KANTI = [
  "Accès à 125 établissements partenaires",
  "Analyse du coût total du crédit (taux, assurance, garanties)",
  "Vision patrimoniale intégrée : fiscalité, transmission, prévoyance",
  "Coordination avec votre notaire, expert-comptable et avocat",
  "Suivi et revue annuelle de votre stratégie de financement",
  "Négociation active des conditions et de l'assurance emprunteur",
  "Accompagnement sur les montages complexes (SCI, holding, lombard)",
  "Un interlocuteur unique sur toute la durée du projet",
];

export default function MarketComparisonSection() {
  const reduce = useReducedMotion();

  return (
    <section className="section-padding bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          viewport={{ once: true, margin: "-60px" }}
        >
          <p className="text-[10px] tracking-[0.32em] uppercase font-medium mb-4" style={{ color: "hsl(224 25% 50%)" }}>
            Notre positionnement
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[42px] font-light leading-[1.1] tracking-tight mb-5" style={{ color: "hsl(224 60% 10%)" }}>
            Une vision élargie du marché,<br />
            <span className="italic" style={{ color: "hsl(224 45% 35%)" }}>une stratégie ciblée.</span>
          </h2>
          <p className="text-base font-light max-w-2xl mx-auto" style={{ color: "hsl(224 15% 42%)" }}>
            La technologie élargit l'analyse. L'expertise humaine détermine la bonne stratégie.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, margin: "-60px" }}
            className="rounded-2xl p-6 md:p-8"
            style={{ background: "hsl(224 15% 96%)", border: "1px solid hsl(224 20% 12% / 0.07)" }}
          >
            <p className="text-[11px] tracking-[0.28em] uppercase font-medium mb-5" style={{ color: "hsl(224 20% 55%)" }}>
              Approche traditionnelle
            </p>
            <ul className="space-y-3">
              {TRADITIONAL.map((t, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-light" style={{ color: "hsl(224 15% 45%)" }}>
                  <X className="w-4 h-4 flex-shrink-0 mt-0.5" strokeWidth={1.5} style={{ color: "hsl(224 15% 62%)" }} />
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            viewport={{ once: true, margin: "-60px" }}
            className="rounded-2xl p-6 md:p-8"
            style={{ background: "hsl(224 55% 10%)", border: "1px solid transparent" }}
          >
            <p className="text-[11px] tracking-[0.28em] uppercase font-medium mb-5" style={{ color: "hsl(224 20% 60%)" }}>
              Approche KANTI
            </p>
            <ul className="space-y-3">
              {KANTI.map((k, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-light" style={{ color: "hsl(224 15% 78%)" }}>
                  <Check className="w-4 h-4 flex-shrink-0 mt-0.5" strokeWidth={1.5} style={{ color: "hsl(218 65% 62%)" }} />
                  {k}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.p
          className="text-center text-[12px] italic mt-8"
          style={{ color: "hsl(224 15% 58%)" }}
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          Données indicatives. Chaque situation fait l'objet d'une analyse personnalisée.
        </motion.p>
      </div>
    </section>
  );
}
