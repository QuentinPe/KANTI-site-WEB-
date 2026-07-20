import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Flame, BarChart2, Building2, Globe,
  DollarSign, Scale, Activity, Landmark, Percent, Shield,
  X,
} from 'lucide-react';

interface Factor {
  id: string;
  icon: React.ReactNode;
  name: string;
  shortDesc: string;
  detail: string;
  affected: string[];
  sensitivity: 'positive' | 'negative' | 'neutral';
}

const FACTORS: Factor[] = [
  {
    id: 'hausse-taux',
    icon: <TrendingUp className="w-5 h-5" />,
    name: 'Hausse des taux',
    shortDesc: 'Impact négatif sur les obligations longues et l\'immobilier coté.',
    detail: 'Une hausse des taux directeurs renchérit le crédit, pénalise les obligations à duration longue (baisse mécanique du prix) et réduit l\'attractivité relative des actifs immobiliers cotés. En revanche, les fonds monétaires et dépôts bénéficient de cette configuration.',
    affected: ['Obligations souveraines', 'SIIC/REIT', 'Private equity', 'Monétaire (+)'],
    sensitivity: 'negative',
  },
  {
    id: 'baisse-taux',
    icon: <TrendingDown className="w-5 h-5" />,
    name: 'Baisse des taux',
    shortDesc: 'Favorable aux obligations, à l\'immobilier et aux actifs risqués.',
    detail: 'Un cycle d\'assouplissement monétaire soutient les valorisations obligataires, réduit les coûts de financement des entreprises et améliore l\'attractivité relative des actifs de rendement. Les actions et l\'immobilier coté en bénéficient généralement.',
    affected: ['Obligations souveraines (+)', 'SIIC/REIT (+)', 'Actions monde (+)', 'Monétaire (−)'],
    sensitivity: 'positive',
  },
  {
    id: 'inflation',
    icon: <Flame className="w-5 h-5" />,
    name: 'Inflation persistante',
    shortDesc: 'Érode la valeur réelle des actifs à taux fixe.',
    detail: 'Une inflation structurellement élevée érode le pouvoir d\'achat des obligations à taux fixe. Les actifs réels (immobilier, matières premières) et certaines actions disposant de pouvoir de fixation des prix constituent des couvertures partielles.',
    affected: ['Fonds euros (−)', 'Obligations (−)', 'Immobilier (+)', 'Actions (+)'],
    sensitivity: 'negative',
  },
  {
    id: 'croissance',
    icon: <BarChart2 className="w-5 h-5" />,
    name: 'Cycle de croissance',
    shortDesc: 'Moteur principal des marchés actions et du crédit.',
    detail: 'La croissance économique soutient les bénéfices des entreprises, réduit les défauts de crédit et améliore la confiance des investisseurs. C\'est le principal moteur de performance des actifs risqués (actions, high yield, private equity).',
    affected: ['Actions monde (+)', 'High Yield (+)', 'Private equity (+)', 'Obligations souv. (−)'],
    sensitivity: 'positive',
  },
  {
    id: 'resultats',
    icon: <Activity className="w-5 h-5" />,
    name: 'Résultats d\'entreprises',
    shortDesc: 'Driver direct de la valorisation des actions.',
    detail: 'Les publications de résultats supérieures aux attentes constituent le principal catalyseur des marchés actions à court terme. Des révisions à la hausse des BPA (bénéfice par action) soutiennent les valorisations, tandis que les déceptions provoquent des corrections.',
    affected: ['Actions France (+/−)', 'Actions Europe (+/−)', 'Private equity (+/−)'],
    sensitivity: 'neutral',
  },
  {
    id: 'spreads',
    icon: <Percent className="w-5 h-5" />,
    name: 'Spreads de crédit',
    shortDesc: 'Indicateur de stress sur les marchés obligataires.',
    detail: 'L\'élargissement des spreads de crédit (différentiel de rendement entre obligations d\'entreprises et souverains) signale une aversion au risque accrue et impacte négativement le high yield et le crédit investment grade. Le resserrement bénéficie à ces actifs.',
    affected: ['High Yield', 'Oblig. IG', 'Produits structurés', 'Private equity'],
    sensitivity: 'negative',
  },
  {
    id: 'immo',
    icon: <Building2 className="w-5 h-5" />,
    name: 'Cycle immobilier',
    shortDesc: 'Taux, démographie et offre influencent l\'immobilier coté et SCPI.',
    detail: 'Le cycle immobilier est influencé par les taux d\'intérêt, la démographie, l\'offre de logements et la conjoncture économique. La hausse des taux pèse sur les valorisations à court terme, tandis que l\'inflation peut soutenir les loyers réels sur le long terme.',
    affected: ['SIIC/REIT', 'SCPI', 'Private equity immo'],
    sensitivity: 'neutral',
  },
  {
    id: 'volatilite',
    icon: <Activity className="w-5 h-5" />,
    name: 'Pic de volatilité',
    shortDesc: 'Stress de marché généralisé, hausse du VIX.',
    detail: 'Les épisodes de forte volatilité (VIX > 30) correspondent généralement à des phases de vente forcée et de désendettement. Ils pénalisent l\'ensemble des actifs risqués mais offrent des opportunités d\'entrée pour les investisseurs de long terme disposant de liquidités.',
    affected: ['Actions monde (−)', 'High Yield (−)', 'Obligations souv. (+)', 'Liquidités (+)'],
    sensitivity: 'negative',
  },
  {
    id: 'geo',
    icon: <Globe className="w-5 h-5" />,
    name: 'Risque géopolitique',
    shortDesc: 'Conflits, sanctions et instabilité régionale.',
    detail: 'Les chocs géopolitiques génèrent une aversion au risque et une fuite vers les actifs refuges (or, obligations souveraines, USD). Ils peuvent perturber les chaînes d\'approvisionnement et alimenter l\'inflation sur les matières premières.',
    affected: ['Actions EM (−)', 'Obligations souv. (+)', 'Énergie (+/−)', 'Devises'],
    sensitivity: 'negative',
  },
  {
    id: 'devises',
    icon: <DollarSign className="w-5 h-5" />,
    name: 'Effets de change',
    shortDesc: 'EUR/USD et autres croisements impactent les actifs étrangers.',
    detail: 'Pour un investisseur en euros, la performance des actifs étrangers (US, émergents) intègre l\'effet de change EUR/USD et autres paires. Un euro faible amplifie les gains sur actifs USD non couverts ; un euro fort les réduit.',
    affected: ['Actions US', 'Actions EM', 'ETF hors zone euro'],
    sensitivity: 'neutral',
  },
  {
    id: 'fiscalite',
    icon: <Scale className="w-5 h-5" />,
    name: 'Évolutions fiscales',
    shortDesc: 'PFU, ISF, niches fiscales : la fiscalité impacte le rendement net.',
    detail: 'En France, la fiscalité du patrimoine évolue régulièrement. Les enveloppes (PEA, assurance-vie, PER) offrent des avantages fiscaux à maintenir dans le temps. Les réformes fiscales peuvent modifier l\'attractivité relative de certains supports.',
    affected: ['Assurance-vie', 'PEA', 'PER', 'SCPI'],
    sensitivity: 'neutral',
  },
  {
    id: 'bc',
    icon: <Landmark className="w-5 h-5" />,
    name: 'Politique des banques centrales',
    shortDesc: 'BCE, Fed : les décisions monétaires guident les marchés.',
    detail: 'Les décisions de la BCE et de la Fed (taux directeurs, QE/QT, forward guidance) constituent les principaux facteurs macro exogènes qui influencent l\'ensemble des classes d\'actifs. La communication des banquiers centraux peut déclencher des mouvements de marché significatifs.',
    affected: ['Toutes classes d\'actifs'],
    sensitivity: 'neutral',
  },
];

const SENSITIVITY_COLORS: Record<string, string> = {
  positive: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  negative: 'bg-red-50 text-red-700 border-red-100',
  neutral: 'bg-foreground/5 text-foreground/60 border-foreground/10',
};

const SENSITIVITY_LABELS: Record<string, string> = {
  positive: 'Favorable',
  negative: 'Défavorable',
  neutral: 'Mixte',
};

export default function MacroFactorTimeline() {
  const [selected, setSelected] = useState<string | null>(null);
  const reduce = useReducedMotion();

  const selectedFactor = FACTORS.find(f => f.id === selected);

  return (
    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-10"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: '-60px' }}
        >
          <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/45 mb-4 font-medium">
            Environnement de marché
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-tight tracking-tight max-w-2xl">
            12 facteurs qui influencent votre allocation
          </h2>
          <p className="text-foreground/55 font-light mt-3 text-sm">
            Cliquez sur un facteur pour en savoir plus sur son impact.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {FACTORS.map((factor, i) => (
            <motion.button
              key={factor.id}
              onClick={() => setSelected(selected === factor.id ? null : factor.id)}
              className={`text-left rounded-xl border p-4 transition-all duration-200 ${
                selected === factor.id
                  ? 'border-foreground/20 bg-foreground/[0.03] shadow-sm'
                  : 'border-foreground/8 bg-white hover:border-foreground/15 hover:shadow-sm'
              }`}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              viewport={{ once: true, margin: '-40px' }}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-foreground/50">{factor.icon}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium text-foreground">{factor.name}</h3>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${SENSITIVITY_COLORS[factor.sensitivity]}`}>
                      {SENSITIVITY_LABELS[factor.sensitivity]}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/55 leading-relaxed">{factor.shortDesc}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {selectedFactor && (
            <motion.div
              key={selectedFactor.id}
              initial={reduce ? false : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-foreground/10 bg-white p-6 md:p-8"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-foreground/50">{selectedFactor.icon}</span>
                  <h3 className="font-heading text-xl font-light text-foreground">{selectedFactor.name}</h3>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-foreground/30 hover:text-foreground/60 transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-foreground/70 leading-relaxed text-sm mb-5">{selectedFactor.detail}</p>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-3">Classes d'actifs concernées</p>
                <div className="flex flex-wrap gap-2">
                  {selectedFactor.affected.map(item => (
                    <span
                      key={item}
                      className="text-xs px-3 py-1 rounded-full bg-foreground/5 text-foreground/65 border border-foreground/8"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
