import { motion, useReducedMotion } from "framer-motion";

interface Indicator {
  label: string;
  value: string;
}

interface CasClient {
  num: string;
  title: string;
  profil: string;
  objectif: string;
  contraintes: string;
  financement: string;
  indicators: Indicator[];
  vigilance: string;
}

const CAS: CasClient[] = [
  {
    num: "01",
    title: "Résidence principale",
    profil: "Couple, 45 ans, cadres sup, patrimoine constitué.",
    objectif:
      "Acquérir une résidence principale à 850 000 € à Bordeaux avec travaux.",
    contraintes:
      "Apport de 200 000 € à préserver partiellement. Crédits auto en cours.",
    financement:
      "650 000 € sur 20 ans. Délégation d'assurance. Modularité demandée.",
    indicators: [
      { label: "Mensualité", value: "3 480 €/mois" },
      { label: "Coût total", value: "83 500 €" },
      { label: "Taux obtenu", value: "3,65 %" },
    ],
    vigilance: "Taux d'effort à surveiller avec les crédits en cours.",
  },
  {
    num: "02",
    title: "Investissement locatif",
    profil: "Chef d'entreprise, 38 ans, forte capacité d'épargne.",
    objectif:
      "Acquisition d'un immeuble de rapport à 1,2 M€ via SCI.",
    contraintes:
      "Financement partiel via trésorerie professionnelle. Structure SCI à créer.",
    financement:
      "900 000 € sur 25 ans, in fine partiel. Coordination comptable.",
    indicators: [
      { label: "Cash-flow net", value: "+320 €/mois" },
      { label: "Rendement brut", value: "5,2 %" },
      { label: "TRI estimatif", value: "6,8 %" },
    ],
    vigilance:
      "Vacance locative et gestion des cautions personnelles.",
  },
  {
    num: "03",
    title: "Murs professionnels",
    profil: "Médecin libéral, 50 ans, SCI créée.",
    objectif: "Acquisition des murs de son cabinet à 480 000 €.",
    contraintes:
      "Revenus variables selon l'activité. Garanties hypothécaires sur SCI.",
    financement:
      "384 000 € sur 15 ans. Analyse des 3 bilans. Assurance adaptée.",
    indicators: [
      { label: "Loyer SCI", value: "2 100 €/mois" },
      { label: "Durée", value: "15 ans" },
      { label: "Taux", value: "3,85 %" },
    ],
    vigilance:
      "Structure juridique et fiscalité du loyer à optimiser.",
  },
  {
    num: "04",
    title: "Opération patrimoniale",
    profil: "Dirigeant, 54 ans, cession partielle d'entreprise imminente.",
    objectif:
      "Prêt relais + acquisition avant cession. Optimisation succession.",
    contraintes:
      "Timing lié à la cession. Coordination avec notaire et avocat.",
    financement:
      "Relais sur bien existant + financement acquisition 700 000 €.",
    indicators: [
      { label: "Durée relais", value: "18 mois" },
      { label: "Capital relais", value: "320 000 €" },
      { label: "Économie fiscale", value: "À calculer" },
    ],
    vigilance:
      "Timing et valorisation du bien à vendre. Coordination pluridisciplinaire.",
  },
];

export default function CasClientFinancementSection() {
  const reduce = useReducedMotion();

  return (
    <section
      className="section-padding"
      style={{ background: "hsl(220 30% 97%)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-60px" }}
        >
          <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/45 mb-4 font-medium">
            12 · Cas clients fictifs
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-[1.1] tracking-tight max-w-2xl mb-4">
            Quatre projets, quatre structures de financement.
          </h2>
          <p className="text-[11px] italic text-foreground/40">
            Cas entièrement fictifs, présentés à titre illustratif. Toute
            ressemblance avec des situations réelles serait fortuite.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {CAS.map((cas, i) => (
            <motion.div
              key={cas.num}
              className="rounded-2xl border border-foreground/8 bg-white p-6 md:p-8 shadow-sm"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-40px" }}
            >
              {/* Number + title */}
              <div className="flex items-start gap-4 mb-5">
                <span className="w-10 h-10 rounded-full border border-foreground/12 bg-background flex items-center justify-center flex-shrink-0 font-heading text-sm font-light text-foreground/55">
                  {cas.num}
                </span>
                <div>
                  <h3 className="font-heading text-xl font-light text-foreground">
                    {cas.title}
                  </h3>
                  <p className="text-xs text-foreground/45 mt-0.5">{cas.profil}</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-5">
                {[
                  { label: "Objectif", text: cas.objectif },
                  { label: "Contraintes", text: cas.contraintes },
                  { label: "Financement", text: cas.financement },
                ].map((d) => (
                  <div key={d.label}>
                    <p className="text-[10px] uppercase tracking-wider text-foreground/35 mb-1">
                      {d.label}
                    </p>
                    <p className="text-sm text-foreground/65 leading-relaxed">
                      {d.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Indicators */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {cas.indicators.map((ind) => (
                  <div
                    key={ind.label}
                    className="bg-background/60 rounded-xl p-3 text-center"
                  >
                    <p className="text-[10px] text-foreground/40 mb-1">
                      {ind.label}
                    </p>
                    <p className="text-sm font-medium text-foreground/80 font-heading">
                      {ind.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Vigilance */}
              <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
                <p className="text-[10px] uppercase tracking-wider text-amber-700/60 mb-1">
                  Point de vigilance
                </p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  {cas.vigilance}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
