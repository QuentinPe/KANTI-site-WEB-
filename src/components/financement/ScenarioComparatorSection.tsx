import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { computeAmortizationSchedule } from "@/lib/financing/loanEngine";

const INSURANCE_RATE = 0.003;

interface ScenarioDef {
  label: string;
  capital: number;
  rate: number;
  months: number;
  contribution: number;
}

const SCENARIOS: ScenarioDef[] = [
  {
    label: "Apport important",
    capital: 480_000,
    rate: 0.037,
    months: 240,
    contribution: 313_000,
  },
  {
    label: "Apport modéré",
    capital: 613_000,
    rate: 0.038,
    months: 240,
    contribution: 180_000,
  },
  {
    label: "Durée allongée",
    capital: 613_000,
    rate: 0.038,
    months: 300,
    contribution: 180_000,
  },
];

const COLORS = [
  "hsl(222 50% 18%)",
  "hsl(215 40% 50%)",
  "hsl(215 28% 70%)",
];

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

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-foreground/10 rounded-xl px-4 py-3 shadow-lg text-xs space-y-1">
      <p className="text-foreground/50 mb-2">Année {label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: p.color }}
          />
          <span className="text-foreground/70">{p.name}</span>
          <span className="font-medium ml-auto">{formatEur(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function ScenarioComparatorSection() {
  const reduce = useReducedMotion();

  const results = useMemo(() =>
    SCENARIOS.map((s) =>
      computeAmortizationSchedule({
        principal: s.capital,
        annualRate: s.rate,
        durationMonths: s.months,
        insuranceRate: INSURANCE_RATE,
      })
    ),
  []);

  // Build chart data — sample every 12 months (annual)
  const chartData = useMemo(() => {
    const maxMonths = Math.max(...results.map((r) => r.schedule.length));
    const points: Array<Record<string, number>> = [];

    for (let m = 0; m <= maxMonths; m += 12) {
      const year = m / 12;
      const row: Record<string, number> = { year };
      SCENARIOS.forEach((s, i) => {
        const found = results[i].schedule[m - 1];
        row[s.label] = found ? found.remainingCapital : 0;
      });
      points.push(row);
    }
    return points;
  }, [results]);

  return (
    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-60px" }}
        >
          <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/45 mb-4 font-medium">
            04 · Comparateur de stratégies
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-[1.1] tracking-tight max-w-2xl mb-4">
            Comparer plusieurs stratégies, pas seulement plusieurs taux.
          </h2>
          <p className="text-foreground/55 font-light text-sm max-w-xl">
            Apport, durée, capital emprunté : chaque paramètre redéfinit
            l'équilibre entre mensualité, coût total et trésorerie conservée.
          </p>
        </motion.div>

        {/* Chart */}
        <motion.div
          className="rounded-2xl border border-foreground/8 bg-white p-6 md:p-8 shadow-sm mb-8"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          viewport={{ once: true, margin: "-60px" }}
        >
          <p className="text-[10px] tracking-widest uppercase text-foreground/40 mb-6">
            Capital restant dû — évolution comparée
          </p>
          <div className="h-72" aria-label="Courbes d'amortissement comparées" role="img">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 88% / 0.5)" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 11, fill: "hsl(220 10% 42%)" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v} ans`}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(220 10% 42%)" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => formatEur(v)}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 11 }}
                />
                {SCENARIOS.map((s, i) => (
                  <Line
                    key={s.label}
                    type="monotone"
                    dataKey={s.label}
                    stroke={COLORS[i]}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] italic text-foreground/30 text-center mt-4">
            Données illustratives — hypothèses de démonstration
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {SCENARIOS.map((s, i) => {
            const r = results[i];
            const years = s.months / 12;
            const treso = 793_000 - s.contribution; // simplified indicative
            return (
              <motion.div
                key={s.label}
                className="rounded-2xl border border-foreground/8 bg-white p-6 shadow-sm"
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                viewport={{ once: true, margin: "-40px" }}
              >
                <div
                  className="w-3 h-3 rounded-full mb-4"
                  style={{ background: COLORS[i] }}
                />
                <h3 className="font-heading text-lg font-light text-foreground mb-5">
                  {s.label}
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      label: "Mensualité (avec assurance)",
                      value: formatEurFull(r.monthlyPaymentWithInsurance) + "/mois",
                    },
                    {
                      label: "Coût total",
                      value: formatEur(r.totalCost),
                    },
                    {
                      label: "Apport",
                      value: formatEur(s.contribution),
                    },
                    {
                      label: "Trésorerie conservée (indicatif)",
                      value: formatEur(treso),
                    },
                    {
                      label: "Durée",
                      value: `${years} ans`,
                    },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="flex justify-between gap-2 text-sm"
                    >
                      <span className="text-foreground/50 font-light">{m.label}</span>
                      <span className="font-medium text-foreground/80 text-right">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <p className="text-[11px] italic text-foreground/35 text-center mt-6">
          Données fictives à titre illustratif. Taux de démonstration sans lien
          avec des conditions de marché actuelles.
        </p>
      </div>
    </section>
  );
}
