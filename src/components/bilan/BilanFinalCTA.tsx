import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CONTACT_URL = '/contact';
const WEALTH_SIMULATOR_URL = '/gestion-patrimoniale/simulateur';

export default function BilanFinalCTA() {
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
            Bilan patrimonial
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-[52px] font-heading font-light text-white leading-[1.08] tracking-tight max-w-3xl mx-auto mb-10">
            Prenez le temps de comprendre votre patrimoine · avant de décider.
          </h2>
          <p className="text-white/50 font-light text-base leading-relaxed max-w-xl mx-auto mb-12">
            Un premier échange de 30 minutes, gratuit et sans engagement, pour évaluer la pertinence d'un bilan dans votre situation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0 }}
              viewport={{ once: true }}
            >
              <Link
                to={CONTACT_URL}
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full text-sm font-medium tracking-wide bg-white text-[hsl(224_60%_12%)] hover:shadow-2xl hover:shadow-white/10 transition-all duration-300 hover:-translate-y-0.5 group"
              >
                Demander un bilan patrimonial
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                to={WEALTH_SIMULATOR_URL}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-light tracking-wide text-white/65 hover:text-white border border-white/20 hover:border-white/40 transition-all duration-300"
              >
                Simulateur patrimonial →
              </Link>
            </motion.div>
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
