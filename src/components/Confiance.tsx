const items = [
  {
    title: "Statut réglementaire",
    body: "Conseiller en Investissements Financiers (CIF) enregistré à l'ORIAS. Courtier en assurances (COA) et en opérations de banque (COBSP). Carte de transaction immobilière (carte T).",
  },
  {
    title: "Supervision",
    body: "Membre de la Chambre Nationale des Conseils en Gestion de Patrimoine (CNCGP), association professionnelle agréée par l'Autorité des Marchés Financiers (AMF).",
  },
  {
    title: "Rémunération",
    body: "Nous vous informons systématiquement de notre mode de rémunération avant toute recommandation. Honoraires de conseil ou commissions : tout est documenté et expliqué.",
  },
  {
    title: "Assurances",
    body: "Responsabilité civile professionnelle et garantie financière conformes aux exigences réglementaires. Vos actifs sont détenus chez des dépositaires agréés, jamais chez nous.",
  },
];

export default function Confiance() {
  return (
    <section className="section-padding section-glass relative">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-16 reveal text-center max-w-2xl mx-auto">
          <div className="electric-line mb-5 mx-auto" />
          <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-5 font-medium">
            Cadre réglementaire
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-light text-foreground tracking-tight leading-[1.1]">
            Un exercice encadré,<br />
            <span className="italic text-foreground/70">une transparence totale</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {items.map((item, i) => (
            <div
              key={item.title}
              className={`reveal reveal-delay-${Math.min(i + 1, 4)} glass-card p-7`}
            >
              <h3 className="font-heading text-xl font-light text-foreground mb-3 tracking-tight">
                {item.title}
              </h3>
              <p className="text-foreground/60 text-sm leading-relaxed font-light">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
