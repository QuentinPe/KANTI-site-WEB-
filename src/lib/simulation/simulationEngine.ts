/**
 * MOTEUR DE SIMULATION MONTE CARLO — USAGE PÉDAGOGIQUE UNIQUEMENT.
 *
 * Les résultats présentés reposent sur des hypothèses et des données simulées.
 * Ils ne constituent pas une prévision, une garantie de rendement ou une
 * recommandation personnalisée. La valeur des investissements peut évoluer
 * à la hausse comme à la baisse et un risque de perte en capital existe.
 * Les performances passées ne préjugent pas des performances futures.
 */
import type { SimulationParams, SimulationResult, SimulationEvent } from './simulationTypes';
import { ASSET_ASSUMPTIONS } from './assetAssumptions';
import { MACRO_SCENARIOS } from './macroScenarios';
import {
  computeMaxDrawdown,
  computeVolatility,
  computeAnnualizedReturn,
  computeDiversificationScore,
  assessRiskAlignment,
  percentile,
} from './portfolioMetrics';

// ─── Seeded PRNG (Mulberry32) ─────────────────────────────────────────────────
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Box-Muller transform for normal distribution
function gaussianRng(rand: () => number): () => number {
  let spare: number | null = null;
  return function () {
    if (spare !== null) {
      const val = spare;
      spare = null;
      return val;
    }
    let u, v, s: number;
    do {
      u = rand() * 2 - 1;
      v = rand() * 2 - 1;
      s = u * u + v * v;
    } while (s >= 1 || s === 0);
    const mul = Math.sqrt(-2 * Math.log(s) / s);
    spare = v * mul;
    return u * mul;
  };
}

// ─── Portfolio expected return & volatility ───────────────────────────────────
function computePortfolioParams(
  allocation: SimulationParams['allocation'],
  scenarioId?: string
): { mu: number; sigma: number } {
  const scenario = MACRO_SCENARIOS.find(s => s.id === (scenarioId ?? 'central'));
  let mu = 0;
  let sigmaSquared = 0;

  for (const [assetId, weight] of Object.entries(allocation)) {
    if (weight <= 0) continue;
    const asset = ASSET_ASSUMPTIONS[assetId];
    if (!asset) continue;

    const returnMod = scenario?.returnModifiers[assetId] ?? 0;
    const volMod = scenario?.volatilityModifiers[assetId] ?? 0;

    const assetReturn = asset.expectedReturn + returnMod - asset.fees;
    const assetVol = asset.volatility + volMod;

    mu += weight * assetReturn;
    sigmaSquared += weight * weight * assetVol * assetVol;
  }

  return { mu, sigma: Math.sqrt(sigmaSquared) };
}

// ─── Single trajectory simulation ─────────────────────────────────────────────
function simulateTrajectory(
  params: SimulationParams,
  gauss: () => number,
  mu: number,
  sigma: number
): number[] {
  const months = params.horizon * 12;
  const monthlyMu = mu / 12;
  const monthlySigma = sigma / Math.sqrt(12);
  const monthlyFees = (params.annualManagementFees || 0) / 12;
  const monthlyInflation = params.inflation / 12;

  let capital = params.initialCapital * (1 - params.entryFees);
  const trajectory: number[] = [capital];

  for (let m = 1; m <= months; m++) {
    // Monthly return with noise
    const monthlyReturn = monthlyMu - monthlyFees + monthlySigma * gauss();

    capital = capital * (1 + monthlyReturn);

    // Contributions / withdrawals
    const year = Math.floor(m / 12);
    const isWithdrawalPhase = params.withdrawalStart !== undefined && year >= params.withdrawalStart;

    if (isWithdrawalPhase && params.monthlyWithdrawal) {
      capital -= params.monthlyWithdrawal;
    } else {
      let contribution = params.monthlyContribution;
      if (params.indexedContributions) {
        contribution *= Math.pow(1 + monthlyInflation, m);
      }
      capital += contribution;
    }

    // Floor at 0
    capital = Math.max(0, capital);
    trajectory.push(capital);
  }

  return trajectory;
}

// ─── Main simulation function ─────────────────────────────────────────────────
export function runSimulation(params: SimulationParams): SimulationResult {
  const seed = params.seed ?? 42;
  const rand = mulberry32(seed);
  const gauss = gaussianRng(rand);

  const { mu, sigma } = computePortfolioParams(params.allocation, params.scenarioId);
  const months = params.horizon * 12;
  const numSims = params.numSimulations ?? 500;

  // Run all trajectories
  const allTrajectories: number[][] = [];
  for (let i = 0; i < numSims; i++) {
    allTrajectories.push(simulateTrajectory(params, gauss, mu, sigma));
  }

  // Compute percentiles at each month
  const p10: number[] = [];
  const p25: number[] = [];
  const p50: number[] = [];
  const p75: number[] = [];
  const p90: number[] = [];
  const investedCapital: number[] = [];
  const realMedian: number[] = [];

  const monthlyInflation = params.inflation / 12;

  for (let m = 0; m <= months; m++) {
    const valuesAtM = allTrajectories.map(t => t[m]);
    p10.push(percentile(valuesAtM, 10));
    p25.push(percentile(valuesAtM, 25));
    p50.push(percentile(valuesAtM, 50));
    p75.push(percentile(valuesAtM, 75));
    p90.push(percentile(valuesAtM, 90));

    // Cumulative invested capital
    let invested = params.initialCapital;
    for (let k = 1; k <= m; k++) {
      invested += params.monthlyContribution;
    }
    investedCapital.push(invested);

    // Real median (inflation-adjusted)
    const inflationFactor = Math.pow(1 + monthlyInflation, m);
    realMedian.push(p50[m] / inflationFactor);
  }

  // ─── Metrics ─────────────────────────────────────────────────────────────────
  const medianFinalValue = p50[months];
  const totalContributed = investedCapital[months];
  const realFinalValue = realMedian[months];

  const medianTrajectory = allTrajectories[Math.floor(numSims / 2)];
  const maxDrawdown = computeMaxDrawdown(medianTrajectory);

  // Monthly returns for vol computation
  const monthlyReturns: number[] = [];
  for (let m = 1; m <= months; m++) {
    const prev = medianTrajectory[m - 1];
    if (prev > 0) monthlyReturns.push((medianTrajectory[m] - prev) / prev);
  }
  const annualizedVolatility = computeVolatility(monthlyReturns);

  const medianAnnualizedReturn = computeAnnualizedReturn(
    medianFinalValue,
    params.initialCapital,
    totalContributed - params.initialCapital,
    params.horizon
  );

  const finalValues = allTrajectories.map(t => t[months]);
  const probabilityOfGain = finalValues.filter(v => v > totalContributed).length / numSims;
  const probabilityOfReachingTarget = params.targetAmount
    ? finalValues.filter(v => v >= params.targetAmount!).length / numSims
    : undefined;

  // Fees estimation
  const cumulativeFees = totalContributed * params.annualManagementFees * params.horizon;

  const diversificationScore = computeDiversificationScore(params.allocation);
  const riskProfileAlignment = assessRiskAlignment(params.allocation, 'équilibré');

  // Best/worst periods (annual)
  let bestReturn = -Infinity;
  let worstReturn = Infinity;
  let bestLabel = '';
  let worstLabel = '';

  for (let y = 0; y < params.horizon; y++) {
    const startM = y * 12;
    const endM = Math.min((y + 1) * 12, months);
    const startVal = medianTrajectory[startM];
    const endVal = medianTrajectory[endM];
    if (startVal > 0) {
      const ret = (endVal - startVal) / startVal;
      const label = `Année ${y + 1}`;
      if (ret > bestReturn) { bestReturn = ret; bestLabel = label; }
      if (ret < worstReturn) { worstReturn = ret; worstLabel = label; }
    }
  }

  // ─── Synthetic events ─────────────────────────────────────────────────────────
  const events: SimulationEvent[] = [];
  const horizonMonths = params.horizon * 12;

  if (horizonMonths >= 24) {
    events.push({
      month: 12,
      type: 'rebalancing',
      label: 'Premier rééquilibrage annuel',
      description: 'Réajustement de l\'allocation aux poids cibles après une année d\'évolution des marchés.',
    });
  }
  if (horizonMonths >= 60) {
    events.push({
      month: 36,
      type: 'review',
      label: 'Point d\'étape triennal',
      description: 'Révision approfondie de la stratégie : objectifs, profil de risque, fiscalité.',
    });
  }
  if (params.withdrawalStart) {
    events.push({
      month: params.withdrawalStart * 12,
      type: 'withdrawal',
      label: 'Début des retraits',
      description: `Démarrage des retraits mensuels de ${params.monthlyWithdrawal?.toLocaleString('fr-FR')} €.`,
    });
  }

  return {
    months,
    percentiles: { p10, p25, p50, p75, p90 },
    investedCapital,
    realMedian,
    metrics: {
      medianFinalValue,
      realFinalValue,
      totalContributed,
      medianAnnualizedReturn,
      annualizedVolatility,
      maxDrawdown,
      probabilityOfGain,
      probabilityOfReachingTarget,
      cumulativeFees,
      diversificationScore,
      riskProfileAlignment,
      bestPeriod: { label: bestLabel || 'Année 1', returnPct: isFinite(bestReturn) ? bestReturn : 0 },
      worstPeriod: { label: worstLabel || 'Année 1', returnPct: isFinite(worstReturn) ? worstReturn : 0 },
    },
    events,
  };
}

// Pre-computed result for illustrative preview sections
export function runIllustrativeSimulation(): SimulationResult {
  return runSimulation({
    initialCapital: 100000,
    monthlyContribution: 500,
    annualContribution: 6000,
    horizon: 15,
    allocation: {
      'fonds-euros': 0.20,
      'obligations-souveraines': 0.10,
      'obligations-entreprises': 0.15,
      'actions-monde': 0.25,
      'etf-diversifié': 0.15,
      'scpi': 0.10,
      'liquidités': 0.05,
    },
    entryFees: 0.01,
    annualManagementFees: 0.008,
    inflation: 0.02,
    rebalancingFrequency: 'quarterly',
    indexedContributions: false,
    numSimulations: 300,
    seed: 12345,
    scenarioId: 'central',
  });
}
