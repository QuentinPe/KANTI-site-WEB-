import { motion, useReducedMotion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const ILLUSTRATIVE_ALLOCATION = [
  { name: 'Fonds en euros', value: 20, color: 'hsl(218 28% 65%)' },
  { name: 'Obligations', value: 20, color: 'hsl(222 50% 30%)' },
  { name: 'Actions monde', value: 25, color: 'hsl(222 50% 18%)' },
  { name: 'ETF diversifiés', value: 15, color: 'hsl(218 45% 45%)' },
  { name: 'Immobilier SCPI', value: 10, color: 'hsl(215 35% 55%)' },
  { name: 'Private equity', value: 5, color: 'hsl(224 60% 12%)' },
  { name: 'Trésorerie', value: 5, color: 'hsl(220 20% 75%)' },
];

const METRICS = [
  { label: 'Horizon', value: '12 ans' },
  { label: 'Rendement central', value: '4,6 %' },
  { label: 'Volatilité', value: '8,2 %' },
  { label: 'Drawdown max', value: '−14 %' },
  { label: 'Classes', value: '7' },
  { label: 'Suivi', value: 'Trimestriel' },
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

export default function AllocationDonutSection() {
  const reduce = useReducedMotion();

  return (
    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left editorial column */}
          <motion.div
            className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/45 mb-5 font-medium">
              Notre approche
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-heading font-light text-foreground leading-[1.1] tracking-tight mb-6">
              Construire,{' '}
              <em className="not-italic font-light" style={{ fontStyle: 'italic' }}>piloter</em>{' '}
              et faire évoluer votre allocation.
            </h2>
            <p className="text-foreground/65 leading-relaxed font-light text-base mb-6 max-w-lg">
              Votre allocation patrimoniale est construite à partir de vos objectifs de vie, de votre horizon de placement, de votre situation fiscale et de votre capacité à absorber une baisse temporaire des marchés. Elle est révisée régulièrement pour s'adapter à votre situation.
            </p>
            <p className="text-foreground/65 leading-relaxed font-light text-base mb-8 max-w-lg">
              Architecture ouverte : nous sélectionnons les meilleurs supports disponibles sur le marché sans quota, sans produit maison, sans conflit d'intérêt.
            </p>
            <p className="text-[12px] italic text-foreground/40 leading-relaxed max-w-sm">
              Les données présentées sont indicatives et pédagogiques. Elles ne constituent pas une recommandation d'investissement.
            </p>
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
                aria-label="Graphique de l'allocation indicative : répartition en secteurs"
                role="img"
                className="h-[260px] md:h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ILLUSTRATIVE_ALLOCATION}
                      cx="50%"
                      cy="50%"
                      innerRadius="52%"
                      outerRadius="78%"
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {ILLUSTRATIVE_ALLOCATION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-4 justify-center">
                {ILLUSTRATIVE_ALLOCATION.map(item => (
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
              <p className="text-[11px] font-medium text-foreground/50 text-center mt-4 mb-6">
                Exemple pédagogique — données indicatives
              </p>

              {/* Metric badges */}
              <div className="grid grid-cols-3 gap-3 border-t border-foreground/8 pt-5">
                {METRICS.map(m => (
                  <div
                    key={m.label}
                    className="flex flex-col items-center text-center gap-1 p-2 rounded-xl bg-background/60"
                  >
                    <span className="text-[11px] text-foreground/45 tracking-wide">{m.label}</span>
                    <span className="text-sm font-medium text-foreground/80 font-heading">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
