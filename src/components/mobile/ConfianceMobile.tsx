const badges = [
  { label: "ORIAS", title: "CIF · IAS · IOBSP", body: "Inscrit comme Conseiller en Investissements Financiers et Courtier en Assurances." },
  { label: "CNCEF", title: "Membre certifié", body: "Code de déontologie strict, formation continue et contrôle annuel." },
  { label: "AMF / ACPR", title: "Sous supervision", body: "Activités encadrées par les autorités françaises de tutelle financière." },
  { label: "RC Pro", title: "& garantie financière", body: "Conformes aux articles L.541-3 et L.512-6. Aucune détention d'actifs." },
];

const guarantees = [
  "Information précontractuelle systématique",
  "Mode de rémunération expliqué avant tout conseil",
  "Aucune détention d'actifs en propre",
  "Indépendance totale des banques",
];

export default function ConfianceMobile() {
  return (
    <section
      id="confiance"
      className="md:hidden relative section-padding-mobile section-glass"
    >
      <div className="max-w-md mx-auto">
        <div className="electric-line mb-4" />
        <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/50 mb-3 font-medium">
          Réassurance
        </p>
        <h2 className="font-heading text-[30px] font-light text-foreground tracking-tight leading-[1.1] mb-8">
          Un exercice encadré,
          <br />
          <span className="italic text-foreground/65">une transparence totale</span>
        </h2>

        <ul className="space-y-3 mb-10 border-l border-foreground/10 pl-5">
          {guarantees.map((g) => (
            <li
              key={g}
              className="flex items-start gap-3 text-foreground/70 text-[14.5px] font-light leading-relaxed"
            >
              <svg
                className="w-4 h-4 mt-0.5 flex-shrink-0 text-[hsl(var(--electric))]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {g}
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-2 gap-3">
          {badges.map((b) => (
            <article
              key={b.label}
              className="rounded-2xl p-4 bg-white/65 backdrop-blur-sm ring-1 ring-foreground/[0.06]"
            >
              <div className="font-heading text-[18px] font-light text-foreground tracking-tight mb-1.5">
                {b.label}
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-foreground/45 font-medium mb-2">
                {b.title}
              </div>
              <p className="text-foreground/55 text-[12px] leading-snug font-light">
                {b.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}