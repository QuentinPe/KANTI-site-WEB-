import { motion } from "framer-motion";

const badges = [
  {
    label: "ORIAS",
    code: "n° 20 000 855",
    title: "Conseiller en Investissements Financiers",
    body: "Immatriculé à l'ORIAS comme CIF, Courtier d'assurance (IAS) et Courtier en opérations de banque et services de paiement (IOBSP). Carte de transaction immobilière n° CPI33012020000045313 délivrée par la CCI de Bordeaux-Gironde.",
  },
  {
    label: "CNCEF",
    code: "Adhérent certifié",
    title: "La Compagnie CIF / IOBSP · CNCEF Assurance",
    body: "Adhérent de La Compagnie CIF et de La Compagnie IOBSP (n° F002635) et de la CNCEF Assurance (n° 25/860422), associations agréées par l'AMF et l'ACPR. Code de déontologie strict et contrôle continu.",
  },
  {
    label: "AMF / ACPR",
    code: "Supervision",
    title: "Autorités de tutelle",
    body: "Activités encadrées par l'Autorité des Marchés Financiers et l'Autorité de Contrôle Prudentiel et de Résolution. Information précontractuelle systématique.",
  },
  {
    label: "RC Pro",
    code: "& garantie financière",
    title: "Assurances obligatoires",
    body: "Responsabilité civile professionnelle et garantie financière conformes aux articles L.541-3 et L.512-6. Vos actifs sont détenus chez des dépositaires agréés, jamais chez nous.",
  },
];

const guarantees = [
  "Information précontractuelle remise systématiquement",
  "Mode de rémunération expliqué avant toute recommandation",
  "Aucune détention d'actifs en propre",
  "Indépendance vis-à-vis des établissements financiers",
];

export default function Confiance() {
  return (
    <section id="confiance" className="section-padding section-glass relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-16 items-end">
          <div className="lg:col-span-7 reveal">
            <div className="electric-line mb-5" />
            <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-5 font-medium">
              Réassurance · Cadre réglementaire
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light text-foreground tracking-tight leading-[1.05]">
              Un exercice encadré,<br />
              <span className="italic text-foreground/70">une transparence totale</span>
            </h2>
          </div>
          <ul className="lg:col-span-5 reveal space-y-2.5 border-l border-foreground/10 pl-6">
            {guarantees.map((g) => (
              <li key={g} className="flex items-start gap-3 text-[14px] text-foreground/65 font-light leading-relaxed">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[hsl(var(--electric))]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {g}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {badges.map((b, i) => (
            <motion.article
              key={b.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group relative rounded-[1.75rem] p-7 bg-white/55 backdrop-blur-sm border border-foreground/[0.06] hover:border-foreground/15 hover:bg-white/70 transition-all duration-500"
            >
              <div className="flex items-baseline justify-between mb-6">
                <span className="font-heading text-3xl font-light text-foreground tracking-tight">{b.label}</span>
                <span className="text-[10px] tracking-[0.25em] uppercase text-foreground/40 font-medium">
                  {b.code}
                </span>
              </div>
              <h3 className="font-heading text-base font-normal text-foreground mb-3 tracking-tight leading-snug">
                {b.title}
              </h3>
              <p className="text-foreground/55 text-[13px] leading-relaxed font-light">
                {b.body}
              </p>
              <div className="absolute bottom-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-[hsl(var(--electric))/0.35] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
