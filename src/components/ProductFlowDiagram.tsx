import { ActorNode, FlowEdge } from "@/data/productsAnalysis";

/**
 * Lightweight SVG actors-and-flows diagram.
 * Layout : circular placement around the central manager / vehicle.
 * Uses semantic design tokens (gold, foreground, electric) — no raw colours.
 */
export default function ProductFlowDiagram({
  actors,
  flows,
}: {
  actors: ActorNode[];
  flows: FlowEdge[];
}) {
  const W = 720;
  const H = 420;
  const cx = W / 2;
  const cy = H / 2;
  const radius = Math.min(W, H) * 0.36;

  // Position actors evenly on a circle
  const positions = actors.reduce<Record<string, { x: number; y: number }>>(
    (acc, a, i) => {
      const angle = (i / actors.length) * Math.PI * 2 - Math.PI / 2;
      acc[a.id] = { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
      return acc;
    },
    {},
  );

  const kindFill: Record<ActorNode["kind"], string> = {
    client: "hsl(var(--gold) / 0.18)",
    manager: "hsl(var(--electric) / 0.22)",
    vehicle: "hsl(var(--foreground) / 0.08)",
    counterparty: "hsl(var(--foreground) / 0.05)",
    regulator: "hsl(var(--foreground) / 0.04)",
    tax: "hsl(var(--foreground) / 0.04)",
  };
  const kindStroke: Record<ActorNode["kind"], string> = {
    client: "hsl(var(--gold) / 0.7)",
    manager: "hsl(var(--electric) / 0.7)",
    vehicle: "hsl(var(--foreground) / 0.35)",
    counterparty: "hsl(var(--foreground) / 0.25)",
    regulator: "hsl(var(--foreground) / 0.2)",
    tax: "hsl(var(--foreground) / 0.2)",
  };

  return (
    <div className="w-full overflow-hidden rounded-[var(--radius)] glass-strong p-4 md:p-6">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Schéma des acteurs et des flux">
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="hsl(var(--foreground) / 0.55)" />
          </marker>
        </defs>

        {/* Edges */}
        {flows.map((f, i) => {
          const a = positions[f.from];
          const b = positions[f.to];
          if (!a || !b) return null;
          // shorten the line so the arrow lands on the node edge (~40px)
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const len = Math.hypot(dx, dy) || 1;
          const ux = dx / len;
          const uy = dy / len;
          const x1 = a.x + ux * 42;
          const y1 = a.y + uy * 28;
          const x2 = b.x - ux * 46;
          const y2 = b.y - uy * 32;
          const mx = (x1 + x2) / 2;
          const my = (y1 + y2) / 2;
          return (
            <g key={i}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="hsl(var(--foreground) / 0.32)"
                strokeWidth={1.2}
                markerEnd="url(#arrow)"
              />
              <text
                x={mx}
                y={my - 6}
                textAnchor="middle"
                fontSize="10"
                fill="hsl(var(--foreground) / 0.6)"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {f.label}
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {actors.map((a) => {
          const p = positions[a.id];
          return (
            <g key={a.id} transform={`translate(${p.x}, ${p.y})`}>
              <ellipse
                cx={0}
                cy={0}
                rx={62}
                ry={30}
                fill={kindFill[a.kind]}
                stroke={kindStroke[a.kind]}
                strokeWidth={1.2}
              />
              <text
                x={0}
                y={-2}
                textAnchor="middle"
                fontSize="12"
                fontWeight={500}
                fill="hsl(var(--foreground) / 0.92)"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {a.label}
              </text>
              <text
                x={0}
                y={14}
                textAnchor="middle"
                fontSize="9"
                fill="hsl(var(--foreground) / 0.55)"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {truncate(a.role, 32)}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-foreground/55">
        <LegendDot color="hsl(var(--gold) / 0.7)" label="Client" />
        <LegendDot color="hsl(var(--electric) / 0.7)" label="KANTI / Conseil" />
        <LegendDot color="hsl(var(--foreground) / 0.35)" label="Véhicule" />
        <LegendDot color="hsl(var(--foreground) / 0.25)" label="Contrepartie" />
        <LegendDot color="hsl(var(--foreground) / 0.2)" label="Régulateur / Fisc" />
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}