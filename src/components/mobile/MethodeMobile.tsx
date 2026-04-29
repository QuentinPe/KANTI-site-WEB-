import { Link } from "react-router-dom";

const steps = [
  { n: "01", title: "Découverte", desc: "30 minutes pour comprendre votre situation. Gratuit, sans engagement." },
  { n: "02", title: "Bilan patrimonial", desc: "Audit complet : actifs, fiscalité, prévoyance, régimes matrimoniaux." },
  { n: "03", title: "Objectifs", desc: "Une carte claire de vos priorités, avant toute décision." },
  { n: "04", title: "Préconisations", desc: "Lettre de recommandations chiffrée. Vous gardez la main." },
  { n: "05", title: "Mise en œuvre", desc: "Sélection des meilleurs contrats et coordination de vos conseils." },
  { n: "06", title: "Suivi annuel", desc: "Un rendez-vous chaque année. Une relation qui s'inscrit dans la durée." },
];

export default function MethodeMobile() {
  return (
    <section
      id="methode"
      className="md:hidden relative section-padding-mobile text-white"
      style={{ background: "hsl(var(--navy-deep))" }}
    >
      <div className="max-w-md mx-auto">
        <div
          className="electric-line mb-4"
          style={{ background: "hsl(var(--electric-soft) / 0.7)" }}
        />
        <p className="text-[10px] tracking-[0.32em] uppercase text-white/55 mb-3 font-medium">
          Notre méthode
        </p>
        <h2 className="font-heading text-[32px] font-light leading-[1.1] tracking-tight mb-10">
          Comment nous
          <br />
          <span className="italic text-white/70">travaillons</span>
        </h2>

        <ol className="space-y-7">
          {steps.map((s) => (
            <li key={s.n} className="grid grid-cols-[auto_1fr] gap-5">
              <div>
                <span className="font-heading text-[34px] font-light text-white/30 leading-none tabular-nums">
                  {s.n}
                </span>
              </div>
              <div className="border-l border-white/10 pl-5">
                <h3 className="font-heading text-[19px] font-normal text-white tracking-tight leading-snug mb-1.5">
                  {s.title}
                </h3>
                <p className="text-white/65 text-[14.5px] leading-relaxed font-light">
                  {s.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <Link
          to="/contact"
          className="mt-12 flex items-center justify-center gap-2 h-14 rounded-full bg-white text-[hsl(var(--navy-deep))] text-[15px] font-medium tracking-wide"
        >
          Démarrer la conversation
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.6}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}