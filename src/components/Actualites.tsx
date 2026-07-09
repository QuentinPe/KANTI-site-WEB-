import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getArticles } from "@/lib/articlesService";

/**
 * Card wrapper that highlights (white glow + scale) when it crosses the
 * vertical center of the viewport. Pure scroll-driven, no JS scroll listener.
 */
function SpotlightCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    // 0 when card bottom enters viewport bottom, 1 when card top exits viewport top
    offset: ["start end", "end start"],
  });

  // Peak highlight when the card sits in the middle (~0.5 progress)
  const highlight = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);
  const scale = useTransform(highlight, [0, 1], [1, 1.015]);
  const borderOpacity = useTransform(highlight, [0, 1], [0.08, 0.55]);
  const glowOpacity = useTransform(highlight, [0, 1], [0, 0.85]);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      style={
        reduce
          ? undefined
          : {
              scale,
              borderColor: useTransform(
                borderOpacity,
                (o) => `hsl(0 0% 100% / ${o})`,
              ),
              boxShadow: useTransform(
                glowOpacity,
                (o) =>
                  `0 0 0 1px hsl(0 0% 100% / ${o * 0.4}), 0 30px 80px -20px hsl(0 0% 100% / ${o * 0.25})`,
              ),
            }
      }
      className={`relative border border-white/10 ${className}`}
    >
      {children}
    </motion.article>
  );
}

export default function Actualites() {
  const { data: allArticles = [] } = useQuery({ queryKey: ["articles"], queryFn: getArticles });
  const featured = allArticles.find((a) => a.featured) ?? allArticles[0];
  const articles = allArticles.filter((a) => a.id !== featured?.id).slice(0, 3);

  if (!featured) return null;

  return (
    <section id="actualites" className="section-padding section-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 reveal gap-6">
          <div>
            <div
              className="electric-line mb-5"
              style={{
                background:
                  "linear-gradient(90deg, hsl(0 0% 100% / 0.55), hsl(0 0% 100% / 0.1))",
              }}
            />
            <p className="text-[11px] tracking-[0.3em] uppercase text-white/50 mb-5 font-medium">
              Magazine · Éclairages
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light tracking-tight leading-[1.05]">
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

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Featured */}
          <SpotlightCard className="lg:col-span-7 group rounded-[2rem] overflow-hidden glass-dark cursor-pointer">
            <div className="relative aspect-[16/10] overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                style={{ backgroundImage: `url(${featured.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--navy-deep))]/70 via-[hsl(var(--navy-deep))]/15 to-transparent" />
              <span className="absolute top-6 left-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-[10px] tracking-[0.3em] uppercase text-white font-medium">
                À la une · {featured.tag}
              </span>
            </div>
            <div className="p-8 lg:p-10">
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/60 mb-4 font-medium">
                {featured.date} · {featured.reading_time}
              </p>
                  <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl font-light text-white mb-4 leading-[1.1] tracking-tight max-w-2xl group-hover:text-white/90 transition-colors duration-500">
                {featured.title}
              </h3>
              <p className="text-white/70 text-[15px] leading-relaxed font-light max-w-2xl mb-5">
                {featured.excerpt}
              </p>
              <span className="inline-flex items-center gap-2 text-sm text-white tracking-wide">
                Lire l'analyse
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </div>
          </SpotlightCard>

          {/* Side stack */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-7">
            {articles.map((a, i) => (
              <SpotlightCard
                key={a.title}
                delay={0.1 + i * 0.08}
                className="group flex gap-5 p-5 rounded-[1.5rem] glass-dark cursor-pointer transition-colors duration-500"
              >
                <div
                  className="relative w-28 lg:w-32 aspect-square flex-shrink-0 rounded-xl bg-cover bg-center overflow-hidden"
                  style={{ backgroundImage: `url(${a.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[hsl(var(--navy-deep))]/40" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p className="text-[10px] text-white/40 tracking-[0.25em] uppercase mb-2 font-medium">
                    {a.tag} · {a.reading_time}
                  </p>
                    <h3 className="font-heading text-base lg:text-lg font-normal text-white mb-2 leading-snug tracking-tight group-hover:text-white/90 transition-colors duration-500">
                    {a.title}
                  </h3>
                  <p className="text-white/50 text-[12px] leading-relaxed font-light line-clamp-2">
                    {a.excerpt}
                  </p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}