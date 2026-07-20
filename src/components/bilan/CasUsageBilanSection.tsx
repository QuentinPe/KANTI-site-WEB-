import { motion, useReducedMotion } from 'framer-motion';
import { Briefcase, Users, Landmark } from 'lucide-react';

const CAS = [
  {
    num: '01',
    icon: Briefcase,
    title: "Dirigeant d'entreprise",
    body: "Coordination patrimoine personnel et professionnel, préparation d'une cession, rémunération optimisée.",
    tags: ['OBO / Cession', 'Holding patrimoniale', 'Arbitrages IS/IR'],
  },
  {
    num: '02',
    icon: Users,
    title: 'Famille & transmissions',
    body: 'Patrimoine constitué, fiscalité à anticiper, transmission aux enfants dans les meilleures conditions.',
    tags: ['Donations progressives', 'Assurance-vie', 'Pacte Dutreil'],
  },
  {
    num: '03',
    icon: Landmark,
    title: 'Préretraité & retraité',
    body: 'Arbitrages entre revenus, capital et liquidité. Organisation du patrimoine pour sécuriser la retraite.',
    tags: ['Rentes vs capital', 'Prévoyance dépendance', 'Succession organisée'],
  },
];

export default function CasUsageBilanSection() {
  const reduce = useReducedMotion();

  return (
    <section className="section-padding" style={{ background: 'hsl(220 30% 97%)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: '-60px' }}
        >
          <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/45 mb-4 font-medium">
            10 · Pour qui
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-tight tracking-tight max-w-2xl">
            Trois profils, une même exigence : voir clair.
          </h2>
        </motion.div>

        {/* 3-card grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {CAS.map((cas, i) => {
            const Icon = cas.icon;
            return (
              <motion.article
                key={cas.num}
                className="rounded-2xl border border-foreground/8 bg-white p-6 md:p-7 flex flex-col gap-5"
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true, margin: '-40px' }}
              >
                {/* Icon + number */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl border border-foreground/10 bg-foreground/[0.03] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-foreground/50" />
                  </div>
                  <span className="font-heading text-4xl font-extralight text-foreground/10">
                    {cas.num}
                  </span>
                </div>

                {/* Title + body */}
                <div>
                  <h3 className="font-heading text-xl font-light text-foreground leading-snug mb-3">
                    {cas.title}
                  </h3>
                  <p className="text-sm text-foreground/65 leading-relaxed font-light">{cas.body}</p>
                </div>

                {/* Tag pills */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {cas.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-foreground/5 text-foreground/55 border border-foreground/8"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
