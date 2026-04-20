import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import SimulatorShell from "./SimulatorShell";
import GlassSlider from "./GlassSlider";

export default function CreditSimulator() {
  const [montant, setMontant] = useState(300000);
  const [taux, setTaux] = useState(3.2);
  const [duree, setDuree] = useState(20);

  const { mensualite, data, coutTotal } = useMemo(() => {
    const r = taux / 100 / 12;
    const n = duree * 12;
    const m = r > 0 ? (montant * r) / (1 - Math.pow(1 + r, -n)) : montant / n;
    const points = [];
    let restant = montant;
    for (let y = 0; y <= duree; y++) {
      points.push({ annee: `${y}`, restant: Math.round(restant) });
      for (let mo = 0; mo < 12 && restant > 0; mo++) {
        const interet = restant * r;
        const amort = m - interet;
        restant = Math.max(0, restant - amort);
      }
    }
    return { mensualite: Math.round(m), data: points, coutTotal: Math.round(m * n - montant) };
  }, [montant, taux, duree]);

  return (
    <SimulatorShell
      eyebrow="Simulateur · Crédit"
      title="Calculez votre capacité d'emprunt"
      subtitle="Estimez votre mensualité et le coût total de votre financement immobilier."
    >
      <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-2 space-y-6">
          <GlassSlider label="Montant emprunté" value={`${(montant / 1000).toFixed(0)}k €`} min={50000} max={2000000} step={10000} current={montant} onChange={setMontant} />
          <GlassSlider label="Taux d'intérêt" value={`${taux.toFixed(1)} %`} min={1} max={6} step={0.1} current={taux} onChange={setTaux} />
          <GlassSlider label="Durée" value={`${duree} ans`} min={5} max={30} step={1} current={duree} onChange={setDuree} />

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-foreground/10">
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-foreground/45 mb-1">Mensualité</div>
              <div className="font-heading font-light text-xl md:text-2xl tracking-tight text-[hsl(var(--accent))]">{mensualite.toLocaleString()} €</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-foreground/45 mb-1">Coût du crédit</div>
              <div className="font-heading font-light text-xl md:text-2xl tracking-tight text-foreground">{(coutTotal / 1000).toFixed(0)}k €</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 h-[280px] md:h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="hsl(var(--foreground) / 0.06)" vertical={false} />
              <XAxis dataKey="annee" tick={{ fontSize: 10, fill: "hsl(var(--foreground) / 0.5)" }} stroke="hsl(var(--foreground) / 0.15)" tickLine={false} axisLine={false} interval={Math.floor(duree / 5)} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "hsl(0 0% 100% / 0.92)", backdropFilter: "blur(12px)", border: "1px solid hsl(var(--foreground) / 0.1)", borderRadius: 12, fontSize: 12, boxShadow: "0 10px 40px hsl(var(--primary) / 0.15)" }}
                formatter={(v: number) => [`${(v / 1000).toFixed(0)}k €`, "Capital restant"]}
                labelFormatter={(l) => `Année ${l}`}
              />
              <Line type="monotone" dataKey="restant" stroke="hsl(var(--accent))" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </SimulatorShell>
  );
}
