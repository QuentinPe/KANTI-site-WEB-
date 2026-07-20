import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, ArrowRight,
  Info, AlertTriangle, ChevronDown,
} from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectionChart from '@/components/gestion/ProjectionChart';

import { runSimulation } from '@/lib/simulation/simulationEngine';
import { RISK_PROFILES } from '@/lib/simulation/riskProfiles';
import { ASSET_ASSUMPTIONS } from '@/lib/simulation/assetAssumptions';
import { MACRO_SCENARIOS } from '@/lib/simulation/macroScenarios';
import type { SimulationResult, RiskProfile, Allocation } from '@/lib/simulation/simulationTypes';

// ─── Zod schema ───────────────────────────────────────────────────────────────
const simSchema = z.object({
  initialCapital: z.number().min(1000, 'Minimum 1 000 €').max(100_000_000),
  monthlyContribution: z.number().min(0).max(100_000),
  horizon: z.number().min(1).max(50),
  age: z.number().min(18).max(80),
  objectif: z.string().min(1),
  profile: z.enum(['prudent', 'équilibré', 'dynamique', 'personnalisé'] as const),
  envelopes: z.array(z.string()),
  entryFees: z.number().min(0).max(0.05),
  annualManagementFees: z.number().min(0).max(0.03),
  inflation: z.number().min(0).max(0.1),
  rebalancingFrequency: z.enum(['monthly', 'quarterly', 'annual'] as const),
  indexedContributions: z.boolean(),
  targetAmount: z.number().optional(),
  scenarioId: z.string(),
});

type SimForm = z.infer<typeof simSchema>;

// ─── Asset class IDs we show sliders for ─────────────────────────────────────
const SLIDER_ASSETS = [
  'fonds-euros', 'monétaire', 'obligations-souveraines', 'obligations-entreprises',
  'obligations-haut-rendement', 'actions-france', 'actions-europe', 'actions-us',
  'actions-monde', 'actions-émergentes', 'etf-diversifié', 'immobilier-coté',
  'scpi', 'private-equity', 'liquidités',
] as const;

const ENVELOPE_OPTIONS = [
  { id: 'av', label: 'Assurance-vie' },
  { id: 'pea', label: 'PEA' },
  { id: 'cto', label: 'Compte-titres (CTO)' },
  { id: 'per', label: 'PER individuel' },
  { id: 'scpi-direct', label: 'SCPI en direct' },
  { id: 'pe', label: 'Private equity' },
];

// ─── Steps ────────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Situation', description: 'Capital & horizon' },
  { id: 2, label: 'Profil', description: 'Profil de risque' },
  { id: 3, label: 'Enveloppes', description: 'Supports juridiques' },
  { id: 4, label: 'Allocation', description: 'Répartition par actif' },
  { id: 5, label: 'Paramètres', description: 'Options avancées' },
];

function formatEur(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)} M€`;
  if (v >= 1_000) return `${Math.round(v / 1000)} k€`;
  return `${v.toFixed(0)} €`;
}

function formatPct(v: number) {
  return `${(v * 100).toFixed(1)} %`;
}

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`flex flex-col items-center ${i < total - 1 ? 'mr-0' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                step.id === current
                  ? 'border-foreground bg-foreground text-white'
                  : step.id < current
                  ? 'border-foreground/40 bg-foreground/10 text-foreground/60'
                  : 'border-foreground/15 text-foreground/30'
              }`}
            >
              {step.id}
            </div>
            <span
              className={`text-[9px] tracking-wide mt-1.5 hidden sm:block uppercase ${
                step.id === current ? 'text-foreground font-medium' : 'text-foreground/35'
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`h-px flex-1 w-8 md:w-12 mx-2 transition-all duration-300 ${
                step.id < current ? 'bg-foreground/30' : 'bg-foreground/10'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Simulation metrics panel ─────────────────────────────────────────────────
function SimulationMetrics({ result }: { result: SimulationResult }) {
  const m = result.metrics;
  const metrics = [
    { label: 'Valeur médiane finale', value: formatEur(m.medianFinalValue) },
    { label: 'Valeur réelle (hors inflation)', value: formatEur(m.realFinalValue) },
    { label: 'Capital total investi', value: formatEur(m.totalContributed) },
    { label: 'Rendement annualisé médian', value: formatPct(m.medianAnnualizedReturn) },
    { label: 'Volatilité annualisée', value: formatPct(m.annualizedVolatility) },
    { label: 'Drawdown maximum', value: formatPct(m.maxDrawdown) },
    { label: 'Probabilité de gain', value: `${Math.round(m.probabilityOfGain * 100)} %` },
    { label: 'Score de diversification', value: `${Math.round(m.diversificationScore * 100)}/100` },
    { label: 'Frais cumulés estimés', value: formatEur(m.cumulativeFees) },
    { label: 'Cohérence profil', value: m.riskProfileAlignment },
  ];

  return (
    <div className="rounded-2xl border border-foreground/8 bg-white p-5">
      <p className="text-[10px] tracking-widest uppercase text-foreground/40 mb-4">Métriques clés</p>
      <div className="grid grid-cols-2 gap-3">
        {metrics.map(metric => (
          <div key={metric.label} className="bg-background/60 rounded-xl p-3">
            <p className="text-[10px] text-foreground/40 mb-1 leading-tight">{metric.label}</p>
            <p className="text-sm font-medium text-foreground/80">{metric.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-foreground/6 grid grid-cols-2 gap-3">
        <div className="bg-background/60 rounded-xl p-3">
          <p className="text-[10px] text-foreground/40 mb-1">Meilleure période</p>
          <p className="text-xs font-medium text-foreground/70">{m.bestPeriod.label}</p>
          <p className="text-sm font-medium text-emerald-600">{formatPct(m.bestPeriod.returnPct)}</p>
        </div>
        <div className="bg-background/60 rounded-xl p-3">
          <p className="text-[10px] text-foreground/40 mb-1">Pire période</p>
          <p className="text-xs font-medium text-foreground/70">{m.worstPeriod.label}</p>
          <p className="text-sm font-medium text-red-600">{formatPct(m.worstPeriod.returnPct)}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Assumptions table ────────────────────────────────────────────────────────
function AssumptionsPanel({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <div className="rounded-2xl border border-foreground/8 bg-white overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-foreground/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-foreground/40" />
          <span className="text-sm font-medium text-foreground/70">Hypothèses de simulation</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-foreground/35 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-foreground/6">
              <p className="text-xs italic text-foreground/40 my-3">
                Les données suivantes sont des hypothèses illustratives et pédagogiques. Elles ne constituent pas une prévision.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] min-w-[400px]">
                  <thead>
                    <tr className="border-b border-foreground/6">
                      <th className="text-left py-2 pr-3 text-foreground/40 font-medium">Actif</th>
                      <th className="text-right py-2 px-2 text-foreground/40 font-medium">Rdmt esp.</th>
                      <th className="text-right py-2 px-2 text-foreground/40 font-medium">Volatilité</th>
                      <th className="text-right py-2 px-2 text-foreground/40 font-medium">Frais</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SLIDER_ASSETS.map(id => {
                      const a = ASSET_ASSUMPTIONS[id];
                      return (
                        <tr key={id} className="border-b border-foreground/4">
                          <td className="py-1.5 pr-3 text-foreground/65">{a.shortLabel}</td>
                          <td className="py-1.5 px-2 text-right text-foreground/60">{(a.expectedReturn * 100).toFixed(1)} %</td>
                          <td className="py-1.5 px-2 text-right text-foreground/60">{(a.volatility * 100).toFixed(1)} %</td>
                          <td className="py-1.5 px-2 text-right text-foreground/60">{(a.fees * 100).toFixed(2)} %</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Scenario comparator ──────────────────────────────────────────────────────
function ScenarioComparator({
  baseParams,
  horizon,
}: {
  baseParams: Parameters<typeof runSimulation>[0];
  horizon: number;
}) {
  const scenarios = useMemo(() => {
    const ids = ['central', 'hausse-taux', 'récession'];
    return ids.map(id => {
      const result = runSimulation({ ...baseParams, scenarioId: id, numSimulations: 100 });
      const scenario = MACRO_SCENARIOS.find(s => s.id === id);
      return { id, label: scenario?.label ?? id, result };
    });
  }, [baseParams]);

  return (
    <div className="rounded-2xl border border-foreground/8 bg-white p-5">
      <p className="text-[10px] tracking-widest uppercase text-foreground/40 mb-4">Comparaison de scénarios</p>
      <div className="grid grid-cols-3 gap-3">
        {scenarios.map(s => (
          <div key={s.id} className="bg-background/60 rounded-xl p-3 text-center">
            <p className="text-[10px] font-medium text-foreground/50 mb-2 leading-tight">{s.label}</p>
            <p className="text-lg font-heading font-light text-foreground">{formatEur(s.result.metrics.medianFinalValue)}</p>
            <p className="text-[10px] text-foreground/40 mt-1">médiane à {horizon} ans</p>
          </div>
        ))}
      </div>
      <p className="text-[10px] italic text-foreground/30 mt-3">Données illustratives — scénarios de démonstration</p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SimulateurPatrimonialPage() {
  const [searchParams] = useSearchParams();
  const reduce = useReducedMotion();
  const [step, setStep] = useState(1);
  const [showAssumptions, setShowAssumptions] = useState(false);

  // Allocation state (separate from form)
  const [allocation, setAllocation] = useState<Record<string, number>>(() => {
    const urlProfile = searchParams.get('profil') as RiskProfile | null;
    const profileId: RiskProfile = urlProfile && RISK_PROFILES[urlProfile] ? urlProfile : 'équilibré';
    return { ...RISK_PROFILES[profileId].allocation };
  });

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [allocationError, setAllocationError] = useState('');

  const defaultProfile = (searchParams.get('profil') as RiskProfile) ?? 'équilibré';

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<SimForm>({
    resolver: zodResolver(simSchema),
    defaultValues: {
      initialCapital: 100000,
      monthlyContribution: 500,
      horizon: 15,
      age: 45,
      objectif: 'capital',
      profile: defaultProfile,
      envelopes: ['av', 'pea'],
      entryFees: 0.01,
      annualManagementFees: 0.008,
      inflation: 0.02,
      rebalancingFrequency: 'quarterly',
      indexedContributions: false,
      scenarioId: 'central',
    },
  });

  const watchedProfile = watch('profile');
  const watchedValues = watch();

  // Sync profile → allocation
  useEffect(() => {
    const prof = RISK_PROFILES[watchedProfile];
    if (prof) {
      setAllocation({ ...prof.allocation });
    }
  }, [watchedProfile]);

  // Build simulation params
  const buildParams = useCallback((): Parameters<typeof runSimulation>[0] => ({
    initialCapital: watchedValues.initialCapital,
    monthlyContribution: watchedValues.monthlyContribution,
    annualContribution: watchedValues.monthlyContribution * 12,
    horizon: watchedValues.horizon,
    allocation: allocation as Allocation,
    entryFees: watchedValues.entryFees,
    annualManagementFees: watchedValues.annualManagementFees,
    inflation: watchedValues.inflation,
    rebalancingFrequency: watchedValues.rebalancingFrequency,
    indexedContributions: watchedValues.indexedContributions,
    targetAmount: watchedValues.targetAmount,
    numSimulations: 300,
    seed: 42,
    scenarioId: watchedValues.scenarioId,
  }), [watchedValues, allocation]);

  // Run simulation
  const runSim = useCallback(() => {
    const total = Object.values(allocation).reduce((a, b) => a + b, 0);
    if (Math.abs(total - 1) > 0.02) {
      setAllocationError(`L'allocation doit totaliser 100 % (actuellement ${(total * 100).toFixed(1)} %)`);
      return;
    }
    setAllocationError('');
    try {
      const params = buildParams();
      const res = runSimulation(params);
      setResult(res);
    } catch (e) {
      console.error(e);
    }
  }, [allocation, buildParams]);

  // Auto-run on first mount
  useEffect(() => {
    runSim();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalAllocation = Object.values(allocation).reduce((a, b) => a + b, 0);
  const allocationValid = Math.abs(totalAllocation - 1) < 0.02;

  function handleAllocationChange(id: string, rawValue: number) {
    const val = Math.max(0, Math.min(1, rawValue));
    setAllocation(prev => ({ ...prev, [id]: Math.round(val * 100) / 100 }));
  }

  const horizon = watch('horizon');

  return (
    <>
      <Header />

      {/* Hero compact */}
      <section className="pt-28 pb-10 px-4" style={{ background: 'hsl(220 30% 97%)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/40 mb-4 font-medium">
            Outil pédagogique — données simulées
          </p>
          <h1 className="text-3xl md:text-5xl font-heading font-light text-foreground leading-tight tracking-tight mb-4 max-w-2xl">
            Simulateur de stratégie patrimoniale
          </h1>
          <p className="text-foreground/60 font-light text-base max-w-xl mb-6">
            Explorez l'impact de différentes allocations, horizons et scénarios de marché sur la projection de votre capital. Outil illustratif uniquement.
          </p>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-2xl mb-6">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              Les résultats présentés reposent sur des hypothèses et des données simulées. Ils ne constituent pas une prévision, une garantie de rendement ou une recommandation personnalisée. La valeur des investissements peut évoluer à la hausse comme à la baisse et un risque de perte en capital existe.
            </p>
          </div>

          <Link
            to="/profil-de-risque"
            className="inline-flex items-center gap-2 text-sm text-foreground/55 hover:text-foreground transition-colors"
          >
            Déterminer mon profil de risque d'abord
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Main simulator */}
      <section className="pb-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left: form */}
            <div className="lg:col-span-6 xl:col-span-5">
              <div className="rounded-2xl border border-foreground/8 bg-white p-6 md:p-8 sticky top-24">
                <StepIndicator current={step} total={STEPS.length} />

                <form onSubmit={handleSubmit(runSim)} noValidate>
                  <AnimatePresence mode="wait">
                    {/* Step 1: Situation */}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={reduce ? false : { opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-5"
                      >
                        <div>
                          <h2 className="font-heading text-2xl font-light text-foreground mb-1">Votre situation</h2>
                          <p className="text-sm text-foreground/50 font-light">Capital initial, versements et horizon de placement.</p>
                        </div>

                        <div>
                          <label className="block text-xs text-foreground/55 mb-1.5 tracking-wide">Capital initial (€)</label>
                          <input
                            type="number"
                            {...register('initialCapital', { valueAsNumber: true })}
                            className="w-full border border-foreground/12 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/15 bg-background/50"
                          />
                          {errors.initialCapital && (
                            <p className="text-xs text-red-500 mt-1">{errors.initialCapital.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs text-foreground/55 mb-1.5 tracking-wide">Versement mensuel (€)</label>
                          <input
                            type="number"
                            {...register('monthlyContribution', { valueAsNumber: true })}
                            className="w-full border border-foreground/12 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/15 bg-background/50"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-foreground/55 mb-1.5 tracking-wide">
                            Horizon de placement : {horizon} ans
                          </label>
                          <input
                            type="range"
                            min={1} max={40} step={1}
                            {...register('horizon', { valueAsNumber: true })}
                            className="w-full accent-foreground"
                          />
                          <div className="flex justify-between text-[10px] text-foreground/30 mt-1">
                            <span>1 an</span><span>40 ans</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-foreground/55 mb-1.5 tracking-wide">Âge actuel</label>
                            <input
                              type="number"
                              {...register('age', { valueAsNumber: true })}
                              className="w-full border border-foreground/12 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/15 bg-background/50"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-foreground/55 mb-1.5 tracking-wide">Objectif</label>
                            <select
                              {...register('objectif')}
                              className="w-full border border-foreground/12 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/15 bg-background/50"
                            >
                              <option value="capital">Constituer un capital</option>
                              <option value="retraite">Préparer la retraite</option>
                              <option value="revenus">Revenus complémentaires</option>
                              <option value="transmission">Transmission</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-foreground/55 mb-1.5 tracking-wide">Objectif de capital cible (optionnel, €)</label>
                          <input
                            type="number"
                            {...register('targetAmount', { valueAsNumber: true, setValueAs: v => v === '' || isNaN(v) ? undefined : Number(v) })}
                            placeholder="Ex. 500 000"
                            className="w-full border border-foreground/12 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/15 bg-background/50"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Profile */}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={reduce ? false : { opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4"
                      >
                        <div>
                          <h2 className="font-heading text-2xl font-light text-foreground mb-1">Profil de risque</h2>
                          <p className="text-sm text-foreground/50 font-light">Sélectionnez un profil. L'allocation de l'étape 4 sera pré-remplie.</p>
                        </div>

                        <Controller
                          name="profile"
                          control={control}
                          render={({ field }) => (
                            <div className="space-y-3">
                              {(['prudent', 'équilibré', 'dynamique'] as const).map(pid => {
                                const prof = RISK_PROFILES[pid];
                                return (
                                  <button
                                    key={pid}
                                    type="button"
                                    onClick={() => field.onChange(pid)}
                                    className={`w-full text-left rounded-xl border p-4 transition-all duration-200 ${
                                      field.value === pid
                                        ? 'border-foreground/30 bg-foreground/[0.03]'
                                        : 'border-foreground/8 hover:border-foreground/15'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-medium text-sm text-foreground">{prof.label}</span>
                                      <span className="text-[10px] text-foreground/40">Horizon {prof.minHorizon}+ ans</span>
                                    </div>
                                    <p className="text-xs text-foreground/55 leading-relaxed">{prof.description}</p>
                                    <div className="flex gap-4 mt-2">
                                      <span className="text-[10px] text-foreground/40">Rdmt : {formatPct(prof.expectedReturn)}/an</span>
                                      <span className="text-[10px] text-foreground/40">Vol : {formatPct(prof.volatility)}/an</span>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        />

                        <p className="text-[11px] italic text-foreground/35">
                          Données indicatives — profil réel défini lors du diagnostic patrimonial.
                        </p>
                      </motion.div>
                    )}

                    {/* Step 3: Envelopes */}
                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={reduce ? false : { opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4"
                      >
                        <div>
                          <h2 className="font-heading text-2xl font-light text-foreground mb-1">Enveloppes</h2>
                          <p className="text-sm text-foreground/50 font-light">Supports juridiques envisagés.</p>
                        </div>

                        <Controller
                          name="envelopes"
                          control={control}
                          render={({ field }) => (
                            <div className="space-y-2">
                              {ENVELOPE_OPTIONS.map(env => (
                                <label
                                  key={env.id}
                                  className="flex items-center gap-3 p-4 rounded-xl border border-foreground/8 hover:border-foreground/15 cursor-pointer transition-colors"
                                >
                                  <input
                                    type="checkbox"
                                    checked={field.value.includes(env.id)}
                                    onChange={e => {
                                      if (e.target.checked) {
                                        field.onChange([...field.value, env.id]);
                                      } else {
                                        field.onChange(field.value.filter((v: string) => v !== env.id));
                                      }
                                    }}
                                    className="w-4 h-4 accent-foreground"
                                  />
                                  <span className="text-sm text-foreground/70">{env.label}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        />
                      </motion.div>
                    )}

                    {/* Step 4: Allocation */}
                    {step === 4 && (
                      <motion.div
                        key="step4"
                        initial={reduce ? false : { opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-4"
                      >
                        <div>
                          <h2 className="font-heading text-2xl font-light text-foreground mb-1">Allocation</h2>
                          <p className="text-sm text-foreground/50 font-light">Répartition par classe d'actif.</p>
                        </div>

                        {allocationError && (
                          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <p className="text-xs text-red-600">{allocationError}</p>
                          </div>
                        )}

                        {/* Total indicator */}
                        <div className={`text-center py-2 rounded-xl text-sm font-medium ${allocationValid ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                          Total : {(totalAllocation * 100).toFixed(0)} % {allocationValid ? '✓' : '— doit être 100 %'}
                        </div>

                        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                          {SLIDER_ASSETS.map(id => {
                            const asset = ASSET_ASSUMPTIONS[id];
                            const val = allocation[id] ?? 0;
                            return (
                              <div key={id}>
                                <div className="flex justify-between mb-1">
                                  <label className="text-xs text-foreground/60">{asset.shortLabel}</label>
                                  <span className="text-xs font-medium text-foreground/70">{Math.round(val * 100)} %</span>
                                </div>
                                <input
                                  type="range"
                                  min={0} max={100} step={5}
                                  value={Math.round(val * 100)}
                                  onChange={e => handleAllocationChange(id, Number(e.target.value) / 100)}
                                  className="w-full accent-foreground"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 5: Advanced */}
                    {step === 5 && (
                      <motion.div
                        key="step5"
                        initial={reduce ? false : { opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-5"
                      >
                        <div>
                          <h2 className="font-heading text-2xl font-light text-foreground mb-1">Paramètres avancés</h2>
                          <p className="text-sm text-foreground/50 font-light">Frais, inflation, rééquilibrage.</p>
                        </div>

                        <div>
                          <label className="block text-xs text-foreground/55 mb-1.5">Scénario macro-économique</label>
                          <select
                            {...register('scenarioId')}
                            className="w-full border border-foreground/12 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/15 bg-background/50"
                          >
                            {MACRO_SCENARIOS.map(s => (
                              <option key={s.id} value={s.id}>{s.label}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs text-foreground/55 mb-1.5">
                            Frais d'entrée : {(watchedValues.entryFees * 100).toFixed(1)} %
                          </label>
                          <input
                            type="range" min={0} max={5} step={0.25}
                            value={watchedValues.entryFees * 100}
                            onChange={e => setValue('entryFees', Number(e.target.value) / 100)}
                            className="w-full accent-foreground"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-foreground/55 mb-1.5">
                            Frais de gestion annuels : {(watchedValues.annualManagementFees * 100).toFixed(2)} %
                          </label>
                          <input
                            type="range" min={0} max={3} step={0.1}
                            value={watchedValues.annualManagementFees * 100}
                            onChange={e => setValue('annualManagementFees', Number(e.target.value) / 100)}
                            className="w-full accent-foreground"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-foreground/55 mb-1.5">
                            Inflation annuelle : {(watchedValues.inflation * 100).toFixed(1)} %
                          </label>
                          <input
                            type="range" min={0} max={10} step={0.25}
                            value={watchedValues.inflation * 100}
                            onChange={e => setValue('inflation', Number(e.target.value) / 100)}
                            className="w-full accent-foreground"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-foreground/55 mb-1.5">Rééquilibrage</label>
                          <select
                            {...register('rebalancingFrequency')}
                            className="w-full border border-foreground/12 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/15 bg-background/50"
                          >
                            <option value="monthly">Mensuel</option>
                            <option value="quarterly">Trimestriel</option>
                            <option value="annual">Annuel</option>
                          </select>
                        </div>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            {...register('indexedContributions')}
                            className="w-4 h-4 accent-foreground"
                          />
                          <span className="text-sm text-foreground/65">Versements indexés sur l'inflation</span>
                        </label>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-foreground/8">
                    <button
                      type="button"
                      onClick={() => setStep(s => Math.max(1, s - 1))}
                      disabled={step === 1}
                      className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Précédent
                    </button>

                    {step < STEPS.length ? (
                      <button
                        type="button"
                        onClick={() => setStep(s => Math.min(STEPS.length, s + 1))}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-foreground text-white hover:bg-foreground/85 transition-colors"
                      >
                        Suivant
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={runSim}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-foreground text-white hover:bg-foreground/85 transition-colors"
                      >
                        Mettre à jour la simulation
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Right: results */}
            <div className="lg:col-span-6 xl:col-span-7 space-y-6">
              {/* Demo badge */}
              <div className="flex items-center gap-2 text-[11px] text-foreground/40 italic">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                Données simulées — hypothèses de démonstration — non contractuelles
              </div>

              {result ? (
                <>
                  <div className="rounded-2xl border border-foreground/8 bg-white p-5 md:p-6">
                    <p className="text-[10px] tracking-widest uppercase text-foreground/40 mb-4">Projection Monte Carlo · {300} trajectoires</p>
                    <ProjectionChart result={result} horizon={horizon} targetAmount={watchedValues.targetAmount} />
                  </div>

                  <SimulationMetrics result={result} />

                  <ScenarioComparator baseParams={buildParams()} horizon={horizon} />

                  <AssumptionsPanel open={showAssumptions} onToggle={() => setShowAssumptions(v => !v)} />
                </>
              ) : (
                <div className="flex items-center justify-center h-64 rounded-2xl border border-foreground/8 bg-white text-foreground/30 text-sm">
                  Lancez la simulation pour voir les résultats
                </div>
              )}

              {/* CTAs */}
              <div className="rounded-2xl border border-foreground/8 bg-white p-6 text-center">
                <p className="font-heading text-xl font-light text-foreground mb-3">
                  Besoin d'un conseil personnalisé ?
                </p>
                <p className="text-sm text-foreground/55 font-light mb-5">
                  Un bilan patrimonial complet permet de définir votre stratégie réelle, adaptée à votre fiscalité et à vos objectifs précis.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-foreground text-white hover:bg-foreground/85 transition-all hover:-translate-y-0.5 group"
                  >
                    Prendre rendez-vous
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/bilan-patrimonial-bordeaux"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-light border border-foreground/15 text-foreground/60 hover:text-foreground hover:border-foreground/30 transition-all"
                  >
                    Bilan patrimonial
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
