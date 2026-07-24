import { motion, useReducedMotion } from 'framer-motion';

const MILESTONES = [
  {
    label: "Aujourd'hui",
    tag: 'T+0',
    items: ['Bilan de situation', 'Optimisation fiscale', "Constitution d'épargne"],
  },
  {
    label: '3 ans',
    tag: 'Court terme',
    items: ['Achat immobilier', "Création d'entreprise", 'Projet personnel'],
  },
  {
    label: '8 ans',
    tag: 'Moyen terme',
    items: ['Diversification', 'Réduction du crédit', 'PEA pleinement investi'],
  },
  {
    label: '15 ans',
    tag: 'Long terme',
    items: ['Préparation retraite', 'Arbitrages successoraux', 'Revenus complémentaires'],
  },
  {
    label: 'Transmission',
    tag: 'Horizon long',
    items: ['Donations progressives', 'Stratégie successorale', 'Optimisation IFI'],
  },
];

export default function FriseProjetsSection() {
  const reduce = useReducedMotion();

  return (
    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-14"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: '-60px' }}
        >
          <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/45 mb-4 font-medium">
            03 · Frise des projets de vie
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-tight tracking-tight max-w-2xl">
            Aligner votre allocation à chaque étape.
          </h2>
          <p className="text-foreground/55 font-light mt-3 text-sm max-w-xl">
            Chaque projet de vie a un horizon et un montant. La frise permet de lire votre allocation à travers le prisme de vos objectifs réels.
          </p>
        </motion.div>

        {/* Desktop horizontal timeline */}
        <div className="hidden md:block relative">
          {/* Horizontal connector line */}
          <div
            className="absolute top-[3.25rem] left-[10%] right-[10%] h-px bg-foreground/12"
            aria-hidden
          />

          <div className="grid grid-cols-5 gap-4">
            {MILESTONES.map((m, i) => (
              <motion.div
                key={m.label}
                className="flex flex-col items-center text-center"
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true, margin: '-40px' }}
              >
                {/* Tag above */}
                <span className="text-[10px] uppercase tracking-[0.22em] text-foreground/40 mb-3 font-medium">
                  {m.tag}
                </span>

                {/* Dot on line */}
                <div className="relative z-10 w-7 h-7 rounded-full border border-foreground/15 bg-background flex items-center justify-center mb-4 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-foreground/30" />
                </div>

                {/* Label */}
                <p className="font-heading text-base font-light text-foreground mb-4 leading-snug">
                  {m.label}
                </p>

                {/* Items */}
                <ul className="space-y-2 text-left w-full px-2">
                  {m.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-foreground/50">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-foreground/25 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="md:hidden space-y-0">
          {MILESTONES.map((m, i) => (
            <motion.div
              key={m.label}
              className="flex gap-5 pb-8"
              initial={reduce ? false : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              viewport={{ once: true, margin: '-40px' }}
            >
              {/* Left: dot + vertical line */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-10 h-10 rounded-full border border-foreground/12 bg-background flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-foreground/30" />
                </div>
                {i < MILESTONES.length - 1 && (
                  <div className="w-px flex-1 bg-foreground/10 mt-2" />
                )}
              </div>

              {/* Right: content */}
              <div className="pt-1">
                <span className="text-[10px] uppercase tracking-[0.22em] text-foreground/40 font-medium">
                  {m.tag}
                </span>
                <p className="font-heading text-lg font-light text-foreground mt-1 mb-3">
                  {m.label}
                </p>
                <ul className="space-y-2">
                  {m.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-foreground/50">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-foreground/25 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
