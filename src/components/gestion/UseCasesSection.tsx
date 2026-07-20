import { motion, useReducedMotion } from 'framer-motion';

const USE_CASES = [
  {
    id: 'capital',
    number: '01',
    title: 'Constituer un capital long terme',
    situation: 'Cadre de 38 ans, capacité d\'épargne mensuelle de 1 500 €, pas de contrainte de liquidité immédiate, premier investissement en unités de compte.',
    horizon: '20 ans',
    contrainte: 'Acceptation d\'une volatilité modérée, souhait de diversification internationale',
    approche: 'Mise en place d\'un contrat d\'assurance-vie en unités de compte et d\'un PEA, avec une allocation majoritairement actions monde (ETF indiciels), rééquilibrage annuel et versements programmés. Utilisation de la discipline des apports réguliers pour lisser l\'entrée en marché.',
    indicateurs: ['Performance annualisée vs. indice de référence', 'Taux de couverture de l\'objectif capital', 'Diversification géographique', 'Drawdown maximum observé'],
  },
  {
    id: 'retraite',
    number: '02',
    title: 'Préparer sa retraite',
    situation: 'Professionnel libéral de 52 ans, TMI à 41 %, revenus professionnels élevés mais irréguliers, horizon de départ à la retraite dans 13 ans.',
    horizon: '13 ans',
    contrainte: 'Optimisation fiscale prioritaire, constitution de revenus complémentaires réguliers',
    approche: 'Combinaison d\'un PER individuel pour maximiser la déductibilité (versement ciblé selon la TMI), d\'une assurance-vie en phase d\'accumulation et d\'une SCPI en nue-propriété pour bénéficier de l\'usufruit temporaire. Glissement progressif vers un profil plus défensif à l\'approche de l\'échéance.',
    indicateurs: ['Économie fiscale annuelle', 'Taux de remplacement projeté', 'Revenu mensuel estimé à la retraite', 'Part de revenus défiscalisés'],
  },
  {
    id: 'tresorerie',
    number: '03',
    title: 'Valoriser une trésorerie d\'entreprise',
    situation: 'Dirigeant de PME, trésorerie excédentaire de 300 k€ non distribuée, souhait de valorisation sans immobilisation excessive, enjeux de fiscalité IS/IR.',
    horizon: '3 à 7 ans',
    contrainte: 'Liquidité partielle maintenue, respect du cadre juridique IS, aversion aux produits complexes',
    approche: 'Contrat de capitalisation au nom de la société, combinant fonds en euros pour la part liquide et unités de compte obligataires et actions pour la partie à horizon plus long. Comparaison avec l\'hypothèse de distribution et placement à titre personnel.',
    indicateurs: ['Rendement net de charges IS', 'Ratio liquidité maintenue', 'Frais totaux du contrat', 'Performance vs. dépôt bancaire'],
  },
];

export default function UseCasesSection() {
  const reduce = useReducedMotion();

  return (
    <section className="section-padding" style={{ background: 'hsl(var(--ivory-warm, 40 30% 96%))' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-12"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: '-60px' }}
        >
          <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/45 mb-4 font-medium">
            Cas d'usage
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-tight tracking-tight max-w-2xl">
            Exemples de situations patrimoniales
          </h2>
          <p className="text-foreground/55 font-light mt-3 text-sm max-w-xl">
            Ces cas sont purement illustratifs et anonymisés. Ils ne constituent pas une recommandation personnalisée.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {USE_CASES.map((uc, i) => (
            <motion.article
              key={uc.id}
              className="rounded-2xl border border-foreground/8 bg-white p-6 md:p-7 flex flex-col gap-5"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true, margin: '-40px' }}
            >
              {/* Header */}
              <div>
                <span className="font-heading text-4xl font-extralight text-foreground/10 block mb-2">{uc.number}</span>
                <h3 className="font-heading text-xl font-light text-foreground leading-snug">{uc.title}</h3>
              </div>

              {/* Situation */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-2">Situation de départ</p>
                <p className="text-sm text-foreground/65 leading-relaxed font-light">{uc.situation}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-foreground/5 text-foreground/55 border border-foreground/8">
                  Horizon : {uc.horizon}
                </span>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-foreground/5 text-foreground/55 border border-foreground/8">
                  {uc.contrainte.split(',')[0]}
                </span>
              </div>

              {/* Approach */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-2">Approche envisagée</p>
                <p className="text-sm text-foreground/65 leading-relaxed font-light">{uc.approche}</p>
              </div>

              {/* Indicators */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-2">Indicateurs à suivre</p>
                <ul className="space-y-1.5">
                  {uc.indicateurs.map(ind => (
                    <li key={ind} className="flex items-start gap-2 text-xs text-foreground/50">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-foreground/25 flex-shrink-0" />
                      {ind}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="text-[11px] italic text-foreground/35 text-center mt-8">
          Exemples purement illustratifs et anonymisés. Ces situations ne constituent pas une recommandation d'investissement.
          Tout conseil personnalisé nécessite un diagnostic patrimonial complet.
        </p>
      </div>
    </section>
  );
}
