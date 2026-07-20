/**
 * SCÉNARIOS MACRO-ÉCONOMIQUES ILLUSTRATIFS.
 * Ces scénarios sont fictifs et ne constituent pas une prévision économique.
 */
import type { MacroScenario } from './simulationTypes';

export const MACRO_SCENARIOS: MacroScenario[] = [
  {
    id: 'central',
    label: 'Scénario central',
    description: 'Croissance modérée, inflation stabilisée autour de 2%, politique monétaire normalisée.',
    returnModifiers: {},
    volatilityModifiers: {},
  },
  {
    id: 'hausse-taux',
    label: 'Hausse des taux',
    description: 'Remontée marquée des taux directeurs. Impact négatif sur obligations longues, positif sur monétaire.',
    returnModifiers: {
      'obligations-souveraines': -0.03,
      'obligations-entreprises': -0.025,
      'immobilier-coté': -0.02,
      'scpi': -0.015,
      'monétaire': 0.02,
      'fonds-euros': 0.008,
    },
    volatilityModifiers: {
      'obligations-souveraines': 0.02,
      'obligations-entreprises': 0.015,
    },
  },
  {
    id: 'baisse-taux',
    label: 'Baisse des taux',
    description: 'Assouplissement monétaire prononcé. Bénéfique pour les obligations et l\'immobilier coté.',
    returnModifiers: {
      'obligations-souveraines': 0.03,
      'obligations-entreprises': 0.025,
      'immobilier-coté': 0.03,
      'scpi': 0.015,
      'monétaire': -0.015,
      'fonds-euros': -0.005,
      'actions-monde': 0.015,
    },
    volatilityModifiers: {
      'obligations-souveraines': -0.01,
    },
  },
  {
    id: 'inflation-persistante',
    label: 'Inflation persistante',
    description: 'Inflation structurelle au-dessus de 4%. Avantage aux actifs réels, pénalise les taux fixes.',
    returnModifiers: {
      'fonds-euros': -0.02,
      'obligations-souveraines': -0.04,
      'monétaire': 0.01,
      'scpi': 0.02,
      'immobilier-coté': 0.015,
      'actions-monde': 0.01,
      'actions-émergentes': 0.02,
    },
    volatilityModifiers: {
      'obligations-souveraines': 0.015,
      'obligations-entreprises': 0.01,
      'actions-monde': 0.02,
    },
  },
  {
    id: 'récession',
    label: 'Récession économique',
    description: 'Contraction de l\'activité, hausse du chômage, baisse des bénéfices. Impact négatif généralisé.',
    returnModifiers: {
      'actions-france': -0.04,
      'actions-europe': -0.04,
      'actions-us': -0.035,
      'actions-monde': -0.038,
      'actions-émergentes': -0.05,
      'obligations-haut-rendement': -0.04,
      'private-equity': -0.05,
      'obligations-souveraines': 0.02,
      'fonds-euros': 0.005,
    },
    volatilityModifiers: {
      'actions-monde': 0.05,
      'actions-émergentes': 0.07,
      'obligations-haut-rendement': 0.06,
      'private-equity': 0.08,
    },
  },
  {
    id: 'reprise',
    label: 'Phase de reprise',
    description: 'Rebond post-crise, soutien fiscal et monétaire, hausse des bénéfices. Favorable aux actifs risqués.',
    returnModifiers: {
      'actions-france': 0.04,
      'actions-europe': 0.04,
      'actions-us': 0.05,
      'actions-monde': 0.045,
      'actions-émergentes': 0.06,
      'obligations-haut-rendement': 0.03,
      'private-equity': 0.05,
      'etf-diversifié': 0.025,
    },
    volatilityModifiers: {
      'actions-monde': -0.02,
      'obligations-haut-rendement': -0.02,
    },
  },
  {
    id: 'choc-actions',
    label: 'Choc sur les marchés actions',
    description: 'Correction brutale des marchés actions (-30% en quelques mois), sans récession prolongée.',
    returnModifiers: {
      'actions-france': -0.06,
      'actions-europe': -0.06,
      'actions-us': -0.065,
      'actions-monde': -0.062,
      'actions-émergentes': -0.08,
      'etf-diversifié': -0.04,
      'immobilier-coté': -0.03,
      'obligations-souveraines': 0.025,
    },
    volatilityModifiers: {
      'actions-monde': 0.10,
      'actions-émergentes': 0.12,
      'etf-diversifié': 0.05,
    },
  },
  {
    id: 'crise-credit',
    label: 'Crise de crédit',
    description: 'Élargissement brutal des spreads. Pénalise le crédit et le high yield, vols refuge vers souverains.',
    returnModifiers: {
      'obligations-entreprises': -0.05,
      'obligations-haut-rendement': -0.08,
      'private-equity': -0.06,
      'produits-structurés': -0.04,
      'obligations-souveraines': 0.03,
      'monétaire': 0.01,
      'fonds-euros': 0.005,
    },
    volatilityModifiers: {
      'obligations-haut-rendement': 0.08,
      'obligations-entreprises': 0.05,
      'private-equity': 0.10,
    },
  },
];
