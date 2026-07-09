import { Link } from "react-router-dom";

const team = [
  {
    name: "Quentin Perromat",
    role: "Associé Fondateur",
    short: "Vision · stratégie · clientèle",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=75",
  },
  {
    name: "Thomas Robert",
    role: "Courtier & Assistant patrimoine",
    short: "Financement · suivi client",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=75",
  },
];

export default function EquipeMobile() {
  return (
    <section
      id="equipe"
      className="md:hidden relative section-padding-mobile texture-paper"
    >
      <div className="max-w-md mx-auto">
        <div className="electric-line mb-4" />
        <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/50 mb-3 font-medium">
          L'équipe · Bordeaux
        </p>
        <h2 className="font-heading text-[32px] font-light text-foreground tracking-tight leading-[1.1] mb-3">
          L'équipe,
          <br />
          <span className="italic text-foreground/65">à votre service</span>
        </h2>
        <p className="text-foreground/60 text-[15px] font-light leading-relaxed mb-8">
          Un interlocuteur dédié par client. Plusieurs cerveaux sur les
          dossiers qui l'exigent.
        </p>

        <ul className="space-y-4">
          {team.map((m, i) => (
            <li
              key={m.name}
              className="flex items-center gap-4 rounded-2xl bg-white/55 backdrop-blur-sm ring-1 ring-foreground/[0.06] p-3"
            >
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                <img
                  src={m.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover grayscale-[0.2]"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] tracking-[0.28em] uppercase text-foreground/45 font-medium mb-1">
                  {String(i + 1).padStart(2, "0")} · {m.role}
                </p>
                <h3 className="font-heading text-[18px] font-normal text-foreground tracking-tight leading-tight mb-0.5">
                  {m.name}
                </h3>
                <p className="text-foreground/55 text-[12.5px] font-light">
                  {m.short}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <Link
          to="/cabinet"
          className="mt-8 inline-flex items-center gap-2 text-[14px] font-medium text-foreground link-underline pb-1"
        >
          Découvrir le cabinet →
        </Link>
      </div>
    </section>
  );
}