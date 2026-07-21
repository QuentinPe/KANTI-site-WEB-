import { useRef, useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, Calendar, BookOpen, ExternalLink } from "lucide-react";
import { motion, useScroll, useSpring, useMotionValueEvent } from "framer-motion";
import DOMPurify from "dompurify";
import { getArticleById, getArticles } from "@/lib/articlesService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo, { blogPostingJsonLd, breadcrumbJsonLd, SITE_URL } from "@/components/Seo";

/* ── Helpers ──────────────────────────────────────────────────── */

function slugifyHeading(text: string): string {
  return "toc-" + text.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function injectHeadingIds(html: string): string {
  return html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_, level, attrs, content) => {
      if (/\bid=/.test(attrs)) return `<h${level}${attrs}>${content}</h${level}>`;
      const text = content.replace(/<[^>]+>/g, "").trim();
      const id = slugifyHeading(text);
      return `<h${level}${attrs} id="${id}">${content}</h${level}>`;
    }
  );
}

function extractTOC(html: string): { id: string; text: string; level: number }[] {
  return [...html.matchAll(/<h([23])[^>]*>([\s\S]*?)<\/h[23]>/gi)].map(m => {
    const text = m[2].replace(/<[^>]+>/g, "").trim();
    return { id: slugifyHeading(text), text, level: parseInt(m[1]) };
  });
}

/* ── TOC Sidebar ─────────────────────────────────────────────── */
function TableOfContents({ items, activeId }: { items: { id: string; text: string; level: number }[]; activeId: string }) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Table des matières">
      <p className="text-[10px] tracking-[0.28em] uppercase font-semibold mb-4"
        style={{ color: "hsl(224 20% 55%)" }}>
        Dans cet article
      </p>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item.id} style={{ paddingLeft: item.level === 3 ? "0.75rem" : "0" }}>
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`toc-link block text-[13px] font-light leading-snug py-0.5 ${activeId === item.id ? "active" : ""}`}
              style={{
                color: activeId === item.id ? "hsl(218 45% 42%)" : "hsl(224 15% 50%)",
                borderLeft: activeId === item.id ? "2px solid hsl(218 45% 42%)" : "2px solid transparent",
                paddingLeft: activeId === item.id ? "0.5rem" : (item.level === 3 ? "0.75rem" : "0"),
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ── Related Article Card ────────────────────────────────────── */
function RelatedCard({ article }: { article: { id: string; slug?: string | null; title: string; tag: string; date: string; reading_time: string; image: string; excerpt: string } }) {
  const href = `/actualites/${article.id}`;
  return (
    <Link to={href} className="group block">
      <article className="rounded-2xl overflow-hidden h-full"
        style={{ border: "1px solid hsl(224 20% 12% / 0.08)", background: "white" }}>
        <div className="aspect-[16/9] overflow-hidden relative">
          <img src={article.image} alt={article.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, hsl(224 40% 8% / 0.25), transparent 60%)" }} />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] tracking-[0.22em] uppercase font-medium px-2 py-0.5 rounded-full"
              style={{ background: "hsl(218 45% 42% / 0.09)", color: "hsl(218 45% 38%)" }}>
              {article.tag}
            </span>
            <span className="text-[11px] font-light" style={{ color: "hsl(224 15% 55%)" }}>{article.reading_time}</span>
          </div>
          <h3 className="font-heading text-[1.1rem] font-light leading-snug tracking-tight mb-2 group-hover:opacity-70 transition-opacity"
            style={{ color: "hsl(224 55% 12%)" }}>
            {article.title}
          </h3>
          <p className="text-[13px] font-light leading-relaxed line-clamp-2" style={{ color: "hsl(224 15% 48%)" }}>
            {article.excerpt}
          </p>
        </div>
      </article>
    </Link>
  );
}

/* ── Main ────────────────────────────────────────────────────── */
export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const contentRef = useRef<HTMLElement>(null);
  const [readPct, setReadPct] = useState(0);
  const [activeId, setActiveId] = useState("");

  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start 80px", "end end"],
  });
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 28, restDelta: 0.001 });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setReadPct(Math.min(100, Math.round(v * 100)));
  });

  const { data: article, isLoading, isError } = useQuery({
    queryKey: ["article", id],
    queryFn: () => getArticleById(id!),
    enabled: Boolean(id),
  });

  const { data: allArticles = [] } = useQuery({
    queryKey: ["articles"],
    queryFn: getArticles,
  });

  const processedBody = useMemo(
    () => (article?.body ? injectHeadingIds(article.body) : ""),
    [article?.body]
  );

  const toc = useMemo(() => extractTOC(processedBody), [processedBody]);

  const related = useMemo(() => {
    if (article?.related_article_ids && article.related_article_ids.length > 0) {
      return article.related_article_ids
        .map(rid => allArticles.find(a => a.id === rid))
        .filter((a): a is NonNullable<typeof a> => Boolean(a));
    }
    return allArticles.filter(a => a.id !== id).slice(0, 3);
  }, [allArticles, id, article?.related_article_ids]);

  // IntersectionObserver for active TOC heading
  useEffect(() => {
    if (!processedBody || toc.length === 0) return;
    const timer = setTimeout(() => {
      const headings = toc.map(t => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
      if (headings.length === 0) return;
      const observer = new IntersectionObserver(
        entries => {
          const visible = entries.filter(e => e.isIntersecting);
          if (visible.length > 0) setActiveId(visible[0].target.id);
        },
        { rootMargin: "-15% 0% -55% 0%", threshold: 0 }
      );
      headings.forEach(h => observer.observe(h));
      return () => observer.disconnect();
    }, 400);
    return () => clearTimeout(timer);
  }, [processedBody, toc]);

  return (
    <>
      {/* Progress bar */}
      <motion.div aria-hidden className="fixed top-0 left-0 right-0 z-[110] h-[2px] origin-left pointer-events-none"
        style={{ scaleX, background: "linear-gradient(90deg, hsl(218 45% 42%), hsl(224 60% 22%))" }} />

      {/* Floating read % */}
      <motion.div aria-hidden
        className="fixed bottom-8 right-6 z-[100] pointer-events-none flex items-center gap-2.5 px-3.5 py-2 rounded-full"
        style={{ background: "hsl(224 60% 10% / 0.85)", backdropFilter: "blur(12px)", border: "1px solid hsl(224 40% 40% / 0.30)" }}
        initial={{ opacity: 0, y: 12, scale: 0.9 }}
        animate={{ opacity: readPct > 3 && readPct < 98 ? 1 : 0, y: readPct > 3 && readPct < 98 ? 0 : 12, scale: readPct > 3 && readPct < 98 ? 1 : 0.9 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
        <svg width="22" height="22" viewBox="0 0 22 22">
          <circle cx="11" cy="11" r="9" fill="none" stroke="hsl(224 40% 40% / 0.30)" strokeWidth="2" />
          <motion.circle cx="11" cy="11" r="9" fill="none" stroke="hsl(218 60% 65%)" strokeWidth="2"
            strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 9}`}
            style={{ pathLength: scrollYProgress, rotate: -90, transformOrigin: "center" }} />
        </svg>
        <span className="text-[11px] font-medium tabular-nums" style={{ color: "hsl(220 30% 82%)" }}>
          {readPct}&thinsp;%
        </span>
      </motion.div>

      <Header />

      {isLoading && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-foreground/15 border-t-foreground/60 animate-spin" />
        </div>
      )}

      {(isError || (!isLoading && !article)) && (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
          <p className="text-2xl font-heading font-light" style={{ color: "hsl(224 55% 20%)" }}>Article introuvable</p>
          <Link to="/actualites" className="inline-flex items-center gap-2 text-[14px] font-medium hover:opacity-70 transition-opacity" style={{ color: "hsl(224 55% 32%)" }}>
            <ArrowLeft className="w-4 h-4" />Retour aux actualités
          </Link>
        </div>
      )}

      {article && (
        <>
          <Seo
            title={article.meta_title ?? article.title}
            description={article.meta_description ?? article.excerpt}
            image={article.image}
            canonical={`${SITE_URL}/actualites/${article.slug ?? article.id}`}
            articleMeta={{ publishedTime: article.created_at, modifiedTime: article.updated_at, section: article.tag, author: article.author_name ?? "Cabinet KANTI" }}
            jsonLd={[
              blogPostingJsonLd(article),
              breadcrumbJsonLd([
                { name: "Accueil", url: "/" },
                { name: "Actualités", url: "/actualites" },
                { name: article.title, url: `/actualites/${article.slug ?? article.id}` },
              ]),
            ]}
          />

          {/* ── HEADER SECTION ── */}
          <div className="bg-white pt-10 pb-0" style={{ borderBottom: "none" }}>
            <div className="max-w-6xl mx-auto px-6 md:px-12">

              {/* Breadcrumb */}
              <Link to="/actualites"
                className="inline-flex items-center gap-2 text-[12px] font-medium tracking-wide mb-8 transition-opacity hover:opacity-60"
                style={{ color: "hsl(224 30% 52%)" }}>
                <ArrowLeft className="w-3.5 h-3.5" />
                Actualités
              </Link>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.18em] uppercase"
                  style={{ background: "hsl(218 45% 42% / 0.09)", color: "hsl(218 45% 36%)" }}>
                  {article.tag}
                </span>
                <span className="flex items-center gap-1.5 text-[12px] font-light" style={{ color: "hsl(224 15% 50%)" }}>
                  <Calendar className="w-3.5 h-3.5" />{article.date}
                </span>
                <span className="flex items-center gap-1.5 text-[12px] font-light" style={{ color: "hsl(224 15% 50%)" }}>
                  <Clock className="w-3.5 h-3.5" />{article.reading_time}
                </span>
                {article.author_name && (
                  <span className="text-[12px] font-light" style={{ color: "hsl(224 15% 50%)" }}>
                    par <span className="font-medium" style={{ color: "hsl(224 35% 35%)" }}>{article.author_name}</span>
                  </span>
                )}
              </div>

              {/* Headline */}
              <h1 className="font-heading font-light leading-[1.06] tracking-tight mb-8 max-w-4xl"
                style={{ fontSize: "clamp(2rem, 4.5vw, 3.6rem)", color: "hsl(224 55% 10%)" }}>
                {article.title}
              </h1>
            </div>

            {/* Cover image · full width with elegant top cut */}
            {article.image && (
              <div className="max-w-6xl mx-auto px-6 md:px-12">
                <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: "21 / 9" }}>
                  <img src={article.image} alt={article.title}
                    className="w-full h-full object-cover"
                    style={{ display: "block" }} />
                </div>
              </div>
            )}
          </div>

          {/* ── CONTENT + SIDEBAR ── */}
          <section ref={contentRef} className="bg-white pt-14 pb-24">
            <div className="max-w-6xl mx-auto px-6 md:px-12">
              <div className="grid lg:grid-cols-[1fr_300px] gap-16">

                {/* Left: article body */}
                <div>
                  {/* Excerpt · lead paragraph */}
                  <p className="text-xl font-light leading-relaxed mb-10 pb-10 font-heading"
                    style={{ color: "hsl(218 40% 30%)", borderBottom: "1px solid hsl(224 20% 12% / 0.08)", fontSize: "clamp(1.05rem, 2vw, 1.22rem)" }}>
                    {article.excerpt}
                  </p>

                  {/* Rich body */}
                  {processedBody ? (
                    <div
                      className="article-body"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(processedBody) }}
                    />
                  ) : (
                    <p className="text-[15px] font-light leading-relaxed" style={{ color: "hsl(224 15% 45%)" }}>
                      Contenu complet à venir.
                    </p>
                  )}

                  {/* Footer nav */}
                  <div className="flex items-center justify-between mt-16 pt-8"
                    style={{ borderTop: "1px solid hsl(224 20% 12% / 0.08)" }}>
                    <Link to="/actualites"
                      className="inline-flex items-center gap-2 text-[13px] font-medium hover:opacity-70 transition-opacity"
                      style={{ color: "hsl(224 40% 40%)" }}>
                      <ArrowLeft className="w-4 h-4" />Toutes les actualités
                    </Link>
                    <Link to="/contact"
                      className="px-5 py-2.5 rounded-full text-[13px] font-medium text-white hover:opacity-90 transition-opacity"
                      style={{ background: "hsl(224 60% 18%)" }}>
                      Prendre rendez-vous
                    </Link>
                  </div>
                </div>

                {/* Right: sticky sidebar */}
                <aside className="hidden lg:block">
                  <div className="sticky top-28 space-y-8">

                    {/* TOC */}
                    {toc.length > 0 && (
                      <div className="rounded-2xl p-6"
                        style={{ background: "hsl(220 30% 98%)", border: "1px solid hsl(224 20% 12% / 0.07)" }}>
                        <TableOfContents items={toc} activeId={activeId} />
                      </div>
                    )}

                    {/* Reading progress */}
                    <div className="rounded-2xl p-5"
                      style={{ background: "hsl(218 45% 42% / 0.05)", border: "1px solid hsl(218 45% 42% / 0.12)" }}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-medium tracking-wide uppercase" style={{ color: "hsl(218 40% 42%)" }}>
                          <BookOpen className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                          Progression
                        </span>
                        <span className="text-[13px] font-medium tabular-nums" style={{ color: "hsl(218 45% 36%)" }}>
                          {readPct}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(218 30% 88%)" }}>
                        <motion.div className="h-full rounded-full origin-left"
                          style={{ scaleX: scrollYProgress, background: "linear-gradient(90deg, hsl(218 45% 42%), hsl(218 60% 60%))", transformOrigin: "left" }} />
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="rounded-2xl p-6"
                      style={{ background: "hsl(224 60% 12%)" }}>
                      <p className="text-[11px] tracking-[0.22em] uppercase font-medium mb-3"
                        style={{ color: "hsl(220 30% 70%)" }}>
                        Prêt à agir ?
                      </p>
                      <p className="text-[14px] font-heading font-light leading-snug mb-5"
                        style={{ color: "white" }}>
                        Échangeons sur votre situation patrimoniale.
                      </p>
                      <Link to="/contact"
                        className="block text-center py-2.5 rounded-xl text-[13px] font-medium transition-opacity hover:opacity-85"
                        style={{ background: "white", color: "hsl(224 55% 18%)" }}>
                        Prendre rendez-vous
                      </Link>
                    </div>

                    {/* Tag context */}
                    <div>
                      <p className="text-[10px] tracking-[0.22em] uppercase font-medium mb-3" style={{ color: "hsl(224 15% 55%)" }}>
                        Catégorie
                      </p>
                      <Link to="/actualites"
                        className="inline-flex items-center gap-2 text-[13px] font-medium hover:opacity-70 transition-opacity"
                        style={{ color: "hsl(218 45% 38%)" }}>
                        <ExternalLink className="w-3.5 h-3.5" />
                        {article.tag}
                      </Link>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </section>

          {/* ── RELATED ARTICLES ── */}
          {related.length > 0 && (
            <section className="py-20" style={{ background: "hsl(220 30% 97%)" }}>
              <div className="max-w-6xl mx-auto px-6 md:px-12">
                <div className="flex items-end justify-between mb-10">
                  <div>
                    <div className="w-8 h-px mb-4" style={{ background: "hsl(218 45% 42%)" }} />
                    <h2 className="font-heading text-2xl font-light tracking-tight" style={{ color: "hsl(224 55% 12%)" }}>
                      Pour aller plus loin
                    </h2>
                  </div>
                  <Link to="/actualites"
                    className="text-[13px] font-medium hover:opacity-70 transition-opacity"
                    style={{ color: "hsl(218 45% 38%)" }}>
                    Toutes les analyses →
                  </Link>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {related.map(a => <RelatedCard key={a.id} article={a} />)}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <Footer />
    </>
  );
}
