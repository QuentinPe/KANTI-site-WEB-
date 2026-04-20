import { Link } from "react-router-dom";

const steps = [
  {
    number: "01",
    title: "Écoute",
    description: "Un premier rendez-vous de 30 minutes pour comprendre votre situation, vos projets et vos préoccupations. Gratuit et sans engagement.",
  },
  {
    number: "02",
    title: "Audit",
    description: "Analyse complète de votre patrimoine : actifs, passifs, fiscalité, prévoyance, régimes matrimoniaux. Nous regardons tout.",
  },
  {
    number: "03",
    title: "Stratégie",
    description: "Rédaction d'une lettre de recommandations structurée, avec simulations chiffrées et scénarios comparés.",
  },
  {
    number: "04",
    title: "Mise en œuvre",
    description: "Sélection des meilleurs contrats et supports du marché, ouverture des comptes, coordination avec vos autres conseils.",
  },
  {
    number: "05",
    title: "Suivi",
    description: "Un rendez-vous annuel de bilan, des alertes en cas de changement législatif, un interlocuteur disponible toute l'année.",
  },
];

export default function Methode() {
  return (
    <section id="methode" className="section-padding section-dark relative">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-16 reveal max-w-2xl">
          <div className="electric-line mb-5" style={{ background: "linear-gradient(90deg, hsl(210 100% 70%), hsl(210 100% 70% / 0.2))" }} />
          <p className="text-[11px] tracking-[0.3em] uppercase text-white/50 mb-5 font-medium">
            Méthode
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-light mb-6 tracking-tight leading-[1.1]">
            Comment nous<br />
            <span className="italic text-white/75">travaillons</span>
          </h2>
          <p className="text-white/60 text-lg font-light">
            Pas de formule standard, mais un processus clair, reproductible, qui respecte votre temps et vos priorités.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`reveal reveal-delay-${Math.min(i + 1, 5)} glass-dark rounded-2xl p-7 group hover:border-white/15 transition-all duration-500 hover:-translate-y-1`}
            >
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-3xl font-heading font-light text-white/30 group-hover:text-[hsl(var(--electric-soft))] transition-colors duration-500">
                  {step.number}
                </span>
                <h3 className="font-heading text-xl font-normal text-white tracking-tight">
                  {step.title}
                </h3>
              </div>
              <p className="text-white/55 leading-relaxed text-sm font-light">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 reveal">
          <Link
            to="/notre-methode"
            className="inline-flex items-center gap-2 px-6 py-3 btn-glass text-white text-sm tracking-wide"
          >
            Découvrir notre méthode en détail
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
