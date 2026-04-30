import FlipCard from "./FlipCard";
import type { Product } from "@/data/productsCatalog";

interface ProductGridProps {
  eyebrow?: string;
  title: string;
  intro?: string;
  categorySlug: string;
  products: Product[];
  hideLinks?: boolean;
}

/**
 * Grid of liquid-glass FlipCards used on each expertise page
 * to present the underlying products & solutions.
 */
export default function ProductGrid({
  eyebrow = "Solutions & produits",
  title,
  intro,
  categorySlug,
  products,
  hideLinks = false,
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
            <div
              key={p.slug}
              className={`reveal reveal-delay-${(i % 3) + 1}`}
            >
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
        </div>
      </div>
    </section>
  );
}