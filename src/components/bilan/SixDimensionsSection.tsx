import { motion, useReducedMotion } from 'framer-motion';
import { Users, TrendingUp, Building2, Scale, ShieldCheck, Target } from 'lucide-react';

const DIMENSIONS = [
  {
    icon: Users,
    number: '01',
    title: 'Famille & situation civile',
    body: 'Régime matrimonial, donations, testament, clauses bénéficiaires des contrats, transmission non préparée.',
  },
  {
    icon: TrendingUp,
    number: '02',
    title: 'Revenus & capacité d\'épargne',
    body: 'Revenus professionnels, fonciers, financiers. Charges fixes, fiscalité, reste à épargner mensuel.',
  },
  {
    icon: Building2,
    number: '03',
    title: 'Actifs & passifs',
    body: 'Résidence principale, locatif, SCI, assurance-vie, PEA, PER, comptes-titres, crédits en cours, cautions.',
  },
  {
    icon: Scale,
    number: '04',
    title: 'Fiscalité',
    body: 'IR, IFI, revenus fonciers, plus-values mobilières et immobilières, TMI effective, leviers d\'optimisation.',
  },
  {
    icon: ShieldCheck,
    number: '05',
    title: 'Protection & prévoyance',
    body: 'Décès, invalidité, dépendance, arrêt de travail, homme-clé pour les dirigeants. Couverture réelle vs besoins.',
  },
  {
    icon: Target,
    number: '06',
    title: 'Objectifs',
    body: 'Horizon de chaque projet, montant cible, contraintes de liquidité, degré d\'exposition au risque souhaité.',
  },
];

export default function SixDimensionsSection() {
  const reduce = useReducedMotion();

  return (
    <section className="section-padding" style={{ background: 'hsl(220 30% 97%)' }}>
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
            03 · Périmètre d'analyse
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-tight tracking-tight max-w-2xl mx-auto">
            Six dimensions étudiées en parallèle.
          </h2>
        </motion.div>

        {/* 6-card grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DIMENSIONS.map((dim, i) => {
            const Icon = dim.icon;
            return (
              <motion.div
                key={dim.number}
                className="rounded-2xl border border-foreground/8 bg-white p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-300"
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true, margin: '-40px' }}
              >
                {/* Icon + number row */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl border border-foreground/10 bg-foreground/[0.03] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-foreground/50" />
                  </div>
                  <span className="text-[10px] tracking-[0.28em] uppercase text-foreground/35 font-medium">
                    {dim.number}
                  </span>
                </div>
                {/* Title */}
                <h3 className="font-heading text-lg font-light text-foreground leading-snug">
                  {dim.title}
                </h3>
                {/* Body */}
                <p className="text-sm text-foreground/65 leading-relaxed font-light">
                  {dim.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
