import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, ArrowRight, Plus, X } from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  computeAmortizationSchedule,
  computeMonthlyPayment,
} from "@/lib/financing/loanEngine";

// ─── Route constants ──────────────────────────────────────────────────────────
const CONTACT_URL = "/contact";
const BILAN_URL = "/bilan-patrimonial-bordeaux";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProjectType =
  | "Résidence principale"
  | "Investissement locatif"
  | "Murs professionnels"
  | "Refinancement"
  | "Autre";

type LoanType = "Amortissable" | "Relais" | "In fine";

interface FormState {
  projectType: ProjectType;
  propertyPrice: number;
  works: number;
  acquisitionFees: number;
  contribution: number;
  monthlyNetIncome: number;
  existingDebts: number;
  annualRate: number;
  durationYears: number;
  insuranceRate: number;
  deferredMonths: number;
  loanType: LoanType;
  rateStress: number;
  incomeStress: number;
}

interface SavedScenario {
  id: number;
  label: string;
  form: FormState;
  monthlyPaymentWithInsurance: number;
  totalCost: number;
  debtRatio: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatEur(v: number) {
  if (v >= 1_000_000)
    return `${(v / 1_000_000).toFixed(1).replace(".", ",")} M€`;
  if (v >= 1_000) return `${Math.round(v / 1_000)} k€`;
  return `${Math.round(v)} €`;
}

function formatEurFull(v: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(v);
}

function formatPct(v: number) {
  return `${(v * 100).toFixed(1)} %`;
}

// ─── Input component ──────────────────────────────────────────────────────────

function InputField({
  label,
  value,
  onChange,
  type = "number",
  step,
  min,
  max,
  suffix,
  note,
}: {
  label: string;
  value: number | string;
  onChange: (v: number | string) => void;
  type?: "number" | "text";
  step?: number;
  min?: number;
  max?: number;
  suffix?: string;
  note?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-foreground/55 mb-1.5 tracking-wide">
        {label}
        {suffix && (
          <span className="text-foreground/35 ml-1">({suffix})</span>
        )}
      </label>
      <input
        type={type}
        value={value}
        step={step}
        min={min}
        max={max}
        onChange={(e) =>
          onChange(type === "number" ? Number(e.target.value) : e.target.value)
        }
        className="w-full border border-foreground/12 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/15 bg-background/50"
      />
      {note && <p className="text-[10px] text-foreground/35 mt-1 italic">{note}</p>}
    </div>
  );
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; fill: string; color: string }>;
  label?: string;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const names: Record<string, string> = {
    capital: "Capital restant",
    interest: "Intérêts",
    principal: "Capital amorti",
    insurance: "Assurance",
  };
  return (
    <div className="bg-white border border-foreground/10 rounded-xl px-4 py-3 shadow-lg text-xs space-y-1">
      <p className="text-foreground/50 mb-1">Mois {label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: p.fill ?? p.color }}
          />
          <span className="text-foreground/65">{names[p.name] ?? p.name}</span>
          <span className="font-medium ml-auto">{formatEur(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SimulateurFinancementPage() {
  const reduce = useReducedMotion();

  const [form, setForm] = useState<FormState>({
    projectType: "Résidence principale",
    propertyPrice: 600_000,
    works: 0,
    acquisitionFees: 48_000, // auto ~8%
    contribution: 100_000,
    monthlyNetIncome: 6_000,
    existingDebts: 0,
    annualRate: 0.038,
    durationYears: 20,
    insuranceRate: 0.003,
    deferredMonths: 0,
    loanType: "Amortissable",
    rateStress: 0,
    incomeStress: 0,
  });

  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);
  const [nextScenarioId, setNextScenarioId] = useState(1);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      // Auto-compute acquisitionFees when propertyPrice changes
      if (key === "propertyPrice") {
        next.acquisitionFees = Math.round((value as number) * 0.08);
      }
      // Auto-compute loanAmount
      return next;
    });
  }

  const totalCost =
    form.propertyPrice + form.works + form.acquisitionFees;
  const loanAmount = Math.max(0, totalCost - form.contribution);
  const durationMonths = form.durationYears * 12;

  // Base results
  const result = useMemo(() => {
    if (loanAmount <= 0) return null;
    return computeAmortizationSchedule({
      principal: loanAmount,
      annualRate: form.annualRate,
      durationMonths,
      insuranceRate: form.insuranceRate,
      deferredMonths: form.deferredMonths,
    });
  }, [loanAmount, form.annualRate, durationMonths, form.insuranceRate, form.deferredMonths]);

  // Stressed results
  const stressedResult = useMemo(() => {
    if (loanAmount <= 0) return null;
    const stressedRate = form.annualRate + form.rateStress;
    const stressedIncome =
      form.monthlyNetIncome * (1 - form.incomeStress);
    const baseMonthly = computeMonthlyPayment(loanAmount, stressedRate, durationMonths);
    const insurance = (loanAmount * form.insuranceRate) / 12;
    const monthly = baseMonthly + insurance;
    const debtRatio = stressedIncome > 0 ? monthly / stressedIncome : 1;
    return { monthly, debtRatio, stressedIncome };
  }, [
    loanAmount,
    form.annualRate,
    form.rateStress,
    form.incomeStress,
    form.monthlyNetIncome,
    durationMonths,
    form.insuranceRate,
  ]);

  // Metrics
  const debtRatio = result && form.monthlyNetIncome > 0
    ? result.monthlyPaymentWithInsurance / form.monthlyNetIncome
    : 0;
  const resteAVivre = form.monthlyNetIncome - (result?.monthlyPaymentWithInsurance ?? 0);

  // Chart data (annual sample)
  const chartData = useMemo(() => {
    if (!result) return [];
    return result.schedule
      .filter((_, i) => (i + 1) % 12 === 0 || i === 0)
      .map((row) => ({
        month: row.month,
        capital: Math.round(row.remainingCapital),
        interest: Math.round(row.interest),
        principal: Math.round(row.principal),
        insurance: Math.round(row.insurance),
      }));
  }, [result]);

  // Save scenario
  function saveScenario() {
    if (!result) return;
    const label = `Scénario ${nextScenarioId} — ${form.durationYears} ans · ${(form.annualRate * 100).toFixed(2)}%`;
    setSavedScenarios((prev) => [
      ...prev.slice(-2), // keep max 3
      {
        id: nextScenarioId,
        label,
        form: { ...form },
        monthlyPaymentWithInsurance: result.monthlyPaymentWithInsurance,
        totalCost: result.totalCost,
        debtRatio,
      },
    ]);
    setNextScenarioId((n) => n + 1);
  }

  function removeScenario(id: number) {
    setSavedScenarios((prev) => prev.filter((s) => s.id !== id));
  }

  // Scenario comparison chart data
  const comparisonData = useMemo(() => {
    if (savedScenarios.length < 2) return [];
    const maxMonths = Math.max(
      ...savedScenarios.map((s) => s.form.durationYears * 12)
    );
    const points: Array<Record<string, number>> = [];
    for (let m = 0; m <= maxMonths; m += 12) {
      const row: Record<string, number> = { month: m };
      savedScenarios.forEach((s) => {
        const lam = Math.max(
          0,
          s.form.propertyPrice +
            s.form.works +
            s.form.acquisitionFees -
            s.form.contribution
        );
        if (lam > 0) {
          const r = computeAmortizationSchedule({
            principal: lam,
            annualRate: s.form.annualRate,
            durationMonths: s.form.durationYears * 12,
            insuranceRate: s.form.insuranceRate,
          });
          const found = r.schedule[m - 1];
          row[`S${s.id}`] = found ? found.remainingCapital : 0;
        }
      });
      points.push(row);
    }
    return points;
  }, [savedScenarios]);

  const SCENARIO_COLORS = [
    "hsl(222 50% 18%)",
    "hsl(215 40% 50%)",
    "hsl(215 28% 70%)",
  ];

  return (
    <>
      <Header />

      {/* Compact hero */}
      <section
        className="pt-28 pb-10 px-4 md:px-8"
        style={{ background: "hsl(220 30% 97%)" }}
      >
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/40 mb-4 font-medium">
            Outil pédagogique — données simulées
          </p>
          <h1 className="text-3xl md:text-5xl font-heading font-light text-foreground leading-tight tracking-tight mb-4 max-w-2xl">
            Simulateur de financement
          </h1>
          <p className="text-foreground/60 font-light text-base max-w-xl mb-6">
            Simulez mensualité, coût total et capacité d'emprunt. Comparez
            plusieurs stratégies et ajustez les paramètres en temps réel.
          </p>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-2xl mb-6">
            <AlertTriangle
              className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5"
              aria-hidden
            />
            <p className="text-xs text-amber-800 leading-relaxed">
              Les résultats présentés reposent sur les informations saisies et
              sont fournis à titre indicatif. Ils ne constituent pas une offre
              de prêt, une garantie de taux ou une recommandation personnalisée.
            </p>
          </div>
        </div>
      </section>

      {/* Main simulator */}
      <section className="pb-20 px-4 md:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left: Form */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-foreground/8 bg-white p-6 md:p-8 space-y-8">

                {/* Groupe A: Projet */}
                <div className="space-y-4">
                  <h2 className="font-heading text-lg font-light text-foreground border-b border-foreground/8 pb-3">
                    A · Projet
                  </h2>

                  <div>
                    <label className="block text-xs text-foreground/55 mb-1.5 tracking-wide">
                      Type de projet
                    </label>
                    <select
                      value={form.projectType}
                      onChange={(e) =>
                        update("projectType", e.target.value as ProjectType)
                      }
                      className="w-full border border-foreground/12 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/15 bg-background/50"
                    >
                      {[
                        "Résidence principale",
                        "Investissement locatif",
                        "Murs professionnels",
                        "Refinancement",
                        "Autre",
                      ].map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <InputField
                    label="Prix du bien"
                    value={form.propertyPrice}
                    onChange={(v) => update("propertyPrice", v as number)}
                    suffix="€"
                    step={5000}
                    min={0}
                  />
                  <InputField
                    label="Travaux"
                    value={form.works}
                    onChange={(v) => update("works", v as number)}
                    suffix="€"
                    step={1000}
                    min={0}
                  />
                  <InputField
                    label="Frais d'acquisition"
                    value={form.acquisitionFees}
                    onChange={(v) => update("acquisitionFees", v as number)}
                    suffix="€"
                    step={1000}
                    min={0}
                    note="Auto-calculé à 8% — modifiable"
                  />
                </div>

                {/* Groupe B: Financement */}
                <div className="space-y-4">
                  <h2 className="font-heading text-lg font-light text-foreground border-b border-foreground/8 pb-3">
                    B · Financement
                  </h2>

                  <InputField
                    label="Apport personnel"
                    value={form.contribution}
                    onChange={(v) => update("contribution", v as number)}
                    suffix="€"
                    step={5000}
                    min={0}
                  />

                  <div className="bg-background/60 rounded-xl p-4">
                    <p className="text-[10px] text-foreground/40 mb-1">
                      Montant emprunté (calculé)
                    </p>
                    <p className="text-xl font-heading font-light text-foreground">
                      {formatEurFull(loanAmount)}
                    </p>
                    <p className="text-[11px] text-foreground/35 mt-0.5">
                      Coût projet : {formatEurFull(totalCost)}
                    </p>
                  </div>
                </div>

                {/* Groupe C: Profil emprunteur */}
                <div className="space-y-4">
                  <h2 className="font-heading text-lg font-light text-foreground border-b border-foreground/8 pb-3">
                    C · Profil emprunteur
                  </h2>
                  <InputField
                    label="Revenus nets mensuels"
                    value={form.monthlyNetIncome}
                    onChange={(v) => update("monthlyNetIncome", v as number)}
                    suffix="€/mois"
                    step={100}
                    min={0}
                  />
                  <InputField
                    label="Dettes mensuelles existantes"
                    value={form.existingDebts}
                    onChange={(v) => update("existingDebts", v as number)}
                    suffix="€/mois"
                    step={50}
                    min={0}
                  />
                </div>

                {/* Groupe D: Paramètres */}
                <div className="space-y-4">
                  <h2 className="font-heading text-lg font-light text-foreground border-b border-foreground/8 pb-3">
                    D · Paramètres du prêt
                  </h2>

                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-xs text-foreground/55 tracking-wide">
                        Taux annuel
                      </label>
                      <span className="text-xs font-medium text-foreground/70">
                        {(form.annualRate * 100).toFixed(2)} %
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.01}
                      max={0.08}
                      step={0.001}
                      value={form.annualRate}
                      onChange={(e) =>
                        update("annualRate", Number(e.target.value))
                      }
                      className="w-full accent-foreground"
                    />
                    <div className="flex justify-between text-[10px] text-foreground/30 mt-1">
                      <span>1 %</span>
                      <span>8 %</span>
                    </div>
                    <p className="text-[10px] italic text-foreground/30 mt-1">
                      Taux de démonstration — sans lien avec une offre de marché
                      actuelle.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs text-foreground/55 mb-1.5 tracking-wide">
                      Durée
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[10, 15, 20, 25].map((y) => (
                        <button
                          key={y}
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

                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-xs text-foreground/55 tracking-wide">
                        Assurance annuelle
                      </label>
                      <span className="text-xs font-medium text-foreground/70">
                        {(form.insuranceRate * 100).toFixed(2)} %
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.001}
                      max={0.01}
                      step={0.0005}
                      value={form.insuranceRate}
                      onChange={(e) =>
                        update("insuranceRate", Number(e.target.value))
                      }
                      className="w-full accent-foreground"
                    />
                    <div className="flex justify-between text-[10px] text-foreground/30 mt-1">
                      <span>0,10 %</span>
                      <span>1,00 %</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-foreground/55 mb-1.5 tracking-wide">
                      Différé partiel (mois)
                    </label>
                    <input
                      type="number"
                      value={form.deferredMonths}
                      min={0}
                      max={24}
                      step={1}
                      onChange={(e) =>
                        update("deferredMonths", Number(e.target.value))
                      }
                      className="w-full border border-foreground/12 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/15 bg-background/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-foreground/55 mb-1.5 tracking-wide">
                      Type de prêt
                    </label>
                    <select
                      value={form.loanType}
                      onChange={(e) =>
                        update("loanType", e.target.value as LoanType)
                      }
                      className="w-full border border-foreground/12 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/15 bg-background/50"
                    >
                      {["Amortissable", "Relais", "In fine"].map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Groupe E: Stress */}
                <div className="space-y-4">
                  <h2 className="font-heading text-lg font-light text-foreground border-b border-foreground/8 pb-3">
                    E · Test de robustesse
                  </h2>

                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-xs text-foreground/55 tracking-wide">
                        Hausse de taux
                      </label>
                      <span className="text-xs font-medium text-foreground/70">
                        +{(form.rateStress * 100).toFixed(1)} %
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={0.02}
                      step={0.001}
                      value={form.rateStress}
                      onChange={(e) =>
                        update("rateStress", Number(e.target.value))
                      }
                      className="w-full accent-foreground"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-xs text-foreground/55 tracking-wide">
                        Baisse de revenus
                      </label>
                      <span className="text-xs font-medium text-foreground/70">
                        -{(form.incomeStress * 100).toFixed(0)} %
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={0.2}
                      step={0.01}
                      value={form.incomeStress}
                      onChange={(e) =>
                        update("incomeStress", Number(e.target.value))
                      }
                      className="w-full accent-foreground"
                    />
                  </div>

                  {stressedResult && (
                    <div
                      className={`rounded-xl border p-4 text-sm ${
                        stressedResult.debtRatio < 0.33
                          ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                          : stressedResult.debtRatio < 0.38
                          ? "bg-amber-50 border-amber-100 text-amber-700"
                          : "bg-red-50 border-red-100 text-red-700"
                      }`}
                    >
                      <p className="text-[10px] uppercase tracking-wider mb-1 opacity-60">
                        Taux d'effort stressé
                      </p>
                      <p className="text-xl font-heading font-light">
                        {formatPct(stressedResult.debtRatio)}
                      </p>
                      <p className="text-xs opacity-70 mt-0.5">
                        Mensualité stressée :{" "}
                        {formatEurFull(stressedResult.monthly)}/mois
                      </p>
                    </div>
                  )}
                </div>

                <p className="text-[11px] italic text-foreground/35">
                  Les résultats reposent sur les informations saisies et sont
                  fournis à titre indicatif.
                </p>
              </div>
            </div>

            {/* Right: Results */}
            <div className="lg:col-span-7 space-y-6">
              {/* Demo badge */}
              <div className="flex items-center gap-2 text-[11px] text-foreground/40 italic">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                Données calculées — hypothèses de démonstration — non contractuelles
              </div>

              {result ? (
                <>
                  {/* Key metrics */}
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-3 gap-3"
                  >
                    {[
                      {
                        label: "Mensualité",
                        value: formatEurFull(result.monthlyPayment) + "/mois",
                        sub: "hors assurance",
                      },
                      {
                        label: "Mensualité + assurance",
                        value:
                          formatEurFull(result.monthlyPaymentWithInsurance) +
                          "/mois",
                        sub: "charge réelle",
                      },
                      {
                        label: "Coût total",
                        value: formatEur(result.totalCost),
                        sub: "intérêts + assurance",
                      },
                      {
                        label: "Total intérêts",
                        value: formatEur(result.totalInterest),
                        sub: "",
                      },
                      {
                        label: "Taux d'effort",
                        value: formatPct(debtRatio),
                        sub:
                          debtRatio < 0.35 ? "Acceptable" : "Élevé",
                      },
                      {
                        label: "Reste à vivre",
                        value: formatEurFull(Math.max(0, resteAVivre)) + "/mois",
                        sub: "indicatif",
                      },
                    ].map((m) => (
                      <div
                        key={m.label}
                        className="rounded-2xl border border-foreground/8 bg-white p-4 shadow-sm"
                      >
                        <p className="text-[10px] text-foreground/40 mb-1 leading-tight">
                          {m.label}
                        </p>
                        <p className="text-base font-heading font-light text-foreground/85">
                          {m.value}
                        </p>
                        {m.sub && (
                          <p className="text-[10px] text-foreground/30 mt-0.5">
                            {m.sub}
                          </p>
                        )}
                      </div>
                    ))}
                  </motion.div>

                  {/* Chart */}
                  <div className="rounded-2xl border border-foreground/8 bg-white p-5 md:p-6 shadow-sm">
                    <p className="text-[10px] tracking-widest uppercase text-foreground/40 mb-5">
                      Composition mensuelle — {form.durationYears} ans
                    </p>
                    <div
                      className="h-64"
                      aria-label="Graphique de composition des mensualités"
                      role="img"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={chartData}
                          margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="hsl(220 20% 88% / 0.5)"
                          />
                          <XAxis
                            dataKey="month"
                            tick={{ fontSize: 10, fill: "hsl(220 10% 42%)" }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => `M${v}`}
                          />
                          <YAxis
                            tick={{ fontSize: 10, fill: "hsl(220 10% 42%)" }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => formatEur(v)}
                            width={52}
                          />
                          <Tooltip content={<ChartTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="interest"
                            stackId="1"
                            stroke="hsl(215 40% 50%)"
                            fill="hsl(215 40% 50% / 0.35)"
                            name="interest"
                          />
                          <Area
                            type="monotone"
                            dataKey="principal"
                            stackId="1"
                            stroke="hsl(222 50% 18%)"
                            fill="hsl(222 50% 18% / 0.45)"
                            name="principal"
                          />
                          <Area
                            type="monotone"
                            dataKey="insurance"
                            stackId="1"
                            stroke="hsl(215 28% 70%)"
                            fill="hsl(215 28% 70% / 0.3)"
                            name="insurance"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-3">
                      {[
                        { label: "Intérêts", color: "hsl(215 40% 50%)" },
                        { label: "Capital", color: "hsl(222 50% 18%)" },
                        { label: "Assurance", color: "hsl(215 28% 70%)" },
                      ].map((l) => (
                        <div
                          key={l.label}
                          className="flex items-center gap-1.5 text-xs text-foreground/60"
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ background: l.color }}
                          />
                          {l.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Save scenario button */}
                  {savedScenarios.length < 3 && (
                    <button
                      onClick={saveScenario}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-foreground/15 text-sm text-foreground/60 hover:text-foreground hover:border-foreground/30 transition-all duration-200"
                    >
                      <Plus className="w-4 h-4" />
                      Enregistrer ce scénario pour comparaison
                    </button>
                  )}

                  {/* Saved scenarios comparison */}
                  {savedScenarios.length > 0 && (
                    <div className="rounded-2xl border border-foreground/8 bg-white p-5 md:p-6 shadow-sm space-y-5">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] tracking-widest uppercase text-foreground/40">
                          Scénarios enregistrés
                        </p>
                        <span className="text-[10px] text-foreground/30">
                          {savedScenarios.length}/3
                        </span>
                      </div>

                      {/* Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-[11px] min-w-[480px]">
                          <thead>
                            <tr className="border-b border-foreground/8">
                              <th className="text-left py-2 pr-3 text-foreground/40 font-medium">
                                Scénario
                              </th>
                              <th className="text-right py-2 px-2 text-foreground/40 font-medium">
                                Mensualité
                              </th>
                              <th className="text-right py-2 px-2 text-foreground/40 font-medium">
                                Coût total
                              </th>
                              <th className="text-right py-2 px-2 text-foreground/40 font-medium">
                                Durée
                              </th>
                              <th className="text-right py-2 px-2 text-foreground/40 font-medium">
                                Taux
                              </th>
                              <th className="text-right py-2 px-2 text-foreground/40 font-medium">
                                T. d'effort
                              </th>
                              <th className="py-2 pl-2" />
                            </tr>
                          </thead>
                          <tbody>
                            {savedScenarios.map((s, i) => (
                              <tr
                                key={s.id}
                                className="border-b border-foreground/4"
                              >
                                <td className="py-2 pr-3 text-foreground/65 font-medium">
                                  <span
                                    className="inline-block w-2 h-2 rounded-full mr-1.5"
                                    style={{ background: SCENARIO_COLORS[i % 3] }}
                                  />
                                  {s.label}
                                </td>
                                <td className="py-2 px-2 text-right text-foreground/60">
                                  {formatEurFull(s.monthlyPaymentWithInsurance)}
                                </td>
                                <td className="py-2 px-2 text-right text-foreground/60">
                                  {formatEur(s.totalCost)}
                                </td>
                                <td className="py-2 px-2 text-right text-foreground/60">
                                  {s.form.durationYears} ans
                                </td>
                                <td className="py-2 px-2 text-right text-foreground/60">
                                  {(s.form.annualRate * 100).toFixed(2)} %
                                </td>
                                <td className="py-2 px-2 text-right text-foreground/60">
                                  {(s.debtRatio * 100).toFixed(1)} %
                                </td>
                                <td className="py-2 pl-2 text-right">
                                  <button
                                    onClick={() => removeScenario(s.id)}
                                    className="text-foreground/20 hover:text-foreground/50 transition-colors"
                                    aria-label="Supprimer"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Comparison line chart */}
                      {savedScenarios.length >= 2 &&
                        comparisonData.length > 0 && (
                          <div
                            className="h-48"
                            aria-label="Comparaison des scénarios enregistrés"
                            role="img"
                          >
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={comparisonData}
                                margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                              >
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="hsl(220 20% 88% / 0.5)"
                                />
                                <XAxis
                                  dataKey="month"
                                  tick={{
                                    fontSize: 10,
                                    fill: "hsl(220 10% 42%)",
                                  }}
                                  tickLine={false}
                                  axisLine={false}
                                  tickFormatter={(v) =>
                                    v === 0 ? "" : `M${v}`
                                  }
                                />
                                <YAxis
                                  tick={{
                                    fontSize: 10,
                                    fill: "hsl(220 10% 42%)",
                                  }}
                                  tickLine={false}
                                  axisLine={false}
                                  tickFormatter={(v) => formatEur(v)}
                                  width={52}
                                />
                                <Tooltip
                                  contentStyle={{
                                    fontSize: 11,
                                    borderRadius: 12,
                                    border: "1px solid hsl(220 20% 88%)",
                                  }}
                                  formatter={(v: number) => formatEur(v)}
                                  labelFormatter={(v) => `Mois ${v}`}
                                />
                                {savedScenarios.map((s, i) => (
                                  <Line
                                    key={s.id}
                                    type="monotone"
                                    dataKey={`S${s.id}`}
                                    name={s.label}
                                    stroke={SCENARIO_COLORS[i % 3]}
                                    strokeWidth={2}
                                    dot={false}
                                  />
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

              {/* CTA block */}
              <div className="rounded-2xl border border-foreground/8 bg-white p-6 text-center shadow-sm">
                <p className="font-heading text-xl font-light text-foreground mb-3">
                  Besoin d'une analyse personnalisée ?
                </p>
                <p className="text-sm text-foreground/55 font-light mb-5">
                  Les résultats du simulateur sont indicatifs. Un conseiller
                  KANTI peut analyser votre dossier réel, comparer les offres
                  des établissements et structurer un financement adapté.
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
