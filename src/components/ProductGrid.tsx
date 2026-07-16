import { Link } from "react-router-dom";
import FlipCard from "./FlipCard";
import type { Product } from "@/data/productsCatalog";

interface CtaCard {
  title: string;
  description: string;
  href: string;
  buttonText?: string;
}

interface ProductGridProps {
  eyebrow?: string;
  title: string;
  intro?: string;
  categorySlug: string;
  products: Product[];
  hideLinks?: boolean;
  ctaCard?: CtaCard;
}

export default function ProductGrid({
  eyebrow = "Solutions & produits",
  title,
  intro,
  categorySlug,
  products,
  hideLinks = false,
  ctaCard,
}: ProductGridProps) {
  return (
    <section className="section-padding section-glass relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16 reveal max-w-3xl">
          <div className="electric-line mb-5" />
          <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-5 font-medium">
            {eyebrow}
          </p>
          <h2 className="text-3xl md:text-5xl font-heading font-light text-foreground mb-6 leading-[1.1] tracking-tight">
            {title}
          </h2>
          {intro && (
            <p className="text-foreground/60 text-base md:text-lg leading-relaxed font-light">
              {intro}
            </p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, i) => (
            <div key={p.slug} className={`reveal reveal-delay-${(i % 3) + 1}`}>
              <FlipCard
                tag={p.tag}
                title={p.title}
                pitch={p.pitch}
                forWhom={p.forWhom}
                benefits={p.benefits}
                fiscality={p.fiscality}
                horizon={p.horizon}
                href={`/${categorySlug}/${p.slug}`}
                hideLink={hideLinks}
              />
            </div>
          ))}

          {ctaCard && (
            <div className={`reveal reveal-delay-${(products.length % 3) + 1}`}>
              <Link
                to={ctaCard.href}
                className="group flex flex-col justify-between h-[420px] rounded-[var(--radius)] p-7 md:p-8 transition-all duration-500 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--electric))]"
                style={{
                  background: "linear-gradient(145deg, hsl(224 60% 14%) 0%, hsl(224 62% 8%) 100%)",
                  boxShadow: "0 8px 40px -12px hsl(224 60% 8% / 0.5), inset 0 1px 0 hsl(0 0% 100% / 0.08)",
                }}
              >
                <div>
                  <p className="text-[10px] tracking-[0.28em] uppercase text-white/40 mb-6 font-medium">
                    Sur mesure
                  </p>
                  <h3 className="font-heading text-2xl md:text-[26px] font-light text-white leading-[1.15] tracking-tight mb-4">
                    {ctaCard.title}
                  </h3>
                  <p className="text-white/55 text-[14.5px] leading-relaxed font-light">
                    {ctaCard.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-white/10">
                  <span className="text-white/60 text-[13px] font-medium tracking-wide group-hover:text-white transition-colors duration-300">
                    {ctaCard.buttonText ?? "Prendre rendez-vous"}
                  </span>
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 group-hover:bg-white/20 transition-colors duration-300 text-white/80 group-hover:translate-x-1"
                    style={{ transition: "background 0.3s, transform 0.3s" }}
                  >
                    →
                  </span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}