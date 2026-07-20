/**
 * MOTEUR DE CALCUL CRÉDIT — USAGE PÉDAGOGIQUE UNIQUEMENT.
 *
 * Les résultats présentés reposent sur des hypothèses et des données simulées.
 * Ils ne constituent pas une offre de prêt, une garantie de taux ou une
 * recommandation personnalisée.
 */

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface LoanParams {
  principal: number;       // loan amount in €
  annualRate: number;      // e.g. 0.038 for 3.8%
  durationMonths: number;  // e.g. 240 for 20 years
  insuranceRate: number;   // annual rate on initial capital e.g. 0.003
  deferredMonths?: number; // optional partial deferral
}

export interface MonthlyRow {
  month: number;
  payment: number;          // total monthly payment
  principal: number;        // capital repaid
  interest: number;         // interest portion
  insurance: number;        // insurance portion
  remainingCapital: number; // outstanding balance
}

export interface LoanResult {
  monthlyPayment: number;                // excl. insurance
  monthlyPaymentWithInsurance: number;
  monthlyInsurance: number;
  totalInterest: number;
  totalInsurance: number;
  totalCost: number;                     // interest + insurance
  schedule: MonthlyRow[];
}

export interface FundingPlan {
  propertyPrice: number;
  works: number;
  acquisitionFees: number;
  guarantee: number;
  brokerageFees: number;
  contribution: number;
}

export interface FundingPlanResult {
  totalCost: number;
  loanNeeded: number;
  remainingLiquidity: number;
}

export interface StressTest {
  rateIncrease: number;      // e.g. 0.01 = +1%
  incomeDecrease: number;    // e.g. 0.10 = -10%
  extraWorksAmount: number;  // €
}

// ─── Core formulas ────────────────────────────────────────────────────────────

/**
 * Standard annuity (constant monthly payment) formula.
 */
export function computeMonthlyPayment(
  principal: number,
  annualRate: number,
  months: number,
): number {
  if (annualRate === 0) return principal / months;
  const r = annualRate / 12;
  return (principal * (r * Math.pow(1 + r, months))) / (Math.pow(1 + r, months) - 1);
}

/**
 * Full amortization schedule with optional deferred period.
 */
export function computeAmortizationSchedule(params: LoanParams): LoanResult {
  const {
    principal,
    annualRate,
    durationMonths,
    insuranceRate,
    deferredMonths = 0,
  } = params;

  const monthlyPayment = computeMonthlyPayment(principal, annualRate, durationMonths);
  const monthlyInsurance = (principal * insuranceRate) / 12;
  const monthlyRate = annualRate / 12;

  const schedule: MonthlyRow[] = [];
  let remaining = principal;

  for (let m = 1; m <= durationMonths + deferredMonths; m++) {
    const interest = remaining * monthlyRate;
    const isDeferred = m <= deferredMonths;
    const principalPaid = isDeferred ? 0 : monthlyPayment - interest;
    remaining = Math.max(0, remaining - principalPaid);

    schedule.push({
      month: m,
      payment: isDeferred
        ? interest + monthlyInsurance
        : monthlyPayment + monthlyInsurance,
      principal: principalPaid,
      interest,
      insurance: monthlyInsurance,
      remainingCapital: remaining,
    });
  }

  const totalInterest = schedule.reduce((s, r) => s + r.interest, 0);
  const totalInsurance = schedule.reduce((s, r) => s + r.insurance, 0);

  return {
    monthlyPayment,
    monthlyPaymentWithInsurance: monthlyPayment + monthlyInsurance,
    monthlyInsurance,
    totalInterest,
    totalInsurance,
    totalCost: totalInterest + totalInsurance,
    schedule,
  };
}

/**
 * Funding plan: total project cost and loan needed.
 */
export function computeFundingPlan(plan: FundingPlan): FundingPlanResult {
  const totalCost =
    plan.propertyPrice +
    plan.works +
    plan.acquisitionFees +
    plan.guarantee +
    plan.brokerageFees;
  const loanNeeded = Math.max(0, totalCost - plan.contribution);
  const remainingLiquidity = plan.contribution; // simplified
  return { totalCost, loanNeeded, remainingLiquidity };
}

/**
 * Apply stress parameters to a base loan config.
 */
export function applyStressTest(base: LoanParams, stress: StressTest): LoanParams {
  return {
    ...base,
    annualRate: base.annualRate + stress.rateIncrease,
    principal: base.principal + stress.extraWorksAmount,
  };
}

/**
 * Estimate borrowing capacity given income, existing debts, rate and duration.
 * Uses 35% debt-to-income cap (HCSF recommendation).
 */
export function estimateBorrowingCapacity(
  monthlyNetIncome: number,
  existingMonthlyDebts: number,
  rate: number,
  months: number,
): number {
  const maxDebtRatio = 0.35;
  const availableForLoan =
    monthlyNetIncome * maxDebtRatio - existingMonthlyDebts;
  if (availableForLoan <= 0) return 0;
  const r = rate / 12;
  if (r === 0) return availableForLoan * months;
  return (
    (availableForLoan * (Math.pow(1 + r, months) - 1)) /
    (r * Math.pow(1 + r, months))
  );
}
