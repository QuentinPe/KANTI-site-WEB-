import { motion, useReducedMotion } from 'framer-motion';
import { TrendingUp, Home, Building2, Scale, Target } from 'lucide-react';

const FLUX = [
  { label: 'Revenus bruts', amount: '120 000 €', color: 'hsl(222 50% 18%)', icon: TrendingUp, dark: false },
  { label: 'Charges fixes', amount: '−24 000 €', color: 'hsl(218 45% 38%)', icon: Home, dark: false },
  { label: 'Crédits', amount: '−18 000 €', color: 'hsl(218 28% 55%)', icon: Building2, dark: false },
  { label: 'Fiscalité', amount: '−28 000 €', color: 'hsl(215 35% 65%)', icon: Scale, dark: false },
  { label: "Capacité d'épargne", amount: '50 000 €', color: 'hsl(222 50% 12%)', icon: Target, dark: true },
];

export default function AnalyseFluxSection() {
  const reduce = useReducedMotion();

  return (
    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: '-60px' }}
        >
          <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/45 mb-4 font-medium">
            06 · Analyse des flux annuels
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-tight tracking-tight max-w-2xl mx-auto">
            Ce que vous gagnez, ce que vous payez, ce qui reste.
          </h2>
        </motion.div>

        {/* Desktop horizontal flow */}
        <div className="hidden md:flex items-stretch gap-0">
          {FLUX.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="flex items-center flex-1 min-w-0">
                <motion.div
                  className="flex-1 rounded-2xl p-5 flex flex-col items-center gap-3 text-center"
                  style={{
                    background: f.dark ? f.color : 'white',
                    border: f.dark ? 'none' : '1px solid hsl(222 50% 11% / 0.08)',
                    boxShadow: f.dark ? '0 4px 24px hsl(222 50% 11% / 0.18)' : '0 1px 3px hsl(222 50% 11% / 0.05)',
                  }}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true, margin: '-40px' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: f.dark ? 'hsl(222 50% 18% / 0.5)' : `${f.color}18`,
                    }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: f.dark ? 'white' : f.color }}
                    />
                  </div>
                  <div>
                    <p
                      className="text-[11px] uppercase tracking-[0.18em] font-medium mb-1"
                      style={{ color: f.dark ? 'rgba(255,255,255,0.6)' : 'hsl(222 50% 11% / 0.5)' }}
                    >
                      {f.label}
                    </p>
                    <p
                      className="font-heading text-xl font-light"
                      style={{ color: f.dark ? 'white' : f.color }}
                    >
                      {f.amount}
                    </p>
                  </div>
                </motion.div>

                {/* Arrow separator */}
                {i < FLUX.length - 1 && (
                  <div className="flex-shrink-0 mx-1">
                    <svg
                      className="w-5 h-5 text-foreground/20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile vertical stack */}
        <div className="md:hidden space-y-3">
          {FLUX.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.label}
                className="rounded-2xl p-5 flex items-center gap-4"
                style={{
                  background: f.dark ? f.color : 'white',
                  border: f.dark ? 'none' : '1px solid hsl(222 50% 11% / 0.08)',
                }}
                initial={reduce ? false : { opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                viewport={{ once: true, margin: '-30px' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: f.dark ? 'hsl(222 50% 18% / 0.5)' : `${f.color}18`,
                  }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: f.dark ? 'white' : f.color }}
                  />
                </div>
                <div className="flex-1">
                  <p
                    className="text-[11px] uppercase tracking-[0.18em] font-medium"
                    style={{ color: f.dark ? 'rgba(255,255,255,0.6)' : 'hsl(222 50% 11% / 0.5)' }}
                  >
                    {f.label}
                  </p>
                </div>
                <p
                  className="font-heading text-lg font-light"
                  style={{ color: f.dark ? 'white' : f.color }}
                >
                  {f.amount}
                </p>
              </motion.div>
            );
          })}
        </div>

        <p className="text-[11px] italic text-foreground/40 text-center mt-8 leading-relaxed">
          Exemple pédagogique — flux annuels indicatifs. Ne constitue pas une recommandation personnalisée.
        </p>
      </div>
    </section>
  );
}
