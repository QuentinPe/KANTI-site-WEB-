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
      eyebrow="Simulateur · Dirigeants"
      title="Comparez vos stratégies de rémunération"
      subtitle="Salaire, dividendes, holding : visualisez l'impact fiscal de chaque arbitrage."
    >
      <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-2 space-y-6">
          <GlassSlider label="CA annuel" value={`${(ca / 1000).toFixed(0)}k €`} min={80000} max={2000000} step={10000} current={ca} onChange={setCa} />
          <GlassSlider label="Rémunération visée" value={`${(remuneration / 1000).toFixed(0)}k €`} min={30000} max={500000} step={5000} current={remuneration} onChange={setRemuneration} />

          <div className="pt-4 border-t border-foreground/10 space-y-2 text-[12px]">
            {data.map((d) => (
              <div key={d.scenario} className="flex justify-between items-baseline">
                <span className="text-foreground/60">{d.scenario}</span>
                <span className="font-heading font-light text-base tracking-tight text-[hsl(var(--accent))]">
                  {(d.net / 1000).toFixed(0)}k € net
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 h-[280px] md:h-[340px]">
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
