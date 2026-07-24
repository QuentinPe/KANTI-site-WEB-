import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Star, LayoutGrid, Zap, Search,
  TrendingUp, Building2, FileText, Users,
  BarChart2, Clock, BookOpen, Scale, Mail,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getArticles, Article } from "@/lib/articlesService";

/* ─── Tokens ─────────────────────────────────────────────────────────────── */
const NAVY     = "hsl(224 60% 12%)";
const NAVY_MID = "hsl(224 35% 42%)";
const NAVY_SFT = "hsl(224 18% 56%)";

/* ─── Static data ────────────────────────────────────────────────────────── */
const FILTERS = [
  "Tous", "Fiscalité", "Transmission", "Investissement",
  "Dirigeants", "Immobilier", "International", "Marchés",
];

const HERO_STATS = [
  { Icon: BarChart2, label: "Analyses claires et utiles" },
  { Icon: Clock,     label: "Mise à jour régulière" },
  { Icon: BookOpen,  label: "Lecture en 3 min" },
  { Icon: Scale,     label: "Approche indépendante" },
];

const BREVES = [
  { Icon: TrendingUp, title: "Précompte mobilier : nouveau taux dès juillet 2024", excerpt: "Ce qui change pour vos placements financiers.", date: "29 avr. 2024" },
  { Icon: Building2,  title: "SCPI : les performances au T1 2024 décryptées",    excerpt: "Analyse des tendances et perspectives.",      date: "27 avr. 2024" },
  { Icon: FileText,   title: "Loi de finances 2025 : les premières pistes",       excerpt: "Ce qui pourrait impacter votre patrimoine.",  date: "25 avr. 2024" },
  { Icon: Users,      title: "Retraite des indépendants : ce qui évolue en 2025", excerpt: "Points clés et leviers d'optimisation.",      date: "24 avr. 2024" },
];

const FALLBACK = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80";

type Tab = "une" | "themes" | "bref";
type NavFn = (path: string) => void;

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function ActualitesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("une");
  const [cat, setCat]             = useState("Tous");
  const [email, setEmail]         = useState("");
  const navigate                  = useNavigate();

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: getArticles,
  });

  const featured    = articles.find((a) => a.featured) ?? articles[0];
  const rest        = articles.filter((a) => a.id !== featured?.id);
  const filtered    = useMemo(() => rest.filter((a) => cat === "Tous" || a.tag === cat), [rest, cat]);
  const allFiltered = useMemo(() => articles.filter((a) => cat === "Tous" || a.tag === cat), [articles, cat]);

  if (isLoading) return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 rounded-full border-2 border-foreground/15 border-t-foreground/50 animate-spin" />
      </div>
      <Footer />
    </>
  );

  const TABS: { id: Tab; Icon: typeof Star; label: string }[] = [
    { id: "une",    Icon: Star,       label: "À la une" },
    { id: "themes", Icon: LayoutGrid, label: "Par thèmes" },
    { id: "bref",   Icon: Zap,        label: "En bref" },
  ];

  return (
    <>
      <Header />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* Left: editorial */}
          <div className="lg:col-span-5">
            <motion.p
              className="text-[10px] tracking-[0.32em] uppercase font-semibold mb-6"
              style={{ color: NAVY_MID }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
            >
              Actualités &amp; Décryptages
            </motion.p>

            <motion.h1
              className="font-heading font-light leading-[1.05] tracking-tight mb-6"
              style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)", color: NAVY }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              Décrypter l'actualité patrimoniale
              <br />
              <span className="italic font-light" style={{ color: NAVY_MID }}>en perspective</span>
            </motion.h1>

            <motion.p
              className="text-[15px] font-light leading-relaxed mb-10"
              style={{ color: "hsl(224 18% 42%)" }}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              Nos analyses pour comprendre les marchés, la fiscalité, la gestion de
              patrimoine, la transmission et les stratégies des dirigeants. Des contenus
              clairs pour éclairer vos décisions.
            </motion.p>

            <motion.div
              className="grid grid-cols-2 gap-3"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.45 }}
            >
              {HERO_STATS.map(({ Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
                  style={{ background: "hsl(220 30% 97%)", border: "1px solid hsl(224 20% 12% / 0.07)" }}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} style={{ color: NAVY_MID }} />
                  <span className="text-[11.5px] font-light leading-snug" style={{ color: "hsl(224 25% 38%)" }}>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: featured card */}
          {featured && (
            <motion.div
              className="lg:col-span-7"
              initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <article
                className="relative rounded-[22px] overflow-hidden cursor-pointer group"
                style={{ height: "460px", boxShadow: "0 24px 64px -12px hsl(224 60% 12% / 0.24)" }}
                onClick={() => navigate(`/actualites/${featured.id}`)}
              >
                <img
                  src={featured.image ?? FALLBACK}
                  alt={featured.title}
                  fetchPriority="high"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(145deg, transparent 25%, hsl(224 60% 7% / 0.88) 58%, hsl(224 60% 7%) 100%)" }}
                />
                <span
                  className="absolute top-5 left-5 px-3 py-1.5 rounded-full text-[10px] tracking-[0.22em] uppercase font-semibold"
                  style={{ background: "hsl(43 78% 54%)", color: "hsl(224 60% 10%)" }}
                >
                  À la une
                </span>
                <div className="absolute bottom-0 right-0 p-7 lg:p-9 max-w-[68%]">
                  <p className="text-[9px] tracking-[0.28em] uppercase font-semibold mb-3" style={{ color: "hsl(43 80% 65%)" }}>
                    {featured.tag}
                  </p>
                  <h2
                    className="font-heading font-light text-white leading-[1.12] tracking-tight mb-3"
                    style={{ fontSize: "clamp(1.1rem, 1.9vw, 1.45rem)" }}
                  >
                    {featured.title}
                  </h2>
                  <p className="text-[12.5px] font-light text-white/60 leading-relaxed mb-4 line-clamp-2">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-[11px] text-white/40 font-light">{featured.reading_time} de lecture</span>
                    <span className="w-px h-3 bg-white/20" />
                    <span className="text-[11px] text-white/40 font-light">{featured.date}</span>
                  </div>
                  <button
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[12.5px] font-medium text-white transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: "hsl(224 55% 18%)", border: "1px solid hsl(224 55% 28%)" }}
                  >
                    Lire l'article
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                </div>
              </article>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── STICKY NAV ───────────────────────────────────────────────── */}
      <div
        className="sticky top-[72px] z-20 bg-white/95 backdrop-blur-md"
        style={{ borderBottom: "1px solid hsl(224 20% 12% / 0.07)" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Tabs */}
          <div className="flex items-center gap-2 py-3">
            {TABS.map(({ id, Icon, label }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-[12.5px] font-medium tracking-wide transition-all duration-200"
                  style={{
                    background: active ? NAVY : "transparent",
                    color: active ? "white" : NAVY_MID,
                    border: `1px solid ${active ? NAVY : "hsl(224 20% 12% / 0.12)"}`,
                  }}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={active ? 2 : 1.5} />
                  {label}
                </button>
              );
            })}
          </div>

          {/* Filter pills */}
          {activeTab !== "bref" && (
            <div className="flex items-center gap-2 pb-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {FILTERS.map((f) => {
                const active = cat === f;
                return (
                  <button
                    key={f}
                    onClick={() => setCat(f)}
                    className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11.5px] font-medium tracking-wide transition-all duration-200"
                    style={{
                      background: active ? "hsl(224 55% 18%)" : "transparent",
                      color: active ? "white" : "hsl(224 18% 44%)",
                      border: `1px solid ${active ? "hsl(224 55% 22%)" : "hsl(224 20% 12% / 0.12)"}`,
                    }}
                  >
                    {f}
                  </button>
                );
              })}
              <button className="flex-shrink-0 ml-auto p-2 rounded-full transition-colors hover:bg-black/5">
                <Search className="w-4 h-4" strokeWidth={1.5} style={{ color: NAVY_SFT }} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-14">
          <AnimatePresence mode="wait">

            {/* À LA UNE */}
            {activeTab === "une" && (
              <motion.div
                key="une"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="grid lg:grid-cols-12 gap-8 lg:gap-10"
              >
                <div className="lg:col-span-8 space-y-6">
                  {filtered[0] && <LargeCard a={filtered[0]} nav={navigate} />}
                  {(filtered[1] || filtered[2]) && (
                    <div className="grid md:grid-cols-2 gap-5">
                      {([filtered[1], filtered[2]].filter(Boolean) as Article[]).map((a) => (
                        <CompactCard key={a.id} a={a} nav={navigate} />
                      ))}
                    </div>
                  )}
                  {filtered.length > 3 && (
                    <div className="grid md:grid-cols-2 gap-5">
                      {filtered.slice(3).map((a) => (
                        <CompactCard key={a.id} a={a} nav={navigate} />
                      ))}
                    </div>
                  )}
                  {filtered.length === 0 && (
                    <p className="py-20 text-[14px] font-light text-center" style={{ color: NAVY_SFT }}>
                      Aucun article dans cette catégorie.
                    </p>
                  )}
                </div>
                <aside className="lg:col-span-4">
                  <BrevesPanel />
                </aside>
              </motion.div>
            )}

            {/* PAR THÈMES */}
            {activeTab === "themes" && (
              <motion.div
                key="themes"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                {allFiltered.length === 0 ? (
                  <p className="py-20 text-[14px] font-light text-center" style={{ color: NAVY_SFT }}>
                    Aucun article dans cette catégorie.
                  </p>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                    {allFiltered.map((a, i) => (
                      <GridCard key={a.id} a={a} delay={(i % 3) * 0.07} nav={navigate} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* EN BREF */}
            {activeTab === "bref" && (
              <motion.div
                key="bref"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="max-w-3xl"
              >
                <p className="text-[10px] tracking-[0.32em] uppercase font-semibold mb-8" style={{ color: NAVY_MID }}>
                  En bref · Actualités rapides
                </p>
                <div className="divide-y" style={{ borderColor: "hsl(224 20% 12% / 0.07)" }}>
                  {BREVES.map(({ Icon, title, excerpt, date }) => (
                    <div key={title} className="flex items-start gap-4 py-5 group cursor-pointer">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: "hsl(220 30% 96%)", border: "1px solid hsl(224 20% 12% / 0.08)" }}
                      >
                        <Icon className="w-4 h-4" strokeWidth={1.5} style={{ color: NAVY_MID }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[14px] font-medium leading-snug mb-1.5 transition-colors duration-200 group-hover:text-[hsl(224_55%_30%)]"
                          style={{ color: NAVY }}
                        >
                          {title}
                        </p>
                        <p className="text-[12.5px] font-light leading-relaxed mb-2" style={{ color: "hsl(224 12% 50%)" }}>
                          {excerpt}
                        </p>
                        <p className="text-[10px] tracking-wide font-medium" style={{ color: "hsl(224 18% 62%)" }}>{date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* ── NEWSLETTER ───────────────────────────────────────────────── */}
      <section style={{ background: "hsl(220 30% 97%)", padding: "56px 0" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div
            className="flex flex-col md:flex-row items-center gap-6 md:gap-10 rounded-2xl p-7 lg:p-10"
            style={{
              background: "white",
              border: "1px solid hsl(224 20% 12% / 0.07)",
              boxShadow: "0 4px 24px -8px hsl(224 60% 12% / 0.07)",
            }}
          >
            <div
              className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "hsl(220 30% 95%)", border: "1px solid hsl(224 20% 12% / 0.09)" }}
            >
              <Mail className="w-5 h-5" strokeWidth={1.5} style={{ color: NAVY_MID }} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="font-heading text-xl font-light mb-1" style={{ color: NAVY }}>
                Restez informé avec nos décryptages
              </p>
              <p className="text-[13.5px] font-light" style={{ color: "hsl(224 18% 46%)" }}>
                Recevez chaque semaine nos analyses et conseils patrimoniaux.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 w-full md:w-auto">
              <div className="flex gap-2 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Votre adresse e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 md:w-60 px-4 py-2.5 rounded-full text-[13px] font-light focus:outline-none"
                  style={{ background: "hsl(220 30% 97%)", border: "1px solid hsl(224 20% 12% / 0.12)", color: NAVY }}
                />
                <button
                  className="px-5 py-2.5 rounded-full text-[13px] font-medium text-white whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: NAVY }}
                >
                  S'abonner
                </button>
              </div>
              <p className="text-[10.5px] font-light" style={{ color: "hsl(224 12% 65%)" }}>
                Vos données sont protégées et ne seront jamais partagées.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────────── */}
      <section className="text-center" style={{ background: NAVY, padding: "80px 24px" }}>
        <div className="max-w-xl mx-auto">
          <p className="text-[10px] tracking-[0.32em] uppercase font-semibold mb-6 text-white/40">
            Allons plus loin
          </p>
          <h2
            className="font-heading font-light text-white leading-[1.1] tracking-tight mb-4"
            style={{ fontSize: "clamp(1.9rem, 4vw, 2.8rem)" }}
          >
            Un sujet à approfondir ?
            <br />
            <span className="italic font-light text-white/65">Parlons-en.</span>
          </h2>
          <p className="text-[14px] font-light text-white/55 leading-relaxed mb-10 max-w-md mx-auto">
            Nos experts vous accompagnent pour transformer l'information en décisions éclairées.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-[13px] font-medium transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: "hsl(43 78% 54%)", color: "hsl(224 60% 10%)" }}
            >
              Prendre rendez-vous
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
            <Link
              to="/ressources"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-[13px] font-medium transition-all duration-200 hover:-translate-y-0.5"
              style={{ color: "white", border: "1px solid hsl(0 0% 100% / 0.20)" }}
            >
              Voir nos ressources
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function LargeCard({ a, nav }: { a: Article; nav: NavFn }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-[18px] overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-xl"
      style={{ border: "1px solid hsl(224 20% 12% / 0.08)", boxShadow: "0 4px 24px -8px hsl(224 60% 12% / 0.07)" }}
      onClick={() => nav(`/actualites/${a.id}`)}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={a.image} alt={a.title} loading="lazy" decoding="async"
          className="w-full h-full object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
        <span
          className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] tracking-[0.22em] uppercase font-medium text-white"
          style={{ background: "hsl(224 60% 16% / 0.82)", backdropFilter: "blur(10px)" }}
        >
          {a.tag}
        </span>
      </div>
      <div className="p-6 lg:p-7" style={{ background: "hsl(220 30% 98.5%)" }}>
        <p className="text-[10px] tracking-[0.28em] uppercase font-medium mb-3" style={{ color: "hsl(224 18% 58%)" }}>
          {a.date} · {a.reading_time} de lecture
        </p>
        <h3
          className="font-heading text-xl md:text-2xl font-light leading-snug tracking-tight mb-3 transition-colors duration-300 group-hover:text-[hsl(224_55%_28%)]"
          style={{ color: NAVY }}
        >
          {a.title}
        </h3>
        <p className="text-[13.5px] font-light leading-relaxed mb-5 line-clamp-2" style={{ color: "hsl(224 12% 46%)" }}>
          {a.excerpt}
        </p>
        <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium" style={{ color: "hsl(224 50% 30%)" }}>
          Lire l'article
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
        </span>
      </div>
    </motion.article>
  );
}

function CompactCard({ a, nav }: { a: Article; nav: NavFn }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group flex rounded-[16px] overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-lg"
      style={{ border: "1px solid hsl(224 20% 12% / 0.08)", boxShadow: "0 2px 12px -4px hsl(224 60% 12% / 0.06)" }}
      onClick={() => nav(`/actualites/${a.id}`)}
    >
      <div className="relative w-28 lg:w-32 flex-shrink-0 overflow-hidden">
        <img
          src={a.image} alt={a.title} loading="lazy" decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
        />
      </div>
      <div className="flex-1 p-4 flex flex-col justify-center min-w-0 bg-white">
        <span className="text-[9px] tracking-[0.22em] uppercase font-semibold mb-1.5" style={{ color: "hsl(224 35% 52%)" }}>
          {a.tag}
        </span>
        <p
          className="text-[13px] font-light leading-snug tracking-tight line-clamp-3 mb-2 transition-colors duration-200 group-hover:text-[hsl(224_55%_28%)]"
          style={{ color: NAVY }}
        >
          {a.title}
        </p>
        <p className="text-[11px] font-light" style={{ color: "hsl(224 15% 60%)" }}>
          {a.reading_time} · {a.date}
        </p>
      </div>
    </motion.article>
  );
}

function GridCard({ a, delay, nav }: { a: Article; delay: number; nav: NavFn }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col rounded-[18px] overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
      style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.07)", boxShadow: "0 2px 12px -4px hsl(224 60% 12% / 0.06)" }}
      onClick={() => nav(`/actualites/${a.id}`)}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={a.image} alt={a.title} loading="lazy" decoding="async"
          className="w-full h-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />
        <span
          className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] tracking-[0.22em] uppercase font-medium text-white"
          style={{ background: "hsl(224 60% 16% / 0.82)", backdropFilter: "blur(10px)" }}
        >
          {a.tag}
        </span>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <p className="text-[10px] tracking-[0.25em] uppercase font-medium mb-2.5" style={{ color: "hsl(224 18% 56%)" }}>
          {a.date} · {a.reading_time}
        </p>
        <h3
          className="font-heading text-[17px] font-light leading-snug tracking-tight mb-3 transition-colors duration-300 group-hover:text-[hsl(224_55%_28%)]"
          style={{ color: NAVY }}
        >
          {a.title}
        </h3>
        <p className="text-[13px] font-light leading-relaxed line-clamp-2 mb-5" style={{ color: "hsl(224 12% 46%)" }}>
          {a.excerpt}
        </p>
        <span className="mt-auto inline-flex items-center gap-1.5 text-[12px] font-medium" style={{ color: "hsl(224 50% 30%)" }}>
          Lire l'article
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
        </span>
      </div>
    </motion.article>
  );
}

function BrevesPanel() {
  return (
    <div
      className="rounded-2xl p-6 lg:sticky lg:top-[160px] lg:self-start"
      style={{ background: "hsl(220 30% 97%)", border: "1px solid hsl(224 20% 12% / 0.07)" }}
    >
      <div className="flex items-center gap-2 mb-5">
        <Zap className="w-4 h-4" strokeWidth={1.5} style={{ color: NAVY_MID }} />
        <p className="text-[10px] tracking-[0.28em] uppercase font-semibold" style={{ color: NAVY_MID }}>
          En bref
        </p>
      </div>

      <div>
        {BREVES.map(({ Icon, title, excerpt, date }, i) => (
          <div
            key={title}
            className="flex items-start gap-3 py-4 group cursor-pointer"
            style={i < BREVES.length - 1 ? { borderBottom: "1px solid hsl(224 20% 12% / 0.07)" } : undefined}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.08)" }}
            >
              <Icon className="w-3.5 h-3.5" strokeWidth={1.5} style={{ color: NAVY_MID }} />
            </div>
            <div>
              <p
                className="text-[12px] font-medium leading-snug mb-1 transition-colors duration-200 group-hover:text-[hsl(224_55%_30%)]"
                style={{ color: NAVY }}
              >
                {title}
              </p>
              <p className="text-[11px] font-light leading-relaxed mb-1" style={{ color: "hsl(224 12% 52%)" }}>
                {excerpt}
              </p>
              <p className="text-[10px] font-medium tracking-wide" style={{ color: "hsl(224 18% 62%)" }}>{date}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        className="mt-4 flex items-center gap-1.5 text-[12px] font-medium transition-colors duration-200 hover:text-[hsl(224_55%_25%)]"
        style={{ color: NAVY_MID }}
      >
        Voir toutes les brèves
        <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
      </button>
    </div>
  );
}
