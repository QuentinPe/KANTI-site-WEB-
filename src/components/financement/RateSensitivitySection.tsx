import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

interface Factor {
  id: string;
  name: string;
  shortDesc: string;
  detail: string;
  affected: string[];
}

const FACTORS: Factor[] = [
  {
    id: "taux-directeurs",
    name: "Taux directeurs",
    shortDesc: "BCE et Fed influencent le coût de refinancement des banques.",
    detail:
      "Une hausse des taux directeurs renchérit le coût de refinancement des établissements, qui répercutent cette hausse sur les crédits. L'impact peut varier selon la concurrence et la politique commerciale de chaque banque.",
    affected: ["Taux nominal", "Taux variable", "Marché obligataire"],
  },
  {
    id: "apport",
    name: "Apport personnel",
    shortDesc:
      "Un apport élevé réduit le risque perçu et améliore les conditions.",
    detail:
      "Un apport significatif (≥ 20 % du projet) rassure les établissements, réduit leur exposition et leur permet souvent d'améliorer le taux ou les conditions de garantie.",
    affected: ["Taux", "Garanties", "Coût de l'assurance"],
  },
  {
    id: "revenus",
    name: "Stabilité des revenus",
    shortDesc: "CDI, ancienneté, nature des revenus : critères clés.",
    detail:
      "Les banques privilégient les revenus réguliers et justifiables. Les dirigeants et indépendants doivent en général présenter 3 bilans et peuvent bénéficier d'une analyse adaptée.",
    affected: ["Faisabilité", "Taux d'effort", "Mensualité maximale"],
  },
  {
    id: "endettement",
    name: "Taux d'endettement",
    shortDesc:
      "Le ratio revenus/charges pèse sur la capacité d'emprunt.",
    detail:
      "Au-delà d'un certain taux d'effort (souvent 35 % selon les recommandations HCSF), les banques peuvent refuser ou durcir les conditions. Le reste à vivre est également analysé.",
    affected: ["Montant empruntable", "Durée", "Faisabilité"],
  },
  {
    id: "bien",
    name: "Qualité du bien",
    shortDesc:
      "Localisation, DPE, vétusté influencent la prise de garantie.",
    detail:
      "Un bien mal situé, très ancien ou mal noté (DPE F-G) peut conduire une banque à refuser la garantie hypothécaire ou à majorer le taux pour couvrir le risque de revente.",
    affected: ["Garanties", "Hypothèque", "Conditions"],
  },
  {
    id: "garanties",
    name: "Type de garanties",
    shortDesc: "Caution, hypothèque, PPD : des coûts et protections différents.",
    detail:
      "La caution (ex : Crédit Logement) est souvent moins coûteuse que l'hypothèque et partiellement remboursable. L'hypothèque reste pertinente sur certains montages ou profils.",
    affected: ["Frais", "Sécurité", "Mainlevée"],
  },
  {
    id: "assurance",
    name: "Assurance emprunteur",
    shortDesc:
      "Le coût réel de l'assurance peut dépasser celui des intérêts.",
    detail:
      "L'assurance représente souvent 20 à 30 % du coût total. La délégation d'assurance permet de la souscrire hors de la banque, parfois à des conditions significativement plus favorables.",
    affected: ["Coût total", "TAEA", "Mensualité réelle"],
  },
  {
    id: "duree",
    name: "Durée du prêt",
    shortDesc:
      "Allonger la durée réduit la mensualité mais augmente le coût total.",
    detail:
      "Chaque année supplémentaire diminue la mensualité mais augmente le total intérêts + assurance. Au-delà de 25 ans, les conditions se durcissent dans de nombreux établissements.",
    affected: ["Mensualité", "Coût total", "Taux d'effort"],
  },
  {
    id: "concurrence",
    name: "Concurrence bancaire",
    shortDesc: "La mise en concurrence améliore les conditions obtenues.",
    detail:
      "Solliciter plusieurs établissements — via un courtier — crée une pression concurrentielle qui peut améliorer significativement le taux, les frais ou les conditions annexes.",
    affected: ["Taux", "Frais de dossier", "Conditions"],
  },
  {
    id: "dossier",
    name: "Qualité du dossier",
    shortDesc:
      "Un dossier complet et cohérent accélère et facilite la décision.",
    detail:
      "Un dossier bien préparé (pièces complètes, revenus documentés, projet solide) réduit les délais, rassure les analystes et limite les demandes complémentaires.",
    affected: ["Délais", "Conditions", "Refus"],
  },
  {
    id: "calendrier",
    name: "Calendrier",
    shortDesc:
      "Le moment du dépôt peut influencer les conditions obtenues.",
    detail:
      "Les politiques commerciales des banques varient selon les trimestres, les objectifs de production et les directives réglementaires. Le timing peut parfois jouer.",
    affected: ["Taux", "Faisabilité", "Réponse"],
  },
  {
    id: "structure",
    name: "Structure de détention",
    shortDesc:
      "SCI, SARL, nom propre : chaque structure a ses implications.",
    detail:
      "Acquérir via une SCI ou une société impacte les critères d'analyse, la garantie, la fiscalité et les conditions de financement. La coordination avec l'expert-comptable est recommandée.",
    affected: ["Faisabilité", "Garanties", "Fiscalité"],
  },
  {
    id: "dpe",
    name: "Performance énergétique",
    shortDesc: "Le DPE peut faciliter ou compliquer le financement.",
    detail:
      "Les établissements intègrent progressivement la performance énergétique dans leur analyse. Un DPE A-B peut faciliter l'obtention du financement ou améliorer les conditions. Un DPE F-G peut complexifier la garantie.",
    affected: ["Garanties", "Valeur", "Conditions"],
  },
  {
    id: "relais",
    name: "Prêt relais",
    shortDesc:
      "Le relais dépend de la valeur du bien vendu et du timing.",
    detail:
      "Un prêt relais permet d'acquérir un nouveau bien avant la vente de l'ancien. Son coût, sa durée et sa disponibilité dépendent de la valeur nette du bien à vendre et de la politique de l'établissement.",
    affected: ["Liquidité", "Risque", "Timing"],
  },
];

export default function RateSensitivitySection() {
  const [selected, setSelected] = useState<string | null>(null);
  const reduce = useReducedMotion();

  const selectedFactor = FACTORS.find((f) => f.id === selected);

  return (
    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-10"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-60px" }}
        >
          <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/45 mb-4 font-medium">
            06 · Facteurs influençant les conditions
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-[1.1] tracking-tight max-w-2xl">
            Ce qui fait évoluer une proposition bancaire.
          </h2>
          <p className="text-foreground/55 font-light mt-3 text-sm">
            Cliquez sur un facteur pour en savoir plus sur son impact.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {FACTORS.map((factor, i) => (
            <motion.button
              key={factor.id}
              onClick={() =>
                setSelected(selected === factor.id ? null : factor.id)
              }
              className={`text-left rounded-xl border p-4 transition-all duration-200 ${
                selected === factor.id
                  ? "border-foreground/20 bg-foreground/[0.03] shadow-sm"
                  : "border-foreground/8 bg-white hover:border-foreground/15 hover:shadow-sm"
              }`}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              viewport={{ once: true, margin: "-40px" }}
            >
              <div className="flex items-start gap-3">
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-1">
                    {factor.name}
                  </h3>
                  <p className="text-xs text-foreground/55 leading-relaxed">
                    {factor.shortDesc}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {selectedFactor && (
            <motion.div
              key={selectedFactor.id}
              initial={reduce ? false : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-foreground/10 bg-white p-6 md:p-8"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-heading text-xl font-light text-foreground">
                  {selectedFactor.name}
                </h3>
                <button
                  onClick={() => setSelected(null)}
                  className="text-foreground/30 hover:text-foreground/60 transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-foreground/70 leading-relaxed text-sm mb-5">
                {selectedFactor.detail}
              </p>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-3">
                  Paramètres concernés
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedFactor.affected.map((item) => (
                    <span
                      key={item}
                      className="text-xs px-3 py-1 rounded-full bg-foreground/5 text-foreground/65 border border-foreground/8"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
