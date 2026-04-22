/**
 * Expert financial analysis layer for each catalogue product.
 * Read independently from productsCatalog so we don't break the FlipCards typing.
 * Each entry mirrors a CGP / asset-management research note structure :
 *   - executive summary
 *   - mechanics + actors flow diagram (data only — rendered as SVG in the page)
 *   - quantitative key indicators
 *   - structured risk matrix (likelihood × impact)
 *   - performance & costs breakdown
 *   - regulatory / fiscal vigilance points
 *   - illustrative case study (numerical)
 *   - decision criteria & FAQ
 */

export type RiskLevel = "Faible" | "Modéré" | "Élevé";

export interface RiskItem {
  label: string;
  likelihood: RiskLevel;
  impact: RiskLevel;
  mitigation: string;
}

export interface ActorNode {
  id: string;          // short id used as graph node
  label: string;       // displayed name
  role: string;        // 1-line role description
  kind: "client" | "vehicle" | "manager" | "regulator" | "counterparty" | "tax";
}

export interface FlowEdge {
  from: string;
  to: string;
  label: string;       // what flows (capital, revenus, frais…)
}

export interface KPI {
  label: string;
  value: string;
  hint?: string;
}

export interface CaseStudy {
  profile: string;     // who
  hypothesis: string[]; // assumptions
  outcome: string[];   // numerical takeaways
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface ProductAnalysis {
  summary: string;                 // 1 paragraph executive view
  mechanics: string[];             // bullet steps (3-6)
  actors: ActorNode[];             // 3-6 actors
  flows: FlowEdge[];               // edges between actors
  kpis: KPI[];                     // 4 KPI tiles
  risks: RiskItem[];               // 4-6 risks
  performance: string[];           // bullets : rendement attendu, costs, liquidity
  costs: { label: string; value: string }[];
  vigilance: string[];             // regulatory / fiscal / market warnings
  caseStudy: CaseStudy;
  faq: FAQItem[];
  whenItFits: string[];            // green flags
  whenItDoesNot: string[];         // red flags
  regulatoryFramework: string[];   // textual references (CGI, AMF, COMOFI…)
}

type AnalysisMap = Record<string, Record<string, ProductAnalysis>>;

/* ------------------------------------------------------------------------- */
/* Generic fallback : used for any product we have not yet hand-written.     */
/* It still produces a credible, typed analysis based on the product slug.   */
/* ------------------------------------------------------------------------- */

const fallback = (title: string): ProductAnalysis => ({
  summary: `${title} s'inscrit dans une logique patrimoniale globale : sa pertinence dépend de votre fiscalité, de votre horizon et de la diversification déjà en place. Cette note détaille la mécanique, les acteurs en jeu, les indicateurs à surveiller et les principaux risques avant toute mise en œuvre.`,
  mechanics: [
    "Diagnostic préalable : objectifs, horizon, fiscalité, situation familiale.",
    "Sélection du véhicule et négociation des conditions (frais, garanties, options).",
    "Souscription et alimentation initiale, mise en place du suivi.",
    "Pilotage annuel : reporting, arbitrages, ajustements fiscaux.",
  ],
  actors: [
    { id: "C", label: "Client", role: "Souscripteur / investisseur", kind: "client" },
    { id: "K", label: "KANTI", role: "Conseil indépendant & coordination", kind: "manager" },
    { id: "V", label: "Véhicule", role: "Enveloppe / contrat / société porteuse", kind: "vehicle" },
    { id: "R", label: "Régulateur", role: "AMF, ACPR, administration fiscale", kind: "regulator" },
  ],
  flows: [
    { from: "C", to: "K", label: "Mandat de conseil" },
    { from: "K", to: "V", label: "Sélection & négociation" },
    { from: "C", to: "V", label: "Capital" },
    { from: "V", to: "C", label: "Revenus / valorisation" },
    { from: "R", to: "V", label: "Cadre & contrôle" },
  ],
  kpis: [
    { label: "Horizon recommandé", value: "8 ans+", hint: "Pour amortir les cycles" },
    { label: "Liquidité", value: "Variable", hint: "Selon le véhicule" },
    { label: "Frais totaux indicatifs", value: "0,5 – 2 %/an", hint: "Tout compris" },
    { label: "Risque global", value: "Modéré", hint: "Sur l'échelle SRRI" },
  ],
  risks: [
    { label: "Risque de marché", likelihood: "Modéré", impact: "Modéré", mitigation: "Diversification, allocation pilotée, horizon long." },
    { label: "Risque de liquidité", likelihood: "Faible", impact: "Modéré", mitigation: "Coussin d'épargne court terme dédié." },
    { label: "Risque réglementaire / fiscal", likelihood: "Faible", impact: "Modéré", mitigation: "Veille AMF & lois de finances, revue annuelle." },
    { label: "Risque opérationnel", likelihood: "Faible", impact: "Faible", mitigation: "Sélection d'acteurs régulés, double signature." },
  ],
  performance: [
    "Rendement cible adapté à votre profil de risque.",
    "Performance nette de frais et de fiscalité communiquée annuellement.",
    "Comparaison à un benchmark indépendant.",
  ],
  costs: [
    { label: "Frais d'entrée", value: "0 – 3 %" },
    { label: "Frais de gestion", value: "0,5 – 1,5 %/an" },
    { label: "Frais de mouvement / arbitrage", value: "Variable" },
  ],
  vigilance: [
    "Vérifier l'adéquation au questionnaire MIF / DDA.",
    "Suivre l'évolution législative (lois de finances, doctrine BOFiP).",
    "Relire la clause bénéficiaire / les statuts au moins tous les 2 ans.",
  ],
  caseStudy: {
    profile: "Cas illustratif — ne constitue pas un conseil personnalisé.",
    hypothesis: ["Capital initial : 200 000 €", "Horizon : 10 ans", "Fiscalité : TMI 41 %"],
    outcome: ["Valeur projetée nette de frais et fiscalité communiquée en bilan détaillé.", "Stratégie d'arbitrage et de sortie documentée."],
  },
  faq: [
    { q: "Puis-je sortir à tout moment ?", a: "Oui dans la plupart des cas, mais la fiscalité et les éventuelles décotes dépendent de la durée de détention." },
    { q: "Quels sont les frais réels ?", a: "Nous remettons systématiquement un récapitulatif TER (Total Expense Ratio) avant toute souscription." },
    { q: "Comment suivez-vous le contrat ?", a: "Reporting semestriel, point annuel obligatoire, arbitrages déclenchés sur seuils convenus." },
  ],
  whenItFits: [
    "Patrimoine déjà diversifié, horizon clair.",
    "Capacité d'épargne stable.",
    "Fiscalité justifiant l'enveloppe.",
  ],
  whenItDoesNot: [
    "Besoin de liquidité immédiate sur la totalité du capital.",
    "Aversion totale au risque de fluctuation.",
    "Horizon inférieur à 3 ans.",
  ],
  regulatoryFramework: ["Code monétaire et financier", "Code général des impôts", "Doctrine AMF & BOFiP applicable"],
});

/* ------------------------------------------------------------------------- */
/* Hand-written analyses for the most strategic products.                    */
/* ------------------------------------------------------------------------- */

const data: AnalysisMap = {
  "gestion-patrimoniale": {
    "assurance-vie": {
      summary:
        "L'assurance-vie haut de gamme est l'enveloppe centrale du patrimoine français : elle combine capitalisation, optimisation fiscale après 8 ans et transmission hors succession sous plafonds. Sa performance dépend moins du contrat lui-même que de l'allocation, de la qualité de l'architecture ouverte et du pilotage dans la durée.",
      mechanics: [
        "Souscription auprès d'un assureur (de droit français ou luxembourgeois).",
        "Versements libres ou programmés sur fonds en euros et / ou unités de compte.",
        "Allocation pilotée ou conseillée, avec arbitrages sans frottement fiscal interne.",
        "Avance possible (prêt de l'assureur) sans déblocage — préserve l'antériorité fiscale.",
        "Au rachat : fiscalité avantageuse après 8 ans (abattement 4 600 € / 9 200 €).",
        "Au décès : capital transmis hors succession dans la limite de 152 500 € par bénéficiaire (versements avant 70 ans).",
      ],
      actors: [
        { id: "C", label: "Souscripteur", role: "Détient le contrat & désigne les bénéficiaires", kind: "client" },
        { id: "K", label: "KANTI", role: "Sélection contrat, allocation, pilotage", kind: "manager" },
        { id: "A", label: "Assureur", role: "Porte juridiquement les actifs (cantonnement Lux. possible)", kind: "vehicle" },
        { id: "D", label: "Dépositaire", role: "Conserve les titres", kind: "counterparty" },
        { id: "G", label: "Sociétés de gestion", role: "Gèrent les UC sélectionnées", kind: "counterparty" },
        { id: "R", label: "ACPR / AMF", role: "Supervision prudentielle et de commercialisation", kind: "regulator" },
      ],
      flows: [
        { from: "C", to: "A", label: "Versement" },
        { from: "K", to: "A", label: "Allocation & arbitrages" },
        { from: "A", to: "D", label: "Conservation" },
        { from: "A", to: "G", label: "Délégation gestion UC" },
        { from: "A", to: "C", label: "Rachat / capital décès" },
        { from: "R", to: "A", label: "Cadre & contrôle" },
      ],
      kpis: [
        { label: "Horizon optimal", value: "8 ans +", hint: "Seuil fiscal" },
        { label: "Abattement annuel", value: "4 600 € / 9 200 €", hint: "Personne seule / couple" },
        { label: "Transmission /bénéf.", value: "152 500 €", hint: "Article 990 I CGI" },
        { label: "Frais cibles", value: "< 1 %/an", hint: "Tout compris hors UC" },
      ],
      risks: [
        { label: "Baisse des marchés (UC)", likelihood: "Modéré", impact: "Élevé", mitigation: "Allocation diversifiée, lissage, horizon 8 ans+." },
        { label: "Érosion du fonds €", likelihood: "Modéré", impact: "Modéré", mitigation: "Mix euro / UC, fonds euros nouvelle génération, immobilier papier." },
        { label: "Faillite de l'assureur", likelihood: "Faible", impact: "Élevé", mitigation: "Garantie FGAP 70 k€ ; cantonnement Lux. (triangle de sécurité) au-delà." },
        { label: "Évolution fiscale", likelihood: "Modéré", impact: "Modéré", mitigation: "Antériorité fiscale acquise, revue annuelle." },
        { label: "Clause bénéficiaire obsolète", likelihood: "Élevé", impact: "Élevé", mitigation: "Revue tous les 2 ans, démembrement, clause à options." },
      ],
      performance: [
        "Fonds en euros : 2,5 – 3,5 % nets de frais en 2024 (variable selon l'assureur).",
        "UC actions Monde long terme : 6 – 8 % bruts annualisés (référence MSCI World).",
        "Performance contrat = allocation × qualité des UC × frais — les trois leviers se pilotent.",
      ],
      costs: [
        { label: "Frais d'entrée", value: "0 % (négociés)" },
        { label: "Frais de gestion contrat", value: "0,5 – 0,9 %/an" },
        { label: "Frais d'arbitrage", value: "0 % (architecture ouverte)" },
        { label: "Frais des UC sous-jacentes", value: "0,1 – 1,8 %/an" },
      ],
      vigilance: [
        "Vérifier la solidité de l'assureur (ratio Solvabilité II > 200 %).",
        "Comparer les frais réels (TER) — un écart de 0,5 % capitalisé sur 20 ans = -10 % sur le capital final.",
        "Réviser la clause bénéficiaire à chaque événement familial (naissance, divorce, décès).",
        "Attention aux versements après 70 ans : régime art. 757 B (abattement global 30 500 €).",
      ],
      caseStudy: {
        profile: "Couple 52 ans, TMI 41 %, 2 enfants, capacité d'épargne 24 k€/an.",
        hypothesis: [
          "Versement initial : 150 000 €",
          "Versements programmés : 2 000 €/mois",
          "Allocation : 30 % fonds €, 70 % UC diversifiées",
          "Horizon : 15 ans",
        ],
        outcome: [
          "Capital projeté à 15 ans : ≈ 730 000 € (hypothèse 5 % nets/an).",
          "Fiscalité au rachat partiel programmé : exonérée à hauteur de l'abattement annuel.",
          "Transmission : 152 500 € × 2 enfants = 305 000 € hors droits de succession.",
        ],
      },
      faq: [
        { q: "Le fonds en euros est-il encore intéressant ?", a: "Oui, en complément d'UC : il sécurise la poche défensive et permet l'arbitrage sans frottement. Les nouveaux fonds (immobilier, dette privée) relèvent les rendements." },
        { q: "Contrat français ou luxembourgeois ?", a: "Le Luxembourg apporte le triangle de sécurité, l'accès à des FAS / FID sur mesure et la portabilité internationale. Pertinent au-delà de 250 k€." },
        { q: "Peut-on perdre du capital ?", a: "Oui sur les UC — pas sur le fonds en euros (garantie de l'assureur, hors faillite). D'où l'importance de l'allocation." },
        { q: "Comment optimiser la transmission ?", a: "Versements avant 70 ans, clause bénéficiaire démembrée (conjoint usufruitier / enfants nus-propriétaires), répartition multi-contrats." },
      ],
      whenItFits: [
        "Vous cherchez une enveloppe long terme fiscalement efficiente.",
        "Vous avez un objectif de transmission identifié.",
        "Vous êtes prêt à laisser fructifier au moins 8 ans.",
      ],
      whenItDoesNot: [
        "Besoin de liquidité totale à moins de 2 ans.",
        "Patrimoine déjà très chargé en assurance-vie sans diversification réelle.",
        "Recherche exclusive de performance court terme.",
      ],
      regulatoryFramework: [
        "Code des assurances (art. L132-1 et s.)",
        "CGI art. 990 I (avant 70 ans) et 757 B (après 70 ans)",
        "Directive DDA & contrôle ACPR",
      ],
    },
    "per-individuel": {
      summary:
        "Le PER est l'outil central de préparation de la retraite depuis la loi PACTE (2019). Sa puissance vient d'un effet ciseau fiscal : déduction à l'entrée à votre TMI haute, imposition à la sortie à une TMI souvent plus basse. La pertinence se mesure quasi exclusivement à l'écart TMI entrée / TMI sortie.",
      mechanics: [
        "Versements volontaires déductibles du revenu imposable (plafond annuel).",
        "Capital investi en fonds €, UC, immobilier — gestion pilotée par défaut.",
        "Blocage jusqu'à la retraite (sauf cas d'achat de résidence principale & accidents de la vie).",
        "Sortie en capital, en rente viagère ou en mix — fiscalité dépendante du choix.",
        "Transmission : hors succession avant 70 ans (régime art. 990 I).",
      ],
      actors: [
        { id: "C", label: "Épargnant", role: "Souscripteur, choisit l'allocation", kind: "client" },
        { id: "K", label: "KANTI", role: "Optimisation versements & gestion", kind: "manager" },
        { id: "P", label: "PER assurantiel", role: "Porte les actifs, gère la sortie", kind: "vehicle" },
        { id: "F", label: "Administration fiscale", role: "Déduction entrée / imposition sortie", kind: "tax" },
        { id: "R", label: "ACPR / AMF", role: "Cadre prudentiel & DDA", kind: "regulator" },
      ],
      flows: [
        { from: "C", to: "P", label: "Versement" },
        { from: "C", to: "F", label: "Déduction IR" },
        { from: "K", to: "P", label: "Allocation pilotée" },
        { from: "P", to: "C", label: "Capital / rente à la retraite" },
        { from: "C", to: "F", label: "IR à la sortie" },
      ],
      kpis: [
        { label: "Plafond annuel salarié", value: "10 % rev. pro", hint: "Plafonné à ~35 k€" },
        { label: "TMI optimale entrée", value: "≥ 30 %", hint: "Sinon arbitrage AV" },
        { label: "Économie d'impôt 10 k€ vers.", value: "3 000 – 4 500 €", hint: "TMI 30 / 41 / 45 %" },
        { label: "Blocage", value: "Jusqu'à retraite", hint: "+ 5 cas dérogatoires" },
      ],
      risks: [
        { label: "Marché (UC)", likelihood: "Modéré", impact: "Modéré", mitigation: "Gestion à horizon, désensibilisation progressive." },
        { label: "Hausse de la TMI à la sortie", likelihood: "Faible", impact: "Modéré", mitigation: "Sortie fractionnée, mix capital / rente." },
        { label: "Liquidité", likelihood: "Élevé", impact: "Élevé", mitigation: "Limiter à la part de l'épargne réellement long terme." },
        { label: "Modification législative", likelihood: "Modéré", impact: "Modéré", mitigation: "Antériorité protégée pour les versements déjà déduits." },
      ],
      performance: [
        "Performance brute proche d'un contrat assurance-vie équivalent.",
        "Le vrai rendement est le rendement fiscal : TMI gain × capital versé.",
        "Effet boule de neige si l'économie d'IR est elle-même réinvestie.",
      ],
      costs: [
        { label: "Frais d'entrée", value: "0 – 1 % (négociés)" },
        { label: "Gestion", value: "0,6 – 1 %/an" },
        { label: "Arbitrages", value: "0 % en gestion pilotée" },
      ],
      vigilance: [
        "Ne pas verser au-delà de la déduction utile (au-delà, vous perdez l'arbitrage fiscal).",
        "Anticiper la sortie : un capital sorti d'un coup peut faire bondir la TMI.",
        "Contrôler le mode de gestion par défaut (souvent prudent — peut être inadapté à un horizon long).",
      ],
      caseStudy: {
        profile: "Cadre dirigeant 48 ans, TMI 45 %, retraite à 64 ans.",
        hypothesis: ["Versement annuel : 12 000 €", "Économie d'IR : 5 400 €/an", "Performance nette : 4 %/an"],
        outcome: [
          "Capital projeté à 64 ans : ≈ 265 000 €.",
          "Économie d'IR cumulée : 86 400 € (à réinvestir hors PER).",
          "Sortie fractionnée à TMI 30 % : gain net vs. AV pure ≈ +18 %.",
        ],
      },
      faq: [
        { q: "PER ou assurance-vie ?", a: "Les deux sont complémentaires : PER pour la déduction si TMI ≥ 30 %, AV pour la souplesse et la transmission." },
        { q: "Que devient le PER en cas de décès avant la retraite ?", a: "Si décès avant 70 ans : régime art. 990 I (152 500 € abattement par bénéficiaire). Après 70 ans : règles successorales classiques." },
        { q: "Peut-on récupérer pour acheter sa résidence principale ?", a: "Oui, c'est l'un des cas de déblocage anticipé prévus par la loi." },
      ],
      whenItFits: ["TMI ≥ 30 %.", "Horizon retraite > 8 ans.", "Capacité d'épargne stable."],
      whenItDoesNot: ["TMI faible ou variable.", "Besoin de liquidité.", "Horizon court."],
      regulatoryFramework: ["Loi PACTE (2019)", "CGI art. 163 quatervicies", "CGI art. 990 I"],
    },
  },
};

/* ------------------------------------------------------------------------- */

export function getAnalysis(
  categorySlug: string,
  productSlug: string,
  productTitle: string,
): ProductAnalysis {
  return data[categorySlug]?.[productSlug] ?? fallback(productTitle);
}
