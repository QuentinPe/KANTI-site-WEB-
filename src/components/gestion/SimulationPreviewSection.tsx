import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChartLine, ShieldCheck } from 'lucide-react';
import { runIllustrativeSimulation } from '@/lib/simulation/simulationEngine';
import ProjectionChart from './ProjectionChart';

function formatK(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)} M€`;
  return `${Math.round(v / 1000)} k€`;
}

export default function SimulationPreviewSection() {
  const reduce = useReducedMotion();
  const result = useMemo(() => runIllustrativeSimulation(), []);

  const stats = [
    {
      icon: <ChartLine className="w-5 h-5" />,
      label: 'Capital médian à 15 ans',
      value: formatK(result.metrics.medianFinalValue),
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      label: 'Probabilité de gain',
      value: `${Math.round(result.metrics.probabilityOfGain * 100)} %`,
    },
    {
      icon: <ArrowRight className="w-5 h-5" />,
      label: 'Rendement annualisé médian',
      value: `${(result.metrics.medianAnnualizedReturn * 100).toFixed(1)} %`,
    },
  ];

  return (
    <section
      className="section-padding"
      style={{ background: 'hsl(var(--navy-deep))' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left column */}
          <motion.div
            className="lg:col-span-4"
            initial={reduce ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <p className="text-[10px] tracking-[0.32em] uppercase text-white/40 mb-5 font-medium">
              Simulation interactive
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-light text-white leading-[1.1] tracking-tight mb-6">
              Projetez votre stratégie dans différents environnements de marché.
            </h2>
            <p className="text-white/55 leading-relaxed font-light text-sm mb-8">
              Modifiez vos hypothèses, testez différents profils, comparez plusieurs scénarios macro-économiques. Le simulateur illustre l'impact de vos choix sur une projection à long terme.
            </p>

            {/* Stats */}
            <div className="space-y-4 mb-10">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  className="flex items-center gap-4 p-4 rounded-xl border border-white/8 bg-white/4"
                  initial={reduce ? false : { opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <span className="text-white/40">{s.icon}</span>
                  <div>
                    <p className="text-[11px] text-white/40 tracking-wide mb-0.5">{s.label}</p>
                    <p className="text-white font-medium text-lg font-heading">{s.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <Link
                to="/gestion-patrimoniale/simulateur"
                className="inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-full text-sm font-medium tracking-wide bg-white text-navy-deep hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group"
              >
                Accéder au simulateur
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/profil-de-risque"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-light tracking-wide text-white/65 hover:text-white border border-white/15 hover:border-white/30 transition-all duration-300"
              >
                Déterminer mon profil de risque
              </Link>
            </div>
          </motion.div>

          {/* Right chart */}
          <motion.div
            className="lg:col-span-8 lg:sticky lg:top-24 lg:self-start"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.15 }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <div className="rounded-2xl bg-white/6 border border-white/10 p-4 md:p-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs text-white/50 tracking-wide">
                  Projection illustrative — profil équilibré — 15 ans — données de démonstration
                </p>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/10 text-white/50 border border-white/10">
                  Monte Carlo · 300 trajectoires
                </span>
              </div>
              {/* Invert colors for dark bg */}
              <div className="[&_.recharts-text]:fill-white/40 [&_.recharts-legend-item-text]:text-white/40">
                <ProjectionChart result={result} horizon={15} />
              </div>
            </div>

            <p className="text-[11px] italic text-white/30 mt-4 text-center">
              Les résultats présentés reposent sur des hypothèses simulées et ne constituent pas une prévision.
              La valeur des investissements peut baisser. Les performances passées ne préjugent pas du futur.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
