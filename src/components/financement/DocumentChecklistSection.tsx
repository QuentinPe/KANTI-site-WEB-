import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CheckSquare, Copy, Check } from "lucide-react";

interface DocCategory {
  cat: string;
  items: string[];
}

const PARTICULIER_DOCS: DocCategory[] = [
  {
    cat: "Identité",
    items: [
      "CNI ou passeport en cours de validité",
      "Justificatif de domicile < 3 mois",
    ],
  },
  {
    cat: "Revenus",
    items: [
      "3 derniers bulletins de salaire",
      "Contrat de travail ou attestation employeur",
      "2 derniers avis d'imposition",
    ],
  },
  {
    cat: "Relevés bancaires",
    items: [
      "3 derniers relevés de tous les comptes",
      "Relevé épargne (livrets, AV, PEA)",
    ],
  },
  {
    cat: "Crédits en cours",
    items: ["Tableaux d'amortissement des crédits existants"],
  },
  {
    cat: "Projet",
    items: [
      "Compromis de vente ou avant-contrat",
      "Devis travaux si applicable",
    ],
  },
];

const DIRIGEANT_DOCS: DocCategory[] = [
  {
    cat: "Comptabilité",
    items: [
      "3 derniers bilans et liasses fiscales",
      "Situation intermédiaire < 3 mois",
      "2 derniers avis d'imposition (IR et IS)",
    ],
  },
  {
    cat: "Revenus",
    items: [
      "Rémunération de gérance + dividendes",
      "Attestation de rémunération",
    ],
  },
  {
    cat: "Structure",
    items: ["Kbis < 3 mois", "Statuts de la société", "Répartition du capital"],
  },
  {
    cat: "Dettes",
    items: ["Cautions accordées", "Prêts professionnels en cours"],
  },
];

const SCI_DOCS: DocCategory[] = [
  {
    cat: "Société",
    items: [
      "Statuts de la SCI",
      "Kbis < 3 mois",
      "Liste des associés + quote-parts",
    ],
  },
  {
    cat: "Comptes",
    items: ["2 derniers bilans de la SCI", "Situation de trésorerie"],
  },
  {
    cat: "Biens",
    items: [
      "Liste des biens détenus",
      "Baux en cours",
      "Tableau de loyers perçus",
    ],
  },
  {
    cat: "Garanties",
    items: [
      "Cautions personnelles des associés",
      "Documents hypothécaires existants",
    ],
  },
];

const TABS = [
  { label: "Particulier", docs: PARTICULIER_DOCS },
  { label: "Dirigeant & indépendant", docs: DIRIGEANT_DOCS },
  { label: "SCI", docs: SCI_DOCS },
];

export default function DocumentChecklistSection() {
  const reduce = useReducedMotion();
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  function copyList() {
    const tab = TABS[activeTab];
    const lines: string[] = [`${tab.label}\n`];
    tab.docs.forEach(cat => {
      lines.push(`- ${cat.cat}`);
      cat.items.forEach(item => lines.push(`  · ${item}`));
      lines.push('');
    });
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const docs = TABS[activeTab].docs;
  const totalItems = docs.reduce((s, c) => s + c.items.length, 0);

  return (
    <section
      className="section-padding"
      style={{ background: "hsl(220 30% 97%)" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-10"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-60px" }}
        >
          <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/45 mb-4 font-medium">
            10 · Préparation du dossier
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-[1.1] tracking-tight max-w-2xl mb-4">
            Un dossier complet et cohérent améliore les conditions.
          </h2>
          <p className="text-foreground/55 font-light text-sm max-w-xl">
            Un dossier bien préparé réduit les délais, limite les demandes de
            pièces complémentaires et rassure les analystes bancaires.
          </p>
        </motion.div>

        {/* Tab selector + copy button */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === i
                    ? "bg-foreground text-white"
                    : "border border-foreground/15 text-foreground/60 hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={copyList}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-foreground/15 text-xs font-medium text-foreground/55 hover:text-foreground hover:border-foreground/30 transition-all duration-200"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copié !" : "Copier la liste"}
          </button>
        </div>

        {/* Checklist card */}
        <motion.div
          key={activeTab}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-foreground/8 bg-white p-6 md:p-8 shadow-sm"
        >
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-foreground/50 mb-2">
              <span>{totalItems} pièces à réunir</span>
              <span className="text-foreground/35 italic">Guide visuel uniquement</span>
            </div>
            <div className="h-1.5 rounded-full bg-foreground/8 overflow-hidden">
              <div
                className="h-full rounded-full bg-foreground/20 transition-all duration-500"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="grid md:grid-cols-2 gap-6">
            {docs.map((cat, ci) => (
              <motion.div
                key={cat.cat}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: ci * 0.07 }}
              >
                <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-3">
                  {cat.cat}
                </p>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckSquare
                        className="w-4 h-4 text-foreground/25 flex-shrink-0 mt-0.5"
                        aria-hidden
                      />
                      <span className="text-sm text-foreground/65 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <p className="text-[11px] italic text-foreground/35 mt-6 border-t border-foreground/6 pt-4">
            Liste indicative · les pièces demandées peuvent varier selon
            l'établissement, le profil et le type de financement.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
