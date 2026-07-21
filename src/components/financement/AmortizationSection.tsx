import { useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { computeAmortizationSchedule } from "@/lib/financing/loanEngine";

const DURATIONS = [
  { label: "10 ans", months: 120 },
  { label: "15 ans", months: 180 },
  { label: "20 ans", months: 240 },
  { label: "25 ans", months: 300 },
];

const PRINCIPAL = 400_000;
const RATE = 0.038;
const INSURANCE_RATE = 0.003;

function formatEur(v: number) {
  if (v >= 1_000_000)
    return `${(v / 1_000_000).toFixed(1).replace(".", ",")} M€`;
  if (v >= 1_000) return `${Math.round(v / 1_000)} k€`;
  return `${Math.round(v)} €`;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; fill: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const labels: Record<string, string> = {
    interest: "Intérêts",
    principal: "Capital",
    insurance: "Assurance",
  };
  return (
    <div className="bg-white border border-foreground/10 rounded-xl px-4 py-3 shadow-lg text-xs space-y-1">
      <p className="text-foreground/50 mb-2">Mois {label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: p.fill }}
          />
          <span className="text-foreground/70">{labels[p.name] ?? p.name}</span>
          <span className="font-medium ml-auto">{formatEur(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function AmortizationSection() {
  const reduce = useReducedMotion();
  const [selectedIdx, setSelectedIdx] = useState(2); // default 20 ans

  const result = useMemo(
    () =>
      computeAmortizationSchedule({
        principal: PRINCIPAL,
        annualRate: RATE,
        durationMonths: DURATIONS[selectedIdx].months,
        insuranceRate: INSURANCE_RATE,
      }),
    [selectedIdx]
  );

  // Sample every 12 months
  const chartData = useMemo(() => {
    const sampled = result.schedule.filter(
      (_, i) => (i + 1) % 12 === 0 || i === 0
    );
    return sampled.map((row) => ({
      month: row.month,
      interest: Math.round(row.interest),
      principal: Math.round(row.principal),
      insurance: Math.round(row.insurance),
    }));
  }, [result]);

  return (
    <section
      className="section-padding"
      style={{ background: "hsl(220 30% 97%)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left sticky */}
          <motion.div
            className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            viewport={{ once: true, margin: "-60px" }}
          >
            <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/45 mb-5 font-medium">
              07 · Échéancier animé
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-[1.1] tracking-tight mb-6">
              Une mensualité stable peut cacher une composition qui évolue
              chaque mois.
            </h2>
            <p className="text-foreground/65 leading-relaxed font-light text-base mb-8">
              Au début du crédit, l'essentiel de la mensualité couvre les
              intérêts. Au fil du temps, la part de capital amorti augmente
              progressivement. Cette dynamique a des implications fiscales et
              stratégiques importantes.
            </p>

            {/* Duration selector */}
            <div>
              <p className="text-xs text-foreground/45 mb-3 uppercase tracking-wide">
                Durée du prêt
              </p>
              <div className="flex flex-wrap gap-2">
                {DURATIONS.map((d, i) => (
                  <button
                    key={d.months}
                    onClick={() => setSelectedIdx(i)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedIdx === i
                        ? "bg-foreground text-white"
                        : "border border-foreground/15 text-foreground/60 hover:border-foreground/30 hover:text-foreground"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                {
                  label: "Mensualité",
                  value: formatEur(result.monthlyPaymentWithInsurance) + "/mois",
                },
                {
                  label: "Intérêts totaux",
                  value: formatEur(result.totalInterest),
                },
                {
                  label: "Assurance totale",
                  value: formatEur(result.totalInsurance),
                },
                {
                  label: "Coût total",
                  value: formatEur(result.totalCost),
                },
              ].map((m) => (
                <div
                  key={m.label}
                  className="bg-background/60 rounded-xl p-3"
                >
                  <p className="text-[10px] text-foreground/40 mb-1">{m.label}</p>
                  <p className="text-sm font-medium text-foreground/80 font-heading">
                    {m.value}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-[11px] italic text-foreground/35 mt-4">
              Base : 400 000 € à 3,8% · données illustratives
            </p>
          </motion.div>

          {/* Right chart */}
          <motion.div
            className="lg:col-span-7"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.12 }}
            viewport={{ once: true, margin: "-60px" }}
          >
            <div className="rounded-2xl border border-foreground/8 bg-white p-6 md:p-8 shadow-sm">
              <p className="text-[10px] tracking-widest uppercase text-foreground/40 mb-6">
                Composition mensuelle · {DURATIONS[selectedIdx].label}
              </p>
              <div
                className="h-80"
                aria-label="Composition des mensualités par mois"
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
                    <Tooltip content={<CustomTooltip />} />
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
              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-4 justify-center">
                {[
                  { key: "Intérêts", color: "hsl(215 40% 50%)" },
                  { key: "Capital", color: "hsl(222 50% 18%)" },
                  { key: "Assurance", color: "hsl(215 28% 70%)" },
                ].map((l) => (
                  <div
                    key={l.key}
                    className="flex items-center gap-1.5 text-xs text-foreground/60"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: l.color }}
                    />
                    {l.key}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
