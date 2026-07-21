import { useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { computeMonthlyPayment, computeFundingPlan } from "@/lib/financing/loanEngine";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-foreground/10 rounded-xl px-4 py-2.5 shadow-lg text-sm">
      <p className="font-medium text-foreground">{payload[0].name}</p>
      <p className="text-foreground/60">{formatEur(payload[0].value)}</p>
    </div>
  );
}

function formatEur(v: number) {
  if (v >= 1_000_000)
    return `${(v / 1_000_000).toFixed(2).replace(".", ",")} M€`;
  if (v >= 1_000) return `${Math.round(v / 1000)} k€`;
  return `${Math.round(v)} €`;
}

function formatEurFull(v: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(v);
}

const BASE = {
  propertyPrice: 650_000,
  works: 80_000,
  acquisitionFees: 52_000,
  guarantee: 7_500,
  brokerageFees: 3_500,
};

const COST_ROWS = [
  { label: "Prix du bien", key: "propertyPrice" as const, color: "hsl(222 50% 18%)" },
  { label: "Travaux", key: "works" as const, color: "hsl(218 45% 35%)" },
  { label: "Frais d'acquisition", key: "acquisitionFees" as const, color: "hsl(215 40% 50%)" },
  { label: "Garantie", key: "guarantee" as const, color: "hsl(215 35% 62%)" },
  { label: "Frais de courtage", key: "brokerageFees" as const, color: "hsl(215 28% 72%)" },
];

export default function FundingPlanSection() {
  const reduce = useReducedMotion();
  const [contribution, setContribution] = useState(180_000);

  const plan = useMemo(
    () => computeFundingPlan({ ...BASE, contribution }),
    [contribution]
  );

  const estimatedMonthly = useMemo(() => {
    if (plan.loanNeeded <= 0) return 0;
    const base = computeMonthlyPayment(plan.loanNeeded, 0.038, 240);
    const insurance = (plan.loanNeeded * 0.003) / 12;
    return base + insurance;
  }, [plan.loanNeeded]);

  const pieData = [
    { name: "Apport personnel", value: contribution },
    { name: "Financement nécessaire", value: plan.loanNeeded },
  ];

  const pieColors = ["hsl(222 50% 18%)", "hsl(215 35% 62%)"];

  return (
    <section className="section-padding bg-background">
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
              02 · Plan de financement
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-[1.1] tracking-tight mb-6">
              Comprendre où va chaque euro du projet.
            </h2>
            <p className="text-foreground/65 leading-relaxed font-light text-base mb-6">
              Un plan de financement complet intègre le prix du bien, les
              travaux, les frais annexes et l'apport mobilisé. C'est à partir
              de cet ensemble que le besoin d'emprunt est déterminé.
            </p>
            <p className="text-foreground/65 leading-relaxed font-light text-base mb-8">
              L'apport que vous conservez impacte directement le montant emprunté,
              la mensualité et la trésorerie disponible pour d'autres projets.
            </p>
            <p className="text-[12px] italic text-foreground/40 leading-relaxed">
              Exemple fictif · données pédagogiques. Les chiffres sont
              modifiables à titre illustratif.
            </p>
          </motion.div>

          {/* Right data */}
          <motion.div
            className="lg:col-span-7"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.12 }}
            viewport={{ once: true, margin: "-60px" }}
          >
            <div className="rounded-2xl border border-foreground/8 bg-white p-6 md:p-8 shadow-sm space-y-8">
              {/* Cost breakdown */}
              <div>
                <p className="text-[10px] tracking-widest uppercase text-foreground/40 mb-4">
                  Composition du coût du projet
                </p>
                <div className="space-y-2">
                  {COST_ROWS.map((row) => {
                    const val = BASE[row.key];
                    const pct = (val / plan.totalCost) * 100;
                    return (
                      <div key={row.key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-foreground/65">{row.label}</span>
                          <span className="font-medium text-foreground/80">
                            {formatEurFull(val)}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-foreground/6 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              background: row.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-4 pt-4 border-t border-foreground/8">
                  <span className="text-sm font-medium text-foreground/70">
                    Coût total du projet
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {formatEurFull(plan.totalCost)}
                  </span>
                </div>
              </div>

              {/* Donut + key metrics */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Donut */}
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-foreground/40 mb-3">
                    Sources de financement
                  </p>
                  <div
                    className="h-44"
                    aria-label="Répartition apport / emprunt"
                    role="img"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius="55%"
                          outerRadius="80%"
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {pieData.map((_, i) => (
                            <Cell
                              key={`cell-${i}`}
                              fill={pieColors[i]}
                              stroke="transparent"
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col gap-1.5 mt-2">
                    {pieData.map((d, i) => (
                      <div key={d.name} className="flex items-center gap-2 text-xs text-foreground/60">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ background: pieColors[i] }}
                        />
                        {d.name}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 content-start">
                  {[
                    { label: "Projet total", value: formatEur(plan.totalCost) },
                    { label: "Apport", value: formatEur(contribution) },
                    { label: "Financement", value: formatEur(plan.loanNeeded) },
                    {
                      label: "Mensualité est.",
                      value: `${formatEur(estimatedMonthly)}/mois`,
                    },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="bg-background/60 rounded-xl p-3 flex flex-col gap-1"
                    >
                      <span className="text-[10px] text-foreground/40 tracking-wide">
                        {m.label}
                      </span>
                      <span className="text-sm font-medium text-foreground/80 font-heading">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slider */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-foreground/65">
                    Apport personnel
                  </label>
                  <span className="text-sm font-medium text-foreground/80">
                    {formatEurFull(contribution)}
                  </span>
                </div>
                <input
                  type="range"
                  min={50_000}
                  max={300_000}
                  step={5_000}
                  value={contribution}
                  onChange={(e) => setContribution(Number(e.target.value))}
                  className="w-full accent-foreground"
                  aria-label="Apport personnel"
                />
                <div className="flex justify-between text-[10px] text-foreground/30 mt-1">
                  <span>50 000 €</span>
                  <span>300 000 €</span>
                </div>
                <p className="text-[11px] italic text-foreground/35 mt-3">
                  Mensualité estimée sur 20 ans à 3,8% + 0,3% assurance · à
                  titre indicatif uniquement
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
