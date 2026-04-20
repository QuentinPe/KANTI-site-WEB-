const team = [
  {
    name: "Alexandre Dumont",
    role: "Fondateur — Ingénierie patrimoniale",
    bio: "Ancien directeur de clientèle privée en banque, Alexandre a fondé le cabinet après 12 ans passés à structurer des patrimoines familiaux et professionnels. Il intervient sur les dossiers complexes : holding, cession, transmission internationale.",
  },
  {
    name: "Claire Lefèvre",
    role: "Associée — Stratégie fiscale",
    bio: "Diplômée du Master Gestion de Patrimoine de Clermont-Ferrand, Claire est spécialisée en optimisation fiscale et structuration successorale. Elle coordonne les dossiers impliquant notaires et avocats fiscalistes.",
  },
  {
    name: "Thomas Bernier",
    role: "Associé — Allocations & marchés",
    bio: "Certifié CFA et CIF, Thomas pilote l'allocation d'actifs et la sélection des supports d'investissement. Il assure le suivi de performance et les arbitrages stratégiques sur les portefeuilles.",
  },
];

export default function Equipe() {
  return (
    <section id="equipe" className="section-padding texture-paper relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-16 reveal max-w-2xl">
          <div className="electric-line mb-5" />
          <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-5 font-medium">
            L'équipe
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-light text-foreground mb-6 tracking-tight leading-[1.1]">
            Trois associés,<br />
            <span className="italic text-foreground/70">une même exigence</span>
          </h2>
          <p className="text-foreground/60 text-lg font-light">
            Chaque client a un interlocuteur dédié. L'ensemble de l'équipe collabore sur les dossiers qui l'exigent.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {team.map((member, i) => (
            <div
              key={member.name}
              className={`reveal reveal-delay-${i + 1} glass-card p-6 group`}
            >
              <div
                className="w-full aspect-[4/5] mb-6 flex items-end justify-center overflow-hidden rounded-xl relative"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(220 30% 92%) 0%, hsl(210 25% 85%) 100%)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-60"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 20%, hsl(210 100% 70% / 0.3) 0%, transparent 60%)",
                  }}
                />
                <span className="relative font-heading text-7xl text-foreground/15 pb-6 group-hover:text-foreground/25 transition-colors duration-500">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
              <h3 className="font-heading text-xl font-normal text-foreground mb-1 tracking-tight">
                {member.name}
              </h3>
              <p className="text-[hsl(var(--electric))] text-[12px] font-medium mb-3 tracking-wide">
                {member.role}
              </p>
              <p className="text-foreground/60 text-sm leading-relaxed font-light">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
