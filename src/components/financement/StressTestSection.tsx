import { useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { computeMonthlyPayment } from "@/lib/financing/loanEngine";

const BASE_PRINCIPAL = 613_000;
const BASE_RATE = 0.038;
const BASE_MONTHS = 240;
const BASE_NET_INCOME = 8_500;
const BASE_INSURANCE = 0.003;

type RobustnessLevel = "Confortable" | "Maîtrisée" | "Limitée" | "Insuffisante";

function getRobustness(debtRatio: number): {
  level: RobustnessLevel;
  color: string;
  bg: string;
  desc: string;
} {
  if (debtRatio < 0.28)
    return {
      level: "Confortable",
      color: "text-emerald-700",
      bg: "bg-emerald-50 border-emerald-100",
      desc: "Taux d'effort maîtrisé, projet solide.",
    };
  if (debtRatio < 0.33)
    return {
      level: "Maîtrisée",
      color: "text-blue-700",
      bg: "bg-blue-50 border-blue-100",
      desc: "Situation acceptable selon les établissements.",
    };
  if (debtRatio < 0.38)
    return {
      level: "Limitée",
      color: "text-amber-700",
      bg: "bg-amber-50 border-amber-100",
      desc: "Attention · certains établissements peuvent refuser.",
    };
  return {
    level: "Insuffisante",
    color: "text-red-700",
    bg: "bg-red-50 border-red-100",
    desc: "Projet potentiellement non finançable dans ces conditions.",
  };
}

function formatEurFull(v: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(v);
}

export default function StressTestSection() {
  const reduce = useReducedMotion();

  const [rateStress, setRateStress] = useState(0);       // 0 to 0.02
  const [incomeStress, setIncomeStress] = useState(0);   // 0 to 0.2
  const [worksStress, setWorksStress] = useState(0);     // 0 to 50000

  const stressedRate = BASE_RATE + rateStress;
  const stressedPrincipal = BASE_PRINCIPAL + worksStress;
  const stressedIncome = BASE_NET_INCOME * (1 - incomeStress);

  const stressedMonthly = useMemo(() => {
    const base = computeMonthlyPayment(stressedPrincipal, stressedRate, BASE_MONTHS);
    const ins = (stressedPrincipal * BASE_INSURANCE) / 12;
    return base + ins;
  }, [stressedPrincipal, stressedRate]);

  const debtRatio = stressedIncome > 0 ? stressedMonthly / stressedIncome : 1;
  const resteAVivre = stressedIncome - stressedMonthly;
  const robustness = getRobustness(debtRatio);

  return (
    <section className="section-padding bg-background">
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
            11 · Robustesse du projet
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-[1.1] tracking-tight max-w-2xl mb-4">
            Votre projet reste-t-il solide si le contexte change ?
          </h2>
          <p className="text-foreground/55 font-light text-sm max-w-xl">
            Ajustez les curseurs pour simuler différents scénarios adverses et
            observer leur impact sur le taux d'effort et la soutenabilité.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: sliders */}
          <motion.div
            className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            viewport={{ once: true, margin: "-60px" }}
          >
            <div className="rounded-2xl border border-foreground/8 bg-white p-6 md:p-8 shadow-sm space-y-7">
              {/* Rate stress */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-foreground/65">
                    Hausse de taux
                  </label>
                  <span className="text-sm font-medium text-foreground/80">
                    +{(rateStress * 100).toFixed(1)} %
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={0.02}
                  step={0.001}
                  value={rateStress}
                  onChange={(e) => setRateStress(Number(e.target.value))}
                  className="w-full accent-foreground"
                  aria-label="Hausse de taux"
                />
                <div className="flex justify-between text-[10px] text-foreground/30 mt-1">
                  <span>0 %</span>
                  <span>+2 %</span>
                </div>
              </div>

              {/* Income stress */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-foreground/65">
                    Baisse de revenus
                  </label>
                  <span className="text-sm font-medium text-foreground/80">
                    -{(incomeStress * 100).toFixed(0)} %
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={0.2}
                  step={0.01}
                  value={incomeStress}
                  onChange={(e) => setIncomeStress(Number(e.target.value))}
                  className="w-full accent-foreground"
                  aria-label="Baisse de revenus"
                />
                <div className="flex justify-between text-[10px] text-foreground/30 mt-1">
                  <span>0 %</span>
                  <span>-20 %</span>
                </div>
              </div>

              {/* Works stress */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-foreground/65">
                    Travaux supplémentaires
                  </label>
                  <span className="text-sm font-medium text-foreground/80">
                    +{formatEurFull(worksStress)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50_000}
                  step={1_000}
                  value={worksStress}
                  onChange={(e) => setWorksStress(Number(e.target.value))}
                  className="w-full accent-foreground"
                  aria-label="Travaux supplémentaires"
                />
                <div className="flex justify-between text-[10px] text-foreground/30 mt-1">
                  <span>0 €</span>
                  <span>+50 000 €</span>
                </div>
              </div>

              <p className="text-[11px] italic text-foreground/35 border-t border-foreground/8 pt-4">
                Indicateur pédagogique · ne constitue pas une décision de
                financement. Base : 613 000 €, 3,8%, 20 ans, revenus 8 500 €/mois.
              </p>
            </div>
          </motion.div>

          {/* Right: results */}
          <motion.div
            className="lg:col-span-7 space-y-5"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.12 }}
            viewport={{ once: true, margin: "-60px" }}
          >
            {/* Robustness pill */}
            <div
              className={`rounded-2xl border p-5 md:p-6 ${robustness.bg}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-2">
                    Indicateur de robustesse
                  </p>
                  <p className={`text-2xl font-heading font-light ${robustness.color}`}>
                    {robustness.level}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-2">
                    Taux d'effort
                  </p>
                  <p className={`text-2xl font-heading font-light ${robustness.color}`}>
                    {(debtRatio * 100).toFixed(1)} %
                  </p>
                </div>
              </div>
              <p className={`text-sm mt-3 ${robustness.color} opacity-80`}>
                {robustness.desc}
              </p>
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "Mensualité stressée",
                  value: formatEurFull(stressedMonthly) + "/mois",
                  sub: `Taux réel : ${(stressedRate * 100).toFixed(2)} %`,
                },
                {
                  label: "Revenus stressés",
                  value: formatEurFull(stressedIncome) + "/mois",
                  sub: `Revenus de base : ${formatEurFull(BASE_NET_INCOME)}/mois`,
                },
                {
                  label: "Reste à vivre",
                  value: formatEurFull(Math.max(0, resteAVivre)) + "/mois",
                  sub: resteAVivre < 0 ? "Attention · insuffisant" : "Indicatif",
                },
                {
                  label: "Capital emprunté",
                  value: formatEurFull(stressedPrincipal),
                  sub: `Travaux inclus : +${formatEurFull(worksStress)}`,
                },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-2xl border border-foreground/8 bg-white p-5 shadow-sm"
                >
                  <p className="text-[10px] text-foreground/40 mb-2">{m.label}</p>
                  <p className="text-xl font-heading font-light text-foreground/85 mb-1">
                    {m.value}
                  </p>
                  <p className="text-[11px] text-foreground/35">{m.sub}</p>
                </div>
              ))}
            </div>

            {/* Visual debt ratio bar */}
            <div className="rounded-2xl border border-foreground/8 bg-white p-5 shadow-sm">
              <div className="flex justify-between text-xs text-foreground/50 mb-3">
                <span>Taux d'effort simulé</span>
                <span className={`font-medium ${robustness.color}`}>
                  {(debtRatio * 100).toFixed(1)} %
                </span>
              </div>
              <div className="h-3 rounded-full bg-foreground/8 overflow-hidden relative">
                {/* Threshold markers */}
                {[28, 33, 38].map((pct) => (
                  <div
                    key={pct}
                    className="absolute top-0 bottom-0 w-px bg-white/80 z-10"
                    style={{ left: `${(pct / 50) * 100}%` }}
                    aria-hidden
                  />
                ))}
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (debtRatio / 0.5) * 100)}%`,
                    background:
                      debtRatio < 0.28
                        ? "hsl(142 70% 45%)"
                        : debtRatio < 0.33
                        ? "hsl(220 70% 55%)"
                        : debtRatio < 0.38
                        ? "hsl(38 95% 50%)"
                        : "hsl(0 72% 51%)",
                  }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-foreground/25 mt-1.5">
                <span>0 %</span>
                <span>28 %</span>
                <span>33 %</span>
                <span>38 %</span>
                <span>50 %</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
