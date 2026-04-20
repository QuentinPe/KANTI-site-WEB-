import { Link } from "react-router-dom";

const cas = [
  {
    profil: "Cadre dirigeant",
    situation: "Tranche marginale à 45 %, patrimoine financier important, peu d'optimisation fiscale en place.",
    axes: "Restructuration de l'épargne, PER, démembrement, création d'une holding patrimoniale.",
  },
  {
    profil: "Couple avec enfants",
    situation: "Patrimoine immobilier et assurance-vie, aucune disposition successorale prévue.",
    axes: "Donation-partage, clause bénéficiaire, démembrement de la résidence principale.",
  },
  {
    profil: "Chef d'entreprise",
    situation: "Trésorerie excédentaire en société, projet de cession à moyen terme.",
    axes: "Placement de la trésorerie, préparation à la cession, pacte Dutreil, réinvestissement post-cession.",
  },
];

export default function HomeCasClients() {
  return (
    <section className="section-padding section-glass relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-16 reveal max-w-2xl">
          <div className="electric-line mb-5" />
          <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-5 font-medium">
            Situations concrètes
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-light text-foreground mb-6 tracking-tight leading-[1.1]">
            Des cas<br />
            <span className="italic text-foreground/70">proches du vôtre</span>
          </h2>
          <p className="text-foreground/60 text-lg font-light">
            Chaque situation est différente. Voici comment nous avons accompagné des profils similaires — de façon anonymisée.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {cas.map((c, i) => (
            <div
              key={c.profil}
              className={`reveal reveal-delay-${i + 1} glass-card p-7`}
            >
              <p className="text-[10px] tracking-[0.25em] uppercase text-[hsl(var(--electric))] mb-4 font-medium">
                {c.profil}
              </p>
              <p className="text-foreground/65 text-sm leading-relaxed mb-4 font-light">
                {c.situation}
              </p>
              <div className="separator-fine my-4" />
              <p className="text-foreground/85 text-sm leading-relaxed">{c.axes}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 reveal">
          <Link
            to="/cas-clients"
            className="inline-flex items-center gap-2 px-6 py-3 btn-primary-glass text-sm tracking-wide reflection-sweep"
          >
            Voir tous les cas clients
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
