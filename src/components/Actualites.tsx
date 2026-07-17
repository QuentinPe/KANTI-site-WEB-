import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getArticles } from "@/lib/articlesService";

export default function Actualites() {
  const { data: allArticles = [] } = useQuery({ queryKey: ["articles"], queryFn: getArticles });
  const featured = allArticles.find((a) => a.featured) ?? allArticles[0];
  const articles = allArticles.filter((a) => a.id !== featured?.id).slice(0, 3);

  if (!featured) return null;

  return (
    <section
      id="actualites"
      className="section-padding section-glass texture-paper relative overflow-hidden"
    >
      {/* Glow décoratif */}
      <div
        aria-hidden
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-40"
        style={{
          background: "radial-gradient(circle, hsl(218 45% 38% / 0.1) 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6 reveal">
          <div>
            <div className="electric-line mb-5" />
            <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-5 font-medium">
              Magazine · Éclairages
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-[3.2rem] font-heading font-light text-foreground tracking-tight leading-[1.05]">
              Analyses<br />
              <span className="italic text-foreground/65">& décryptages</span>
            </h2>
          </div>
          <Link
            to="/actualites"
            data-magnetic
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground link-underline pb-1 self-start md:self-auto"
          >
            Toutes les actualités
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Grille principale */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* Article à la une — 7 colonnes */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <Link to={`/actualites/${featured.slug}`} className="group block">
              <article className="glass-card glass-card-plain rounded-[2rem] overflow-hidden relative hover:shadow-[0_24px_64px_-20px_hsl(224_60%_12%/0.14)] transition-shadow duration-500">
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                    style={{ backgroundImage: `url(${featured.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
                  {/* Badge à la une */}
                  <span className="absolute top-5 left-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(var(--navy-deep))] text-[10px] tracking-[0.28em] uppercase text-white font-medium">
                    À la une · {featured.tag}
                  </span>
                </div>

                {/* Contenu */}
                <div className="relative p-8 lg:p-10">
                  {/* Numéro fantôme */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-4 -right-2 font-heading font-light leading-none select-none text-[9rem] text-foreground/[0.04] tracking-tighter"
                  >
                    01
                  </span>

                  <p className="text-[10px] tracking-[0.28em] uppercase text-foreground/45 mb-4 font-medium">
                    {featured.date} · {featured.reading_time}
                  </p>
                  <h3 className="font-heading text-2xl md:text-3xl font-light text-foreground mb-4 leading-[1.1] tracking-tight group-hover:text-foreground/80 transition-colors duration-400">
                    {featured.title}
                  </h3>
                  <p className="text-foreground/60 text-[15px] leading-relaxed font-light mb-6 max-w-xl">
                    {featured.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground link-underline pb-0.5">
                    Lire l'analyse
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </article>
            </Link>
          </motion.div>

          {/* Articles secondaires — 5 colonnes */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {articles.map((a, i) => (
              <motion.div
                key={a.id ?? a.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link to={`/actualites/${a.slug}`} className="group block">
                  <article className="glass-card glass-card-plain rounded-[1.5rem] overflow-hidden hover:shadow-[0_16px_40px_-12px_hsl(224_60%_12%/0.12)] transition-shadow duration-400 relative">
                    <div className="flex gap-5 p-5">
                      {/* Miniature */}
                      <div
                        className="relative w-24 lg:w-28 aspect-square flex-shrink-0 rounded-xl overflow-hidden bg-cover bg-center"
                        style={{ backgroundImage: `url(${a.image})` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[hsl(var(--navy-deep))]/20" />
                      </div>

                      {/* Contenu */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[10px] font-medium text-foreground/35 tracking-[0.22em] tabular-nums">
                            {String(i + 2).padStart(2, "0")}
                          </span>
                          <span className="w-3 h-px bg-foreground/20" />
                          <span className="text-[10px] tracking-[0.22em] uppercase text-foreground/45 font-medium">
                            {a.tag}
                          </span>
                        </div>
                        <h3 className="font-heading text-base lg:text-[1.05rem] font-light text-foreground leading-snug tracking-tight mb-2 group-hover:text-foreground/75 transition-colors duration-300">
                          {a.title}
                        </h3>
                        <p className="text-foreground/50 text-[12px] leading-relaxed font-light line-clamp-2">
                          {a.excerpt}
                        </p>
                        <p className="text-[10px] text-foreground/35 tracking-wide mt-2">{a.reading_time}</p>
                      </div>
                    </div>

                    {/* Séparateur bas (sauf dernier) */}
                    {i < articles.length - 1 && (
                      <div className="separator-fine opacity-30 mx-5" />
                    )}
                  </article>
                </Link>
              </motion.div>
            ))}

            {/* CTA vers toutes les actualités */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-1"
            >
              <Link
                to="/actualites"
                className="group inline-flex items-center gap-3 pl-7 pr-2.5 py-2.5 rounded-full border border-foreground/15 text-foreground text-sm font-medium tracking-wide hover:bg-foreground/5 hover:border-foreground/25 transition"
              >
                <span>Voir toutes les actualités</span>
                <span className="w-8 h-8 rounded-full bg-[hsl(var(--navy-deep))] text-white flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
