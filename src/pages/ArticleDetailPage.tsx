import { useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { motion, useScroll, useSpring, useMotionValueEvent } from "framer-motion";
import { getArticleById } from "@/lib/articlesService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo, { blogPostingJsonLd, breadcrumbJsonLd, SITE_URL } from "@/components/Seo";

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const contentRef = useRef<HTMLElement>(null);
  const [readPct, setReadPct] = useState(0);

  // Track scroll progress through the article body only
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start 80px", "end end"],
  });

  // Spring makes the bar buttery smooth
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 28, restDelta: 0.001 });

  // Keep percentage in sync for the floating indicator
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setReadPct(Math.min(100, Math.round(v * 100)));
  });

  const { data: article, isLoading, isError } = useQuery({
    queryKey: ["article", id],
    queryFn: () => getArticleById(id!),
    enabled: Boolean(id),
  });

  return (
    <>
      {/* ── Reading progress bar — fixed at very top ── */}
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 right-0 z-[110] h-[2px] origin-left pointer-events-none"
        style={{
          scaleX,
          background: "linear-gradient(90deg, hsl(218 45% 42%) 0%, hsl(224 60% 22%) 100%)",
        }}
      />

      {/* ── Floating reading indicator ── */}
      <motion.div
        aria-hidden
        className="fixed bottom-8 right-6 z-[100] pointer-events-none flex items-center gap-2.5 px-3.5 py-2 rounded-full"
        style={{
          background: "hsl(224 60% 10% / 0.85)",
          backdropFilter: "blur(12px)",
          border: "1px solid hsl(224 40% 40% / 0.30)",
          boxShadow: "0 4px 20px -4px hsl(224 60% 8% / 0.30)",
        }}
        initial={{ opacity: 0, y: 12, scale: 0.9 }}
        animate={{
          opacity: readPct > 3 && readPct < 98 ? 1 : 0,
          y: readPct > 3 && readPct < 98 ? 0 : 12,
          scale: readPct > 3 && readPct < 98 ? 1 : 0.9,
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Mini arc progress */}
        <svg width="22" height="22" viewBox="0 0 22 22" className="flex-shrink-0">
          <circle
            cx="11" cy="11" r="9"
            fill="none"
            stroke="hsl(224 40% 40% / 0.30)"
            strokeWidth="2"
          />
          <motion.circle
            cx="11" cy="11" r="9"
            fill="none"
            stroke="hsl(218 60% 65%)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 9}`}
            style={{
              pathLength: scrollYProgress,
              rotate: -90,
              transformOrigin: "center",
            }}
          />
        </svg>
        <span
          className="text-[11px] font-medium tabular-nums"
          style={{ color: "hsl(220 30% 82%)" }}
        >
          {readPct}&thinsp;%
        </span>
      </motion.div>

      <Header />

      {isLoading && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-foreground/15 border-t-foreground/60 animate-spin" />
        </div>
      )}

      {isError || (!isLoading && !article) ? (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
          <p className="text-2xl font-heading font-light" style={{ color: "hsl(224 55% 20%)" }}>
            Article introuvable
          </p>
          <Link to="/actualites"
            className="inline-flex items-center gap-2 text-[14px] font-medium transition-opacity hover:opacity-70"
            style={{ color: "hsl(224 55% 32%)" }}>
            <ArrowLeft className="w-4 h-4" />
            Retour aux actualités
          </Link>
        </div>
      ) : article ? (
        <>
          <Seo
            title={article.meta_title ?? article.title}
            description={article.meta_description ?? article.excerpt}
            image={article.image}
            canonical={`${SITE_URL}/actualites/${article.slug ?? article.id}`}
            articleMeta={{
              publishedTime: article.created_at,
              modifiedTime: article.updated_at,
              section: article.tag,
              author: article.author_name ?? "Cabinet KANTI",
            }}
            jsonLd={[
              blogPostingJsonLd(article),
              breadcrumbJsonLd([
                { name: "Accueil", url: "/" },
                { name: "Actualités", url: "/actualites" },
                { name: article.title, url: `/actualites/${article.slug ?? article.id}` },
              ]),
            ]}
          />

          {/* ── Hero ── */}
          <section className="relative overflow-hidden" style={{ minHeight: "52vh" }}>
            {article.image && (
              <>
                <div className="absolute inset-0">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    style={{ filter: "brightness(0.55)" }}
                  />
                </div>
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(180deg, hsl(224 60% 8% / 0.4) 0%, hsl(224 60% 8% / 0.65) 100%)",
                  }}
                />
              </>
            )}

            <div className="relative z-10 flex items-end min-h-[52vh] py-20 lg:py-28">
              <div className="max-w-4xl mx-auto px-6 md:px-12 w-full">
                <Link
                  to="/actualites"
                  className="inline-flex items-center gap-2 text-[12px] font-medium tracking-wide mb-8 transition-opacity hover:opacity-80"
                  style={{ color: "hsl(0 0% 100% / 0.65)" }}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Actualités
                </Link>

                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span
                    className="px-3 py-1 rounded-full text-[11px] font-medium tracking-wide"
                    style={{ background: "hsl(0 0% 100% / 0.15)", color: "hsl(0 0% 100% / 0.90)", backdropFilter: "blur(8px)" }}
                  >
                    {article.tag}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "hsl(0 0% 100% / 0.55)" }}>
                    <Calendar className="w-3.5 h-3.5" />
                    {article.date}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "hsl(0 0% 100% / 0.55)" }}>
                    <Clock className="w-3.5 h-3.5" />
                    {article.reading_time}
                  </span>
                </div>

                <h1
                  className="font-heading font-light tracking-tight leading-[1.06]"
                  style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", color: "white" }}
                >
                  {article.title}
                </h1>
              </div>
            </div>
          </section>

          {/* ── Content ── */}
          <section ref={contentRef} className="bg-white py-16 md:py-20 pb-24">
            <div className="max-w-3xl mx-auto px-6 md:px-12">
              {/* Excerpt */}
              <p
                className="text-lg md:text-xl font-light leading-relaxed mb-10 pb-10"
                style={{
                  color: "hsl(224 35% 30%)",
                  borderBottom: "1px solid hsl(224 20% 12% / 0.08)",
                }}
              >
                {article.excerpt}
              </p>

              {/* Rich body */}
              {article.body ? (
                <div
                  className="prose prose-slate prose-headings:font-heading prose-headings:font-light prose-headings:tracking-tight prose-a:text-[hsl(218_45%_38%)] prose-a:no-underline hover:prose-a:underline max-w-none"
                  dangerouslySetInnerHTML={{ __html: article.body }}
                />
              ) : (
                <p className="text-[15px] font-light leading-relaxed" style={{ color: "hsl(224 15% 45%)" }}>
                  Contenu complet à venir.
                </p>
              )}

              {/* Footer nav */}
              <div
                className="flex items-center justify-between mt-16 pt-8"
                style={{ borderTop: "1px solid hsl(224 20% 12% / 0.08)" }}
              >
                <Link
                  to="/actualites"
                  className="inline-flex items-center gap-2 text-[13px] font-medium transition-opacity hover:opacity-70"
                  style={{ color: "hsl(224 55% 32%)" }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Toutes les actualités
                </Link>
                <Link
                  to="/contact"
                  className="px-5 py-2.5 rounded-full text-[13px] font-medium text-white transition-all duration-200 hover:opacity-90"
                  style={{ background: "hsl(224 60% 18%)" }}
                >
                  Prendre rendez-vous
                </Link>
              </div>
            </div>
          </section>
        </>
      ) : null}

      <Footer />
    </>
  );
}
