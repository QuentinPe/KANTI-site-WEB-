import { motion, useReducedMotion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const DATA = [
  { name: 'Résidence principale', value: 38, color: 'hsl(222 50% 18%)' },
  { name: 'Immobilier locatif', value: 22, color: 'hsl(218 45% 38%)' },
  { name: 'Assurance-vie', value: 18, color: 'hsl(218 28% 55%)' },
  { name: 'PEA / Titres', value: 10, color: 'hsl(215 35% 65%)' },
  { name: 'Épargne liquide', value: 7, color: 'hsl(220 20% 75%)' },
  { name: 'Professionnel', value: 5, color: 'hsl(224 60% 12%)' },
];

const METRICS = [
  { label: 'Actifs bruts', value: '850 k€' },
  { label: 'Passifs', value: '180 k€' },
  { label: 'Patrimoine net', value: '670 k€' },
  { label: 'Liquidité 3 ans', value: '12 %' },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-foreground/10 rounded-xl px-4 py-2.5 shadow-lg text-sm">
      <p className="font-medium text-foreground">{payload[0].name}</p>
      <p className="text-foreground/60">{payload[0].value} %</p>
    </div>
  );
}

export default function CartographieSection() {
  const reduce = useReducedMotion();

  return (
    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left sticky editorial column */}
          <motion.div
            className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/45 mb-5 font-medium">
              02 · Cartographie patrimoniale
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-[1.1] tracking-tight mb-6">
              Actifs, passifs, liquidité —{' '}
              <em style={{ fontStyle: 'italic' }}>une lecture chiffrée de votre situation nette.</em>
            </h2>
            <p className="text-foreground/65 leading-relaxed font-light text-base mb-8 max-w-lg">
              Avant toute recommandation, nous construisons une cartographie exhaustive de ce que vous possédez réellement. Valorisation actuelle, structure juridique, liquidité de chaque actif — et ce que vous devez réellement en face.
            </p>

            {/* Metric badges */}
            <div className="grid grid-cols-2 gap-3">
              {METRICS.map((m) => (
                <div
                  key={m.label}
                  className="flex flex-col gap-1 p-4 rounded-xl border border-foreground/8 bg-white"
                >
                  <span className="text-[10px] text-foreground/45 tracking-wide uppercase">{m.label}</span>
                  <span className="text-lg font-medium text-foreground/80 font-heading">{m.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right chart column */}
          <motion.div
            className="lg:col-span-7"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.12 }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <div className="rounded-2xl border border-foreground/8 bg-white p-6 md:p-8 shadow-sm">
              {/* Chart */}
              <div
                aria-label="Graphique de la répartition patrimoniale indicative"
                role="img"
                className="h-[260px] md:h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius="52%"
                      outerRadius="78%"
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-4 justify-center">
                {DATA.map(item => (
                  <div key={item.name} className="flex items-center gap-1.5 text-xs text-foreground/65">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: item.color }}
                    />
                    {item.name}
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] font-medium text-foreground/50 text-center mt-4">
                Exemple pédagogique — données indicatives
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
