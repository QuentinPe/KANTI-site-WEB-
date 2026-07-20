import { motion, useReducedMotion } from 'framer-motion';

const STEPS = [
  {
    number: '01',
    title: 'Diagnostic',
    description: 'Analyse complète de votre situation patrimoniale, fiscale et personnelle.',
    items: [
      'Bilan patrimonial exhaustif',
      'Analyse de la fiscalité actuelle',
      'Identification des objectifs de vie',
      'Évaluation de la capacité d\'épargne',
    ],
  },
  {
    number: '02',
    title: 'Profil',
    description: 'Définition de votre profil de risque et de vos contraintes de placement.',
    items: [
      'Questionnaire de profil réglementaire',
      'Horizon de placement par objectif',
      'Tolérance aux pertes temporaires',
      'Besoins de liquidité',
    ],
  },
  {
    number: '03',
    title: 'Construction',
    description: 'Élaboration de l\'allocation et sélection des meilleurs supports.',
    items: [
      'Architecture ouverte — aucun produit maison',
      'Sélection comparative des supports',
      'Optimisation des enveloppes fiscales',
      'Mise en place et souscriptions',
    ],
  },
  {
    number: '04',
    title: 'Suivi',
    description: 'Pilotage continu et adaptation de votre stratégie dans le temps.',
    items: [
      'Reporting trimestriel personnalisé',
      'Rééquilibrages disciplinés',
      'Veille fiscale et réglementaire',
      'Révision annuelle de la stratégie',
    ],
  },
];

export default function MethodologySteps() {
  const reduce = useReducedMotion();

  return (
    <section className="section-padding" style={{ background: 'hsl(220 30% 97%)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: '-60px' }}
        >
          <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/45 mb-4 font-medium">
            Notre méthode
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-tight tracking-tight max-w-2xl mx-auto">
            Un accompagnement structuré en quatre temps
          </h2>
        </motion.div>

        {/* Desktop: horizontal */}
        <div className="hidden md:grid md:grid-cols-4 gap-0 relative">
          {/* Connector line */}
          <div
            className="absolute top-8 left-[12.5%] right-[12.5%] h-px bg-foreground/10"
            aria-hidden
          />
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              className="relative flex flex-col items-center text-center px-6"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              viewport={{ once: true, margin: '-40px' }}
            >
              {/* Number circle */}
              <div className="relative z-10 w-16 h-16 rounded-full border border-foreground/12 bg-background flex items-center justify-center mb-6">
                <span className="font-heading text-xl font-light text-foreground/60">{step.number}</span>
              </div>
              <h3 className="font-heading text-xl font-light text-foreground mb-3">{step.title}</h3>
              <p className="text-foreground/55 text-sm leading-relaxed mb-5 font-light">{step.description}</p>
              <ul className="space-y-2 text-left w-full">
                {step.items.map(item => (
                  <li key={item} className="flex items-start gap-2 text-xs text-foreground/50">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-foreground/25 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Mobile: vertical */}
        <div className="md:hidden space-y-0">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              className="flex gap-5 pb-8"
              initial={reduce ? false : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              viewport={{ once: true, margin: '-40px' }}
            >
              {/* Left: number + line */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border border-foreground/12 bg-background flex items-center justify-center flex-shrink-0">
                  <span className="font-heading text-base font-light text-foreground/60">{step.number}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-px flex-1 bg-foreground/10 mt-2" />
                )}
              </div>
              {/* Right: content */}
              <div className="pt-1">
                <h3 className="font-heading text-xl font-light text-foreground mb-2">{step.title}</h3>
                <p className="text-foreground/55 text-sm leading-relaxed mb-4 font-light">{step.description}</p>
                <ul className="space-y-2">
                  {step.items.map(item => (
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
