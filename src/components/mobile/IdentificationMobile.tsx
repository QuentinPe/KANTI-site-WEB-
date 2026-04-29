const items = [
  { n: "01", title: "Optimiser mon épargne", line: "Faire travailler un capital qui dort, sans risque mal calibré." },
  { n: "02", title: "Structurer mon patrimoine", line: "Mettre de la cohérence entre l'immobilier, le financier et le pro." },
  { n: "03", title: "Préparer ma retraite", line: "Construire des revenus complémentaires solides et fiscalement maîtrisés." },
  { n: "04", title: "Réduire ma fiscalité", line: "Identifier les marges de manœuvre réelles, pas les niches risquées." },
  { n: "05", title: "Financer un projet", line: "Obtenir un crédit aux meilleures conditions et au bon montage." },
  { n: "06", title: "Préparer la transmission", line: "Anticiper la fiscalité et protéger ceux qui comptent." },
];

export default function IdentificationMobile() {
  return (
    <section
      id="problematiques"
      className="md:hidden relative section-padding-mobile texture-paper"
      aria-label="Vos enjeux patrimoniaux"
    >
      <div className="max-w-md mx-auto">
        <div className="electric-line mb-4" />
        <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/50 mb-3 font-medium">
          Vos enjeux
        </p>
        <h2 className="font-heading font-light text-foreground tracking-tight leading-[1.1] text-[32px] mb-10">
          Vous vous reconnaissez
          <br />
          <span className="italic text-foreground/65">
            dans l'une de ces situations&nbsp;?
          </span>
        </h2>

        <ol className="relative">
          <span
            aria-hidden
            className="absolute left-[18px] top-2 bottom-2 w-px bg-foreground/10"
          />
          {items.map((it) => (
            <li
              key={it.n}
              className="relative pl-14 pb-8 last:pb-0"
            >
              <span className="absolute left-0 top-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-[hsl(var(--navy-deep))] text-white text-[11px] font-medium tracking-wider">
                {it.n}
              </span>
              <h3 className="font-heading text-[19px] font-normal text-foreground leading-snug mb-1.5 tracking-tight">
                {it.title}
              </h3>
              <p className="text-foreground/60 text-[14.5px] leading-relaxed font-light">
                {it.line}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}