import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Calculator, TrendingDown, PiggyBank } from "lucide-react";
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

const CONTACT_URL = "/contact";
const SIMULATOR_URL = "/courtage-patrimonial/simulateur-financement";

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

export default function SimulatorTeaserSection() {
  const reduce = useReducedMotion();

  const result = useMemo(
    () =>
      computeAmortizationSchedule({
        principal: 400_000,
        annualRate: 0.038,
        durationMonths: 240,
        insuranceRate: 0.003,
      }),
    []
  );

  // Annual sample for chart
  const chartData = useMemo(() => {
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

  const stats = [
    {
      icon: <Calculator className="w-5 h-5" />,
      label: "Mensualité indicative",
      value: formatEurFull(result.monthlyPaymentWithInsurance) + "/mois",
    },
    {
      icon: <TrendingDown className="w-5 h-5" />,
      label: "Coût total",
      value: formatEur(result.totalCost),
    },
    {
      icon: <PiggyBank className="w-5 h-5" />,
      label: "Capacité estimative",
      value: "Calculée en direct",
    },
  ];

  return (
    <section
      className="section-padding"
      style={{ background: "hsl(var(--navy-deep))" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left */}
          <motion.div
            className="lg:col-span-4"
            initial={reduce ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            viewport={{ once: true, margin: "-60px" }}
          >
            <p className="text-[10px] tracking-[0.32em] uppercase text-white/40 mb-5 font-medium">
              08 · Simulateur de financement
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-light text-white leading-[1.1] tracking-tight mb-6">
              Projetez votre financement avant de déposer votre dossier.
            </h2>
            <p className="text-white/55 leading-relaxed font-light text-sm mb-8">
              Simulez mensualité, coût total et taux d'effort en temps réel.
              Modifiez le montant, la durée ou le taux pour comparer plusieurs
              stratégies.
            </p>

            {/* Stats */}
            <div className="space-y-4 mb-10">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  className="flex items-center gap-4 p-4 rounded-xl border border-white/8 bg-white/4"
                  initial={reduce ? false : { opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <span className="text-white/40">{s.icon}</span>
                  <div>
                    <p className="text-[11px] text-white/40 tracking-wide mb-0.5">
                      {s.label}
                    </p>
                    <p className="text-white font-medium text-base font-heading">
                      {s.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <Link
                to={SIMULATOR_URL}
                className="inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-full text-sm font-medium tracking-wide bg-white text-[hsl(224_60%_7%)] hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group"
              >
                Accéder au simulateur
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to={CONTACT_URL}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-light tracking-wide text-white/65 hover:text-white border border-white/15 hover:border-white/30 transition-all duration-300"
              >
                Étudier mon financement
              </Link>
            </div>
          </motion.div>

          {/* Right chart */}
          <motion.div
            className="lg:col-span-8 lg:sticky lg:top-24 lg:self-start"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.15 }}
            viewport={{ once: true, margin: "-60px" }}
          >
            <div className="rounded-2xl bg-white/6 border border-white/10 p-4 md:p-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs text-white/50 tracking-wide">
                  Projection illustrative · 400 000 € · 20 ans · 3,8% + assurance
                </p>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/10 text-white/50 border border-white/10">
                  Données de démonstration
                </span>
              </div>

              {/* Metrics row */}
              <div className="grid grid-cols-4 gap-3 mb-5">
                {[
                  {
                    label: "Mensualité",
                    value: formatEurFull(result.monthlyPaymentWithInsurance),
                  },
                  { label: "Intérêts", value: formatEur(result.totalInterest) },
                  { label: "Assurance", value: formatEur(result.totalInsurance) },
                  { label: "Coût total", value: formatEur(result.totalCost) },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="bg-white/5 rounded-xl p-3 text-center"
                  >
                    <p className="text-[10px] text-white/35 mb-1">{m.label}</p>
                    <p className="text-sm font-medium text-white/85 font-heading">
                      {m.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div
                className="h-56 [&_.recharts-text]:fill-white/40"
                aria-label="Courbe capital restant dû"
                role="img"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(0 0% 100% / 0.08)"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 10, fill: "hsl(0 0% 100% / 0.35)" }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `M${v}`}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "hsl(0 0% 100% / 0.35)" }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => formatEur(v)}
                      width={52}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(224 60% 7%)",
                        border: "1px solid hsl(0 0% 100% / 0.12)",
                        borderRadius: 12,
                        fontSize: 12,
                        color: "hsl(0 0% 100% / 0.7)",
                      }}
                      labelFormatter={(v) => `Mois ${v}`}
                      formatter={(v: number, name: string) => [
                        formatEur(v),
                        name === "capital" ? "Capital restant" : name,
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="capital"
                      stroke="hsl(215 40% 65%)"
                      fill="hsl(215 40% 65% / 0.2)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <p className="text-[11px] italic text-white/30 mt-4 text-center">
              Les résultats présentés reposent sur des hypothèses de démonstration et ne
              constituent pas une offre de prêt.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
