import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Clock, Calendar, BookOpen, ExternalLink, Eye, Heart } from "lucide-react";
import { motion, useScroll, useSpring, useMotionValueEvent, AnimatePresence } from "framer-motion";
import DOMPurify from "dompurify";
import { getArticleById, getArticles, incrementArticleViews, toggleArticleLike } from "@/lib/articlesService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo, { blogPostingJsonLd, breadcrumbJsonLd, SITE_URL } from "@/components/Seo";

/* ── Visitor ID (anonymous like tracking) ───────────────────────── */
function getVisitorId(): string {
  const key = "kanti_vid";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

function getLikedArticles(): string[] {
  try { return JSON.parse(localStorage.getItem("kanti_liked") ?? "[]"); }
  catch { return []; }
}

function setLikedArticle(id: string, liked: boolean) {
  const arr = getLikedArticles();
  const next = liked ? [...new Set([...arr, id])] : arr.filter(x => x !== id);
  localStorage.setItem("kanti_liked", JSON.stringify(next));
}

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
  const qc = useQueryClient();
  const contentRef = useRef<HTMLElement>(null);
  const [readPct, setReadPct] = useState(0);
  const [activeId, setActiveId] = useState("");
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likeAnim, setLikeAnim] = useState(false);

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

  // Track view once per session
  useEffect(() => {
    if (!article?.id) return;
    const key = `kanti_viewed_${article.id}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    incrementArticleViews(article.id);
  }, [article?.id]);

  // Init like state from server + localStorage
  useEffect(() => {
    if (!article) return;
    setLikesCount(article.likes ?? 0);
    setLiked(getLikedArticles().includes(article.id));
  }, [article]);

  const handleLike = useCallback(async () => {
    if (!article) return;
    const nextLiked = !liked;
    const delta = nextLiked ? 1 : -1;
    setLiked(nextLiked);
    setLikesCount(n => Math.max(0, n + delta));
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 600);
    setLikedArticle(article.id, nextLiked);
    const serverCount = await toggleArticleLike(article.id, delta as 1 | -1);
    if (serverCount !== null) {
      setLikesCount(serverCount);
      qc.setQueryData(["article", id], (old: typeof article) =>
        old ? { ...old, likes: serverCount } : old
      );
    }
  }, [article, liked, id, qc]);

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
                {/* Views */}
                {(article.views ?? 0) > 0 && (
                  <span className="flex items-center gap-1.5 text-[12px] font-light" style={{ color: "hsl(224 15% 50%)" }}>
                    <Eye className="w-3.5 h-3.5" />{article.views} lecture{(article.views ?? 0) > 1 ? "s" : ""}
                  </span>
                )}
                {/* Like button */}
                <button
                  onClick={handleLike}
                  aria-label={liked ? "Retirer votre like" : "Liker cet article"}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1 transition-all duration-200 text-[12px] font-medium"
                  style={{
                    background: liked ? "hsl(350 70% 54% / 0.10)" : "hsl(224 20% 12% / 0.06)",
                    color: liked ? "hsl(350 65% 48%)" : "hsl(224 15% 50%)",
                    border: `1px solid ${liked ? "hsl(350 60% 52% / 0.25)" : "hsl(224 20% 12% / 0.10)"}`,
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={likeAnim ? "anim" : "idle"}
                      initial={likeAnim ? { scale: 0.6, opacity: 0.5 } : false}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      style={{ display: "flex" }}
                    >
                      <Heart
                        className="w-3.5 h-3.5"
                        fill={liked ? "currentColor" : "none"}
                        strokeWidth={liked ? 0 : 1.5}
                      />
                    </motion.span>
                  </AnimatePresence>
                  <span>{likesCount > 0 ? likesCount : ""} {liked ? "Aimé" : "Aimer"}</span>
                </button>
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
                  <div className="sticky top-28 space-y-4">

                    {/* TOC */}
                    {toc.length > 0 && (
                      <div className="glass rounded-2xl p-5 ring-1 ring-foreground/[0.06]">
                        <TableOfContents items={toc} activeId={activeId} />
                      </div>
                    )}

                    {/* Reading progress */}
                    <div className="glass rounded-2xl p-5 ring-1 ring-foreground/[0.06]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-foreground/50">
                          <BookOpen className="w-3.5 h-3.5" strokeWidth={1.5} />
                          <span className="text-[11px] font-medium tracking-[0.12em] uppercase">Progression</span>
                        </div>
                        <span className="text-[13px] font-semibold tabular-nums" style={{ color: "hsl(218 45% 40%)" }}>
                          {readPct}%
                        </span>
                      </div>
                      <div className="h-[3px] rounded-full overflow-hidden bg-foreground/[0.07]">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ scaleX: scrollYProgress, background: "linear-gradient(90deg, hsl(218 45% 42%), hsl(222 60% 58%))", transformOrigin: "left" }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[11px] text-foreground/35">{article.reading_time}</span>
                        <span className="text-[11px] text-foreground/35">{article.date}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="rounded-2xl p-6 overflow-hidden relative"
                      style={{ background: "linear-gradient(145deg, hsl(224 60% 9%) 0%, hsl(222 50% 16%) 100%)" }}>
                      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none"
                        style={{ background: "hsl(218 80% 65% / 0.12)", filter: "blur(20px)" }} />
                      <p className="text-[10px] tracking-[0.28em] uppercase font-medium mb-3" style={{ color: "hsl(220 25% 55%)" }}>
                        KANTI · Cabinet
                      </p>
                      <p className="text-[15px] font-heading font-light leading-[1.45] mb-6 text-white/90">
                        Échangeons sur votre situation patrimoniale.
                      </p>
                      <Link to="/contact"
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl group"
                        style={{ background: "white", color: "hsl(224 55% 14%)" }}>
                        Prendre rendez-vous
                        <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </Link>
                    </div>

                    {/* Engagement + Catégorie */}
                    <div className="glass rounded-2xl ring-1 ring-foreground/[0.06] overflow-hidden">
                      <div className="flex divide-x divide-foreground/[0.06]">
                        <div className="flex-1 py-5 flex flex-col items-center gap-1">
                          <Eye className="w-4 h-4 text-foreground/35 mb-1" strokeWidth={1.5} />
                          <p className="text-[22px] font-heading font-light tabular-nums text-foreground leading-none">
                            {article.views ?? 0}
                          </p>
                          <p className="text-[10px] tracking-[0.18em] uppercase text-foreground/35">lectures</p>
                        </div>
                        <div className="flex-1 py-5 flex flex-col items-center gap-1">
                          <Heart className="w-4 h-4 mb-1" style={{ color: "hsl(350 60% 55%)" }} fill="currentColor" strokeWidth={1.5} />
                          <p className="text-[22px] font-heading font-light tabular-nums text-foreground leading-none">
                            {likesCount}
                          </p>
                          <p className="text-[10px] tracking-[0.18em] uppercase text-foreground/35">j'aime</p>
                        </div>
                      </div>
                      <div className="border-t border-foreground/[0.06] px-5 py-3.5 flex items-center justify-between">
                        <span className="text-[10px] tracking-[0.22em] uppercase font-medium text-foreground/35">Catégorie</span>
                        <Link to="/actualites"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-opacity hover:opacity-70"
                          style={{ background: "hsl(218 45% 42% / 0.1)", color: "hsl(218 45% 38%)" }}>
                          {article.tag}
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
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
