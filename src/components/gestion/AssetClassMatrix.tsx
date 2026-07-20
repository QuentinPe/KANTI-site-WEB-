import { motion, useReducedMotion } from 'framer-motion';
import { ASSET_ASSUMPTIONS } from '@/lib/simulation/assetAssumptions';

const DISPLAYED_ASSETS = [
  'fonds-euros', 'monétaire', 'obligations-souveraines', 'obligations-entreprises',
  'obligations-haut-rendement', 'actions-france', 'actions-europe', 'actions-us',
  'actions-monde', 'etf-diversifié', 'immobilier-coté', 'scpi', 'private-equity',
] as const;

function RiskDots({ level }: { level: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`Niveau de risque ${level} sur 7`}>
      {Array.from({ length: 7 }).map((_, i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full ${i < level ? 'bg-foreground/70' : 'bg-foreground/10'}`}
        />
      ))}
    </span>
  );
}

const LIQUIDITY_COLORS: Record<string, string> = {
  haute: 'text-emerald-700 bg-emerald-50',
  moyenne: 'text-amber-700 bg-amber-50',
  faible: 'text-orange-700 bg-orange-50',
  'très faible': 'text-red-700 bg-red-50',
};

function SensitivityBar({ value }: { value: number }) {
  const pct = ((value + 1) / 2) * 100; // map [-1, 1] to [0, 100]
  const isPos = value >= 0;
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1.5 rounded-full bg-foreground/8 overflow-hidden">
        <div
          className={`h-full rounded-full ${isPos ? 'bg-blue-500/60' : 'bg-red-400/60'}`}
          style={{ width: `${Math.abs(value) * 100}%`, marginLeft: isPos ? '50%' : `${pct}%` }}
        />
      </div>
      <span className="text-[10px] text-foreground/45 w-8 text-right">{value > 0 ? '+' : ''}{value.toFixed(1)}</span>
    </div>
  );
}

export default function AssetClassMatrix() {
  const reduce = useReducedMotion();

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
            Univers d'investissement
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-tight tracking-tight max-w-2xl">
            Caractéristiques indicatives des classes d'actifs
          </h2>
          <p className="text-foreground/55 font-light mt-3 max-w-2xl text-sm">
            Tableau comparatif illustratif. Toutes les données sont des hypothèses de démonstration et ne constituent pas une prévision.
          </p>
        </motion.div>

        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full min-w-[800px] text-sm" aria-label="Matrice comparative des classes d'actifs">
            <thead>
              <tr className="border-b border-foreground/8">
                <th
                  scope="col"
                  className="sticky left-0 bg-background text-left py-3 pr-4 font-medium text-[11px] tracking-widest uppercase text-foreground/40 min-w-[180px]"
                >
                  Classe d'actif
                </th>
                <th scope="col" className="text-left py-3 px-3 font-medium text-[11px] tracking-widest uppercase text-foreground/40">
                  Risque (1–7)
                </th>
                <th scope="col" className="text-left py-3 px-3 font-medium text-[11px] tracking-widest uppercase text-foreground/40">
                  Horizon min.
                </th>
                <th scope="col" className="text-left py-3 px-3 font-medium text-[11px] tracking-widest uppercase text-foreground/40">
                  Liquidité
                </th>
                <th scope="col" className="text-left py-3 px-3 font-medium text-[11px] tracking-widest uppercase text-foreground/40">
                  Rdmt indicatif
                </th>
                <th scope="col" className="text-left py-3 px-3 font-medium text-[11px] tracking-widest uppercase text-foreground/40">
                  Sens. taux
                </th>
                <th scope="col" className="text-left py-3 px-3 font-medium text-[11px] tracking-widest uppercase text-foreground/40">
                  Sens. inflation
                </th>
              </tr>
            </thead>
            <tbody>
              {DISPLAYED_ASSETS.map((id, i) => {
                const asset = ASSET_ASSUMPTIONS[id];
                return (
                  <motion.tr
                    key={id}
                    className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors"
                    initial={reduce ? false : { opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.04 }}
                    viewport={{ once: true, margin: '-40px' }}
                  >
                    <td className="sticky left-0 bg-background py-3.5 pr-4">
                      <span className="font-medium text-foreground/80">{asset.shortLabel}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <RiskDots level={asset.riskLevel} />
                    </td>
                    <td className="py-3.5 px-3 text-foreground/60">
                      {asset.minHorizon === 0 ? '< 1 an' : `${asset.minHorizon} ans`}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${LIQUIDITY_COLORS[asset.liquidity]}`}>
                        {asset.liquidity}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-foreground/75">
                      {(asset.expectedReturn * 100).toFixed(1)} %
                    </td>
                    <td className="py-3.5 px-3">
                      <SensitivityBar value={asset.ratesSensitivity} />
                    </td>
                    <td className="py-3.5 px-3">
                      <SensitivityBar value={asset.inflationSensitivity} />
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] italic text-foreground/35 mt-6">
          Données illustratives uniquement. Rendements passés non garantis. Tous les investissements comportent un risque de perte en capital.
        </p>
      </div>
    </section>
  );
}
