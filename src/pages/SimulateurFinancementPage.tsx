import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  AlertTriangle, ArrowRight, ChevronLeft, ChevronRight, Plus, X,
} from "lucide-react";
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  computeAmortizationSchedule,
  computeMonthlyPayment,
} from "@/lib/financing/loanEngine";

// ─── Constants ───────────────────────────────────────────────────────────────

const CONTACT_URL = "/contact";
const BILAN_URL = "/bilan-patrimonial-bordeaux";

const STEPS = [
  { id: 1, label: "Projet",      description: "Type & coût" },
  { id: 2, label: "Financement", description: "Apport" },
  { id: 3, label: "Profil",      description: "Revenus" },
  { id: 4, label: "Paramètres",  description: "Taux & durée" },
  { id: 5, label: "Robustesse",  description: "Stress test" },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type ProjectType = "Résidence principale" | "Investissement locatif" | "Murs professionnels" | "Refinancement" | "Autre";
type LoanType    = "Amortissable" | "Relais" | "In fine";

interface FormState {
  projectType:      ProjectType;
  propertyPrice:    number;
  works:            number;
  acquisitionFees:  number;
  contribution:     number;
  monthlyNetIncome: number;
  existingDebts:    number;
  annualRate:       number;
  durationYears:    number;
  insuranceRate:    number;
  deferredMonths:   number;
  loanType:         LoanType;
  rateStress:       number;
  incomeStress:     number;
}

interface SavedScenario {
  id:                         number;
  label:                      string;
  form:                       FormState;
  monthlyPaymentWithInsurance:number;
  totalCost:                  number;
  debtRatio:                  number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatEur(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace(".", ",")} M€`;
  if (v >= 1_000)     return `${Math.round(v / 1_000)} k€`;
  return `${Math.round(v)} €`;
}

function formatEurFull(v: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v);
}

function formatPct(v: number) {
  return `${(v * 100).toFixed(1)} %`;
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-medium transition-all duration-300 ${
              step.id === current
                ? "border-foreground bg-foreground text-white"
                : step.id < current
                ? "border-foreground/40 bg-foreground/10 text-foreground/60"
                : "border-foreground/15 text-foreground/30"
            }`}>
              {step.id}
            </div>
            <span className={`text-[9px] tracking-wide mt-1.5 hidden sm:block uppercase ${
              step.id === current ? "text-foreground font-medium" : "text-foreground/35"
            }`}>
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-px flex-1 w-8 md:w-12 mx-2 transition-all duration-300 ${
              step.id < current ? "bg-foreground/30" : "bg-foreground/10"
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Chart tooltip ────────────────────────────────────────────────────────────

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; fill: string; color: string }>;
  label?: string;
}

function ChartTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const names: Record<string, string> = {
    capital: "Capital restant", interest: "Intérêts",
    principal: "Capital amorti", insurance: "Assurance",
  };
  return (
    <div className="bg-white border border-foreground/10 rounded-xl px-4 py-3 shadow-lg text-xs space-y-1">
      <p className="text-foreground/50 mb-1">Mois {label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.fill ?? p.color }} />
          <span className="text-foreground/65">{names[p.name] ?? p.name}</span>
          <span className="font-medium ml-auto">{formatEur(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Robustness pill ─────────────────────────────────────────────────────────

function RobustnessPill({ ratio }: { ratio: number }) {
  if (ratio < 0.28) return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">Confortable — {formatPct(ratio)}</span>;
  if (ratio < 0.33) return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">Maîtrisée — {formatPct(ratio)}</span>;
  if (ratio < 0.38) return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">Limitée — {formatPct(ratio)}</span>;
  return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">Insuffisante — {formatPct(ratio)}</span>;
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SimulateurFinancementPage() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(1);

  const [form, setForm] = useState<FormState>({
    projectType:      "Résidence principale",
    propertyPrice:    600_000,
    works:            0,
    acquisitionFees:  48_000,
    contribution:     100_000,
    monthlyNetIncome: 6_000,
    existingDebts:    0,
    annualRate:       0.038,
    durationYears:    20,
    insuranceRate:    0.003,
    deferredMonths:   0,
    loanType:         "Amortissable",
    rateStress:       0,
    incomeStress:     0,
  });

  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);
  const [nextId, setNextId] = useState(1);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => {
      const next = { ...prev, [key]: value };
      if (key === "propertyPrice") next.acquisitionFees = Math.round((value as number) * 0.08);
      return next;
    });
  }

  const totalCost   = form.propertyPrice + form.works + form.acquisitionFees;
  const loanAmount  = Math.max(0, totalCost - form.contribution);
  const durationMonths = form.durationYears * 12;

  const result = useMemo(() => {
    if (loanAmount <= 0) return null;
    return computeAmortizationSchedule({
      principal: loanAmount, annualRate: form.annualRate,
      durationMonths, insuranceRate: form.insuranceRate,
      deferredMonths: form.deferredMonths,
    });
  }, [loanAmount, form.annualRate, durationMonths, form.insuranceRate, form.deferredMonths]);

  const stressedResult = useMemo(() => {
    if (loanAmount <= 0 || !result) return null;
    const stressedRate   = form.annualRate + form.rateStress;
    const stressedIncome = form.monthlyNetIncome * (1 - form.incomeStress);
    const baseMonthly    = computeMonthlyPayment(loanAmount, stressedRate, durationMonths);
    const insurance      = (loanAmount * form.insuranceRate) / 12;
    const monthly        = baseMonthly + insurance;
    const debtRatio      = stressedIncome > 0 ? monthly / stressedIncome : 1;
    return { monthly, debtRatio, stressedIncome };
  }, [loanAmount, form.annualRate, form.rateStress, form.incomeStress, form.monthlyNetIncome, durationMonths, form.insuranceRate, result]);

  const debtRatio   = result && form.monthlyNetIncome > 0 ? result.monthlyPaymentWithInsurance / form.monthlyNetIncome : 0;
  const resteAVivre = form.monthlyNetIncome - (result?.monthlyPaymentWithInsurance ?? 0);

  const chartData = useMemo(() => {
    if (!result) return [];
    return result.schedule
      .filter((_, i) => (i + 1) % 12 === 0 || i === 0)
      .map(row => ({
        month:    row.month,
        capital:  Math.round(row.remainingCapital),
        interest: Math.round(row.interest),
        principal:Math.round(row.principal),
        insurance:Math.round(row.insurance),
      }));
  }, [result]);

  function saveScenario() {
    if (!result) return;
    const label = `Scénario ${nextId} — ${form.durationYears} ans · ${(form.annualRate * 100).toFixed(2)} %`;
    setSavedScenarios(prev => [
      ...prev.slice(-2),
      { id: nextId, label, form: { ...form }, monthlyPaymentWithInsurance: result.monthlyPaymentWithInsurance, totalCost: result.totalCost, debtRatio },
    ]);
    setNextId(n => n + 1);
  }

  function removeScenario(id: number) {
    setSavedScenarios(prev => prev.filter(s => s.id !== id));
  }

  const comparisonData = useMemo(() => {
    if (savedScenarios.length < 2) return [];
    const maxMonths = Math.max(...savedScenarios.map(s => s.form.durationYears * 12));
    const points: Array<Record<string, number>> = [];
    for (let m = 0; m <= maxMonths; m += 12) {
      const row: Record<string, number> = { month: m };
      savedScenarios.forEach(s => {
        const lam = Math.max(0, s.form.propertyPrice + s.form.works + s.form.acquisitionFees - s.form.contribution);
        if (lam > 0) {
          const r = computeAmortizationSchedule({ principal: lam, annualRate: s.form.annualRate, durationMonths: s.form.durationYears * 12, insuranceRate: s.form.insuranceRate });
          const found = r.schedule[m - 1];
          row[`S${s.id}`] = found ? found.remainingCapital : 0;
        }
      });
      points.push(row);
    }
    return points;
  }, [savedScenarios]);

  const SCENARIO_COLORS = ["hsl(222 50% 18%)", "hsl(215 40% 50%)", "hsl(215 28% 70%)"];

  // ── Input helpers ──────────────────────────────────────────────────────────

  const inputCls = "w-full border border-foreground/12 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/15 bg-background/50";
  const labelCls = "block text-xs text-foreground/55 mb-1.5 tracking-wide";

  function SliderField({ label, value, onChange, min, max, step: s, format }: {
    label: string; value: number; onChange: (v: number) => void;
    min: number; max: number; step: number; format: (v: number) => string;
  }) {
    return (
      <div>
        <div className="flex justify-between mb-1.5">
          <label className={labelCls}>{label}</label>
          <span className="text-xs font-medium text-foreground/70">{format(value)}</span>
        </div>
        <input
          type="range" min={min} max={max} step={s} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full accent-foreground"
        />
      </div>
    );
  }

  return (
    <>
      <Header />

      {/* Compact hero */}
      <section className="pt-28 pb-10 px-4 md:px-8" style={{ background: "hsl(220 30% 97%)" }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/40 mb-4 font-medium">
            Outil pédagogique — données simulées
          </p>
          <h1 className="text-3xl md:text-5xl font-heading font-light text-foreground leading-tight tracking-tight mb-4 max-w-2xl">
            Simulateur de financement
          </h1>
          <p className="text-foreground/60 font-light text-base max-w-xl mb-6">
            Simulez mensualité, coût total et capacité d'emprunt. Comparez plusieurs stratégies et ajustez les paramètres en temps réel.
          </p>
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-2xl">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden />
            <p className="text-xs text-amber-800 leading-relaxed">
              Les résultats présentés reposent sur les informations saisies et sont fournis à titre indicatif. Ils ne constituent pas une offre de prêt, une garantie de taux ou une recommandation personnalisée.
            </p>
          </div>
        </div>
      </section>

      {/* Main simulator */}
      <section className="pb-20 px-4 md:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8">

            {/* ── Left: wizard form ── */}
            <div className="lg:col-span-5 xl:col-span-5">
              <div className="rounded-2xl border border-foreground/8 bg-white p-6 md:p-8 sticky top-24">
                <StepIndicator current={step} />

                <AnimatePresence mode="wait">

                  {/* Step 1 — Projet */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={reduce ? false : { opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.22 }}
                      className="space-y-5"
                    >
                      <div>
                        <h2 className="font-heading text-2xl font-light text-foreground mb-1">Votre projet</h2>
                        <p className="text-sm text-foreground/50 font-light">Type de bien, prix et travaux envisagés.</p>
                      </div>

                      <div>
                        <label className={labelCls}>Type de projet</label>
                        <select
                          value={form.projectType}
                          onChange={e => update("projectType", e.target.value as ProjectType)}
                          className={inputCls}
                        >
                          {(["Résidence principale", "Investissement locatif", "Murs professionnels", "Refinancement", "Autre"] as ProjectType[]).map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className={labelCls}>Prix du bien (€)</label>
                        <input type="number" value={form.propertyPrice} step={5000} min={0}
                          onChange={e => update("propertyPrice", Number(e.target.value))} className={inputCls} />
                      </div>

                      <div>
                        <label className={labelCls}>Travaux (€)</label>
                        <input type="number" value={form.works} step={1000} min={0}
                          onChange={e => update("works", Number(e.target.value))} className={inputCls} />
                      </div>

                      <div>
                        <label className={labelCls}>Frais d'acquisition (€)</label>
                        <input type="number" value={form.acquisitionFees} step={500} min={0}
                          onChange={e => update("acquisitionFees", Number(e.target.value))} className={inputCls} />
                        <p className="text-[10px] text-foreground/35 mt-1 italic">Auto-calculé à 8 % — modifiable</p>
                      </div>

                      <div className="bg-background/60 rounded-xl p-4">
                        <p className="text-[10px] text-foreground/40 mb-1">Coût total du projet</p>
                        <p className="text-xl font-heading font-light text-foreground">{formatEurFull(totalCost)}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2 — Financement */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={reduce ? false : { opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.22 }}
                      className="space-y-5"
                    >
                      <div>
                        <h2 className="font-heading text-2xl font-light text-foreground mb-1">Financement</h2>
                        <p className="text-sm text-foreground/50 font-light">Apport personnel et montant à emprunter.</p>
                      </div>

                      <div>
                        <label className={labelCls}>Apport personnel (€)</label>
                        <input type="number" value={form.contribution} step={5000} min={0}
                          onChange={e => update("contribution", Number(e.target.value))} className={inputCls} />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-background/60 rounded-xl p-4">
                          <p className="text-[10px] text-foreground/40 mb-1">Montant emprunté</p>
                          <p className="text-lg font-heading font-light text-foreground">{formatEurFull(loanAmount)}</p>
                        </div>
                        <div className="bg-background/60 rounded-xl p-4">
                          <p className="text-[10px] text-foreground/40 mb-1">Ratio apport</p>
                          <p className="text-lg font-heading font-light text-foreground">
                            {totalCost > 0 ? `${Math.round(form.contribution / totalCost * 100)} %` : "—"}
                          </p>
                        </div>
                      </div>

                      {/* Mini funding donut (visual bar) */}
                      {totalCost > 0 && (
                        <div>
                          <div className="flex text-[10px] text-foreground/40 mb-1.5 justify-between">
                            <span>Apport</span>
                            <span>Emprunt</span>
                          </div>
                          <div className="w-full h-3 rounded-full bg-foreground/8 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min(100, form.contribution / totalCost * 100)}%`,
                                background: "hsl(222 50% 18%)",
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-foreground/35 mt-1">
                            <span>{formatEur(form.contribution)}</span>
                            <span>{formatEur(loanAmount)}</span>
                          </div>
                        </div>
                      )}

                      <p className="text-[11px] italic text-foreground/35">
                        Le montant emprunté est calculé automatiquement : coût projet − apport.
                      </p>
                    </motion.div>
                  )}

                  {/* Step 3 — Profil */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={reduce ? false : { opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.22 }}
                      className="space-y-5"
                    >
                      <div>
                        <h2 className="font-heading text-2xl font-light text-foreground mb-1">Profil emprunteur</h2>
                        <p className="text-sm text-foreground/50 font-light">Revenus nets mensuels et charges existantes.</p>
                      </div>

                      <div>
                        <label className={labelCls}>Revenus nets mensuels (€)</label>
                        <input type="number" value={form.monthlyNetIncome} step={100} min={0}
                          onChange={e => update("monthlyNetIncome", Number(e.target.value))} className={inputCls} />
                      </div>

                      <div>
                        <label className={labelCls}>Dettes mensuelles existantes (€)</label>
                        <input type="number" value={form.existingDebts} step={50} min={0}
                          onChange={e => update("existingDebts", Number(e.target.value))} className={inputCls} />
                      </div>

                      {result && form.monthlyNetIncome > 0 && (
                        <div className={`rounded-xl border p-4 ${
                          debtRatio < 0.33 ? "bg-emerald-50 border-emerald-100" :
                          debtRatio < 0.38 ? "bg-amber-50 border-amber-100" :
                          "bg-red-50 border-red-100"
                        }`}>
                          <p className="text-[10px] uppercase tracking-wider mb-1 text-foreground/50">Taux d'effort estimé</p>
                          <p className={`text-xl font-heading font-light ${
                            debtRatio < 0.33 ? "text-emerald-700" : debtRatio < 0.38 ? "text-amber-700" : "text-red-700"
                          }`}>{formatPct(debtRatio)}</p>
                          <p className="text-xs text-foreground/50 mt-0.5">
                            Mensualité : {formatEurFull(result.monthlyPaymentWithInsurance)}/mois · Reste à vivre : {formatEurFull(Math.max(0, resteAVivre))}/mois
                          </p>
                        </div>
                      )}

                      <p className="text-[11px] italic text-foreground/35">
                        Le taux d'effort indicatif est calculé avec la mensualité totale (crédit + assurance) rapportée aux revenus nets.
                      </p>
                    </motion.div>
                  )}

                  {/* Step 4 — Paramètres */}
                  {step === 4 && (
                    <motion.div
                      key="step4"
                      initial={reduce ? false : { opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.22 }}
                      className="space-y-5"
                    >
                      <div>
                        <h2 className="font-heading text-2xl font-light text-foreground mb-1">Paramètres du prêt</h2>
                        <p className="text-sm text-foreground/50 font-light">Taux, durée, assurance et type de crédit.</p>
                      </div>

                      <SliderField
                        label="Taux annuel"
                        value={form.annualRate}
                        onChange={v => update("annualRate", v)}
                        min={0.01} max={0.08} step={0.001}
                        format={v => `${(v * 100).toFixed(2)} %`}
                      />
                      <p className="text-[10px] italic text-foreground/30 -mt-3">
                        Taux de démonstration — sans lien avec une offre de marché actuelle.
                      </p>

                      <div>
                        <label className={labelCls}>Durée</label>
                        <div className="flex flex-wrap gap-2">
                          {[10, 15, 20, 25].map(y => (
                            <button
                              key={y}
                              type="button"
                              onClick={() => update("durationYears", y)}
                              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                form.durationYears === y
                                  ? "bg-foreground text-white"
                                  : "border border-foreground/15 text-foreground/60 hover:border-foreground/30"
                              }`}
                            >
                              {y} ans
                            </button>
                          ))}
                        </div>
                      </div>

                      <SliderField
                        label="Assurance annuelle"
                        value={form.insuranceRate}
                        onChange={v => update("insuranceRate", v)}
                        min={0.001} max={0.01} step={0.0005}
                        format={v => `${(v * 100).toFixed(2)} %`}
                      />

                      <div>
                        <label className={labelCls}>Différé partiel (mois)</label>
                        <input type="number" value={form.deferredMonths} min={0} max={24} step={1}
                          onChange={e => update("deferredMonths", Number(e.target.value))} className={inputCls} />
                      </div>

                      <div>
                        <label className={labelCls}>Type de prêt</label>
                        <select value={form.loanType} onChange={e => update("loanType", e.target.value as LoanType)} className={inputCls}>
                          {(["Amortissable", "Relais", "In fine"] as LoanType[]).map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 5 — Robustesse */}
                  {step === 5 && (
                    <motion.div
                      key="step5"
                      initial={reduce ? false : { opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.22 }}
                      className="space-y-5"
                    >
                      <div>
                        <h2 className="font-heading text-2xl font-light text-foreground mb-1">Test de robustesse</h2>
                        <p className="text-sm text-foreground/50 font-light">Simulez une variation des conditions pour vérifier la solidité du projet.</p>
                      </div>

                      <SliderField
                        label="Hausse de taux"
                        value={form.rateStress}
                        onChange={v => update("rateStress", v)}
                        min={0} max={0.02} step={0.001}
                        format={v => `+${(v * 100).toFixed(1)} %`}
                      />

                      <SliderField
                        label="Baisse de revenus"
                        value={form.incomeStress}
                        onChange={v => update("incomeStress", v)}
                        min={0} max={0.2} step={0.01}
                        format={v => `-${(v * 100).toFixed(0)} %`}
                      />

                      {stressedResult && (
                        <div className="space-y-3">
                          <div className={`rounded-xl border p-4 ${
                            stressedResult.debtRatio < 0.33 ? "bg-emerald-50 border-emerald-100" :
                            stressedResult.debtRatio < 0.38 ? "bg-amber-50 border-amber-100" :
                            "bg-red-50 border-red-100"
                          }`}>
                            <p className="text-[10px] uppercase tracking-wider mb-2 text-foreground/50">Taux d'effort stressé</p>
                            <RobustnessPill ratio={stressedResult.debtRatio} />
                            <p className="text-xs text-foreground/50 mt-2">
                              Mensualité stressée : {formatEurFull(stressedResult.monthly)}/mois
                            </p>
                          </div>

                          {form.rateStress === 0 && form.incomeStress === 0 && (
                            <p className="text-[11px] italic text-foreground/35">
                              Ajustez les curseurs pour simuler un choc de marché ou une variation de revenus.
                            </p>
                          )}
                        </div>
                      )}

                      <p className="text-[11px] italic text-foreground/35">
                        Indicateur pédagogique — ne constitue pas une décision de financement.
                      </p>
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
                      onClick={saveScenario}
                      disabled={!result || savedScenarios.length >= 3}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-foreground text-white hover:bg-foreground/85 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Enregistrer ce scénario
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ── Right: live results ── */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-[11px] text-foreground/40 italic">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                Données calculées — hypothèses de démonstration — non contractuelles
              </div>

              {result ? (
                <>
                  {/* Key metrics grid */}
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-3 gap-3"
                  >
                    {[
                      { label: "Mensualité", value: formatEurFull(result.monthlyPayment) + "/mois", sub: "hors assurance" },
                      { label: "Mensualité + assurance", value: formatEurFull(result.monthlyPaymentWithInsurance) + "/mois", sub: "charge réelle" },
                      { label: "Coût total", value: formatEur(result.totalCost), sub: "intérêts + assurance" },
                      { label: "Total intérêts", value: formatEur(result.totalInterest), sub: "" },
                      { label: "Taux d'effort", value: formatPct(debtRatio), sub: debtRatio < 0.35 ? "Acceptable" : "Élevé" },
                      { label: "Reste à vivre", value: formatEurFull(Math.max(0, resteAVivre)) + "/mois", sub: "indicatif" },
                    ].map(m => (
                      <div key={m.label} className="rounded-2xl border border-foreground/8 bg-white p-4 shadow-sm">
                        <p className="text-[10px] text-foreground/40 mb-1 leading-tight">{m.label}</p>
                        <p className="text-base font-heading font-light text-foreground/85">{m.value}</p>
                        {m.sub && <p className="text-[10px] text-foreground/30 mt-0.5">{m.sub}</p>}
                      </div>
                    ))}
                  </motion.div>

                  {/* Amortization chart */}
                  <div className="rounded-2xl border border-foreground/8 bg-white p-5 md:p-6 shadow-sm">
                    <p className="text-[10px] tracking-widest uppercase text-foreground/40 mb-5">
                      Composition mensuelle — {form.durationYears} ans
                    </p>
                    <div className="h-64" role="img" aria-label="Graphique de composition des mensualités">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 88% / 0.5)" />
                          <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(220 10% 42%)" }} tickLine={false} axisLine={false} tickFormatter={v => `M${v}`} />
                          <YAxis tick={{ fontSize: 10, fill: "hsl(220 10% 42%)" }} tickLine={false} axisLine={false} tickFormatter={v => formatEur(v)} width={52} />
                          <Tooltip content={<ChartTooltip />} />
                          <Area type="monotone" dataKey="interest"  stackId="1" stroke="hsl(215 40% 50%)"    fill="hsl(215 40% 50% / 0.35)"    name="interest"  />
                          <Area type="monotone" dataKey="principal" stackId="1" stroke="hsl(222 50% 18%)"    fill="hsl(222 50% 18% / 0.45)"    name="principal" />
                          <Area type="monotone" dataKey="insurance" stackId="1" stroke="hsl(215 28% 70%)"    fill="hsl(215 28% 70% / 0.3)"     name="insurance" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-3">
                      {[
                        { label: "Intérêts",  color: "hsl(215 40% 50%)" },
                        { label: "Capital",   color: "hsl(222 50% 18%)" },
                        { label: "Assurance", color: "hsl(215 28% 70%)" },
                      ].map(l => (
                        <div key={l.label} className="flex items-center gap-1.5 text-xs text-foreground/60">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                          {l.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Save button (on steps 1-4, also show here as secondary) */}
                  {savedScenarios.length < 3 && step < 5 && (
                    <button
                      onClick={saveScenario}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-foreground/15 text-sm text-foreground/60 hover:text-foreground hover:border-foreground/30 transition-all duration-200"
                    >
                      <Plus className="w-4 h-4" />
                      Enregistrer ce scénario pour comparaison
                    </button>
                  )}

                  {/* Saved scenarios */}
                  {savedScenarios.length > 0 && (
                    <div className="rounded-2xl border border-foreground/8 bg-white p-5 md:p-6 shadow-sm space-y-5">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] tracking-widest uppercase text-foreground/40">Scénarios enregistrés</p>
                        <span className="text-[10px] text-foreground/30">{savedScenarios.length}/3</span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-[11px] min-w-[480px]">
                          <thead>
                            <tr className="border-b border-foreground/8">
                              {["Scénario", "Mensualité", "Coût total", "Durée", "Taux", "T. d'effort", ""].map(h => (
                                <th key={h} className={`py-2 ${h ? "px-2" : "pl-2"} text-${h ? "right" : "left"} text-foreground/40 font-medium first:text-left first:pr-3`}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {savedScenarios.map((s, i) => (
                              <tr key={s.id} className="border-b border-foreground/4">
                                <td className="py-2 pr-3 text-foreground/65 font-medium">
                                  <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ background: SCENARIO_COLORS[i % 3] }} />
                                  {s.label}
                                </td>
                                <td className="py-2 px-2 text-right text-foreground/60">{formatEurFull(s.monthlyPaymentWithInsurance)}</td>
                                <td className="py-2 px-2 text-right text-foreground/60">{formatEur(s.totalCost)}</td>
                                <td className="py-2 px-2 text-right text-foreground/60">{s.form.durationYears} ans</td>
                                <td className="py-2 px-2 text-right text-foreground/60">{(s.form.annualRate * 100).toFixed(2)} %</td>
                                <td className="py-2 px-2 text-right text-foreground/60">{(s.debtRatio * 100).toFixed(1)} %</td>
                                <td className="py-2 pl-2 text-right">
                                  <button onClick={() => removeScenario(s.id)} className="text-foreground/20 hover:text-foreground/50 transition-colors" aria-label="Supprimer">
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {savedScenarios.length >= 2 && comparisonData.length > 0 && (
                        <div className="h-48" role="img" aria-label="Comparaison des scénarios enregistrés">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={comparisonData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 88% / 0.5)" />
                              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(220 10% 42%)" }} tickLine={false} axisLine={false} tickFormatter={v => v === 0 ? "" : `M${v}`} />
                              <YAxis tick={{ fontSize: 10, fill: "hsl(220 10% 42%)" }} tickLine={false} axisLine={false} tickFormatter={v => formatEur(v)} width={52} />
                              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12, border: "1px solid hsl(220 20% 88%)" }} formatter={(v: number) => formatEur(v)} labelFormatter={v => `Mois ${v}`} />
                              {savedScenarios.map((s, i) => (
                                <Line key={s.id} type="monotone" dataKey={`S${s.id}`} name={s.label} stroke={SCENARIO_COLORS[i % 3]} strokeWidth={2} dot={false} />
                              ))}
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-64 rounded-2xl border border-foreground/8 bg-white text-foreground/30 text-sm">
                  Saisissez un montant supérieur à l'apport pour calculer
                </div>
              )}

              {/* CTA */}
              <div className="rounded-2xl border border-foreground/8 bg-white p-6 text-center shadow-sm">
                <p className="font-heading text-xl font-light text-foreground mb-3">Besoin d'une analyse personnalisée ?</p>
                <p className="text-sm text-foreground/55 font-light mb-5">
                  Les résultats du simulateur sont indicatifs. Un conseiller KANTI peut analyser votre dossier réel, comparer les offres des établissements et structurer un financement adapté.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to={CONTACT_URL}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-foreground text-white hover:bg-foreground/85 transition-all hover:-translate-y-0.5 group"
                  >
                    Étudier mon financement
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to={BILAN_URL}
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
