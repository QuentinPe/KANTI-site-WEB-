import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState, useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageCTA from "@/components/PageCTA";
import { getArticles } from "@/lib/articlesService";

const CATEGORIES = ["Toutes", "Investissement", "Épargne", "Transmission", "Fiscalité", "Retraite", "Immobilier", "Dirigeants", "Allocation", "Prévoyance"];

/* ─── Page ─── */
export default function ActualitesPage() {
  useScrollReveal();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("Toutes");

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: getArticles,
  });

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);

  const featured = articles.find((a) => a.featured) ?? articles[0];
  const filtered = useMemo(
    () =>
      articles
        .filter((a) => a.id !== featured?.id)
        .filter((a) => activeCategory === "Toutes" || a.tag === activeCategory),
    [articles, featured, activeCategory]
  );

  const HERO_FALLBACK = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80";

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 rounded-full border-2 border-foreground/15 border-t-foreground/50 animate-spin" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden"
        style={{ minHeight: "68vh" }}
      >
        {/* Image parallax */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ y: imageY, scale: 1.14 }}
        >
          <img
            src={featured?.image ?? HERO_FALLBACK}
            alt=""
            aria-hidden
            className="w-full h-full object-cover object-center"
            fetchPriority="high"
          />
        </motion.div>

        {/* Dégradé blanc gauche */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(105deg, hsl(0 0% 100% / 0.98) 0%, hsl(0 0% 100% / 0.92) 28%, hsl(0 0% 100% / 0.60) 52%, hsl(0 0% 100% / 0.08) 70%, transparent 82%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-36 pointer-events-none"
          style={{ background: "linear-gradient(to top, hsl(0 0% 100%) 0%, transparent 100%)" }}
        />

        {/* Contenu gauche */}
        <div className="relative z-10 flex items-center min-h-[68vh] py-28 lg:py-36">
          <div className="max-w-6xl mx-auto px-8 md:px-14 w-full">
            <div className="max-w-[520px]">

              <motion.div
                className="flex items-center gap-2 mb-7"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <span className="w-5 h-[2px]" style={{ background: "hsl(224 60% 22%)" }} />
                <p className="text-[11px] tracking-[0.32em] uppercase font-medium" style={{ color: "hsl(224 60% 22%)" }}>
                  Magazine · Éclairages
                </p>
              </motion.div>

              <motion.h1
                className="font-heading font-light leading-[1.04] tracking-tight mb-6"
                style={{ fontSize: "clamp(2.6rem, 5.5vw, 4rem)", color: "hsl(224 60% 12%)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                Actualités<br />
                <span className="italic" style={{ color: "hsl(224 55% 30%)" }}>patrimoniales.</span>
              </motion.h1>

              <motion.p
                className="text-[15px] font-light leading-relaxed mb-8"
                style={{ color: "hsl(224 25% 32%)" }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                Analyses, décryptages et points de vue pour éclairer vos décisions patrimoniales. Une veille mensuelle au service de votre stratégie.
              </motion.p>

              <motion.p
                className="text-[12px] font-light tracking-wide"
                style={{ color: "hsl(224 18% 55%)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {articles.length > 0 ? `${articles.length} analyses` : "Mise à jour mensuelle"} · Mise à jour mensuelle
              </motion.p>

            </div>
          </div>
        </div>
      </section>

      {/* ── Article à la une ── */}
      {featured && (
      <section className="bg-white pt-4 pb-16 md:pb-20">
        <div className="max-w-6xl mx-auto px-8 md:px-14">

          <div className="flex items-center gap-2 mb-10 reveal">
            <span className="w-5 h-[2px]" style={{ background: "hsl(224 50% 30%)" }} />
            <p className="text-[11px] tracking-[0.32em] uppercase font-medium" style={{ color: "hsl(224 35% 42%)" }}>
              À la une
            </p>
          </div>

          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="group grid lg:grid-cols-2 rounded-[22px] overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-1"
            style={{
              border: "1px solid hsl(224 20% 12% / 0.07)",
              boxShadow: "0 8px 32px -8px hsl(224 60% 12% / 0.10)",
            }}
            onClick={() => navigate(`/actualites/${featured.id}`)}
          >
            {/* Image */}
            <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
              <span
                className="absolute top-5 left-5 px-3 py-1.5 rounded-full text-[10px] tracking-[0.25em] uppercase font-medium text-white"
                style={{ background: "hsl(224 60% 18% / 0.85)", backdropFilter: "blur(12px)" }}
              >
                {featured.tag}
              </span>
            </div>

            {/* Contenu */}
            <div
              className="flex flex-col justify-center p-8 lg:p-12"
              style={{ background: "hsl(220 25% 98%)" }}
            >
              <p className="text-[10px] tracking-[0.3em] uppercase font-medium mb-4" style={{ color: "hsl(224 25% 52%)" }}>
                {featured.date} · {featured.reading_time} de lecture
              </p>
              <h2
                className="font-heading text-2xl md:text-3xl font-light leading-[1.08] tracking-tight mb-5"
                style={{ color: "hsl(224 60% 10%)" }}
              >
                {featured.title}
              </h2>
              <p className="text-[14px] font-light leading-relaxed mb-8" style={{ color: "hsl(224 18% 38%)" }}>
                {featured.excerpt}
              </p>
              <span
                className="inline-flex items-center gap-2 text-[13px] font-medium tracking-wide"
                style={{ color: "hsl(224 60% 22%)" }}
              >
                Lire l'analyse
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </span>
            </div>
          </motion.article>
        </div>
      </section>
      )}

      {/* ── Grille articles ── */}
      <section className="bg-white pb-24 md:pb-32">
        <div className="max-w-6xl mx-auto px-8 md:px-14">

          {/* En-tête */}
          <div className="mb-10 reveal">
            <div className="electric-line mb-5" />
            <p className="text-[11px] tracking-[0.3em] uppercase font-medium mb-3" style={{ color: "hsl(224 25% 50%)" }}>
              Toutes les analyses
            </p>
            <h2
              className="font-heading text-3xl md:text-4xl font-light tracking-tight leading-[1.05]"
              style={{ color: "hsl(224 55% 12%)" }}
            >
              Explorer par{" "}
              <span className="italic" style={{ color: "hsl(224 25% 40%)" }}>thématique</span>
            </h2>
          </div>

          {/* Pills catégories */}
          <div className="flex flex-wrap gap-2 mb-12">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-4 py-2 rounded-full text-[12px] font-medium tracking-wide transition-all duration-200"
                  style={{
                    background: active ? "hsl(224 60% 18%)" : "transparent",
                    color: active ? "white" : "hsl(224 25% 40%)",
                    border: `1px solid ${active ? "hsl(224 60% 18%)" : "hsl(224 20% 12% / 0.18)"}`,
                    boxShadow: active ? "0 4px 12px -4px hsl(224 60% 18% / 0.30)" : "none",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Grille */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {filtered.map((a, i) => (
              <motion.article
                key={a.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="group flex flex-col rounded-[18px] overflow-hidden cursor-pointer transition-all duration-400 hover:-translate-y-1"
                style={{
                  background: "white",
                  border: "1px solid hsl(224 20% 12% / 0.07)",
                  boxShadow: "0 2px 12px -4px hsl(224 60% 12% / 0.06)",
                }}
                onClick={() => navigate(`/actualites/${a.id}`)}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 20px 48px -12px hsl(224 60% 12% / 0.13), 0 4px 16px -4px hsl(224 60% 12% / 0.07)";
                  (e.currentTarget as HTMLElement).style.borderColor = "hsl(224 20% 12% / 0.14)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 2px 12px -4px hsl(224 60% 12% / 0.06)";
                  (e.currentTarget as HTMLElement).style.borderColor = "hsl(224 20% 12% / 0.07)";
                }}
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={a.image}
                    alt={a.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                  />
                  <span
                    className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] tracking-[0.22em] uppercase font-medium text-white"
                    style={{ background: "hsl(224 60% 16% / 0.82)", backdropFilter: "blur(10px)" }}
                  >
                    {a.tag}
                  </span>
                </div>

                {/* Contenu */}
                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-[10px] tracking-[0.25em] uppercase font-medium mb-2.5" style={{ color: "hsl(224 18% 56%)" }}>
                    {a.date} · {a.reading_time}
                  </p>
                  <h3
                    className="font-heading text-[17px] font-light leading-snug tracking-tight mb-3 transition-colors duration-300 group-hover:text-[hsl(224_55%_28%)]"
                    style={{ color: "hsl(224 55% 12%)" }}
                  >
                    {a.title}
                  </h3>
                  <p className="text-[13px] font-light leading-relaxed line-clamp-2 mb-5" style={{ color: "hsl(224 12% 46%)" }}>
                    {a.excerpt}
                  </p>
                  <span
                    className="mt-auto inline-flex items-center gap-1.5 text-[12px] font-medium"
                    style={{ color: "hsl(224 50% 30%)" }}
                  >
                    Lire l'article
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center py-16 text-[14px] font-light" style={{ color: "hsl(224 12% 55%)" }}>
              Aucun article dans cette catégorie pour le moment.
            </p>
          )}

        </div>
      </section>

      <PageCTA
        variant="ivory"
        title="Restez informé"
        eyebrow="Actualités"
        index="08"
        subtitle="Recevez nos analyses patrimoniales directement par email, une à deux fois par mois."
        buttonText="S'inscrire à la newsletter"
      />
      <Footer />
    </>
  );
}
