import { motion, useReducedMotion } from "framer-motion";

interface Offer {
  label: string;
  tag: string;
  rate: number;
  insurance: number;
  flexibility: number;
  earlyRepaymentCost: string;
  totalCostIndex: number;
  liquidityRetained: number;
  note: string;
}

const OFFERS: Offer[] = [
  {
    label: "Offre A",
    tag: "Taux bas",
    rate: 3.55,
    insurance: 0.40,
    flexibility: 2,
    earlyRepaymentCost: "3 % restant",
    totalCostIndex: 100,
    liquidityRetained: 88,
    note: "Souplesse limitée · conditions de modularité restreintes.",
  },
  {
    label: "Offre B",
    tag: "Équilibrée",
    rate: 3.75,
    insurance: 0.28,
    flexibility: 4,
    earlyRepaymentCost: "IRA plafonnées",
    totalCostIndex: 97,
    liquidityRetained: 100,
    note: "Modularité élevée · optimisation possible de l'assurance.",
  },
  {
    label: "Offre C",
    tag: "Garanties favorables",
    rate: 3.90,
    insurance: 0.22,
    flexibility: 5,
    earlyRepaymentCost: "Sans frais",
    totalCostIndex: 96,
    liquidityRetained: 95,
    note: "Assurance et garanties plus favorables · pertinent selon le profil.",
  },
];

function MetricBar({
  label,
  value,
  max,
  reversed = false,
}: {
  label: string;
  value: number;
  max: number;
  reversed?: boolean;
}) {
  const pct = (value / max) * 100;
  const displayPct = reversed ? 100 - pct : pct;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] text-foreground/50">
        <span>{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-foreground/8 overflow-hidden">
        <div
          className="h-full rounded-full bg-foreground/25 transition-all duration-500"
          style={{ width: `${displayPct}%` }}
        />
      </div>
    </div>
  );
}

function FlexDots({ value }: { value: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full ${
            i < value ? "bg-foreground/40" : "bg-foreground/10"
          }`}
        />
      ))}
    </div>
  );
}

export default function OfferComparisonSection() {
  const reduce = useReducedMotion();

  return (
    <section
      className="section-padding"
      style={{ background: "hsl(220 30% 97%)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-60px" }}
        >
          <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/45 mb-4 font-medium">
            03 · Ce que le courtier optimise
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-[1.1] tracking-tight max-w-2xl mb-4">
            Le meilleur financement n'est pas uniquement celui qui affiche le
            taux le plus bas.
          </h2>
          <p className="text-foreground/55 font-light text-sm max-w-xl">
            L'assurance, la souplesse contractuelle, les indemnités de
            remboursement anticipé et les conditions annexes pèsent souvent
            autant que le taux nominal.
          </p>
        </motion.div>

        {/* Offers */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {OFFERS.map((offer, i) => (
            <motion.div
              key={offer.label}
              className="rounded-2xl border border-foreground/8 bg-white p-6 md:p-8 shadow-sm space-y-5"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-40px" }}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-foreground/40">
                    {offer.label}
                  </span>
                  <h3 className="font-heading text-xl font-light text-foreground mt-0.5">
                    {offer.tag}
                  </h3>
                </div>
                <span className="text-2xl font-heading font-light text-foreground">
                  {offer.rate.toFixed(2)}%
                </span>
              </div>

              {/* Metrics */}
              <div className="space-y-3">
                <MetricBar
                  label={`Assurance (${offer.insurance.toFixed(2)} % /an)`}
                  value={offer.insurance}
                  max={0.5}
                  reversed
                />
                <MetricBar
                  label={`Coût total relatif (base 100)`}
                  value={offer.totalCostIndex}
                  max={100}
                  reversed
                />
                <MetricBar
                  label={`Trésorerie conservée`}
                  value={offer.liquidityRetained}
                  max={100}
                />
              </div>

              {/* Flexibility */}
              <div>
                <p className="text-[10px] text-foreground/40 mb-2">
                  Souplesse contractuelle
                </p>
                <FlexDots value={offer.flexibility} />
              </div>

              {/* IRA */}
              <div>
                <p className="text-[10px] text-foreground/40 mb-1">
                  Remboursement anticipé
                </p>
                <p className="text-xs text-foreground/65">{offer.earlyRepaymentCost}</p>
              </div>

              {/* Note */}
              <p className="text-xs text-foreground/50 leading-relaxed border-t border-foreground/6 pt-4">
                {offer.note}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Advisory note */}
        <motion.div
          className="rounded-2xl border border-foreground/8 bg-white p-6 md:p-8 shadow-sm max-w-3xl mx-auto text-center"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true, margin: "-40px" }}
        >
          <p className="text-sm text-foreground/65 font-light leading-relaxed">
            Aucune offre n'est objectivement "la meilleure". Le choix optimal
            dépend du profil, de la durée de détention envisagée, de la
            situation fiscale et de la stratégie patrimoniale globale. C'est
            précisément le rôle du conseiller de sélectionner en connaissance
            de cause.
          </p>
          <p className="text-[11px] italic text-foreground/35 mt-3">
            Données fictives à titre pédagogique · les conditions réelles
            varient selon les établissements et les profils.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
