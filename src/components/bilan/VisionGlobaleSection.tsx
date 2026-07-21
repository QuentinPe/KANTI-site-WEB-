import { motion, useReducedMotion } from 'framer-motion';
import { Home, Briefcase, TrendingUp, Heart } from 'lucide-react';

interface SatelliteNode {
  icon: React.ReactNode;
  label: string;
  top: string;
  left: string;
}

const SATELLITES: SatelliteNode[] = [
  { icon: <Home className="w-4 h-4" />, label: 'Patrimoine privé', top: '8%', left: '50%' },
  { icon: <Briefcase className="w-4 h-4" />, label: 'Patrimoine pro', top: '50%', left: '88%' },
  { icon: <TrendingUp className="w-4 h-4" />, label: 'Revenus & épargne', top: '82%', left: '50%' },
  { icon: <Heart className="w-4 h-4" />, label: 'Projets & transmission', top: '50%', left: '12%' },
];

export default function VisionGlobaleSection() {
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
              01 · Une vision globale
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-[1.1] tracking-tight mb-6">
              Patrimoine privé, professionnel, fiscalité, prévoyance :{' '}
              <em style={{ fontStyle: 'italic' }}>une lecture unifiée.</em>
            </h2>
            <p className="text-foreground/65 leading-relaxed font-light text-base mb-4 max-w-lg">
              La plupart des patrimoines souffrent d'une même lacune : chaque compartiment a été constitué séparément, sans vision d'ensemble. Assurance-vie ouverte à une époque, immobilier à une autre, PEA négligé, prévoyance sous-dimensionnée.
            </p>
            <p className="text-foreground/65 leading-relaxed font-light text-base max-w-lg">
              Le bilan patrimonial rompt avec cette logique de silos. Il reconstruit une image cohérente et chiffrée de votre situation · pour identifier les contradictions, les angles morts et les leviers d'optimisation réels.
            </p>
          </motion.div>

          {/* Right diagram column */}
          <motion.div
            className="lg:col-span-7"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.12 }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <div className="rounded-2xl border border-foreground/8 bg-white p-8 shadow-sm">
              <div className="relative min-h-[380px] flex items-center justify-center">
                {/* Connection lines using pseudo approach with border */}
                {/* Top line */}
                <div
                  aria-hidden
                  className="absolute left-1/2 top-[16%] w-px bg-foreground/12"
                  style={{ height: 'calc(50% - 16% - 2.5rem)' }}
                />
                {/* Bottom line */}
                <div
                  aria-hidden
                  className="absolute left-1/2 bottom-[16%] w-px bg-foreground/12"
                  style={{ height: 'calc(50% - 16% - 2.5rem)' }}
                />
                {/* Left line */}
                <div
                  aria-hidden
                  className="absolute top-1/2 left-[18%] h-px bg-foreground/12"
                  style={{ width: 'calc(50% - 18% - 4rem)' }}
                />
                {/* Right line */}
                <div
                  aria-hidden
                  className="absolute top-1/2 right-[10%] h-px bg-foreground/12"
                  style={{ width: 'calc(50% - 10% - 4rem)' }}
                />

                {/* Center node */}
                <div className="z-10 absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-32 h-32 rounded-full flex items-center justify-center text-center shadow-md"
                    style={{ background: 'hsl(222 50% 11%)' }}
                    initial={reduce ? false : { opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    viewport={{ once: true }}
                  >
                    <span className="text-white text-xs font-medium px-3 leading-snug">
                      Patrimoine<br />global
                    </span>
                  </motion.div>
                </div>

                {/* Satellite nodes */}
                {SATELLITES.map((node, i) => (
                  <motion.div
                    key={node.label}
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{ top: node.top, left: node.left }}
                    initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45, delay: 0.2 + i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="rounded-xl border border-foreground/10 bg-white shadow-sm p-3 flex flex-col items-center gap-2 min-w-[96px]">
                      <div className="w-8 h-8 rounded-lg border border-foreground/10 bg-foreground/[0.03] flex items-center justify-center text-foreground/55">
                        {node.icon}
                      </div>
                      <span className="text-[11px] text-foreground/65 font-medium text-center leading-tight">
                        {node.label}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
