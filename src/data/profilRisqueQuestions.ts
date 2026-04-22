export interface RiskOption {
  label: string;
  /** Score 1 (most prudent) → 5 (most risk-seeking) */
  score: number;
}

export interface RiskQuestion {
  id: string;
  /** Section thématique du questionnaire AMF */
  section: RiskSection;
  /** Sous-thème (libellé court) */
  dimension: string;
  question: string;
  helper?: string;
  /** "choice" = QCM scoré, "number" = saisie libre (non scorée, reportée dans le PDF) */
  type?: "choice" | "number";
  /** Pour les questions de type "number" */
  numberConfig?: {
    placeholder?: string;
    suffix?: string; // ex : "€", "ans"
    min?: number;
    max?: number;
    step?: number;
  };
  /** Permet plusieurs réponses (toujours scoré sur la meilleure réponse cochée) */
  multi?: boolean;
  options?: RiskOption[];
}

export type RiskSection =
  | "Projet d'investissement"
  | "Connaissance et expérience des placements"
  | "Comportement et tolérance au risque";

export const RISK_SECTIONS: RiskSection[] = [
  "Projet d'investissement",
  "Connaissance et expérience des placements",
  "Comportement et tolérance au risque",
];

/**
 * Questionnaire d'évaluation du profil investisseur — aligné sur les
 * exigences MIF II / AMF (test d'adéquation, art. 25 directive 2014/65).
 * Chaque réponse est notée de 1 (prudent) à 5 (offensif).
 * Le SRI final (1 → 7) est calculé à partir du score moyen.
 */
export const RISK_QUESTIONS: RiskQuestion[] = [
  // ═══════════ 1. PROJET D'INVESTISSEMENT ═══════════
  {
    id: "projet-objectif",
    section: "Projet d'investissement",
    dimension: "Objectifs du placement",
    question: "Quels sont les objectifs de votre placement ?",
    options: [
      { label: "Préparer ma retraite", score: 3 },
      { label: "Réduire mon impôt sur le revenu", score: 3 },
      { label: "Mettre de l'argent de côté pour un objectif précis", score: 2 },
      { label: "Préparer la transmission de mon capital", score: 3 },
      { label: "Accroître mon capital sans but spécifique", score: 4 },
      { label: "Autre", score: 3 },
    ],
  },
  {
    id: "projet-montant",
    section: "Projet d'investissement",
    dimension: "Montant envisagé",
    question: "Quelle somme envisagez-vous d'investir ?",
    type: "number",
    numberConfig: { placeholder: "50 000", suffix: "€", min: 0, step: 1000 },
  },
  {
    id: "projet-duree",
    section: "Projet d'investissement",
    dimension: "Durée du projet",
    question: "Sur quelle durée envisagez-vous d'investir ?",
    type: "number",
    numberConfig: { placeholder: "15", suffix: "ans", min: 0, max: 60, step: 1 },
  },

  // ═══════════ 2. CONNAISSANCE ET EXPÉRIENCE ═══════════
  {
    id: "ce-connaissance",
    section: "Connaissance et expérience des placements",
    dimension: "Connaissance des placements",
    question: "Quelle est votre connaissance en matière de placements ?",
    options: [
      { label: "Connaissance limitée", score: 1 },
      { label: "Connaissance de base : je comprends la différence entre actions et obligations", score: 2 },
      { label: "Connaissance raisonnable : je connais les options de placement et les risques associés", score: 3 },
      { label: "Bonnes connaissances : je comprends les diverses stratégies de placement", score: 4 },
      { label: "Connaissances approfondies : je maîtrise tous les produits et stratégies", score: 5 },
    ],
  },
  {
    id: "ce-experience-generale",
    section: "Connaissance et expérience des placements",
    dimension: "Expérience générale",
    question: "Quelle est votre expérience des placements financiers en général ?",
    options: [
      { label: "Aucune expérience préalable", score: 1 },
      { label: "J'ai déjà réalisé des placements avec un conseiller financier", score: 3 },
      { label: "J'ai déjà réalisé des placements sans conseiller financier", score: 4 },
    ],
  },
  {
    id: "ce-assurance-vie",
    section: "Connaissance et expérience des placements",
    dimension: "Assurance-vie / Épargne retraite",
    question: "Quelle est votre expérience des placements en assurance-vie ou épargne retraite ?",
    options: [
      { label: "Aucune expérience préalable", score: 1 },
      { label: "J'ai déjà investi en fonds euros", score: 2 },
      { label: "J'ai déjà investi en unités de compte", score: 4 },
    ],
  },
  {
    id: "ce-autres-placements",
    section: "Connaissance et expérience des placements",
    dimension: "Autres placements financiers",
    question: "Quelle est votre expérience des autres placements financiers ?",
    helper: "Sélectionnez l'option la plus avancée vous concernant.",
    options: [
      { label: "Aucune expérience préalable", score: 1 },
      { label: "Contrat de capitalisation", score: 2 },
      { label: "Placements retraite (PER, PERP, Madelin, PERCO, Art. 83)", score: 3 },
      { label: "Comptes-titres / PEA en fonds (OPCVM, SICAV…)", score: 3 },
      { label: "Comptes-titres / PEA en titres vifs (actions, obligations)", score: 4 },
      { label: "Capital risque (FCPI, FIP, FCPR, parts de PME)", score: 5 },
      { label: "Produits financiers complexes (warrants, certificats, options, CFD)", score: 5 },
    ],
  },
  {
    id: "ce-immobilier",
    section: "Connaissance et expérience des placements",
    dimension: "Investissement immobilier",
    question: "Quelle est votre expérience de l'investissement immobilier ?",
    options: [
      { label: "Aucune expérience préalable", score: 1 },
      { label: "Je possède (ou ai possédé) ma résidence principale", score: 2 },
      { label: "Je possède (ou ai possédé) une résidence secondaire", score: 3 },
      { label: "Je possède (ou ai possédé) un bien locatif", score: 4 },
      { label: "Je possède (ou ai possédé) des parts de SCPI", score: 4 },
    ],
  },
  {
    id: "ce-anciennete",
    section: "Connaissance et expérience des placements",
    dimension: "Ancienneté",
    question: "Depuis combien de temps faites-vous des placements ?",
    options: [
      { label: "Moins d'un an", score: 1 },
      { label: "De 1 à 5 ans", score: 3 },
      { label: "Plus de 5 ans", score: 5 },
    ],
  },
  {
    id: "ce-baisse-vecue",
    section: "Connaissance et expérience des placements",
    dimension: "Baisse déjà vécue",
    question: "Avez-vous déjà subi une très forte baisse de la valeur d'un placement ?",
    options: [
      { label: "Oui", score: 4 },
      { label: "Non", score: 2 },
    ],
  },
  {
    id: "ce-baisse-pct",
    section: "Connaissance et expérience des placements",
    dimension: "Ampleur de la baisse (%)",
    question: "Le cas échéant, quelle a été l'ampleur de cette baisse en pourcentage ?",
    helper: "Laissez en l'état si vous n'avez jamais subi de baisse significative.",
    options: [
      { label: "Sans objet", score: 3 },
      { label: "Moins de 15 %", score: 2 },
      { label: "Entre 15 % et 25 %", score: 3 },
      { label: "Entre 25 % et 50 %", score: 4 },
      { label: "Plus de 50 %", score: 5 },
    ],
  },
  {
    id: "ce-baisse-eur",
    section: "Connaissance et expérience des placements",
    dimension: "Ampleur de la baisse (€)",
    question: "Le cas échéant, quelle a été l'ampleur de cette baisse en euros ?",
    options: [
      { label: "Sans objet", score: 3 },
      { label: "Moins de 15 000 €", score: 2 },
      { label: "Entre 15 000 € et 50 000 €", score: 3 },
      { label: "Plus de 50 000 €", score: 5 },
    ],
  },
  {
    id: "ce-niveau",
    section: "Connaissance et expérience des placements",
    dimension: "Niveau d'investisseur",
    question: "Au final, vous vous définiriez comme un investisseur de niveau…",
    options: [
      { label: "Non professionnel débutant", score: 1 },
      { label: "Non professionnel confirmé (« investisseur averti »)", score: 3 },
      { label: "Professionnel", score: 5 },
    ],
  },

  // ═══════════ 3. COMPORTEMENT ET TOLÉRANCE AU RISQUE ═══════════
  {
    id: "ct-versements",
    section: "Comportement et tolérance au risque",
    dimension: "Versements réguliers",
    question: "Des versements réguliers dans votre placement sont-ils prévus ?",
    options: [
      { label: "Non", score: 2 },
      { label: "Oui, tous les mois", score: 3 },
      { label: "Oui, tous les trimestres", score: 3 },
      { label: "Oui, tous les ans", score: 3 },
    ],
  },
  {
    id: "ct-versement-montant",
    section: "Comportement et tolérance au risque",
    dimension: "Montant du versement",
    question: "Quel versement régulier envisagez-vous de réaliser ?",
    type: "number",
    numberConfig: { placeholder: "150", suffix: "€", min: 0, step: 50 },
  },
  {
    id: "ct-risque-mot",
    section: "Comportement et tolérance au risque",
    dimension: "Perception du risque",
    question: "Que signifie le mot « risque » pour vous ?",
    options: [
      { label: "Perte", score: 1 },
      { label: "Incertitude", score: 2 },
      { label: "Potentiel", score: 4 },
      { label: "Excitation", score: 5 },
    ],
  },
  {
    id: "ct-rapport",
    section: "Comportement et tolérance au risque",
    dimension: "Rapport rendement / risque",
    question:
      "Qu'est-ce qui vous décrit le mieux dans l'analyse du rapport risque / rendement d'un investissement ?",
    options: [
      { label: "Le potentiel de rendement est le facteur le plus important", score: 5 },
      { label: "Le potentiel de rendement doit correspondre au risque", score: 3 },
      { label: "Le risque est le facteur le plus important", score: 1 },
    ],
  },
  {
    id: "ct-emploi",
    section: "Comportement et tolérance au risque",
    dimension: "Mise en situation — emploi",
    question:
      "Vous obtenez un emploi dans une entreprise en pleine croissance. Lequel de ces choix retenez-vous ?",
    options: [
      { label: "Un contrat de travail de 5 ans", score: 1 },
      {
        label:
          "Un contrat d'un an renouvelable avec un bonus substantiel selon la performance",
        score: 3,
      },
      {
        label:
          "Un contrat d'un an renouvelable avec la possibilité d'utiliser votre bonus pour acheter des actions de la société",
        score: 5,
      },
    ],
  },
  {
    id: "ct-duree",
    section: "Comportement et tolérance au risque",
    dimension: "Durée de l'investissement",
    question: "Quelle est la durée prévue de votre investissement ?",
    options: [
      { label: "Moins de 4 ans", score: 1 },
      { label: "Entre 4 et 8 ans", score: 3 },
      { label: "Entre 8 et 15 ans", score: 4 },
      { label: "Plus de 15 ans", score: 5 },
    ],
  },
  {
    id: "ct-recup",
    section: "Comportement et tolérance au risque",
    dimension: "Récupération anticipée",
    question:
      "Quelle est la probabilité de devoir récupérer votre capital avant le terme prévu ?",
    options: [
      { label: "Nulle", score: 5 },
      { label: "Faible", score: 4 },
      { label: "Moyenne", score: 2 },
      { label: "Forte", score: 1 },
    ],
  },
  {
    id: "ct-part",
    section: "Comportement et tolérance au risque",
    dimension: "Part du patrimoine",
    question:
      "Quelle part de votre patrimoine global (hors résidence principale) envisagez-vous d'investir ?",
    options: [
      { label: "Moins de 10 %", score: 5 },
      { label: "De 10 à 25 %", score: 4 },
      { label: "De 25 à 50 %", score: 2 },
      { label: "Plus de 50 %", score: 1 },
    ],
  },
  {
    id: "ct-reaction",
    section: "Comportement et tolérance au risque",
    dimension: "Réaction à une chute",
    question: "Que feriez-vous si la valeur de votre investissement venait à chuter brutalement ?",
    options: [
      { label: "Je vends tout de suite", score: 1 },
      { label: "J'attends que ça remonte", score: 3 },
      { label: "Je réinvestis", score: 5 },
    ],
  },
  {
    id: "ct-variation",
    section: "Comportement et tolérance au risque",
    dimension: "Variation acceptée sur 1 an",
    question: "Quelle variation de votre capital accepteriez-vous sur une période d'un an ?",
    options: [
      { label: "De 0 à 3 %", score: 1 },
      { label: "De −5 % à +7 %", score: 2 },
      { label: "De −10 % à +12 %", score: 3 },
      { label: "De −20 % à +15 %", score: 4 },
      { label: "Un écart plus grand", score: 5 },
    ],
  },
  {
    id: "ct-portefeuille",
    section: "Comportement et tolérance au risque",
    dimension: "Portefeuille préféré",
    question:
      "Avec lequel de ces 4 portefeuilles hypothétiques seriez-vous le plus à l'aise ?",
    helper:
      "Du portefeuille A (le plus stable) au portefeuille D (le plus volatil).",
    options: [
      { label: "Portefeuille A — très stable, performance modeste", score: 1 },
      { label: "Portefeuille B — variations modérées, performance régulière", score: 3 },
      { label: "Portefeuille C — variations marquées, performance supérieure", score: 4 },
      { label: "Portefeuille D — fortes variations, performance potentiellement élevée", score: 5 },
    ],
  },
  {
    id: "ct-attente",
    section: "Comportement et tolérance au risque",
    dimension: "Patience face à une baisse",
    question:
      "Combien de temps seriez-vous prêt à attendre que vos placements regagnent leur valeur initiale ?",
    options: [
      { label: "Moins de 3 mois", score: 1 },
      { label: "De 3 à 6 mois", score: 2 },
      { label: "De 6 mois à 1 an", score: 3 },
      { label: "De 1 à 2 ans", score: 4 },
      { label: "Plus de 2 ans", score: 5 },
    ],
  },
];

export interface SriProfile {
  sri: number; // 1 → 7
  label: string;
  shortLabel: string;
  description: string;
  recommendations: string[];
  cautions: string[];
}

/**
 * Convertit le score moyen (1 → 5) en SRI (1 → 7)
 * en suivant la grille indicative AMF / PRIIPs.
 */
export function computeSri(answers: Record<string, number>): SriProfile {
  // On n'agrège que les réponses scorées (les saisies libres sont stockées
  // sous forme de NaN ou d'identifiants spécifiques côté UI ; on filtre
  // ici toute valeur non finie ou ≤ 0).
  const values = Object.entries(answers)
    .filter(([id]) => {
      const q = RISK_QUESTIONS.find((r) => r.id === id);
      return q && q.type !== "number";
    })
    .map(([, v]) => v)
    .filter((v) => Number.isFinite(v) && v > 0);
  if (values.length === 0) {
    return SRI_PROFILES[0];
  }
  const avg = values.reduce((s, v) => s + v, 0) / values.length;
  // Map [1..5] → [1..7] linéaire, arrondi
  const sri = Math.min(7, Math.max(1, Math.round(((avg - 1) / 4) * 6 + 1)));
  return SRI_PROFILES[sri - 1];
}

const SRI_PROFILES: SriProfile[] = [
  {
    sri: 1,
    shortLabel: "Très prudent",
    label: "Profil 1 — Sécuritaire",
    description:
      "Vous privilégiez avant tout la préservation du capital et n'acceptez quasiment aucune fluctuation. Le rendement attendu est limité, proche de l'inflation.",
    recommendations: [
      "Conservez une épargne de précaution liquide et garantie.",
      "Privilégiez un horizon court et des supports à capital protégé.",
      "Veillez à compenser l'érosion liée à l'inflation par une diversification douce.",
      "Réévaluez votre profil tous les 12 mois ou lors de tout changement de vie.",
    ],
    cautions: [
      "Le risque principal pour vous est la perte de pouvoir d'achat sur la durée.",
      "Évitez tout produit dont vous ne comprenez pas le fonctionnement.",
    ],
  },
  {
    sri: 2,
    shortLabel: "Prudent",
    label: "Profil 2 — Prudent",
    description:
      "Vous acceptez de très légères variations en échange d'un rendement supérieur à l'épargne réglementée. Votre horizon reste court à moyen.",
    recommendations: [
      "Privilégiez les supports à faible volatilité et bien diversifiés.",
      "Conservez une majorité de votre patrimoine financier sur des actifs peu risqués.",
      "Vérifiez l'adéquation des frais aux performances attendues.",
      "Prévoyez une révision annuelle avec votre conseiller.",
    ],
    cautions: [
      "Une concentration sur une seule classe d'actifs reste à éviter.",
      "Les performances passées ne préjugent pas des performances futures.",
    ],
  },
  {
    sri: 3,
    shortLabel: "Modéré",
    label: "Profil 3 — Modéré",
    description:
      "Vous recherchez un équilibre entre sécurité et performance. Vous comprenez que des fluctuations sont nécessaires pour battre l'inflation.",
    recommendations: [
      "Diversifiez sur plusieurs classes d'actifs (dette, immobilier, actions).",
      "Étalez vos investissements dans le temps pour lisser les points d'entrée.",
      "Conservez une réserve de liquidités pour saisir des opportunités.",
      "Documentez votre stratégie : objectifs, horizon, plafond de perte acceptée.",
    ],
    cautions: [
      "Restez vigilant aux frais et à la liquidité réelle des supports.",
      "Évitez les arbitrages dictés par l'émotion lors d'épisodes de stress.",
    ],
  },
  {
    sri: 4,
    shortLabel: "Équilibré",
    label: "Profil 4 — Équilibré",
    description:
      "Vous êtes prêt(e) à accepter des baisses temporaires significatives en échange d'une perspective de rendement supérieur sur le long terme.",
    recommendations: [
      "Adoptez une approche long terme : 8 ans et plus de préférence.",
      "Diversifiez géographiquement et sectoriellement.",
      "Programmez des revues semestrielles de votre allocation.",
      "Anticipez les contraintes fiscales (PEA, assurance-vie, PER selon objectifs).",
    ],
    cautions: [
      "Une perte temporaire de 15 à 25 % reste statistiquement plausible.",
      "Ne placez pas sur ce profil les sommes nécessaires à court terme.",
    ],
  },
  {
    sri: 5,
    shortLabel: "Dynamique",
    label: "Profil 5 — Dynamique",
    description:
      "Vous acceptez une part importante de risque pour viser une performance significative. Votre horizon est long et votre capacité financière confortable.",
    recommendations: [
      "Vérifiez régulièrement la cohérence entre risque pris et capacité réelle.",
      "Construisez une diversification robuste (cœur / satellite).",
      "Prévoyez une enveloppe défensive pour absorber les chocs.",
      "Encadrez vos décisions par une discipline écrite (règles d'arbitrage).",
    ],
    cautions: [
      "Des baisses de 25 à 35 % peuvent survenir sur de courtes périodes.",
      "Le rendement attendu n'est pas garanti, même sur le long terme.",
    ],
  },
  {
    sri: 6,
    shortLabel: "Offensif",
    label: "Profil 6 — Offensif",
    description:
      "Vous êtes très tolérant(e) au risque, avec une forte capacité financière et une connaissance avancée des marchés. La volatilité ne vous décourage pas.",
    recommendations: [
      "Travaillez avec un horizon supérieur à 10 ans.",
      "Documentez chaque position : thèse, scénario adverse, point de sortie.",
      "Conservez une part de votre patrimoine sur des supports défensifs.",
      "Faites valider la cohérence du profil par un conseiller indépendant.",
    ],
    cautions: [
      "Des pertes supérieures à 35 % sont possibles sur des marchés extrêmes.",
      "L'exposition à des produits complexes nécessite une compréhension fine.",
    ],
  },
  {
    sri: 7,
    shortLabel: "Spéculatif",
    label: "Profil 7 — Très offensif",
    description:
      "Vous recherchez la performance maximale et acceptez explicitement le risque de perte totale sur la part investie. Profil réservé à un patrimoine déjà solidement structuré.",
    recommendations: [
      "Limitez ce type d'investissement à une fraction marginale de votre patrimoine.",
      "Ne mobilisez que des sommes que vous pouvez perdre intégralement.",
      "Maintenez un cadre patrimonial principal sur des profils plus mesurés.",
      "Faites un point trimestriel pour maîtriser la dérive du portefeuille.",
    ],
    cautions: [
      "Le risque de perte en capital peut atteindre 100 % sur certaines lignes.",
      "Aucune recommandation d'allocation n'est délivrée sans étude approfondie.",
    ],
  },
];