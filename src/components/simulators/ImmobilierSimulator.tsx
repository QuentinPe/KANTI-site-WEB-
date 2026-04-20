import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import SimulatorShell from "./SimulatorShell";
import GlassSlider from "./GlassSlider";

export default function ImmobilierSimulator() {
  const [prix, setPrix] = useState(350000);
  const [loyer, setLoyer] = useState(1200);
  const [apport, setApport] = useState(70000);

  const { data, rendementBrut, rendementNet } = useMemo(() => {
    const rendBrut = ((loyer * 12) / prix) * 100;
    const charges = loyer * 12 * 0.25;
    const rendNet = ((loyer * 12 - charges) / prix) * 100;
    const points = [];
    let patrimoine = prix;
    let cashflow = 0;
    for (let y = 0; y <= 20; y++) {
      points.push({
        annee: `${y}`,
        valeurBien: Math.round(patrimoine),
        loyersCumules: Math.round(cashflow),
      });
      patrimoine *= 1.02;
      cashflow += loyer * 12 - charges;
    }
    return { data: points, rendementBrut: rendBrut, rendementNet: rendNet };
  }, [prix, loyer, apport]);

  return (
    <SimulatorShell
      eyebrow="Simulateur · Immobilier"
      title="Projetez votre investissement locatif"
      subtitle="Visualisez la valorisation du bien et les loyers cumulés sur 20 ans."
    >
      <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-2 space-y-6">
          <GlassSlider label="Prix du bien" value={`${(prix / 1000).toFixed(0)}k €`} min={100000} max={2000000} step={10000} current={prix} onChange={setPrix} />
          <GlassSlider label="Loyer mensuel" value={`${loyer} €`} min={300} max={5000} step={50} current={loyer} onChange={setLoyer} />
          <GlassSlider label="Apport" value={`${(apport / 1000).toFixed(0)}k €`} min={0} max={500000} step={5000} current={apport} onChange={setApport} />

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-foreground/10">
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-foreground/45 mb-1">Rdt brut</div>
              <div className="font-heading font-light text-lg md:text-xl tracking-tight text-foreground">{rendementBrut.toFixed(1)} %</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-foreground/45 mb-1">Rdt net</div>
              <div className="font-heading font-light text-lg md:text-xl tracking-tight text-[hsl(var(--accent))]">{rendementNet.toFixed(1)} %</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-foreground/45 mb-1">Loyers/an</div>
              <div className="font-heading font-light text-lg md:text-xl tracking-tight text-foreground">{((loyer * 12) / 1000).toFixed(0)}k €</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 h-[280px] md:h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradBien" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradLoyers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="hsl(var(--foreground) / 0.06)" vertical={false} />
              <XAxis dataKey="annee" tick={{ fontSize: 10, fill: "hsl(var(--foreground) / 0.5)" }} stroke="hsl(var(--foreground) / 0.15)" tickLine={false} axisLine={false} interval={4} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "hsl(0 0% 100% / 0.92)", backdropFilter: "blur(12px)", border: "1px solid hsl(var(--foreground) / 0.1)", borderRadius: 12, fontSize: 12, boxShadow: "0 10px 40px hsl(var(--primary) / 0.15)" }}
                formatter={(v: number, n: string) => [`${(v / 1000).toFixed(0)}k €`, n === "valeurBien" ? "Valeur du bien" : "Loyers cumulés"]}
                labelFormatter={(l) => `Année ${l}`}
              />
              <Area type="monotone" dataKey="valeurBien" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#gradBien)" />
              <Area type="monotone" dataKey="loyersCumules" stroke="hsl(var(--accent))" strokeWidth={2.5} fill="url(#gradLoyers)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </SimulatorShell>
  );
}
