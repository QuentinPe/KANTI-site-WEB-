import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const CONTACT_URL = '/contact';

const RAPPORT_SECTIONS = [
  {
    num: '01',
    title: 'Synthèse du patrimoine',
    items: [
      'Cartographie complète et chiffrée',
      'Actifs, passifs, patrimoine net',
      'Indicateurs clés',
    ],
  },
  {
    num: '02',
    title: 'Cartographie des risques',
    items: [
      'Prévoyance analysée',
      'Points de vigilance identifiés',
      'Couverture vs besoins',
    ],
  },
  {
    num: '03',
    title: 'Scénarios étudiés',
    items: [
      '2 à 3 scénarios alternatifs',
      'Simulation Monte Carlo si applicable',
      'Comparaison chiffrée des options',
    ],
  },
  {
    num: '04',
    title: 'Feuille de route',
    items: [
      'Actions priorisées sur 12-24 mois',
      'Estimation des effets attendus',
      'Calendrier de mise en œuvre',
    ],
  },
];

export default function ApercuRapportSection() {
  const reduce = useReducedMotion();

  return (
    <section
      className="section-padding"
      style={{ background: 'hsl(var(--navy-deep))' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left sticky col */}
          <motion.div
            className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <p className="text-[10px] tracking-[0.32em] uppercase text-white/40 mb-5 font-medium">
              07 · Le rapport remis
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-light text-white leading-[1.1] tracking-tight mb-6">
              Un document structuré, argumenté, qui vous appartient.
            </h2>
            <p className="text-white/55 leading-relaxed font-light text-base mb-8 max-w-md">
              Le rapport patrimonial est remis en amont de la séance de restitution. Vous pouvez le lire, l'annoter et le partager librement avec votre notaire, votre expert-comptable ou votre avocat. Il vous appartient intégralement.
            </p>

            <Link
              to={CONTACT_URL}
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full text-sm font-medium tracking-wide bg-white text-[hsl(224_60%_12%)] hover:shadow-xl hover:shadow-white/10 transition-all duration-300 hover:-translate-y-0.5"
            >
              Demander un bilan
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </motion.div>

          {/* Right dark card with rapport sections */}
          <motion.div
            className="lg:col-span-7"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.15 }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <div className="rounded-2xl border border-white/10 bg-white/6 p-6 md:p-8">
              <p className="text-[10px] tracking-[0.28em] uppercase text-white/35 mb-6 font-medium">
                Aperçu du rapport patrimonial
              </p>

              <div className="divide-y divide-white/10">
                {RAPPORT_SECTIONS.map((section, i) => (
                  <motion.div
                    key={section.num}
                    className="py-5 first:pt-0 last:pb-0"
                    initial={reduce ? false : { opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Number badge */}
                      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-[11px] font-medium text-white/50">
                        {section.num}
                      </span>

                      <div className="flex-1">
                        <p className="text-white/85 font-medium text-sm mb-3">{section.title}</p>
                        <ul className="space-y-1.5">
                          {section.items.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-xs text-white/45">
                              <Check className="w-3 h-3 mt-0.5 flex-shrink-0 text-white/30" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
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
