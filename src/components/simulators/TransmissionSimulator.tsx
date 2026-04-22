import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import SimulatorShell from "./SimulatorShell";
import GlassSlider from "./GlassSlider";

export default function TransmissionSimulator() {
  const [patrimoine, setPatrimoine] = useState(800000);
  const [enfants, setEnfants] = useState(2);

  const { data, droitsSans, droitsAvec } = useMemo(() => {
    const abattement = 100000 * enfants;
    const assietteSans = Math.max(0, patrimoine - abattement);
    const droitsSans = Math.round(assietteSans * 0.20);
    const avAV = Math.min(patrimoine * 0.3, 152500 * enfants);
    const avDemembrement = patrimoine * 0.25;
    const assietteAvec = Math.max(0, patrimoine - abattement - avAV * 0.4 - avDemembrement * 0.3);
    const droitsAvec = Math.round(assietteAvec * 0.20);
    const economie = droitsSans - droitsAvec;

    return {
      droitsSans,
      droitsAvec,
      data: [
        { name: "Transmis net", value: patrimoine - droitsAvec, color: "hsl(var(--accent))" },
        { name: "Droits optimisés", value: droitsAvec, color: "hsl(var(--primary))" },
        { name: "Économie réalisée", value: economie, color: "hsl(160 30% 45%)" },
      ],
    };
  }, [patrimoine, enfants]);

  return (
    <SimulatorShell
      eyebrow="Transmission patrimoniale"
      index="05"
      title="Préservez ce qui compte vraiment"
      subtitle="Mesurez l'impact d'une stratégie de transmission optimisée sur les droits dus."
    >
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <div className="lg:col-span-5 space-y-8">
          <GlassSlider label="Patrimoine total" value={`${(patrimoine / 1000000).toFixed(2)}M €`} min={200000} max={5000000} step={50000} current={patrimoine} onChange={setPatrimoine} />
          <GlassSlider label="Nombre d'enfants" value={`${enfants}`} min={1} max={5} step={1} current={enfants} onChange={setEnfants} />

          <div className="grid grid-cols-2 gap-6 pt-8 border-t border-foreground/10">
            <div className="space-y-2">
              <div className="text-[9px] uppercase tracking-[0.28em] text-foreground/45">Sans optimisation</div>
              <div className="font-heading font-extralight text-3xl md:text-4xl tracking-[-0.02em] tabular-nums text-foreground/70 line-through decoration-foreground/30">{(droitsSans / 1000).toFixed(0)}k €</div>
            </div>
            <div className="space-y-2">
              <div className="text-[9px] uppercase tracking-[0.28em] text-foreground/45">Avec stratégie</div>
              <div className="font-heading font-extralight text-3xl md:text-4xl tracking-[-0.02em] tabular-nums text-[hsl(var(--accent))]">{(droitsAvec / 1000).toFixed(0)}k €</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 h-[300px] md:h-[380px] flex items-center gap-6 relative">
          <div className="absolute -top-3 left-0 text-[10px] uppercase tracking-[0.28em] text-foreground/45">
            Répartition optimisée
          </div>
          <ResponsiveContainer width="55%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={70} outerRadius={120} dataKey="value" stroke="none" paddingAngle={2}>
                {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip
                contentStyle={{ background: "hsl(0 0% 100% / 0.92)", backdropFilter: "blur(12px)", border: "1px solid hsl(var(--foreground) / 0.1)", borderRadius: 12, fontSize: 12, boxShadow: "0 10px 40px hsl(var(--primary) / 0.15)" }}
                formatter={(v: number) => [`${(v / 1000).toFixed(0)}k €`]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-3 text-[12px]">
            {data.map((d) => (
              <div key={d.name} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                <span className="text-foreground/60 flex-1">{d.name}</span>
                <span className="font-heading font-light text-base tracking-tight text-foreground">{(d.value / 1000).toFixed(0)}k €</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SimulatorShell>
  );
}
