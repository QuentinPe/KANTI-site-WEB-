import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { RISK_PROFILES } from '@/lib/simulation/riskProfiles';

const PROFILE_IDS = ['prudent', 'équilibré', 'dynamique'] as const;

const PROFILE_COLORS: Record<string, string> = {
  prudent: 'hsl(218 28% 55%)',
  équilibré: 'hsl(222 50% 22%)',
  dynamique: 'hsl(218 45% 38%)',
};

function formatPct(v: number) {
  return `${(v * 100).toFixed(1)} %`;
}

function AllocationMiniChart({ allocation }: { allocation: Record<string, number> }) {
  const data = Object.entries(allocation)
    .filter(([, w]) => w > 0.01)
    .map(([id, w]) => ({ name: id.replace(/-/g, ' ').replace('actions', 'act.'), value: Math.round(w * 100) }));

  return (
    <ResponsiveContainer width="100%" height={60}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <XAxis type="number" hide domain={[0, 100]} />
        <YAxis type="category" dataKey="name" hide />
        <Bar dataKey="value" radius={2}>
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={`hsl(${220 - i * 8} ${55 - i * 3}% ${20 + i * 6}%)`}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function RiskProfileComparison() {
  const reduce = useReducedMotion();

  return (
    <section className="section-padding" style={{ background: 'hsl(220 30% 97%)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/45 mb-4 font-medium">
            Profils de risque
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-tight tracking-tight max-w-2xl mx-auto">
            Choisir un profil adapté à votre situation
          </h2>
          <p className="text-foreground/55 font-light mt-4 max-w-xl mx-auto text-sm">
            Données indicatives. Les profils réels sont définis lors du diagnostic patrimonial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {PROFILE_IDS.map((id, i) => {
            const profile = RISK_PROFILES[id];
            const color = PROFILE_COLORS[id];
            return (
              <motion.div
                key={id}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
                viewport={{ once: true, margin: '-40px' }}
                className="rounded-2xl border border-foreground/8 bg-white p-6 flex flex-col gap-5 hover:shadow-md transition-shadow duration-300"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full mr-2"
                      style={{ background: color }}
                    />
                    <span className="font-heading text-xl text-foreground font-light">{profile.label}</span>
                  </div>
                  <span className="text-[10px] tracking-widest uppercase text-foreground/40 font-medium">
                    Horizon {profile.minHorizon}+ ans
                  </span>
                </div>

                <p className="text-foreground/65 text-sm leading-relaxed font-light">
                  {profile.description}
                </p>

                {/* Mini allocation chart */}
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-2">Allocation type</p>
                  <AllocationMiniChart allocation={profile.allocation} />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-foreground/6">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-foreground/40">Rendement indicatif</p>
                    <p className="text-sm font-medium text-foreground/80 mt-0.5">{formatPct(profile.expectedReturn)}/an</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-foreground/40">Volatilité</p>
                    <p className="text-sm font-medium text-foreground/80 mt-0.5">{formatPct(profile.volatility)}/an</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-foreground/40">Drawdown max</p>
                    <p className="text-sm font-medium text-foreground/80 mt-0.5">{formatPct(profile.maxDrawdown)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-foreground/40">Liquidité</p>
                    <p className="text-sm font-medium text-foreground/80 mt-0.5">{formatPct(profile.liquidityRatio)}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            to="/profil-de-risque"
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-sm font-medium tracking-wide bg-foreground text-white hover:bg-foreground/85 transition-all duration-300 hover:-translate-y-0.5 group"
          >
            Déterminer mon profil de risque
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <p className="text-[11px] italic text-foreground/35 mt-4">
            Données indicatives · les profils réels sont construits lors d'un diagnostic complet
          </p>
        </div>
      </div>
    </section>
  );
}
