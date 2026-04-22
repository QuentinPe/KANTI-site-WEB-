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
  // === Connaissance ===
  {
    id: "knowledge-products",
    dimension: "Connaissance",
    question:
      "Quel est votre niveau de connaissance des produits financiers (actions, obligations, OPCVM, SCPI, produits structurés) ?",
    options: [
      { label: "Aucune connaissance — je découvre", score: 1 },
      { label: "Notions générales acquises par lecture / presse", score: 2 },
      { label: "Bonne compréhension des grandes classes d'actifs", score: 3 },
      { label: "Maîtrise opérationnelle (rendement, volatilité, frais)", score: 4 },
      { label: "Expert — je suis ces marchés au quotidien", score: 5 },
    ],
  },
  {
    id: "knowledge-volatility",
    dimension: "Connaissance",
    question:
      "Que signifie pour vous la « volatilité » d'un placement ?",
    options: [
      { label: "Je ne sais pas", score: 1 },
      { label: "Une notion vague de variation", score: 2 },
      { label: "L'amplitude de hausse et de baisse d'un actif", score: 3 },
      { label: "Une mesure statistique (écart-type) du risque", score: 4 },
      { label: "Une donnée que j'utilise pour arbitrer", score: 5 },
    ],
  },
  // === Expérience ===
  {
    id: "experience-products",
    dimension: "Expérience",
    question:
      "Avez-vous déjà investi sur les marchés financiers (hors livrets) ?",
    options: [
      { label: "Jamais", score: 1 },
      { label: "Uniquement des fonds euros / assurance-vie sécurisée", score: 2 },
      { label: "Quelques unités de compte ou SCPI", score: 3 },
      { label: "Portefeuille diversifié actions / obligations", score: 4 },
      { label: "Produits complexes (structurés, dérivés, private equity)", score: 5 },
    ],
  },
  {
    id: "experience-frequency",
    dimension: "Expérience",
    question:
      "À quelle fréquence réalisez-vous des opérations d'investissement ?",
    options: [
      { label: "Jamais", score: 1 },
      { label: "Moins d'une fois par an", score: 2 },
      { label: "1 à 4 fois par an", score: 3 },
      { label: "Plusieurs fois par mois", score: 4 },
      { label: "Hebdomadaire ou plus", score: 5 },
    ],
  },
  // === Situation financière ===
  {
    id: "situation-savings",
    dimension: "Situation financière",
    question:
      "Disposez-vous d'une épargne de précaution (au moins 3 à 6 mois de revenus) immédiatement disponible ?",
    options: [
      { label: "Non, pas du tout", score: 1 },
      { label: "Partiellement (moins de 3 mois)", score: 2 },
      { label: "Oui, environ 3 à 6 mois", score: 3 },
      { label: "Oui, plus de 6 mois", score: 4 },
      { label: "Oui, très largement (> 12 mois)", score: 5 },
    ],
  },
  {
    id: "situation-stability",
    dimension: "Situation financière",
    question:
      "Comment qualifieriez-vous la stabilité de vos revenus à moyen terme ?",
    options: [
      { label: "Très incertaine", score: 1 },
      { label: "Variable", score: 2 },
      { label: "Plutôt stable", score: 3 },
      { label: "Stable et récurrente", score: 4 },
      { label: "Très élevée et croissante", score: 5 },
    ],
  },
  {
    id: "situation-share",
    dimension: "Situation financière",
    question:
      "Quelle part de votre patrimoine global envisagez-vous d'investir sur ce projet ?",
    options: [
      { label: "Plus de 75 %", score: 1 },
      { label: "Entre 50 % et 75 %", score: 2 },
      { label: "Entre 25 % et 50 %", score: 3 },
      { label: "Entre 10 % et 25 %", score: 4 },
      { label: "Moins de 10 %", score: 5 },
    ],
  },
  // === Objectifs ===
  {
    id: "objective-horizon",
    dimension: "Objectifs",
    question: "Quel est votre horizon d'investissement principal ?",
    options: [
      { label: "Moins de 2 ans", score: 1 },
      { label: "2 à 5 ans", score: 2 },
      { label: "5 à 8 ans", score: 3 },
      { label: "8 à 12 ans", score: 4 },
      { label: "Plus de 12 ans", score: 5 },
    ],
  },
  {
    id: "objective-goal",
    dimension: "Objectifs",
    question: "Quel est l'objectif principal de votre investissement ?",
    options: [
      { label: "Préserver le capital quoi qu'il arrive", score: 1 },
      { label: "Générer un revenu régulier et stable", score: 2 },
      { label: "Faire croître mon capital de façon mesurée", score: 3 },
      { label: "Maximiser la performance long terme", score: 4 },
      { label: "Recherche de surperformance (capital risque accepté)", score: 5 },
    ],
  },
  // === Tolérance ===
  {
    id: "tolerance-loss",
    dimension: "Tolérance au risque",
    question:
      "Quelle perte temporaire annuelle maximale seriez-vous prêt(e) à accepter ?",
    helper:
      "Une diversification ne supprime pas le risque de perte en capital.",
    options: [
      { label: "Aucune perte tolérée", score: 1 },
      { label: "Jusqu'à 5 %", score: 2 },
      { label: "Jusqu'à 15 %", score: 3 },
      { label: "Jusqu'à 30 %", score: 4 },
      { label: "Plus de 30 %", score: 5 },
    ],
  },
  {
    id: "tolerance-reaction",
    dimension: "Tolérance au risque",
    question:
      "Si votre portefeuille perdait 20 % en quelques semaines, votre réaction serait :",
    options: [
      { label: "Vendre immédiatement pour limiter les pertes", score: 1 },
      { label: "Vendre une partie par sécurité", score: 2 },
      { label: "Ne rien faire et attendre la reprise", score: 3 },
      { label: "Conserver et arbitrer si nécessaire", score: 4 },
      { label: "Renforcer pour profiter du repli", score: 5 },
    ],
  },
  {
    id: "tolerance-tradeoff",
    dimension: "Tolérance au risque",
    question:
      "Quel couple rendement / risque vous correspond le mieux ?",
    options: [
      { label: "+1 % par an, perte maximale ~0 %", score: 1 },
      { label: "+3 % par an, perte maximale ~5 %", score: 2 },
      { label: "+5 % par an, perte maximale ~15 %", score: 3 },
      { label: "+7 % par an, perte maximale ~25 %", score: 4 },
      { label: "+10 % par an, perte maximale > 30 %", score: 5 },
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
  const values = Object.values(answers);
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