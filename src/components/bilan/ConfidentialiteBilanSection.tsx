import { motion, useReducedMotion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const STATS = [
  {
    value: 'ORIAS',
    label: 'Inscription réglementaire',
    sub: 'Courtier en assurances et conseiller en investissements financiers',
  },
  {
    value: '0',
    label: 'Produit maison',
    sub: 'Sélection sur l\'ensemble du marché — aucun quota, aucun conflit',
  },
  {
    value: '100%',
    label: 'Rapport écrit remis',
    sub: 'Le bilan vous appartient — vous pouvez le partager librement avec vos conseils',
  },
  {
    value: 'NDA',
    label: 'Confidentialité garantie',
    sub: 'Accord de confidentialité systématique — vos données ne quittent pas KANTI',
  },
];

export default function ConfidentialiteBilanSection() {
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
                11 · Confidentialité &amp; indépendance
              </p>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-tight tracking-tight mb-6">
              Un cabinet sans produit maison, sans commission cachée.
            </h2>
            <p className="text-foreground/65 leading-relaxed font-light text-sm mb-4">
              KANTI est un cabinet de conseil en gestion de patrimoine indépendant, inscrit à l'ORIAS. Le bilan patrimonial est un acte de conseil pur : nous ne cherchons pas à placer un produit lors de cette mission. Notre analyse est neutre par construction.
            </p>
            <p className="text-foreground/65 leading-relaxed font-light text-sm">
              Toutes les informations que vous nous confiez sont couvertes par un accord de confidentialité systématique. Elles ne sont jamais transmises à des tiers sans votre accord explicite.
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
