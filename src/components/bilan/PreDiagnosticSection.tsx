import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CONTACT_URL = '/contact';

const QUESTIONS = [
  {
    q: 'Votre situation principale',
    choices: ['Salarié', "Dirigeant d'entreprise", 'Indépendant', 'Retraité'],
  },
  {
    q: 'Votre objectif prioritaire',
    choices: ['Optimiser ma fiscalité', 'Préparer ma retraite', 'Organiser ma transmission', 'Structurer mon patrimoine'],
  },
  {
    q: 'Votre horizon de placement',
    choices: ['< 3 ans', '3 à 8 ans', '8 à 15 ans', '> 15 ans'],
  },
  {
    q: 'Événement de vie récent ou anticipé',
    choices: ["Cession d'entreprise", 'Héritage', 'Mariage / divorce', 'Aucun en particulier'],
  },
];

export default function PreDiagnosticSection() {
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
            08 · Pré-diagnostic
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-tight tracking-tight max-w-2xl mx-auto">
            Quelques informations pour préparer notre échange.
          </h2>
        </motion.div>

        {/* Two-col layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Questions display */}
          <motion.div
            className="space-y-5"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            viewport={{ once: true, margin: '-60px' }}
          >
            {QUESTIONS.map((qItem, i) => (
              <motion.div
                key={qItem.q}
                className="rounded-2xl border border-foreground/8 bg-white p-5"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                viewport={{ once: true, margin: '-30px' }}
              >
                <p className="text-sm font-medium text-foreground/75 mb-3">{qItem.q}</p>
                <div className="flex flex-wrap gap-2">
                  {qItem.choices.map((choice) => (
                    <span
                      key={choice}
                      className="text-[12px] px-3 py-1.5 rounded-full border border-foreground/10 bg-foreground/[0.03] text-foreground/55 font-light"
                    >
                      {choice}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
            <p className="text-xs text-foreground/40 italic leading-relaxed px-1">
              Ces informations nous permettent de préparer notre premier échange.
            </p>
          </motion.div>

          {/* Right: CTA card — sticky */}
          <motion.div
            className="lg:sticky lg:top-24 lg:self-start"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.15 }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <div
              className="rounded-2xl p-8 md:p-10 flex flex-col gap-6"
              style={{ background: 'hsl(222 50% 11%)' }}
            >
              <div>
                <p className="text-[10px] tracking-[0.32em] uppercase text-white/35 mb-4 font-medium">
                  Premier échange
                </p>
                <h3 className="font-heading text-2xl md:text-3xl font-light text-white leading-snug tracking-tight mb-4">
                  Prêt à commencer ?
                </h3>
                <p className="text-white/55 leading-relaxed font-light text-sm">
                  Partagez-nous les grandes lignes de votre situation. Nous prendrons contact pour organiser un premier appel de 30 minutes, sans engagement, pour évaluer ensemble si un bilan patrimonial fait sens pour vous.
                </p>
              </div>

              <Link
                to={CONTACT_URL}
                className="inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-full text-sm font-medium tracking-wide bg-white text-[hsl(224_60%_12%)] hover:bg-white/90 transition-all duration-300 hover:-translate-y-0.5 group"
              >
                Démarrer le pré-diagnostic
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <div className="flex items-center gap-2 text-white/30">
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span className="text-[11px] tracking-[0.18em] uppercase">
                  Premier entretien gratuit et sans engagement
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
