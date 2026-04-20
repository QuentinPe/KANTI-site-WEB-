import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import SimulatorShell from "./SimulatorShell";
import GlassSlider from "./GlassSlider";

export default function EpargneSimulator() {
  const [capital, setCapital] = useState(50000);
  const [mensualite, setMensualite] = useState(500);
  const [duree, setDuree] = useState(15);
  const rendement = 0.04;

  const data = useMemo(() => {
    const points = [];
    let cumul = capital;
    let versements = capital;
    for (let y = 0; y <= duree; y++) {
      points.push({
        annee: `${y}`,
        capital: Math.round(cumul),
        versements: Math.round(versements),
      });
      cumul = (cumul + mensualite * 12) * (1 + rendement);
      versements += mensualite * 12;
    }
    return points;
  }, [capital, mensualite, duree]);

  const finalCapital = data[data.length - 1]?.capital ?? 0;
  const totalVerse = data[data.length - 1]?.versements ?? 0;
  const gains = finalCapital - totalVerse;

  return (
    <SimulatorShell
      eyebrow="Simulateur · Épargne"
      title="Projetez la croissance de votre capital"
      subtitle="Visualisez l'effet des intérêts composés sur votre épargne, avec un rendement cible de 4 % annuel."
    >
      <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-2 space-y-6">
          <GlassSlider label="Capital initial" value={`${(capital / 1000).toFixed(0)}k €`} min={10000} max={500000} step={5000} current={capital} onChange={setCapital} />
          <GlassSlider label="Épargne mensuelle" value={`${mensualite} €`} min={100} max={5000} step={100} current={mensualite} onChange={setMensualite} />
          <GlassSlider label="Durée" value={`${duree} ans`} min={5} max={30} step={1} current={duree} onChange={setDuree} />

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-foreground/10">
            <Stat label="Versé" value={`${(totalVerse / 1000).toFixed(0)}k €`} />
            <Stat label="Gains" value={`${gains > 0 ? "+" : ""}${(gains / 1000).toFixed(0)}k €`} accent />
            <Stat label="Capital final" value={`${(finalCapital / 1000).toFixed(0)}k €`} />
          </div>
        </div>

        <div className="lg:col-span-3 h-[280px] md:h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradCapital" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradVersements" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.20} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="hsl(var(--foreground) / 0.06)" vertical={false} />
              <XAxis dataKey="annee" tick={{ fontSize: 10, fill: "hsl(var(--foreground) / 0.5)" }} stroke="hsl(var(--foreground) / 0.15)" tickLine={false} axisLine={false} interval={Math.floor(duree / 5)} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "hsl(0 0% 100% / 0.92)", backdropFilter: "blur(12px)", border: "1px solid hsl(var(--foreground) / 0.1)", borderRadius: 12, fontSize: 12, boxShadow: "0 10px 40px hsl(var(--primary) / 0.15)" }}
                formatter={(v: number, n: string) => [`${(v / 1000).toFixed(0)}k €`, n === "capital" ? "Capital" : "Versements"]}
                labelFormatter={(l) => `Année ${l}`}
              />
              <Area type="monotone" dataKey="versements" stroke="hsl(var(--primary))" strokeWidth={1.5} fill="url(#gradVersements)" />
              <Area type="monotone" dataKey="capital" stroke="hsl(var(--accent))" strokeWidth={2.5} fill="url(#gradCapital)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </SimulatorShell>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-[0.2em] text-foreground/45 mb-1">{label}</div>
      <div className={`font-heading font-light text-lg md:text-xl tracking-tight ${accent ? "text-[hsl(var(--accent))]" : "text-foreground"}`}>
        {value}
      </div>
    </div>
  );
}
