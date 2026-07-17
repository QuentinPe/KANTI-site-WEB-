import { useMemo } from "react";
import type { Lead, LeadStatus } from "@/lib/leadsService";

export type PeriodKey = "7j" | "30j" | "3m" | "6m" | "12m" | "tout";

export const PERIODS: { key: PeriodKey; label: string; days: number }[] = [
  { key: "7j",   label: "7 j",  days: 7   },
  { key: "30j",  label: "30 j", days: 30  },
  { key: "3m",   label: "3 m",  days: 91  },
  { key: "6m",   label: "6 m",  days: 182 },
  { key: "12m",  label: "12 m", days: 365 },
  { key: "tout", label: "Tout", days: 9999 },
];

export const STATUS_CONFIG: Record<LeadStatus, { label: string; bg: string; color: string; dot: string }> = {
  nouveau:  { label: "Nouveau",  bg: "hsl(38 90% 50% / 0.12)",  color: "hsl(38 70% 34%)",  dot: "hsl(38 80% 48%)"  },
  appele:   { label: "Appelé",   bg: "hsl(200 70% 45% / 0.12)", color: "hsl(200 60% 32%)", dot: "hsl(200 70% 42%)" },
  traite:   { label: "Traité",   bg: "hsl(218 55% 42% / 0.10)", color: "hsl(218 48% 38%)", dot: "hsl(218 50% 42%)" },
  converti: { label: "Converti", bg: "hsl(142 55% 38% / 0.10)", color: "hsl(142 50% 30%)", dot: "hsl(142 52% 36%)" },
  archive:  { label: "Archivé",  bg: "hsl(224 12% 55% / 0.10)", color: "hsl(224 12% 45%)", dot: "hsl(224 12% 50%)" },
};

export const STATUS_ORDER: LeadStatus[] = ["nouveau", "appele", "traite", "converti", "archive"];

export function bucketLeadsByDay(
  leads: Lead[],
  days: number
): { label: string; total: number; converti: number }[] {
  const now = Date.now();
  const effectiveDays =
    days === 9999
      ? leads.length === 0
        ? 30
        : Math.min(365, Math.ceil((now - Math.min(...leads.map((l) => new Date(l.created_at).getTime()))) / 86_400_000) + 1)
      : days;

  const useWeeks = effectiveDays > 60;
  const bucketCount = useWeeks ? Math.ceil(effectiveDays / 7) : effectiveDays;

  const totals = Array(bucketCount).fill(0);
  const convertis = Array(bucketCount).fill(0);

  leads.forEach((l) => {
    const ageDays = (now - new Date(l.created_at).getTime()) / 86_400_000;
    if (ageDays > effectiveDays) return;
    const idx = useWeeks
      ? Math.floor((effectiveDays - ageDays) / 7)
      : Math.floor(effectiveDays - ageDays);
    const i = Math.min(idx, bucketCount - 1);
    totals[i]++;
    if (l.status === "converti") convertis[i]++;
  });

  return totals
    .map((total, i) => ({
      label: useWeeks ? `S${i + 1}` : `J-${bucketCount - 1 - i}`,
      total,
      converti: convertis[i],
    }))
    .reverse();
}

export function VolumeChart({
  leads,
  days,
  height = 72,
  showConverti = false,
}: {
  leads: Lead[];
  days: number;
  height?: number;
  showConverti?: boolean;
}) {
  const buckets = useMemo(() => bucketLeadsByDay(leads, days), [leads, days]);
  const max = Math.max(...buckets.map((b) => b.total), 1);
  const W = 400;
  const H = height;
  const pad = 4;

  const pts = buckets.map((b, i) => ({
    x: buckets.length === 1 ? W / 2 : pad + (i / (buckets.length - 1)) * (W - pad * 2),
    y: H - pad - (b.total / max) * (H - pad * 2),
    yC: H - pad - (b.converti / max) * (H - pad * 2),
  }));

  const area =
    pts.length < 2
      ? ""
      : `M ${pts[0].x},${pts[0].y} ` +
        pts.slice(1).map((p) => `L ${p.x},${p.y}`).join(" ") +
        ` L ${pts[pts.length - 1].x},${H} L ${pts[0].x},${H} Z`;

  const line =
    pts.length < 2
      ? ""
      : `M ${pts[0].x},${pts[0].y} ` + pts.slice(1).map((p) => `L ${p.x},${p.y}`).join(" ");

  const lineC =
    showConverti && pts.length >= 2
      ? `M ${pts[0].x},${pts[0].yC} ` + pts.slice(1).map((p) => `L ${p.x},${p.yC}`).join(" ")
      : "";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
      <defs>
        <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(218 45% 42%)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="hsl(218 45% 42%)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {area && <path d={area} fill="url(#volGrad)" />}
      {line && (
        <path d={line} fill="none" stroke="hsl(218 45% 42%)" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round" />
      )}
      {lineC && (
        <path d={lineC} fill="none" stroke="hsl(142 50% 40%)" strokeWidth="1.4"
          strokeDasharray="4 2" strokeLinecap="round" />
      )}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="hsl(218 45% 42%)" />
      ))}
    </svg>
  );
}

export function StatusBars({ leads }: { leads: Lead[] }) {
  const total = leads.length || 1;
  const entries = STATUS_ORDER.map((s) => ({
    status: s,
    count: leads.filter((l) => l.status === s).length,
    cfg: STATUS_CONFIG[s],
  })).filter((e) => e.count > 0);

  return (
    <div className="space-y-2 w-full">
      {entries.map((e) => (
        <div key={e.status} className="flex items-center gap-2">
          <span className="text-[10px] w-16 text-right font-medium" style={{ color: e.cfg.color }}>
            {e.cfg.label}
          </span>
          <div className="flex-1 h-2 rounded-full" style={{ background: "hsl(224 20% 12% / 0.06)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(e.count / total) * 100}%`, background: e.cfg.dot }}
            />
          </div>
          <span className="text-[10px] w-5 tabular-nums" style={{ color: "hsl(224 15% 50%)" }}>
            {e.count}
          </span>
        </div>
      ))}
    </div>
  );
}

export function PipelineHealth({ leads }: { leads: Lead[] }) {
  const now = Date.now();
  const active = leads.filter((l) => l.status === "nouveau" || l.status === "appele");
  const buckets = [
    { label: "< 4 h",  count: 0, color: "hsl(142 52% 36%)" },
    { label: "4–24 h", count: 0, color: "hsl(38 80% 48%)"  },
    { label: "1–3 j",  count: 0, color: "hsl(25 75% 50%)"  },
    { label: "> 3 j",  count: 0, color: "hsl(0 60% 52%)"   },
  ];
  active.forEach((l) => {
    const h = (now - new Date(l.created_at).getTime()) / 3_600_000;
    if (h < 4) buckets[0].count++;
    else if (h < 24) buckets[1].count++;
    else if (h < 72) buckets[2].count++;
    else buckets[3].count++;
  });
  const max = Math.max(...buckets.map((b) => b.count), 1);

  if (active.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[11px]" style={{ color: "hsl(224 15% 60%)" }}>
          Aucun lead en attente
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-3 h-16 w-full">
      {buckets.map((b) => (
        <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[10px] font-medium tabular-nums" style={{ color: b.color }}>
            {b.count}
          </span>
          <div
            className="w-full rounded-t transition-all duration-500"
            style={{
              height: `${Math.max((b.count / max) * 48, b.count > 0 ? 6 : 0)}px`,
              background: b.color,
              opacity: 0.85,
            }}
          />
          <span className="text-[9px] text-center leading-tight" style={{ color: "hsl(224 15% 55%)" }}>
            {b.label}
          </span>
        </div>
      ))}
    </div>
  );
}
