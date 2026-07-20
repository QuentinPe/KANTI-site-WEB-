import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, FileText, BarChart2 } from 'lucide-react';

const ACTIONS = [
  {
    icon: <Calendar className="w-5 h-5" />,
    label: 'Prendre rendez-vous',
    href: '/contact',
    primary: true,
  },
  {
    icon: <FileText className="w-5 h-5" />,
    label: 'Bilan patrimonial',
    href: '/bilan-patrimonial-bordeaux',
    primary: false,
  },
  {
    icon: <BarChart2 className="w-5 h-5" />,
    label: 'Tester le simulateur',
    href: '/gestion-patrimoniale/simulateur',
    primary: false,
  },
];

export default function GestionFinalCTA() {
  const reduce = useReducedMotion();

  return (
    <section
      className="section-padding"
      style={{ background: 'hsl(var(--navy-deep))' }}
    >
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-60px' }}
        >
          <p className="text-[10px] tracking-[0.32em] uppercase text-white/35 mb-6 font-medium">
            KANTI — Gestion patrimoniale
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-[52px] font-heading font-light text-white leading-[1.08] tracking-tight max-w-3xl mx-auto mb-10">
            Votre allocation doit évoluer avec votre vie, pas avec les effets de mode.
          </h2>
          <p className="text-white/50 font-light text-base leading-relaxed max-w-xl mx-auto mb-12">
            Un patrimoine bien construit repose sur une stratégie cohérente, une discipline de long terme et un accompagnement rigoureux. Commençons par un échange.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {ACTIONS.map((action, i) => (
              <motion.div
                key={action.href}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  to={action.href}
                  className={`inline-flex items-center gap-3 px-6 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 hover:-translate-y-0.5 group ${
                    action.primary
                      ? 'bg-white text-navy-deep hover:shadow-2xl hover:shadow-white/10'
                      : 'border border-white/20 text-white/70 hover:text-white hover:border-white/40'
                  }`}
                >
                  <span className={action.primary ? 'text-navy-deep' : 'text-white/50'}>
                    {action.icon}
                  </span>
                  {action.label}
                  {action.primary && (
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-[11px] tracking-[0.18em] uppercase text-white/25">
            <span className="inline-flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-white/25" />
              Premier échange gratuit
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-white/25" />
              Sans engagement
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-white/25" />
              Confidentiel
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
