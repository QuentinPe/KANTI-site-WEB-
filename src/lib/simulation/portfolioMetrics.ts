import type { Allocation, RiskProfile } from './simulationTypes';
import { RISK_PROFILES } from './riskProfiles';
import { ASSET_ASSUMPTIONS } from './assetAssumptions';

export function computeAnnualizedReturn(
  finalValue: number,
  initialValue: number,
  contributions: number,
  years: number
): number {
  if (years <= 0 || initialValue <= 0) return 0;
  // Simple CAGR approximation (ignores timing of contributions)
  const totalInvested = initialValue + contributions;
  if (totalInvested <= 0) return 0;
  return Math.pow(finalValue / totalInvested, 1 / years) - 1;
}

export function computeMaxDrawdown(trajectory: number[]): number {
  if (trajectory.length === 0) return 0;
  let peak = trajectory[0];
  let maxDD = 0;
  for (const value of trajectory) {
    if (value > peak) peak = value;
    const dd = peak > 0 ? (value - peak) / peak : 0;
    if (dd < maxDD) maxDD = dd;
  }
  return maxDD;
}

export function computeVolatility(returns: number[]): number {
  if (returns.length < 2) return 0;
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((acc, r) => acc + Math.pow(r - mean, 2), 0) / (returns.length - 1);
  return Math.sqrt(variance) * Math.sqrt(12); // annualize monthly vol
}

export function computeDiversificationScore(allocation: Allocation): number {
  // Based on Herfindahl-Hirschman Index (HHI) — lower HHI = more diversified
  const weights = Object.values(allocation).filter(w => w > 0);
  if (weights.length === 0) return 0;

  // Check category spread
  const categories = new Set<string>();
  for (const [assetId, weight] of Object.entries(allocation)) {
    if (weight > 0.01 && ASSET_ASSUMPTIONS[assetId]) {
      categories.add(ASSET_ASSUMPTIONS[assetId].category);
    }
  }

  const hhi = weights.reduce((acc, w) => acc + w * w, 0);
  const categoryScore = Math.min(categories.size / 5, 1); // max 5 categories
  const herfindahlScore = 1 - hhi; // 0 = concentrated, ~0.9 = very diversified
  const weightedScore = 0.6 * herfindahlScore + 0.4 * categoryScore;

  return Math.round(weightedScore * 100) / 100;
}

export function assessRiskAlignment(
  allocation: Allocation,
  profileId: RiskProfile
): 'cohérent' | 'légèrement supérieur' | 'trop élevé' | 'trop prudent' {
  // Compute weighted portfolio risk level
  let weightedRisk = 0;
  let totalWeight = 0;
  for (const [assetId, weight] of Object.entries(allocation)) {
    if (weight > 0 && ASSET_ASSUMPTIONS[assetId]) {
      weightedRisk += ASSET_ASSUMPTIONS[assetId].riskLevel * weight;
      totalWeight += weight;
    }
  }
  const portfolioRisk = totalWeight > 0 ? weightedRisk / totalWeight : 3;

  // Compare to profile baseline
  const profileRisks: Record<RiskProfile, number> = {
    'prudent': 2.0,
    'équilibré': 3.5,
    'dynamique': 5.5,
    'personnalisé': 4.0,
  };
  const baseline = profileRisks[profileId];
  const delta = portfolioRisk - baseline;

  if (Math.abs(delta) <= 0.5) return 'cohérent';
  if (delta > 1.5) return 'trop élevé';
  if (delta > 0.5) return 'légèrement supérieur';
  return 'trop prudent';
}

export function percentile(arr: number[], p: number): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}
