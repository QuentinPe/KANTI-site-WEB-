import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getArticles } from "@/lib/articlesService";

export default function ActualitesMobile() {
  const { data: allArticles = [] } = useQuery({ queryKey: ["articles"], queryFn: getArticles });
  const featured = allArticles.find((a) => a.featured) ?? allArticles[0];
  const articles = allArticles.filter((a) => a.id !== featured?.id).slice(0, 3);

  if (!featured) return null;

  return (
    <section
      id="actualites"
      className="md:hidden relative section-padding-mobile section-dark overflow-hidden"
    >
      <div className="max-w-md mx-auto relative z-10">
        <div
          className="electric-line mb-4"
          style={{
            background:
              "linear-gradient(90deg, hsl(210 100% 70%), hsl(210 100% 70% / 0.2))",
          }}
        />
        <p className="text-[10px] tracking-[0.32em] uppercase text-white/55 mb-3 font-medium">
          Magazine
        </p>
        <h2 className="font-heading text-[32px] font-light leading-[1.1] tracking-tight mb-8">
          Analyses
          <br />
          <span className="italic text-white/70">& décryptages</span>
        </h2>

        <article className="rounded-3xl overflow-hidden glass-dark mb-8">
          <div className="relative aspect-[16/10]">
            <img
              src={featured.image}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--navy-deep))]/70 via-transparent to-transparent" />
            <span className="absolute top-4 left-4 inline-flex items-center px-3 h-7 rounded-full bg-white/15 backdrop-blur-md text-[10px] tracking-[0.25em] uppercase text-white font-medium">
              À la une
            </span>
          </div>
          <div className="p-5">
            <p className="text-[10px] tracking-[0.28em] uppercase text-white/55 mb-3 font-medium">
              {featured.date} · {featured.reading_time}
            </p>
            <h3 className="font-heading text-[20px] font-light text-white leading-snug tracking-tight mb-3">
              {featured.title}
            </h3>
            <p className="text-white/65 text-[14px] leading-relaxed font-light">
              {featured.excerpt}
            </p>
          </div>
        </article>

        <ul className="space-y-3 mb-8">
          {articles.map((a) => (
            <li
              key={a.title}
              className="flex gap-4 p-3 rounded-2xl glass-dark"
            >
              <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={a.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex flex-col justify-center">
                <p className="text-[10px] text-white/45 tracking-[0.22em] uppercase mb-1 font-medium">
                  {a.tag} · {a.reading_time}
                </p>
                <h3 className="font-heading text-[15px] font-normal text-white leading-snug tracking-tight">
                  {a.title}
                </h3>
              </div>
            </li>
          ))}
        </ul>

        <Link
          to="/actualites"
          className="inline-flex items-center justify-center w-full h-12 rounded-full ring-1 ring-white/25 text-white text-[14px] font-light tracking-wide bg-white/5"
        >
          Toutes les actualités →
        </Link>
      </div>
    </section>
  );
}