import { useRef } from "react";
import { useInView } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";

// ── DATA ────────────────────────────────────────────────────────────────────
// Source : Observatoire du Crédit Logement / CSA – taux moyen toutes durées
const TAUX_DATA = [
  { period: "Jan. 2020", taux: 1.17 },
  { period: "Juil. 2020", taux: 1.28 },
  { period: "Jan. 2021", taux: 1.13 },
  { period: "Juil. 2021", taux: 1.05 },
  { period: "Jan. 2022", taux: 1.06 },
  { period: "Avr. 2022", taux: 1.27 },
  { period: "Juil. 2022", taux: 1.86 },
  { period: "Oct. 2022", taux: 2.25 },
  { period: "Jan. 2023", taux: 2.82 },
  { period: "Avr. 2023", taux: 3.35 },
  { period: "Juil. 2023", taux: 3.85 },
  { period: "Oct. 2023", taux: 4.22 },
  { period: "Jan. 2024", taux: 4.20 },
  { period: "Avr. 2024", taux: 3.98 },
  { period: "Juil. 2024", taux: 3.62 },
  { period: "Oct. 2024", taux: 3.38 },
  { period: "Jan. 2025", taux: 3.20 },
];

// Économies réalisées en intérêts sur 20 ans selon l'écart de taux négocié
// Base : 0,5 % de mieux (ex : 4,2 % → 3,7 %). Calcul : M×n − P avec M = P×r×(1+r)^n/((1+r)^n−1)
const SAVINGS_DATA = [
  { montant: "200 000 €", marche: 95900, negocie: 83300, economie: 12600 },
  { montant: "300 000 €", marche: 143900, negocie: 124900, economie: 19000 },
  { montant: "400 000 €", marche: 191800, negocie: 166600, economie: 25200 },
  { montant: "500 000 €", marche: 239800, negocie: 208200, economie: 31600 },
];

// ── CUSTOM TOOLTIP · Taux ───────────────────────────────────────────────────
function TauxTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "hsl(224 60% 10% / 0.92)",
        backdropFilter: "blur(16px)",
        border: "1px solid hsl(0 0% 100% / 0.10)",
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: "0 12px 40px -8px hsl(0 0% 0% / 0.35)",
      }}
    >
      <p style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "hsl(0 0% 100% / 0.45)", marginBottom: 4 }}>
        {label}
      </p>
      <p style={{ fontSize: 20, fontWeight: 300, color: "#fff", lineHeight: 1 }}>
        {payload[0].value.toFixed(2)} %
      </p>
    </div>
  );
}

// ── CUSTOM TOOLTIP · Économies ──────────────────────────────────────────────
function SavingsTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const row = SAVINGS_DATA.find((d) => d.montant === label);
  return (
    <div
      style={{
        background: "hsl(224 60% 10% / 0.92)",
        backdropFilter: "blur(16px)",
        border: "1px solid hsl(0 0% 100% / 0.10)",
        borderRadius: 10,
        padding: "10px 14px",
        minWidth: 180,
        boxShadow: "0 12px 40px -8px hsl(0 0% 0% / 0.35)",
      }}
    >
      <p style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "hsl(0 0% 100% / 0.45)", marginBottom: 6 }}>
        {label}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
          <span style={{ fontSize: 12, color: "hsl(0 0% 100% / 0.55)" }}>Taux marché (4,2 %)</span>
          <span style={{ fontSize: 13, color: "#fff", fontVariantNumeric: "tabular-nums" }}>{(row?.marche ?? 0).toLocaleString("fr-FR")} €</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
          <span style={{ fontSize: 12, color: "hsl(218 60% 72%)" }}>Taux négocié (3,7 %)</span>
          <span style={{ fontSize: 13, color: "hsl(218 60% 72%)", fontVariantNumeric: "tabular-nums" }}>{(row?.negocie ?? 0).toLocaleString("fr-FR")} €</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, borderTop: "1px solid hsl(0 0% 100% / 0.10)", paddingTop: 6, marginTop: 2 }}>
          <span style={{ fontSize: 12, color: "hsl(142 60% 65%)" }}>Économie</span>
          <span style={{ fontSize: 14, fontWeight: 500, color: "hsl(142 60% 65%)", fontVariantNumeric: "tabular-nums" }}>−{(row?.economie ?? 0).toLocaleString("fr-FR")} €</span>
        </div>
      </div>
    </div>
  );
}

// ── CHART CARD WRAPPER ──────────────────────────────────────────────────────
function ChartCard({ children, eyebrow, title, source }: {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  source: string;
}) {
  return (
    <div
      className="rounded-2xl p-6 md:p-8 flex flex-col gap-5"
      style={{
        background: "hsl(0 0% 100%)",
        border: "1px solid hsl(224 60% 12% / 0.08)",
        boxShadow: "0 4px 24px -8px hsl(224 60% 12% / 0.10)",
      }}
    >
      <div>
        <p className="text-[10px] tracking-[0.28em] uppercase text-[hsl(218_45%_38%)] font-medium mb-1">
          {eyebrow}
        </p>
        <h3 className="font-heading text-xl md:text-2xl font-light text-[hsl(224_60%_12%)] tracking-tight leading-snug">
          {title}
        </h3>
      </div>
      <div className="flex-1">{children}</div>
      <p className="text-[10px] text-[hsl(224_40%_55%)] font-light">
        Source : {source}
      </p>
    </div>
  );
}

// ── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function CreditCharts() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const NAVY = "hsl(224, 60%, 18%)";
  const ELECTRIC = "hsl(218, 45%, 38%)";
  const ELECTRIC_LIGHT = "hsl(218, 60%, 72%)";

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <div className="electric-line mb-5" />
          <p className="text-[11px] tracking-[0.3em] uppercase text-[hsl(218_45%_38%)] mb-4 font-medium">
            Marchés & données
          </p>
          <h2 className="text-3xl md:text-5xl font-heading font-light text-[hsl(224_60%_12%)] leading-[1.08] tracking-tight mb-4">
            Le contexte du crédit en France
          </h2>
          <p className="text-[hsl(224_40%_38%)] text-base md:text-lg font-light leading-relaxed">
            Pourquoi 0,5 % de mieux sur votre taux peut représenter plusieurs dizaines de milliers d'euros. Et pourquoi cette négociation ne s'improvise pas.
          </p>
        </div>

        {/* Charts grid */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* CHART 1 · Évolution des taux */}
          <ChartCard
            eyebrow="Taux d'emprunt immobilier"
            title="Évolution 2020 – 2025 (toutes durées)"
            source="Observatoire du Crédit Logement / CSA"
          >
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={TAUX_DATA} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tauxGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={ELECTRIC} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={ELECTRIC} stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="hsl(224 60% 12% / 0.05)" />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 10, fill: "hsl(224 50% 45%)", fontFamily: "inherit" }}
                  tickLine={false}
                  axisLine={false}
                  interval={3}
                />
                <YAxis
                  domain={[0.8, 4.6]}
                  tick={{ fontSize: 10, fill: "hsl(224 50% 45%)", fontFamily: "inherit" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v} %`}
                />
                <Tooltip content={<TauxTooltip />} cursor={{ stroke: "hsl(224 60% 12% / 0.12)", strokeWidth: 1 }} />
                <ReferenceLine
                  y={4.22}
                  stroke="hsl(0 60% 55% / 0.4)"
                  strokeDasharray="4 3"
                  label={{ value: "Pic : 4,22 %", position: "insideTopRight", fontSize: 10, fill: "hsl(0 55% 50%)" }}
                />
                <Area
                  type="monotone"
                  dataKey="taux"
                  stroke={ELECTRIC}
                  strokeWidth={2}
                  fill="url(#tauxGradient)"
                  dot={false}
                  activeDot={{ r: 4, fill: ELECTRIC, strokeWidth: 0 }}
                  isAnimationActive={inView}
                  animationDuration={1200}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* CHART 2 · Impact du taux négocié */}
          <ChartCard
            eyebrow="Simulation · 20 ans"
            title="Économie réalisée avec 0,5 % de mieux"
            source="Simulation KANTI · Hypothèse : −0,5 % vs taux de marché (4,2 → 3,7 %)"
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={SAVINGS_DATA} margin={{ top: 8, right: 4, left: -12, bottom: 0 }} barCategoryGap="28%">
                <CartesianGrid vertical={false} stroke="hsl(224 60% 12% / 0.05)" />
                <XAxis
                  dataKey="montant"
                  tick={{ fontSize: 10, fill: "hsl(224 50% 45%)", fontFamily: "inherit" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "hsl(224 50% 45%)", fontFamily: "inherit" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)} k€`}
                />
                <Tooltip content={<SavingsTooltip />} cursor={{ fill: "hsl(224 60% 12% / 0.04)" }} />
                <Bar dataKey="marche" name="Taux marché" radius={[4, 4, 0, 0]} isAnimationActive={inView} animationDuration={1000}>
                  {SAVINGS_DATA.map((_, i) => (
                    <Cell key={i} fill={`hsl(224 50% ${26 + i * 3}% / 0.55)`} />
                  ))}
                </Bar>
                <Bar dataKey="negocie" name="Taux négocié" radius={[4, 4, 0, 0]} isAnimationActive={inView} animationDuration={1200} animationBegin={150}>
                  {SAVINGS_DATA.map((_, i) => (
                    <Cell key={i} fill={ELECTRIC_LIGHT} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex gap-5 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ background: "hsl(224 50% 32% / 0.55)" }} />
                <span className="text-[11px] text-[hsl(224_50%_40%)]">Taux marché (4,2 %)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ background: ELECTRIC_LIGHT }} />
                <span className="text-[11px] text-[hsl(224_50%_40%)]">Taux négocié (3,7 %)</span>
              </div>
            </div>
          </ChartCard>

        </div>

        {/* Bottom callout */}
        <div
          className="mt-6 rounded-2xl p-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"
          style={{
            background: "hsl(220 30% 97%)",
            border: "1px solid hsl(224 60% 12% / 0.07)",
          }}
        >
          <p className="text-[13.5px] text-[hsl(224_40%_35%)] font-light leading-relaxed">
            <span className="text-[hsl(224_60%_14%)] font-medium">Chaque 0,1 % de moins</span> sur un crédit de 300 000 € sur 20 ans représente environ{" "}
            <span className="text-[hsl(224_60%_14%)] font-medium">3 800 € d'économies</span> sur le coût total.
            C'est la valeur d'une négociation experte.
          </p>
          <p className="text-[11px] text-[hsl(224_40%_55%)] font-light flex-shrink-0">
            Données : Banque de France · Déc. 2024
          </p>
        </div>

      </div>
    </section>
  );
}
