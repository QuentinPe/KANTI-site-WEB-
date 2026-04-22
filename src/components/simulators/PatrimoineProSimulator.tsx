import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import SimulatorShell from "./SimulatorShell";
import GlassSlider from "./GlassSlider";

export default function PatrimoineProSimulator() {
  const [ca, setCa] = useState(250000);
  const [remuneration, setRemuneration] = useState(80000);

  const data = useMemo(() => {
    const dividendes = Math.max(0, (ca * 0.15) - remuneration * 0.1);
    const is = ca * 0.15 * 0.25;
    const irSalaire = remuneration * 0.30;
    const irDividendes = dividendes * 0.30;
    const chargesSociales = remuneration * 0.45;

    return [
      { scenario: "Salaire seul", net: Math.round(remuneration - irSalaire - chargesSociales), fiscalite: Math.round(irSalaire + chargesSociales) },
      { scenario: "Mixte optimal", net: Math.round(remuneration * 0.65 * 0.55 + dividendes * 0.7), fiscalite: Math.round(remuneration * 0.65 * 0.45 + dividendes * 0.30) },
      { scenario: "Holding", net: Math.round(remuneration * 0.6 * 0.58 + is * 0.7), fiscalite: Math.round(remuneration * 0.6 * 0.42 + is * 0.3) },
    ];
  }, [ca, remuneration]);

  return (
    <SimulatorShell
      eyebrow="Dirigeants & associés"
      index="05"
      title="Comparez vos stratégies de rémunération"
      subtitle="Salaire, dividendes, holding : visualisez l'impact fiscal de chaque arbitrage."
      disclaimer="Modélisation simplifiée à visée pédagogique. Une étude personnalisée intègre votre régime social, votre situation patrimoniale et votre projet."
    >
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <div className="lg:col-span-5 space-y-8">
          <GlassSlider label="CA annuel" value={`${(ca / 1000).toFixed(0)}k €`} min={80000} max={2000000} step={10000} current={ca} onChange={setCa} />
          <GlassSlider label="Rémunération visée" value={`${(remuneration / 1000).toFixed(0)}k €`} min={30000} max={500000} step={5000} current={remuneration} onChange={setRemuneration} />

          <div className="pt-8 border-t border-foreground/10 space-y-4">
            <div className="text-[9px] uppercase tracking-[0.28em] text-foreground/45">Net perçu par scénario</div>
            <div className="space-y-3">
              {data.map((d, i) => (
                <div key={d.scenario} className="flex justify-between items-baseline gap-4 py-2 border-b border-foreground/5 last:border-0">
                  <span className="flex items-baseline gap-3 text-sm text-foreground/70">
                    <span className="text-[10px] tabular-nums text-foreground/35">0{i + 1}</span>
                    {d.scenario}
                  </span>
                  <span className={`font-heading font-extralight text-2xl tracking-[-0.02em] tabular-nums ${i === 1 ? "text-[hsl(var(--accent))]" : "text-foreground"}`}>
                    {(d.net / 1000).toFixed(0)}k €
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 h-[300px] md:h-[380px] relative">
          <div className="absolute -top-3 left-0 text-[10px] uppercase tracking-[0.28em] text-foreground/45">
            Net vs. fiscalité & charges
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={48} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="hsl(var(--foreground) / 0.06)" vertical={false} />
              <XAxis dataKey="scenario" tick={{ fontSize: 11, fill: "hsl(var(--foreground) / 0.6)" }} stroke="hsl(var(--foreground) / 0.15)" tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "hsl(0 0% 100% / 0.92)", backdropFilter: "blur(12px)", border: "1px solid hsl(var(--foreground) / 0.1)", borderRadius: 12, fontSize: 12, boxShadow: "0 10px 40px hsl(var(--primary) / 0.15)" }}
                formatter={(v: number) => [`${(v / 1000).toFixed(0)}k €`]}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Bar dataKey="net" stackId="a" fill="hsl(var(--accent))" radius={[0, 0, 0, 0]} name="Net perçu" />
              <Bar dataKey="fiscalite" stackId="a" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Fiscalité & charges" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </SimulatorShell>
  );
}
