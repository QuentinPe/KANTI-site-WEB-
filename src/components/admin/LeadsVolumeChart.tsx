import { useMemo, useState, useRef, useCallback, useId } from "react";
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

// ── Smooth cubic bezier path ────────────────────────────────────────────────────

function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  const t = 0.38; // tension
  let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p = pts[i], q = pts[i + 1];
    const dx = (q.x - p.x) * t;
    d += ` C ${(p.x + dx).toFixed(1)},${p.y.toFixed(1)} ${(q.x - dx).toFixed(1)},${q.y.toFixed(1)} ${q.x.toFixed(1)},${q.y.toFixed(1)}`;
  }
  return d;
}

// ── VolumeChart ─────────────────────────────────────────────────────────────────

export function VolumeChart({
  leads,
  days,
  height = 120,
  showConverti = false,
}: {
  leads: Lead[];
  days: number;
  height?: number;
  showConverti?: boolean;
}) {
  const uid  = useId().replace(/:/g, "");
  const gid  = `vg-${uid}`;
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const buckets = useMemo(() => bucketLeadsByDay(leads, days), [leads, days]);
  const max     = Math.max(...buckets.map((b) => b.total), 1);

  // SVG coordinate constants
  const W   = 400;
  const H   = height;
  const pL  = 30;  // left pad for Y labels
  const pR  = 6;
  const pT  = 8;
  const pB  = 18; // bottom pad for X labels
  const cW  = W - pL - pR;
  const cH  = H - pT - pB;

  const pts = useMemo(
    () =>
      buckets.map((b, i) => ({
        x:  buckets.length === 1 ? pL + cW / 2 : pL + (i / (buckets.length - 1)) * cW,
        y:  pT + cH - (b.total   / max) * cH,
        yC: pT + cH - (b.converti / max) * cH,
      })),
    [buckets, max, cW, cH]
  );

  const totalLine   = smoothPath(pts.map((p) => ({ x: p.x, y: p.y  })));
  const convertiLine = showConverti
    ? smoothPath(pts.map((p) => ({ x: p.x, y: p.yC })))
    : "";
  const areaPath = totalLine
    ? totalLine +
      ` L ${pts.at(-1)!.x.toFixed(1)},${(pT + cH).toFixed(1)}` +
      ` L ${pts[0].x.toFixed(1)},${(pT + cH).toFixed(1)} Z`
    : "";

  // Grid: 0, 50%, 100%
  const grid = max === 0
    ? []
    : [max, Math.round(max / 2)].map((val) => ({
        y: pT + cH - (val / max) * cH,
        val,
      }));

  // X labels: max 7
  const xStep = Math.max(1, Math.ceil(pts.length / 7));
  const xLabels = pts.map((p, i) => ({ ...p, i, label: buckets[i].label }))
    .filter((_, i) => i % xStep === 0 || i === pts.length - 1);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!svgRef.current || pts.length === 0) return;
      const rect = svgRef.current.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * W;
      let best = 0, bestD = Infinity;
      pts.forEach((p, i) => {
        const d = Math.abs(p.x - mx);
        if (d < bestD) { bestD = d; best = i; }
      });
      setHoveredIdx(best);
    },
    [pts]
  );

  const hp = hoveredIdx !== null ? pts[hoveredIdx] : null;
  const hb = hoveredIdx !== null ? buckets[hoveredIdx] : null;

  // Tooltip X position clamped to [5%, 95%] to avoid overflow
  const tipPct = hp ? Math.max(5, Math.min(95, (hp.x / W) * 100)) : 0;
  // Tooltip Y position: just above the dot, clamped to chart top
  const tipTopPct = hp
    ? Math.max(0, ((hp.y - 2) / H) * 100 - 36)
    : 0;

  const isEmpty = max === 1 && buckets.every((b) => b.total === 0);

  return (
    <div className="relative w-full select-none" style={{ height }}>
      {/* Tooltip */}
      {hp && hb && !isEmpty && (
        <div
          className="absolute pointer-events-none z-10"
          style={{
            left: `${tipPct}%`,
            top:  `${tipTopPct}%`,
            transform: "translateX(-50%)",
          }}
        >
          <div
            className="rounded-xl px-3 py-2 text-center"
            style={{
              background: "hsl(224 58% 9%)",
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow: "0 8px 28px rgba(0,0,0,0.50)",
              minWidth: 68,
            }}
          >
            <p className="mb-1 tracking-wide" style={{ color: "rgba(255,255,255,0.40)", fontSize: 9 }}>
              {hb.label}
            </p>
            <p className="font-semibold tabular-nums" style={{ color: "hsl(218 80% 78%)", fontSize: 14 }}>
              {hb.total}
            </p>
            <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 9 }}>
              lead{hb.total !== 1 ? "s" : ""}
            </p>
            {showConverti && hb.converti > 0 && (
              <p className="mt-1 font-medium" style={{ color: "hsl(142 65% 55%)", fontSize: 10 }}>
                {hb.converti} converti{hb.converti > 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
      )}

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-full"
        style={{ display: "block" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIdx(null)}
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="hsl(218 52% 55%)" stopOpacity="0.32" />
            <stop offset="60%"  stopColor="hsl(218 52% 55%)" stopOpacity="0.07" />
            <stop offset="100%" stopColor="hsl(218 52% 55%)" stopOpacity="0"    />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {grid.map(({ y, val }, i) => (
          <g key={i}>
            <line
              x1={pL} y1={y} x2={W - pR} y2={y}
              stroke="rgba(255,255,255,0.07)" strokeWidth="0.75"
              strokeDasharray="3 5"
            />
            <text
              x={pL - 5} y={y + 3.5}
              textAnchor="end"
              fill="rgba(255,255,255,0.30)"
              style={{ fontSize: "8px", fontVariantNumeric: "tabular-nums" }}
            >
              {val}
            </text>
          </g>
        ))}

        {/* Baseline */}
        <line
          x1={pL} y1={pT + cH} x2={W - pR} y2={pT + cH}
          stroke="rgba(255,255,255,0.12)" strokeWidth="0.75"
        />

        {/* X labels */}
        {xLabels.map(({ x, label }) => (
          <text
            key={label}
            x={x} y={H - 3}
            textAnchor="middle"
            fill="rgba(255,255,255,0.30)"
            style={{ fontSize: "7.5px" }}
          >
            {label}
          </text>
        ))}

        {/* Hover crosshair */}
        {hp && !isEmpty && (
          <line
            x1={hp.x} y1={pT} x2={hp.x} y2={pT + cH}
            stroke="rgba(255,255,255,0.18)" strokeWidth="1"
            strokeDasharray="2 3"
          />
        )}

        {/* Area fill */}
        {areaPath && <path d={areaPath} fill={`url(#${gid})`} />}

        {/* Total line */}
        {totalLine && (
          <path
            d={totalLine}
            fill="none"
            stroke="hsl(218 52% 62%)"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Convertis line */}
        {convertiLine && (
          <path
            d={convertiLine}
            fill="none"
            stroke="hsl(142 55% 52%)"
            strokeWidth="1.35"
            strokeDasharray="4 2.5"
            strokeLinecap="round"
          />
        )}

        {/* Data dots */}
        {pts.map((p, i) => {
          const isHov = hoveredIdx === i;
          return (
            <g key={i}>
              {isHov && (
                <circle cx={p.x} cy={p.y} r="7"
                  fill="hsl(218 52% 55%)" fillOpacity="0.14" />
              )}
              <circle
                cx={p.x} cy={p.y}
                r={isHov ? 4 : 2.5}
                fill={isHov ? "white" : "hsl(218 52% 62%)"}
                stroke={isHov ? "hsl(218 52% 50%)" : "transparent"}
                strokeWidth="1.8"
              />
              {showConverti && buckets[i].converti > 0 && (
                <circle
                  cx={p.x} cy={p.yC}
                  r={isHov ? 3.5 : 2}
                  fill={isHov ? "hsl(142 70% 70%)" : "hsl(142 55% 52%)"}
                />
              )}
            </g>
          );
        })}

        {/* Empty state overlay */}
        {isEmpty && (
          <text
            x={W / 2} y={H / 2}
            textAnchor="middle" dominantBaseline="middle"
            fill="rgba(255,255,255,0.22)"
            style={{ fontSize: "11px" }}
          >
            Aucun lead sur la période
          </text>
        )}
      </svg>
    </div>
  );
}

// ── StatusBars ──────────────────────────────────────────────────────────────────

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

// ── PipelineHealth ──────────────────────────────────────────────────────────────

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
