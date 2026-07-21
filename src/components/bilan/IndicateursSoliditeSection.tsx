import { motion, useReducedMotion } from 'framer-motion';

const INDICATORS = [
  { label: 'Liquidité disponible', score: 72, color: 'hsl(222 50% 25%)' },
  { label: 'Diversification', score: 58, color: 'hsl(218 45% 40%)' },
  { label: "Niveau d'endettement", score: 81, color: 'hsl(222 50% 25%)' },
  { label: 'Protection prévoyance', score: 45, color: 'hsl(218 28% 55%)' },
  { label: 'Préparation des objectifs', score: 63, color: 'hsl(215 35% 60%)' },
];

interface ProgressBarProps {
  score: number;
  color: string;
  reduce: boolean | null;
  delay: number;
}

function ProgressBar({ score, color, reduce, delay }: ProgressBarProps) {
  return (
    <div className="w-full h-1.5 rounded-full bg-foreground/8 overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        whileInView={{ width: `${score}%` }}
        transition={
          reduce
            ? { duration: 0 }
            : { duration: 0.8, ease: 'easeOut', delay }
        }
        viewport={{ once: true, margin: '-40px' }}
      />
    </div>
  );
}

export default function IndicateursSoliditeSection() {
  const reduce = useReducedMotion();

  return (
    <section className="section-padding" style={{ background: 'hsl(220 30% 97%)' }}>
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
              05 · Indicateurs de solidité
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-[1.1] tracking-tight mb-6">
              Ce que le bilan mesure au-delà des chiffres bruts.
            </h2>
            <p className="text-foreground/65 leading-relaxed font-light text-base mb-4 max-w-lg">
              Un patrimoine peut sembler solide sur le papier et présenter des fragilités importantes : actifs illiquides, protection prévoyance insuffisante, concentration excessive sur une seule classe d'actif.
            </p>
            <p className="text-foreground/65 leading-relaxed font-light text-base max-w-lg">
              Ces indicateurs permettent d'identifier les zones de risque et de prioriser les actions à mener. Ils sont présentés et commentés lors de la restitution.
            </p>
          </motion.div>

          {/* Right indicators column */}
          <motion.div
            className="lg:col-span-7"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.12 }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <div className="rounded-2xl border border-foreground/8 bg-white p-6 md:p-8 shadow-sm">
              <p className="text-[10px] tracking-[0.28em] uppercase text-foreground/40 mb-6 font-medium">
                Score de solidité · exemple indicatif
              </p>

              <div className="space-y-6">
                {INDICATORS.map((ind, i) => (
                  <div key={ind.label} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground/75">{ind.label}</span>
                      <span
                        className="text-sm font-medium font-heading tabular-nums"
                        style={{ color: ind.color }}
                      >
                        {ind.score} / 100
                      </span>
                    </div>
                    <ProgressBar
                      score={ind.score}
                      color={ind.color}
                      reduce={reduce ?? false}
                      delay={0.1 + i * 0.1}
                    />
                  </div>
                ))}
              </div>

              <p className="text-[11px] italic text-foreground/40 mt-8 leading-relaxed">
                Ces scores sont indicatifs et pédagogiques. Ils sont calculés lors du bilan en fonction de votre situation réelle.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
