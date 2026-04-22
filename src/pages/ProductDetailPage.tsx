import { useParams, Navigate, Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageCTA from "@/components/PageCTA";
import TrustBand from "@/components/TrustBand";
import { getProduct, getCategory } from "@/data/productsCatalog";

/**
 * Dynamic stub page for each product/solution.
 * Route: /:categorySlug/:productSlug
 * Picks data from productsCatalog and renders a full liquid-glass layout.
 */
export default function ProductDetailPage() {
  useScrollReveal();
  const { categorySlug = "", productSlug = "" } = useParams();
  const data = getProduct(categorySlug, productSlug);

  if (!data) return <Navigate to="/404" replace />;
  const { category, product } = data;

  // Other products in the same category (for "Solutions liées")
  const siblings = category.products.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <>
      <Header />

      {/* HERO */}
      <section className="relative min-h-[72vh] flex items-end overflow-hidden section-dark">
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
            {product.tag}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light text-white leading-[1.05] mb-7 tracking-tight max-w-4xl">
            {product.title}
          </h1>
          <p className="text-base md:text-lg text-white/60 max-w-2xl leading-relaxed font-light">
            {product.pitch}
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Sidebar resume */}
          <aside className="lg:col-span-4 reveal">
            <div className="lg:sticky lg:top-32 glass-strong rounded-[var(--radius)] p-7 space-y-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/45 mb-1">
                  Catégorie
                </p>
                <Link
                  to={`/${category.slug}`}
                  className="text-foreground font-medium link-underline"
                >
                  {category.parentTitle}
                </Link>
              </div>
              {product.horizon && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/45 mb-1">
                    Horizon
                  </p>
                  <p className="text-foreground/85">{product.horizon}</p>
                </div>
              )}
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/45 mb-1">
                  Pour qui
                </p>
                <p className="text-foreground/75 text-[14px] leading-relaxed font-light">
                  {product.forWhom}
                </p>
              </div>
              <Link
                to="/contact"
                className="btn-primary-glass inline-flex w-full justify-center py-3 px-5 text-sm font-medium"
              >
                Échanger sur cette solution
              </Link>
            </div>
          </aside>

          {/* Main content */}
          <div className="lg:col-span-8 space-y-12 reveal reveal-delay-1">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/45 mb-4 font-medium">
                Ce que cela couvre
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-light text-foreground tracking-tight mb-6">
                Les atouts clés
              </h2>
              <ul className="grid sm:grid-cols-2 gap-4">
                {product.benefits.map((b) => (
                  <li
                    key={b}
                    className="glass-card p-5 flex gap-3 items-start"
                  >
                    <span className="text-[hsl(var(--gold))] text-lg leading-none mt-0.5">✦</span>
                    <span className="text-foreground/80 text-[14.5px] leading-relaxed font-light">
                      {b}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-strong rounded-[var(--radius)] p-7 md:p-9">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[hsl(var(--electric))] mb-3 font-medium">
                Fiscalité
              </p>
              <p className="text-foreground/85 text-[15px] leading-relaxed font-light">
                {product.fiscality}
              </p>
            </div>

            <div>
              <p className="text-foreground/65 text-[15px] leading-relaxed font-light italic">
                Le contenu détaillé de cette solution (étude de cas, montage type,
                indicateurs de performance, conditions d'éligibilité) est en cours
                d'édition. En attendant, échangez avec notre équipe pour une analyse
                personnalisée de votre situation.
              </p>
            </div>
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

      <TrustBand />
      <PageCTA
        title="Allons plus loin sur cette solution"
        subtitle="Un premier échange confidentiel pour évaluer la pertinence de cette solution dans votre stratégie patrimoniale globale."
        eyebrow="Solution patrimoniale"
        index="06"
      />
      <Footer />
    </>
  );
}