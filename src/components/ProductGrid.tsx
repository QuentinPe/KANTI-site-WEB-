import { Link } from "react-router-dom";
import SolutionCarousel from "./SolutionCarousel";
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

        <SolutionCarousel
          products={products}
          categorySlug={categorySlug}
          hideLinks={hideLinks}
        />

        {ctaCard && (
          <div className="mt-6 reveal">
            <Link
              to={ctaCard.href}
              className="group flex flex-col sm:flex-row sm:items-center justify-between rounded-[var(--radius)] p-7 md:p-8 transition-all duration-500 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--electric))]"
              style={{
                background: "linear-gradient(145deg, hsl(224 60% 14%) 0%, hsl(224 62% 8%) 100%)",
                border: "1px solid hsl(0 0% 100% / 0.07)",
                boxShadow: "0 8px 40px -12px hsl(224 60% 8% / 0.5), inset 0 1px 0 hsl(0 0% 100% / 0.07)",
              }}
            >
              <div className="mb-4 sm:mb-0">
                <p className="text-[10px] tracking-[0.28em] uppercase text-white/40 mb-3 font-medium">
                  Sur mesure
                </p>
                <h3 className="font-heading text-xl md:text-2xl font-light text-white leading-[1.2] tracking-tight mb-2">
                  {ctaCard.title}
                </h3>
                <p className="text-white/50 text-[13.5px] leading-relaxed font-light max-w-xl">
                  {ctaCard.description}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-white/60 text-[12.5px] font-medium tracking-wide group-hover:text-white transition-colors duration-300">
                  {ctaCard.buttonText ?? "Prendre rendez-vous"}
                </span>
                <span className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 group-hover:bg-white/20 group-hover:translate-x-1 transition-all duration-300 text-white/80">
                  →
                </span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}