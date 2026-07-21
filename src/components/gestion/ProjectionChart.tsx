import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';
import type { SimulationResult } from '@/lib/simulation/simulationTypes';

interface ProjectionChartProps {
  result: SimulationResult;
  horizon: number;
  targetAmount?: number;
}

function formatValue(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)} M€`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)} k€`;
  return `${v.toFixed(0)} €`;
}

interface TooltipEntry {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const year = Number(label);
  return (
    <div className="bg-white border border-foreground/10 rounded-xl p-4 shadow-xl text-sm min-w-[180px]">
      <p className="font-medium text-foreground/70 mb-2 text-xs tracking-wide uppercase">
        Année {year}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex justify-between gap-4 text-[13px]">
          <span style={{ color: entry.color }} className="font-medium">{entry.name}</span>
          <span className="text-foreground/80 font-medium">{formatValue(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function ProjectionChart({ result, horizon, targetAmount }: ProjectionChartProps) {
  // Build data array (yearly points)
  const data = [];
  for (let y = 0; y <= horizon; y++) {
    const m = y * 12;
    data.push({
      year: y,
      p10: Math.round(result.percentiles.p10[m]),
      p25: Math.round(result.percentiles.p25[m]),
      p50: Math.round(result.percentiles.p50[m]),
      p75: Math.round(result.percentiles.p75[m]),
      p90: Math.round(result.percentiles.p90[m]),
      invested: Math.round(result.investedCapital[m]),
      real: Math.round(result.realMedian[m]),
    });
  }

  const maxVal = Math.max(...data.map(d => d.p90));
  const yMax = Math.ceil(maxVal / 50000) * 50000;

  return (
    <div className="w-full">
      <p className="sr-only">
        Graphique de projection Monte Carlo sur {horizon} ans. La médiane (50e percentile) atteint{' '}
        {formatValue(result.metrics.medianFinalValue)} en fin de période.
        Les 10e et 90e percentiles représentent les scénarios pessimiste et optimiste.
      </p>
      <ResponsiveContainer width="100%" height={340}>
        <ComposedChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradP25P75" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(218 45% 38%)" stopOpacity={0.18} />
              <stop offset="95%" stopColor="hsl(218 45% 38%)" stopOpacity={0.04} />
            </linearGradient>
            <linearGradient id="gradP10P90" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(218 45% 38%)" stopOpacity={0.08} />
              <stop offset="95%" stopColor="hsl(218 45% 38%)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="year"
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'hsl(222 35% 12% / 0.45)', fontSize: 11 }}
            tickFormatter={(v) => `A${v}`}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'hsl(222 35% 12% / 0.45)', fontSize: 11 }}
            tickFormatter={formatValue}
            domain={[0, yMax]}
            width={70}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* p10-p90 outer band */}
          <Area
            type="monotone"
            dataKey="p90"
            stroke="none"
            fill="url(#gradP10P90)"
            name="P90 (optimiste)"
            legendType="none"
          />
          <Area
            type="monotone"
            dataKey="p10"
            stroke="none"
            fill="white"
            name="P10 (pessimiste)"
            legendType="none"
          />

          {/* p25-p75 inner band */}
          <Area
            type="monotone"
            dataKey="p75"
            stroke="none"
            fill="url(#gradP25P75)"
            name="Zone de confiance (P25–P75)"
          />
          <Area
            type="monotone"
            dataKey="p25"
            stroke="none"
            fill="white"
            legendType="none"
          />

          {/* Median line */}
          <Line
            type="monotone"
            dataKey="p50"
            stroke="hsl(222 50% 18%)"
            strokeWidth={2}
            dot={false}
            name="Médiane (P50)"
          />

          {/* Invested capital */}
          <Line
            type="monotone"
            dataKey="invested"
            stroke="hsl(222 35% 12% / 0.35)"
            strokeWidth={1.5}
            strokeDasharray="5 4"
            dot={false}
            name="Capital investi"
          />

          {/* Real value */}
          <Line
            type="monotone"
            dataKey="real"
            stroke="hsl(218 45% 50%)"
            strokeWidth={1.5}
            strokeDasharray="2 3"
            dot={false}
            name="Valeur réelle (hors inflation)"
          />

          {targetAmount && (
            <ReferenceLine
              y={targetAmount}
              stroke="hsl(var(--gold))"
              strokeDasharray="6 3"
              label={{ value: 'Objectif', position: 'insideTopRight', fontSize: 11, fill: 'hsl(var(--gold))' }}
            />
          )}

          <Legend
            wrapperStyle={{ fontSize: 11, color: 'hsl(222 35% 12% / 0.55)', paddingTop: 16 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <p className="text-[11px] italic text-foreground/40 text-center mt-2">
        Simulation illustrative · hypothèses de démonstration · données non contractuelles
      </p>
    </div>
  );
}
