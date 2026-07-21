import { Link } from "react-router-dom";

const cas = [
  {
    profil: "Cadre dirigeant",
    situation: "Tranche marginale à 45%, peu d'optimisation fiscale.",
    chiffre: "−42 K€/an de fiscalité",
  },
  {
    profil: "Couple avec enfants",
    situation: "Patrimoine immobilier, aucune disposition successorale.",
    chiffre: "−65% de droits de succession",
  },
  {
    profil: "Chef d'entreprise",
    situation: "Trésorerie excédentaire, projet de cession à moyen terme.",
    chiffre: "−75% de fiscalité sur la cession",
  },
];

export default function HomeCasClientsMobile() {
  return (
    <section className="md:hidden relative section-padding-mobile">
      <div className="max-w-md mx-auto">
        <h2 className="font-heading text-[32px] font-light text-foreground tracking-tight leading-[1.1] mb-3">
          Des cas
          <br />
          <span className="italic text-foreground/65">proches du vôtre</span>
        </h2>
        <p className="text-foreground/60 text-[15px] font-light leading-relaxed mb-8">
          Anonymisés. Voici comment nous accompagnons des profils similaires.
        </p>

        <ul className="space-y-4">
          {cas.map((c, i) => (
            <li
              key={c.profil}
              className="rounded-2xl bg-white/55 backdrop-blur-sm ring-1 ring-foreground/[0.06] p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] tracking-[0.28em] uppercase text-foreground/45 font-medium">
                  Dossier N°{String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[9px] tracking-[0.2em] uppercase text-[hsl(var(--electric))] font-medium px-2 py-0.5 rounded-full ring-1 ring-[hsl(var(--electric))/0.3]">
                  Anonymisé
                </span>
              </div>
              <p className="text-[hsl(var(--electric))] text-[13px] font-medium mb-2">
                {c.profil}
              </p>
              <p className="text-foreground/65 text-[14px] leading-relaxed font-light mb-3">
                {c.situation}
              </p>
              <p className="text-[12.5px] font-medium tracking-wide text-foreground border-l-2 border-[hsl(var(--accent))] pl-3 italic">
                {c.chiffre}
              </p>
            </li>
          ))}
        </ul>

        <Link
          to="/cas-clients"
          className="mt-8 inline-flex items-center gap-2 text-[14px] font-medium text-foreground link-underline pb-1"
        >
          Voir tous les cas clients →
        </Link>
      </div>
    </section>
  );
}