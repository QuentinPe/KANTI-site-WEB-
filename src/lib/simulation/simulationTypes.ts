export type RiskProfile = 'prudent' | 'équilibré' | 'dynamique' | 'personnalisé';

export type AssetClassId =
  | 'fonds-euros' | 'monétaire' | 'obligations-souveraines' | 'obligations-entreprises'
  | 'obligations-haut-rendement' | 'actions-france' | 'actions-europe' | 'actions-us'
  | 'actions-monde' | 'actions-émergentes' | 'etf-diversifié' | 'immobilier-coté'
  | 'scpi' | 'private-equity' | 'produits-structurés' | 'liquidités';

export interface AssetAssumption {
  id: AssetClassId;
  label: string;
  shortLabel: string;
  expectedReturn: number;
  volatility: number;
  ratesSensitivity: number;
  inflationSensitivity: number;
  growthSensitivity: number;
  creditSensitivity: number;
  liquidity: 'haute' | 'moyenne' | 'faible' | 'très faible';
  minHorizon: number;
  riskLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  fees: number;
  category: 'monetary' | 'bonds' | 'equities' | 'real-estate' | 'alternatives' | 'structured';
}

export interface Allocation {
  [assetClassId: string]: number;
}

export interface SimulationParams {
  initialCapital: number;
  monthlyContribution: number;
  annualContribution: number;
  horizon: number;
  allocation: Allocation;
  entryFees: number;
  annualManagementFees: number;
  inflation: number;
  rebalancingFrequency: 'monthly' | 'quarterly' | 'annual';
  indexedContributions: boolean;
  withdrawalStart?: number;
  monthlyWithdrawal?: number;
  targetAmount?: number;
  maxToleratedLoss?: number;
  numSimulations: number;
  seed?: number;
  scenarioId?: string;
}

export interface SimulationResult {
  months: number;
  percentiles: {
    p10: number[];
    p25: number[];
    p50: number[];
    p75: number[];
    p90: number[];
  };
  investedCapital: number[];
  realMedian: number[];
  metrics: PortfolioMetrics;
  events: SimulationEvent[];
}

export interface PortfolioMetrics {
  medianFinalValue: number;
  realFinalValue: number;
  totalContributed: number;
  medianAnnualizedReturn: number;
  annualizedVolatility: number;
  maxDrawdown: number;
  probabilityOfGain: number;
  probabilityOfReachingTarget?: number;
  cumulativeFees: number;
  diversificationScore: number;
  riskProfileAlignment: 'cohérent' | 'légèrement supérieur' | 'trop élevé' | 'trop prudent';
  bestPeriod: { label: string; returnPct: number };
  worstPeriod: { label: string; returnPct: number };
}

export interface SimulationEvent {
  month: number;
  type: string;
  label: string;
  description: string;
}

export interface MacroScenario {
  id: string;
  label: string;
  description: string;
  returnModifiers: Partial<Record<AssetClassId, number>>;
  volatilityModifiers: Partial<Record<AssetClassId, number>>;
}

export interface RiskProfileDefinition {
  id: RiskProfile;
  label: string;
  description: string;
  allocation: Allocation;
  expectedReturn: number;
  volatility: number;
  minHorizon: number;
  maxDrawdown: number;
  liquidityRatio: number;
  color: string;
}
