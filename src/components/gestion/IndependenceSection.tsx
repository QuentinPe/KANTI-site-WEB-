import { motion, useReducedMotion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const STATS = [
  {
    value: 'ORIAS',
    label: 'Inscrit au registre',
    sub: 'Courtier en assurances et conseil en investissements financiers',
  },
  {
    value: '0',
    label: 'Produit maison',
    sub: 'Aucune gamme propriétaire · sélection sur le marché entier',
  },
  {
    value: '40+',
    label: 'Partenaires sélectionnés',
    sub: 'Compagnies d\'assurance, sociétés de gestion, établissements bancaires',
  },
  {
    value: 'Long terme',
    label: 'Accompagnement continu',
    sub: 'Suivi régulier, reporting, révision annuelle de la stratégie',
  },
];

export default function IndependenceSection() {
  const reduce = useReducedMotion();

  return (
    <section className="section-padding bg-background border-t border-foreground/6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left col */}
          <motion.div
            className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl border border-foreground/10 bg-foreground/[0.03] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-foreground/50" />
              </div>
              <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/45 font-medium">
                Indépendance
              </p>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-tight tracking-tight mb-6">
              Architecture ouverte &amp; indépendance
            </h2>
            <p className="text-foreground/65 leading-relaxed font-light text-sm mb-4">
              KANTI est un cabinet de conseil en gestion de patrimoine indépendant, inscrit à l'ORIAS. Nous ne distribuons aucun produit maison et ne percevons aucune rétrocession susceptible de biaiser notre conseil.
            </p>
            <p className="text-foreground/65 leading-relaxed font-light text-sm">
              Notre rémunération est transparente : honoraires de conseil et/ou rétrocessions de commissions plafonnées, communiquées en amont de chaque mission. Votre intérêt est notre seul critère de sélection.
            </p>
          </motion.div>

          {/* Right stats */}
          <div className="lg:col-span-8">
            <div className="grid sm:grid-cols-2 gap-5">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="rounded-2xl border border-foreground/8 bg-white p-6"
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  viewport={{ once: true, margin: '-40px' }}
                >
                  <p className="font-heading text-3xl md:text-4xl font-light text-foreground mb-2 tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-foreground/70 mb-1">{stat.label}</p>
                  <p className="text-xs text-foreground/45 leading-relaxed font-light">{stat.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
