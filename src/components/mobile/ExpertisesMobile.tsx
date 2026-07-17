import { Link } from "react-router-dom";
const items = [
  {
    tag: "Épargne",
    title: "Gestion patrimoniale",
    desc: "Allocation, assurance-vie, PER, SCPI, une stratégie d'épargne qui dure.",
    href: "/gestion-patrimoniale",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1170&auto=format&fit=crop",
  },
  {
    tag: "Fiscalité",
    title: "Fiscalité du patrimoine",
    desc: "Audit, IFI, revenus fonciers, réduire votre pression fiscale sans risques inutiles.",
    href: "/fiscalite",
    image: "https://images.unsplash.com/photo-1554224155-a1487473ffd9?q=80&w=1170&auto=format&fit=crop",
  },
  {
    tag: "Dirigeants",
    title: "Patrimoine professionnel",
    desc: "Rémunération, holding, prévoyance, cession et transmission d'activité.",
    href: "/patrimoine-professionnel",
    image: "https://images.unsplash.com/photo-1506787497326-c2736dde1bef?w=600&auto=format&fit=crop&q=60",
  },
  {
    tag: "Financement",
    title: "Financement & crédit",
    desc: "Courtage patrimonial, négociation des meilleures conditions de crédit.",
    href: "/financement",
    image: "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?w=600&auto=format&fit=crop&q=60",
  },
  {
    tag: "Succession",
    title: "Transmission",
    desc: "Donation, démembrement, Dutreil, anticiper pour protéger ceux qui comptent.",
    href: "/transmission-patrimoine-famille",
    image: "https://images.unsplash.com/photo-1463760959829-d829ea46e191?w=600&auto=format&fit=crop&q=60",
  },
  {
    tag: "Immobilier",
    title: "Immobilier patrimonial",
    desc: "Résidence, locatif, SCI, nue-propriété, pensé dans une logique globale.",
    href: "/patrimoine-immobilier-strategie",
    image: "https://images.unsplash.com/photo-1598228723793-52759bba239c?w=600&auto=format&fit=crop&q=60",
  },
];

export default function ExpertisesMobile() {
  return (
    <section
      id="expertises"
      className="md:hidden relative section-padding-mobile section-glass texture-paper"
    >
      <div className="max-w-md mx-auto">
        <div className="electric-line mb-4" />
        <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/50 mb-3 font-medium">
          Nos expertises
        </p>
        <h2 className="font-heading text-[32px] font-light text-foreground tracking-tight leading-[1.1] mb-10">
          Six métiers,
          <br />
          <span className="italic text-foreground/65">une même méthode</span>
        </h2>

        <ul className="space-y-5">
          {items.map((it) => (
            <li key={it.title}>
              <Link
                to={it.href}
                className="block rounded-3xl overflow-hidden bg-white/55 backdrop-blur-sm ring-1 ring-foreground/[0.06]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={it.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/35 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 inline-flex items-center px-3 h-7 rounded-full bg-white/85 backdrop-blur-sm text-[10px] tracking-[0.25em] uppercase text-foreground/75 font-medium">
                    {it.tag}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-[20px] font-normal text-foreground leading-snug tracking-tight mb-2">
                    {it.title}
                  </h3>
                  <p className="text-foreground/60 text-[14.5px] leading-relaxed font-light mb-4">
                    {it.desc}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground">
                    Découvrir
                    <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}