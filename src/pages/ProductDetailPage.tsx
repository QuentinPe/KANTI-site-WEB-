import { useParams, Navigate, Link } from "react-router-dom";
import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageCTA from "@/components/PageCTA";
import ProductFlowDiagram from "@/components/ProductFlowDiagram";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getProduct } from "@/data/productsCatalog";
import { getAnalysis, enrichRisk, riskScore, RiskItem, RiskLevel } from "@/data/productsAnalysis";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Scale,
  ShieldAlert,
  Workflow,
  Layers,
  BookOpen,
  HelpCircle,
  Target,
  Activity,
  Eye,
  ShieldCheck,
  UserCog,
} from "lucide-react";

/**
 * Expert financial analysis page for a single product.
 * Layout : sticky table-of-contents (left) + long-form research note (right).
 */
export default function ProductDetailPage() {
  useScrollReveal();
  const { categorySlug = "", productSlug = "" } = useParams();
  const data = getProduct(categorySlug, productSlug);
  const [openRisk, setOpenRisk] = useState<RiskItem | null>(null);

  if (!data) return <Navigate to="/404" replace />;
  const { category, product } = data;
  const analysis = getAnalysis(categorySlug, productSlug, product.title);

  const siblings = category.products.filter((p) => p.slug !== product.slug).slice(0, 3);

  const toc: { id: string; label: string; icon: React.ReactNode }[] = [
    { id: "synthese", label: "Synthèse", icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: "mecanique", label: "Mécanique", icon: <Workflow className="w-3.5 h-3.5" /> },
    { id: "acteurs", label: "Acteurs & flux", icon: <Layers className="w-3.5 h-3.5" /> },
    { id: "indicateurs", label: "Indicateurs clés", icon: <Target className="w-3.5 h-3.5" /> },
    { id: "risques", label: "Matrice des risques", icon: <ShieldAlert className="w-3.5 h-3.5" /> },
    { id: "performance", label: "Performance & coûts", icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: "vigilance", label: "Points de vigilance", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    { id: "cas", label: "Cas d'usage chiffré", icon: <Scale className="w-3.5 h-3.5" /> },
    { id: "decision", label: "Critères de décision", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    { id: "faq", label: "Questions fréquentes", icon: <HelpCircle className="w-3.5 h-3.5" /> },
  ];

  return (
    <>
      <Header />

      {/* HERO */}
      <section className="relative min-h-[64vh] flex items-end overflow-hidden section-dark">
        <div
          className="absolute top-[10%] right-[5%] w-[400px] h-[400px] rounded-full pointer-events-none float-soft"
          style={{
            background: "radial-gradient(circle, hsl(210 100% 60% / 0.18) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-16 pt-36 w-full">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark mb-8 text-xs text-white/65 tracking-wide">
            <Link to="/" className="hover:text-white transition-colors">Accueil</Link>
            <span className="text-white/30">/</span>
            <Link to={`/${category.slug}`} className="hover:text-white transition-colors">
              {category.label}
            </Link>
            <span className="text-white/30">/</span>
            <span className="text-white/85">{product.title}</span>
          </div>

          <p className="text-[10px] tracking-[0.32em] uppercase text-white/45 mb-5 font-medium">
            Note d'analyse, {product.tag}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light text-white leading-[1.05] mb-7 tracking-tight max-w-4xl">
            {product.title}
          </h1>
          <p className="text-base md:text-lg text-white/60 max-w-2xl leading-relaxed font-light">
            {product.pitch}
          </p>

          <div className="mt-8 flex flex-wrap gap-2 text-[11px]">
            {analysis.kpis.slice(0, 4).map((k) => (
              <span key={k.label} className="px-3 py-1.5 rounded-full glass-dark text-white/75">
                <span className="text-white/45 mr-1.5">{k.label}</span>
                <span className="text-white">{k.value}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-14">
          {/* TOC sidebar */}
          <aside className="lg:col-span-3 reveal">
            <div className="lg:sticky lg:top-32 space-y-6">
              <div className="glass-strong rounded-[var(--radius)] p-5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/45 mb-1">
                  Catégorie
                </p>
                <Link to={`/${category.slug}`} className="text-foreground font-medium link-underline text-sm">
                  {category.parentTitle}
                </Link>
                {product.horizon && (
                  <>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/45 mt-4 mb-1">Horizon</p>
                    <p className="text-foreground/85 text-sm">{product.horizon}</p>
                  </>
                )}
                <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/45 mt-4 mb-1">Pour qui</p>
                <p className="text-foreground/75 text-[13px] leading-relaxed font-light">{product.forWhom}</p>
              </div>

              <nav aria-label="Sommaire de la note" className="hidden lg:block">
                <p className="text-[10px] uppercase tracking-[0.22em] text-foreground/45 mb-3 px-1">Sommaire</p>
                <ul className="space-y-1">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a
                        href={`#${t.id}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-md text-[13px] text-foreground/65 hover:text-foreground hover:bg-foreground/5 transition-colors"
                      >
                        <span className="text-[hsl(var(--gold))]/70">{t.icon}</span>
                        {t.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <Link
                to="/contact"
                className="btn-primary-glass inline-flex w-full justify-center py-3 px-5 text-sm font-medium"
              >
                Échanger sur cette solution
              </Link>
            </div>
          </aside>

          {/* Main content */}
          <div className="lg:col-span-9 space-y-20 reveal reveal-delay-1">
            {/* SYNTHESE */}
            <Block id="synthese" eyebrow="01, Synthèse" title="L'essentiel en un paragraphe">
              <p className="text-foreground/85 text-[16px] leading-[1.75] font-light">{analysis.summary}</p>

              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] tracking-[0.22em] uppercase text-foreground/45 mb-2">Atouts clés</p>
                  <ul className="space-y-1.5">
                    {product.benefits.map((b) => (
                      <li key={b} className="flex gap-2 text-[14.5px] text-foreground/80 font-light">
                        <span className="text-[hsl(var(--gold))] mt-0.5">✦</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="glass-card p-5">
                  <p className="text-[10px] tracking-[0.22em] uppercase text-[hsl(var(--electric))] mb-2">Fiscalité résumée</p>
                  <p className="text-foreground/85 text-[14px] leading-relaxed font-light">{product.fiscality}</p>
                </div>
              </div>
            </Block>

            {/* MECANIQUE */}
            <Block id="mecanique" eyebrow="02, Mécanique" title="Comment cela fonctionne, étape par étape">
              <ol className="space-y-3">
                {analysis.mechanics.map((m, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-foreground/5 border border-foreground/10 text-[12px] font-medium text-foreground/70 flex items-center justify-center">
                      {i + 1}
                    </span>
                    <p className="text-foreground/80 text-[15px] leading-relaxed font-light pt-1">{m}</p>
                  </li>
                ))}
              </ol>
            </Block>

            {/* ACTEURS */}
            <Block id="acteurs" eyebrow="03, Architecture" title="Acteurs en présence et flux financiers">
              <ProductFlowDiagram actors={analysis.actors} flows={analysis.flows} />
              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                {analysis.actors.map((a) => (
                  <div key={a.id} className="flex gap-3 p-3 rounded-md border border-foreground/8">
                    <span className="shrink-0 w-8 h-8 rounded-full bg-foreground/5 text-[11px] font-medium text-foreground/70 flex items-center justify-center">
                      {a.id}
                    </span>
                    <div>
                      <p className="text-[13px] font-medium text-foreground">{a.label}</p>
                      <p className="text-[12px] text-foreground/60 leading-snug">{a.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Block>

            {/* KPI */}
            <Block id="indicateurs" eyebrow="04, Indicateurs clés" title="Les chiffres à connaître">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {analysis.kpis.map((k) => (
                  <div key={k.label} className="glass-card p-5">
                    <p className="text-[10px] tracking-[0.22em] uppercase text-foreground/45 mb-2">{k.label}</p>
                    <p className="font-heading text-2xl text-foreground tracking-tight">{k.value}</p>
                    {k.hint && <p className="text-[12px] text-foreground/55 mt-1 font-light">{k.hint}</p>}
                  </div>
                ))}
              </div>
            </Block>

            {/* RISQUES */}
            <Block id="risques" eyebrow="05, Risques" title="Matrice probabilité × impact">
              <p className="text-foreground/65 text-[14px] font-light mb-6 max-w-2xl">
                Cliquez sur un risque pour ouvrir sa fiche détaillée : probabilité, impact chiffré,
                scénarios déclencheurs, signaux à surveiller et mesures d'atténuation opérationnelles.
              </p>

              <RiskMatrix risks={analysis.risks} onSelect={setOpenRisk} />

              <div className="mt-8 grid sm:grid-cols-2 gap-3">
                {analysis.risks.map((r) => (
                  <button
                    key={r.label}
                    type="button"
                    onClick={() => setOpenRisk(r)}
                    className="group text-left p-4 rounded-[var(--radius)] border border-foreground/10 hover:border-[hsl(var(--gold))]/50 hover:bg-foreground/[0.02] transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-[14.5px] font-medium text-foreground group-hover:text-[hsl(var(--gold))] transition-colors">
                        {r.label}
                      </p>
                      <span className={`shrink-0 w-7 h-7 rounded-full text-[11px] font-semibold flex items-center justify-center ${heatClasses(riskScore(r))}`}>
                        {riskScore(r)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <RiskBadge level={r.likelihood} />
                      <RiskBadge level={r.impact} />
                    </div>
                    <p className="text-[12.5px] text-foreground/55 font-light line-clamp-2">{r.mitigation}</p>
                    <p className="mt-2 text-[11px] text-[hsl(var(--electric))] opacity-0 group-hover:opacity-100 transition-opacity">
                      Ouvrir la fiche →
                    </p>
                  </button>
                ))}
              </div>
            </Block>

            {/* PERFORMANCE & COSTS */}
            <Block id="performance" eyebrow="06, Performance & coûts" title="Ce que cela rapporte, ce que cela coûte">
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <p className="text-[10px] tracking-[0.22em] uppercase text-[hsl(var(--electric))] mb-3">Performance</p>
                  <ul className="space-y-2">
                    {analysis.performance.map((p) => (
                      <li key={p} className="flex gap-2 text-foreground/80 text-[14.5px] leading-relaxed font-light">
                        <TrendingUp className="w-4 h-4 mt-1 shrink-0 text-[hsl(var(--electric))]/70" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="glass-card p-6">
                  <p className="text-[10px] tracking-[0.22em] uppercase text-[hsl(var(--gold))] mb-3">Structure de coûts</p>
                  <dl className="space-y-2.5">
                    {analysis.costs.map((c) => (
                      <div key={c.label} className="flex justify-between gap-4 text-[14px] border-b border-foreground/5 pb-2 last:border-0">
                        <dt className="text-foreground/65 font-light">{c.label}</dt>
                        <dd className="text-foreground font-medium">{c.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </Block>

            {/* VIGILANCE */}
            <Block id="vigilance" eyebrow="07, Vigilance" title="Les pièges à éviter">
              <ul className="space-y-3">
                {analysis.vigilance.map((v) => (
                  <li key={v} className="flex gap-3 p-4 rounded-md border-l-2 border-[hsl(var(--gold))]/60 bg-foreground/[0.02]">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-[hsl(var(--gold))]" />
                    <span className="text-foreground/80 text-[14.5px] leading-relaxed font-light">{v}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <p className="text-[10px] tracking-[0.22em] uppercase text-foreground/45 mb-3">Cadre réglementaire</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.regulatoryFramework.map((r) => (
                    <span key={r} className="text-[11.5px] px-3 py-1 rounded-full border border-foreground/15 text-foreground/65">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </Block>

            {/* CAS CHIFFRE */}
            <Block id="cas" eyebrow="08, Cas d'usage" title="Illustration chiffrée">
              <div className="glass-strong rounded-[var(--radius)] p-7">
                <p className="text-[13px] tracking-[0.18em] uppercase text-foreground/55 mb-4">Profil</p>
                <p className="text-foreground/90 text-[15.5px] font-light mb-6">{analysis.caseStudy.profile}</p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] tracking-[0.22em] uppercase text-foreground/45 mb-3">Hypothèses</p>
                    <ul className="space-y-1.5">
                      {analysis.caseStudy.hypothesis.map((h) => (
                        <li key={h} className="flex gap-2 text-foreground/80 text-[14px] font-light">
                          <span className="text-foreground/40">›</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.22em] uppercase text-[hsl(var(--electric))] mb-3">Résultat projeté</p>
                    <ul className="space-y-1.5">
                      {analysis.caseStudy.outcome.map((o) => (
                        <li key={o} className="flex gap-2 text-foreground/85 text-[14px] font-light">
                          <CheckCircle2 className="w-3.5 h-3.5 mt-1 shrink-0 text-[hsl(var(--electric))]" />
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="mt-6 text-[11.5px] text-foreground/45 italic">
                  Simulation à but pédagogique, ne constitue pas un conseil personnalisé au sens de l'article L541-1 du Code monétaire et financier.
                </p>
              </div>
            </Block>

            {/* DECISION */}
            <Block id="decision" eyebrow="09, Décision" title="Quand cela vous correspond, quand cela ne vous correspond pas">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="p-5 rounded-[var(--radius)] border border-[hsl(var(--electric))]/30 bg-[hsl(var(--electric))]/[0.03]">
                  <p className="flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase text-[hsl(var(--electric))] mb-3">
                    <CheckCircle2 className="w-4 h-4" /> Pertinent si
                  </p>
                  <ul className="space-y-2">
                    {analysis.whenItFits.map((w) => (
                      <li key={w} className="text-foreground/80 text-[14px] font-light">- {w}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-5 rounded-[var(--radius)] border border-foreground/15 bg-foreground/[0.02]">
                  <p className="flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase text-foreground/65 mb-3">
                    <XCircle className="w-4 h-4" /> À éviter si
                  </p>
                  <ul className="space-y-2">
                    {analysis.whenItDoesNot.map((w) => (
                      <li key={w} className="text-foreground/75 text-[14px] font-light">- {w}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Block>

            {/* FAQ */}
            <Block id="faq" eyebrow="10, FAQ" title="Questions que l'on nous pose">
              <Accordion type="single" collapsible className="w-full">
                {analysis.faq.map((f, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-foreground/10">
                    <AccordionTrigger className="text-left text-foreground/90 text-[15px] font-medium hover:no-underline">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/75 text-[14.5px] leading-relaxed font-light">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Block>
          </div>
        </div>
      </section>

      {/* SIBLINGS */}
      {siblings.length > 0 && (
        <section className="section-padding section-glass">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 reveal">
              <div className="electric-line mb-5" />
              <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-4 font-medium">
                Solutions liées
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-light text-foreground tracking-tight">
                Dans la même expertise
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {siblings.map((s) => (
                <Link
                  key={s.slug}
                  to={`/${category.slug}/${s.slug}`}
                  className="glass-card p-6 reflection-sweep block group"
                >
                  <span className="text-[10px] tracking-[0.25em] uppercase text-foreground/50 font-medium">
                    {s.tag}
                  </span>
                  <h3 className="font-heading text-xl font-light text-foreground mt-3 mb-3 tracking-tight group-hover:text-[hsl(var(--electric))] transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-foreground/65 text-[13.5px] leading-relaxed font-light">
                    {s.pitch}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <PageCTA
        title="Allons plus loin sur cette solution"
        subtitle="Un premier échange confidentiel pour évaluer la pertinence de cette solution dans votre stratégie patrimoniale globale."
        eyebrow="Solution patrimoniale"
        index="06"
      />
      <Footer />

      <RiskDialog risk={openRisk} onClose={() => setOpenRisk(null)} />
    </>
  );
}

/* ----- helpers ---------------------------------------------------------- */

function Block({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-32">
      <div className="mb-7">
        <p className="text-[10px] tracking-[0.32em] uppercase text-[hsl(var(--gold))]/80 mb-3 font-medium">
          {eyebrow}
        </p>
        <h2 className="font-heading text-2xl md:text-3xl font-light text-foreground tracking-tight">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function RiskBadge({ level }: { level: RiskLevel }) {
  const cls =
    level === "Faible"
      ? "bg-[hsl(var(--electric))]/10 text-[hsl(var(--electric))] border-[hsl(var(--electric))]/30"
      : level === "Modéré"
      ? "bg-[hsl(var(--gold))]/10 text-[hsl(var(--gold))] border-[hsl(var(--gold))]/40"
      : "bg-foreground/10 text-foreground border-foreground/30";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] font-medium ${cls}`}>
      {level}
    </span>
  );
}

/* ----- Interactive risk matrix ----------------------------------------- */

/** Heat colour classes based on the 1-9 severity score. */
function heatClasses(score: number) {
  if (score >= 6) return "bg-foreground/15 text-foreground border border-foreground/30";
  if (score >= 3) return "bg-[hsl(var(--gold))]/15 text-[hsl(var(--gold))] border border-[hsl(var(--gold))]/40";
  return "bg-[hsl(var(--electric))]/15 text-[hsl(var(--electric))] border border-[hsl(var(--electric))]/40";
}

const LEVELS: RiskLevel[] = ["Faible", "Modéré", "Élevé"];

function RiskMatrix({ risks, onSelect }: { risks: RiskItem[]; onSelect: (r: RiskItem) => void }) {
  // Cell key = `${impact}-${likelihood}` ; rows = impact (high → low), cols = likelihood (low → high)
  const cells = new Map<string, RiskItem[]>();
  risks.forEach((r) => {
    const k = `${r.impact}|${r.likelihood}`;
    cells.set(k, [...(cells.get(k) ?? []), r]);
  });

  return (
    <div className="rounded-[var(--radius)] border border-foreground/10 p-4 sm:p-6 bg-foreground/[0.015]">
      <div className="flex">
        {/* Y axis */}
        <div className="hidden sm:flex flex-col justify-between mr-3 py-1">
          <span className="text-[10px] tracking-[0.18em] uppercase text-foreground/45 -rotate-90 origin-left translate-y-2 whitespace-nowrap">
            Impact ↑
          </span>
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-2">
            {[...LEVELS].reverse().map((impact) => (
              <RowFragment
                key={impact}
                impact={impact}
                cells={cells}
                onSelect={onSelect}
              />
            ))}
            <div />
            {LEVELS.map((l) => (
              <div key={l} className="text-[10.5px] tracking-[0.16em] uppercase text-foreground/50 text-center pt-1">
                {l}
              </div>
            ))}
          </div>
          <p className="text-[10px] tracking-[0.18em] uppercase text-foreground/45 text-center mt-2">
            Probabilité →
          </p>
        </div>
      </div>
    </div>
  );
}

function RowFragment({
  impact,
  cells,
  onSelect,
}: {
  impact: RiskLevel;
  cells: Map<string, RiskItem[]>;
  onSelect: (r: RiskItem) => void;
}) {
  return (
    <>
      <div className="text-[10.5px] tracking-[0.16em] uppercase text-foreground/55 flex items-center justify-end pr-2">
        {impact}
      </div>
      {LEVELS.map((likelihood) => {
        const items = cells.get(`${impact}|${likelihood}`) ?? [];
        const score = riskScore({ likelihood, impact });
        const tone =
          score >= 6
            ? "bg-foreground/[0.06] border-foreground/20"
            : score >= 3
            ? "bg-[hsl(var(--gold))]/[0.06] border-[hsl(var(--gold))]/25"
            : "bg-[hsl(var(--electric))]/[0.05] border-[hsl(var(--electric))]/25";
        return (
          <div
            key={likelihood}
            className={`min-h-[88px] rounded-md border p-2 flex flex-col gap-1.5 ${tone}`}
          >
            {items.length === 0 && (
              <span className="text-[10px] text-foreground/25 m-auto">-</span>
            )}
            {items.map((r) => (
              <button
                key={r.label}
                type="button"
                onClick={() => onSelect(r)}
                className="text-left text-[11.5px] leading-tight px-2 py-1.5 rounded bg-background/70 hover:bg-background border border-foreground/10 hover:border-[hsl(var(--gold))]/50 text-foreground/85 hover:text-foreground transition-colors"
              >
                {r.label}
              </button>
            ))}
          </div>
        );
      })}
    </>
  );
}

/* ----- Risk detail dialog ---------------------------------------------- */

function RiskDialog({ risk, onClose }: { risk: RiskItem | null; onClose: () => void }) {
  if (!risk) return null;
  const r = enrichRisk(risk);
  const score = riskScore(r);

  return (
    <Dialog open={!!risk} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <span className={`w-9 h-9 rounded-full text-[12px] font-semibold flex items-center justify-center ${heatClasses(score)}`}>
              {score}
            </span>
            <div className="flex flex-wrap gap-1.5">
              <RiskBadge level={r.likelihood} />
              <RiskBadge level={r.impact} />
            </div>
          </div>
          <DialogTitle className="font-heading text-xl md:text-2xl font-light tracking-tight text-foreground">
            {r.label}
          </DialogTitle>
          <DialogDescription className="text-[14px] leading-relaxed text-foreground/70 font-light">
            {r.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          <div className="grid sm:grid-cols-2 gap-3">
            <DetailTile
              icon={<Activity className="w-3.5 h-3.5" />}
              label="Probabilité estimée"
              value={r.probabilityPct}
              accent="electric"
            />
            <DetailTile
              icon={<TrendingUp className="w-3.5 h-3.5" />}
              label="Impact financier"
              value={r.financialImpact}
              accent="gold"
            />
          </div>

          <DetailList
            icon={<AlertTriangle className="w-3.5 h-3.5" />}
            title="Scénarios déclencheurs"
            items={r.scenarios}
            accent="gold"
          />

          <DetailList
            icon={<Eye className="w-3.5 h-3.5" />}
            title="Signaux à surveiller"
            items={r.leadingIndicators}
            accent="electric"
          />

          <DetailList
            icon={<ShieldCheck className="w-3.5 h-3.5" />}
            title="Mesures d'atténuation"
            items={r.mitigations}
            accent="electric"
          />

          <div className="flex items-center gap-2 pt-2 border-t border-foreground/10 text-[12px] text-foreground/60">
            <UserCog className="w-3.5 h-3.5 text-[hsl(var(--gold))]" />
            <span className="uppercase tracking-[0.16em] text-[10px] text-foreground/45 mr-1">Pilotage</span>
            <span className="text-foreground/80 font-light">{r.responsibility}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailTile({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: "gold" | "electric";
}) {
  const accentCls = accent === "gold" ? "text-[hsl(var(--gold))]" : "text-[hsl(var(--electric))]";
  return (
    <div className="rounded-md border border-foreground/10 p-3.5 bg-foreground/[0.02]">
      <p className={`flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase mb-1.5 ${accentCls}`}>
        {icon}
        {label}
      </p>
      <p className="text-foreground/85 text-[13.5px] leading-snug font-light">{value}</p>
    </div>
  );
}

function DetailList({
  icon,
  title,
  items,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  accent: "gold" | "electric";
}) {
  const accentCls = accent === "gold" ? "text-[hsl(var(--gold))]" : "text-[hsl(var(--electric))]";
  return (
    <div>
      <p className={`flex items-center gap-1.5 text-[10px] tracking-[0.22em] uppercase mb-2.5 ${accentCls}`}>
        {icon}
        {title}
      </p>
      <ul className="space-y-1.5">
        {items.map((it) => (
          <li key={it} className="flex gap-2 text-foreground/80 text-[13.5px] leading-relaxed font-light">
            <span className="text-foreground/35 mt-1">›</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}