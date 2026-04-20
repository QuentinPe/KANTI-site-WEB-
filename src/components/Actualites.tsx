import { Link } from "react-router-dom";

const articles = [
  {
    date: "Avril 2026",
    title: "SCPI en 2026 : ce qu'il faut savoir avant d'investir",
    excerpt: "Après deux années de correction, le marché des SCPI se stabilise. Analyse des rendements, de la liquidité et des critères de sélection.",
    tag: "Investissement",
  },
  {
    date: "Mars 2026",
    title: "Assurance-vie : quand faut-il arbitrer ?",
    excerpt: "Un contrat d'assurance-vie n'est pas un placement qu'on oublie. Quand et comment réallouer pour rester aligné avec vos objectifs.",
    tag: "Épargne",
  },
  {
    date: "Mars 2026",
    title: "Donation : les règles à connaître pour transmettre sereinement",
    excerpt: "Abattements, délais de rappel, démembrement : les mécanismes essentiels pour préparer une transmission efficace et conforme.",
    tag: "Transmission",
  },
];

export default function Actualites() {
  return (
    <section id="actualites" className="section-padding section-dark relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 reveal gap-6">
          <div>
            <div className="electric-line mb-5" style={{ background: "linear-gradient(90deg, hsl(210 100% 70%), hsl(210 100% 70% / 0.2))" }} />
            <p className="text-[11px] tracking-[0.3em] uppercase text-white/50 mb-5 font-medium">
              Éclairages
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-light tracking-tight leading-[1.1]">
              Analyses<br />
              <span className="italic text-white/75">& décryptages</span>
            </h2>
          </div>
          <Link
            to="/actualites"
            className="inline-flex items-center gap-2 px-5 py-2.5 btn-glass text-white text-sm tracking-wide self-start md:self-auto"
          >
            Toutes les actualités
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {articles.map((a, i) => (
            <article
              key={a.title}
              className={`reveal reveal-delay-${i + 1} glass-dark rounded-2xl p-7 group cursor-pointer hover:border-white/15 hover:-translate-y-1 transition-all duration-500`}
            >
              <p className="text-[10px] text-white/40 tracking-widest uppercase mb-4 font-medium">
                {a.date} · {a.tag}
              </p>
              <h3 className="font-heading text-xl font-normal text-white mb-4 group-hover:text-[hsl(var(--electric-soft))] transition-colors duration-500 leading-snug tracking-tight">
                {a.title}
              </h3>
              <p className="text-white/55 text-sm leading-relaxed font-light mb-5">
                {a.excerpt}
              </p>
              <span className="inline-flex items-center gap-1.5 text-[12px] text-white/70 group-hover:text-[hsl(var(--electric-soft))] transition-colors duration-300">
                Lire l'article
                <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
