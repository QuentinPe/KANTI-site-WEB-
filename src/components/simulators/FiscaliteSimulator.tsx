import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import SimulatorShell from "./SimulatorShell";
import GlassSlider from "./GlassSlider";

export default function FiscaliteSimulator() {
  const [revenu, setRevenu] = useState(120000);
  const [foncier, setFoncier] = useState(20000);

  const { data, economie } = useMemo(() => {
    const base = revenu + foncier;
    const impotBrut = Math.round(base * 0.35);
    const apresOptim = Math.round(impotBrut * 0.72);
    const eco = impotBrut - apresOptim;
    return {
      economie: eco,
      data: [
        { label: "Avant", montant: impotBrut, color: "hsl(var(--primary))" },
        { label: "Après", montant: apresOptim, color: "hsl(var(--accent))" },
        { label: "Économie", montant: eco, color: "hsl(160 30% 45%)" },
      ],
    };
  }, [revenu, foncier]);

  return (
    <SimulatorShell
      eyebrow="Simulateur · Fiscalité"
      title="Estimez votre potentiel d'optimisation"
      subtitle="Comparez votre fiscalité actuelle à une stratégie optimisée par nos experts patrimoniaux."
    >
      <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-2 space-y-6">
          <GlassSlider label="Revenus annuels" value={`${(revenu / 1000).toFixed(0)}k €`} min={40000} max={500000} step={5000} current={revenu} onChange={setRevenu} />
          <GlassSlider label="Revenus fonciers" value={`${(foncier / 1000).toFixed(0)}k €`} min={0} max={100000} step={2000} current={foncier} onChange={setFoncier} />

          <div className="pt-4 border-t border-foreground/10">
            <div className="text-[9px] uppercase tracking-[0.2em] text-foreground/45 mb-1">Économie estimée</div>
            <div className="font-heading font-light text-2xl md:text-3xl tracking-tight text-[hsl(var(--accent))]">
              {(economie / 1000).toFixed(1)}k € / an
            </div>
            <p className="text-[11px] text-foreground/50 mt-2">Estimation indicative — un audit patrimonial précis est nécessaire.</p>
          </div>
        </div>

        <div className="lg:col-span-3 h-[280px] md:h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={56} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="hsl(var(--foreground) / 0.06)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--foreground) / 0.6)" }} stroke="hsl(var(--foreground) / 0.15)" tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "hsl(0 0% 100% / 0.92)", backdropFilter: "blur(12px)", border: "1px solid hsl(var(--foreground) / 0.1)", borderRadius: 12, fontSize: 12, boxShadow: "0 10px 40px hsl(var(--primary) / 0.15)" }}
                formatter={(v: number) => [`${(v / 1000).toFixed(1)}k €`, "Montant"]}
              />
              <Bar dataKey="montant" radius={[8, 8, 0, 0]}>
                {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </SimulatorShell>
  );
}
