import { motion, useReducedMotion } from 'framer-motion';

const STEPS = [
  {
    number: '01',
    title: 'Diagnostic',
    description: 'Premier échange confidentiel pour circonscrire votre situation et les enjeux prioritaires.',
    items: [
      'Entretien de cadrage',
      'Identification des axes',
      'Qualification des enjeux',
      'Devis transparent',
    ],
  },
  {
    number: '02',
    title: 'Analyse',
    description: 'Collecte de vos documents et reconstruction complète de votre patrimoine, flux et couverture.',
    items: [
      'Collecte documentaire sécurisée',
      'Analyse fiscale 3 ans',
      'Diagnostic prévoyance',
      'Simulation successorale',
    ],
  },
  {
    number: '03',
    title: 'Restitution',
    description: 'Présentation du rapport structuré avec scénarios, recommandations et plan d\'action chiffré.',
    items: [
      'Rapport écrit remis en amont',
      'Séance de restitution 1h30',
      'Scénarios comparés',
      'Feuille de route priorisée',
    ],
  },
  {
    number: '04',
    title: 'Suivi',
    description: "Mise en œuvre coordonnée et révision annuelle pour adapter la stratégie à l'évolution de votre situation.",
    items: [
      'Coordination avec vos conseils',
      'Mise en place des recommandations',
      'Révision annuelle incluse',
      'Reporting suivi',
    ],
  },
];

export default function MethodeBilanSection() {
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
            06 · Notre méthode
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-tight tracking-tight max-w-2xl mx-auto">
            Quatre temps. De la collecte à la feuille de route.
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
