import { useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "@/data/productsCatalog";

const ORDINALS = ["01", "02", "03", "04", "05", "06", "07", "08"];

// ─── Abstract illustrations ────────────────────────────────────────────────
function Illustration({ index }: { index: number }) {
  const defs = [
    // 0 — two intersecting circles (partage / donation)
    <>
      <circle cx="44" cy="60" r="30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.55" />
      <circle cx="76" cy="60" r="30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.55" />
      <ellipse cx="60" cy="60" rx="11" ry="30" fill="currentColor" opacity="0.13" />
      <circle cx="60" cy="60" r="4" fill="currentColor" opacity="0.45" />
    </>,
    // 1 — half-split circle (démembrement)
    <>
      <circle cx="60" cy="60" r="36" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.55" />
      <path d="M60 24 A36 36 0 0 1 60 96 Z" fill="currentColor" opacity="0.13" />
      <line x1="60" y1="24" x2="60" y2="96" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
    </>,
    // 2 — shield (assurance / protection)
    <>
      <path d="M60 18 L90 32 L90 64 Q90 90 60 104 Q30 90 30 64 L30 32 Z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.55" />
      <path d="M60 30 L80 42 L80 62 Q80 82 60 94 Q40 82 40 62 L40 42 Z" fill="currentColor" opacity="0.11" />
    </>,
    // 3 — triangle with nodes (pacte / réseau)
    <>
      <polygon points="60,20 96,88 24,88" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.55" />
      <circle cx="60" cy="20" r="5" fill="currentColor" opacity="0.55" />
      <circle cx="96" cy="88" r="4" fill="currentColor" opacity="0.4" />
      <circle cx="24" cy="88" r="4" fill="currentColor" opacity="0.4" />
      <circle cx="60" cy="56" r="9" fill="currentColor" opacity="0.13" stroke="currentColor" strokeWidth="1" />
    </>,
    // 4 — linked rings (conjoint / couple)
    <>
      <circle cx="48" cy="60" r="26" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.55" />
      <circle cx="72" cy="60" r="26" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.55" />
      <line x1="22" y1="60" x2="98" y2="60" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
    </>,
  ];
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
      {defs[index % defs.length]}
    </svg>
  );
}

// ─── Dark (active) card content ────────────────────────────────────────────
function ActiveContent({
  p,
  i,
  categorySlug,
  hideLinks,
}: {
  p: Product;
  i: number;
  categorySlug: string;
  hideLinks?: boolean;
}) {
  return (
    <div className="absolute inset-0 flex overflow-hidden px-8 py-9">
      {/* Left: text */}
      <div className="flex flex-col flex-1 min-w-0 pr-4">
        {/* Tag + ordinal */}
        <div className="flex items-start justify-between mb-6">
          <span className="text-[9px] tracking-[0.3em] uppercase text-white/40 font-medium px-2.5 py-1 rounded-full border border-white/10">
            {p.tag}
          </span>
          <span className="font-heading text-[64px] leading-none font-light text-white/[0.05] -mt-2 select-none tabular-nums">
            {ORDINALS[i]}
          </span>
        </div>

        {/* Title & pitch */}
        <h3 className="font-heading text-[22px] font-light text-white leading-[1.2] tracking-tight mb-2.5">
          {p.title}
        </h3>
        <p className="text-white/50 text-[13px] leading-relaxed font-light mb-6">
          {p.pitch}
        </p>

        {/* Benefits */}
        <ul className="space-y-2 flex-1">
          {p.benefits.map((b) => (
            <li key={b} className="flex gap-2.5 text-[12px] text-white/60 font-light leading-snug">
              <span className="text-[hsl(var(--gold))] mt-0.5 flex-shrink-0 text-[9px]">✦</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {/* Footer meta */}
        <div className="mt-5 pt-4 border-t border-white/[0.07]">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[10.5px] mb-4">
            <div>
              <p className="uppercase tracking-[0.2em] text-white/25 mb-1">Profil concerné</p>
              <p className="text-white/50 font-light leading-snug line-clamp-3">{p.forWhom}</p>
            </div>
            {p.horizon ? (
              <div>
                <p className="uppercase tracking-[0.2em] text-white/25 mb-1">Horizon</p>
                <p className="text-white/50 font-light">{p.horizon}</p>
              </div>
            ) : (
              <div>
                <p className="uppercase tracking-[0.2em] text-white/25 mb-1">Fiscalité</p>
                <p className="text-white/50 font-light leading-snug line-clamp-2">{p.fiscality}</p>
              </div>
            )}
          </div>

          {!hideLinks && (
            <Link
              to={`/${categorySlug}/${p.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/40 hover:text-white/80 transition-colors duration-200"
            >
              Approfondir cette solution
              <span className="text-[hsl(var(--electric))]">→</span>
            </Link>
          )}
        </div>
      </div>

      {/* Right: illustration */}
      <div className="w-24 flex-shrink-0 self-center text-[hsl(var(--electric))] opacity-20">
        <Illustration index={i} />
      </div>
    </div>
  );
}

// ─── Light (inactive) card content ─────────────────────────────────────────
function InactiveContent({ p, i }: { p: Product; i: number }) {
  return (
    <div className="absolute inset-0 p-5 flex flex-col select-none">
      <span className="font-heading text-[36px] leading-none font-light text-[hsl(var(--electric))] opacity-20 tabular-nums">
        {ORDINALS[i]}
      </span>
      <span className="text-[8px] tracking-[0.3em] uppercase text-foreground/30 font-medium mt-2 mb-1.5">
        {p.tag}
      </span>
      <h3 className="font-heading text-[13px] font-light text-foreground/60 leading-snug tracking-tight">
        {p.title}
      </h3>

      <div className="flex-1 flex items-center justify-center py-2 text-[hsl(var(--electric))] opacity-[0.18]">
        <Illustration index={i} />
      </div>

      <div>
        <p className="text-[8px] uppercase tracking-[0.22em] text-foreground/25 mb-1">Profil</p>
        <p className="text-[10px] text-foreground/40 font-light line-clamp-2 leading-snug">{p.forWhom}</p>
        <span className="mt-2.5 inline-flex items-center gap-1 text-[10px] text-[hsl(var(--electric))] font-medium opacity-50">
          Explorer →
        </span>
      </div>
    </div>
  );
}

// ─── Mobile accordion item ──────────────────────────────────────────────────
function AccordionCard({
  p,
  i,
  isOpen,
  onToggle,
  categorySlug,
  hideLinks,
}: {
  p: Product;
  i: number;
  isOpen: boolean;
  onToggle: () => void;
  categorySlug: string;
  hideLinks?: boolean;
}) {
  return (
    <div
      className="rounded-[var(--radius)] overflow-hidden transition-shadow duration-300"
      style={
        isOpen
          ? {
              background: "linear-gradient(145deg, hsl(224 62% 12%) 0%, hsl(224 58% 8%) 100%)",
              border: "1px solid hsl(0 0% 100% / 0.08)",
              boxShadow: "0 16px 40px -8px hsl(224 65% 5% / 0.4)",
            }
          : {
              background: "linear-gradient(135deg, hsl(0 0% 100% / 0.5) 0%, hsl(0 0% 100% / 0.2) 100%)",
              backdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid hsl(0 0% 100% / 0.22)",
              boxShadow: "0 2px 8px -1px hsl(0 0% 0% / 0.06)",
            }
      }
    >
      {/* Header */}
      <button
        className="w-full flex items-center gap-4 px-5 py-4 text-left"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span
          className={`font-heading text-2xl font-light tabular-nums flex-shrink-0 ${
            isOpen ? "text-white/20" : "text-[hsl(var(--electric))] opacity-30"
          }`}
        >
          {ORDINALS[i]}
        </span>
        <div className="flex-1 min-w-0">
          <p
            className={`text-[8.5px] uppercase tracking-[0.25em] font-medium mb-0.5 ${
              isOpen ? "text-white/30" : "text-foreground/35"
            }`}
          >
            {p.tag}
          </p>
          <h3
            className={`font-heading text-[15px] font-light leading-snug ${
              isOpen ? "text-white/75" : "text-foreground/70"
            }`}
          >
            {p.title}
          </h3>
        </div>
        <span
          className={`flex-shrink-0 text-xl leading-none transition-transform duration-300 ${
            isOpen ? "rotate-45 text-white/30" : "text-foreground/25"
          }`}
        >
          +
        </span>
      </button>

      {/* Body */}
      <div
        className="overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ maxHeight: isOpen ? "600px" : "0px" }}
      >
        <div className="px-5 pb-6 pt-3 border-t border-white/[0.07]">
          <p className="text-white/45 text-[13px] leading-relaxed font-light mb-5">{p.pitch}</p>

          <ul className="space-y-2 mb-5">
            {p.benefits.map((b) => (
              <li key={b} className="flex gap-2 text-[11.5px] text-white/55 font-light leading-snug">
                <span className="text-[hsl(var(--gold))] mt-0.5 flex-shrink-0 text-[9px]">✦</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-white/[0.07] grid grid-cols-2 gap-4 text-[10.5px] mb-4">
            <div>
              <p className="uppercase tracking-[0.18em] text-white/25 mb-1">Profil concerné</p>
              <p className="text-white/48 font-light leading-snug">{p.forWhom}</p>
            </div>
            {p.horizon ? (
              <div>
                <p className="uppercase tracking-[0.18em] text-white/25 mb-1">Horizon</p>
                <p className="text-white/48 font-light">{p.horizon}</p>
              </div>
            ) : (
              <div>
                <p className="uppercase tracking-[0.18em] text-white/25 mb-1">Fiscalité</p>
                <p className="text-white/48 font-light leading-snug">{p.fiscality}</p>
              </div>
            )}
          </div>

          {!hideLinks && (
            <Link
              to={`/${categorySlug}/${p.slug}`}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/40 hover:text-white/75 transition-colors"
            >
              Approfondir cette solution →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Public component ───────────────────────────────────────────────────────
export interface SolutionCarouselProps {
  products: Product[];
  categorySlug: string;
  hideLinks?: boolean;
}

export default function SolutionCarousel({
  products,
  categorySlug,
  hideLinks,
}: SolutionCarouselProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  // Active card: 460px, inactive: 152px, gap: 12px
  // Max total (5 cards): 460 + 4×152 + 4×12 = 1116px — fits in max-w-7xl with lg:px-20
  const ACTIVE_W = 460;
  const INACTIVE_W = 152;

  return (
    <>
      {/* Desktop carousel — xl and above */}
      <div className="hidden xl:flex gap-3 h-[520px] overflow-hidden">
        {products.map((p, i) => {
          const isActive = i === activeIdx;
          return (
            <div
              key={p.slug}
              role="button"
              tabIndex={isActive ? -1 : 0}
              aria-label={`${p.title}${isActive ? "" : " — Développer"}`}
              onClick={() => !isActive && setActiveIdx(i)}
              onKeyDown={(e) => {
                if (!isActive && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  setActiveIdx(i);
                }
              }}
              style={{
                width: isActive ? `${ACTIVE_W}px` : `${INACTIVE_W}px`,
                flexShrink: 0,
                cursor: isActive ? "default" : "pointer",
                transition: "width 640ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
              className="relative rounded-[var(--radius)] overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--electric))]"
            >
              {/* Dark layer — active */}
              <div
                className={`absolute inset-0 rounded-[var(--radius)] transition-opacity duration-500 ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  background: "linear-gradient(145deg, hsl(224 62% 12%) 0%, hsl(224 58% 8%) 100%)",
                  border: "1px solid hsl(0 0% 100% / 0.07)",
                  boxShadow:
                    "0 24px 60px -12px hsl(224 65% 5% / 0.5), inset 0 1px 0 hsl(0 0% 100% / 0.07)",
                }}
              />
              {/* Glass layer — inactive */}
              <div
                className={`absolute inset-0 rounded-[var(--radius)] transition-opacity duration-500 ${
                  !isActive ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  background:
                    "linear-gradient(135deg, hsl(0 0% 100% / 0.52) 0%, hsl(0 0% 100% / 0.22) 100%)",
                  backdropFilter: "blur(20px) saturate(180%)",
                  border: "1px solid hsl(0 0% 100% / 0.25)",
                  boxShadow:
                    "0 4px 16px -2px hsl(0 0% 0% / 0.08), inset 0 1px 0 hsl(0 0% 100% / 0.4)",
                }}
              />

              {/* Active content (fades in after width starts expanding) */}
              <div
                className={`transition-opacity duration-300 ${
                  isActive ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                style={{ transitionDelay: isActive ? "140ms" : "0ms" }}
              >
                <ActiveContent
                  p={p}
                  i={i}
                  categorySlug={categorySlug}
                  hideLinks={hideLinks}
                />
              </div>

              {/* Inactive content */}
              <div
                className={`transition-opacity duration-200 ${
                  !isActive ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <InactiveContent p={p} i={i} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile / tablet accordion — below xl */}
      <div className="xl:hidden space-y-2">
        {products.map((p, i) => (
          <AccordionCard
            key={p.slug}
            p={p}
            i={i}
            isOpen={i === activeIdx}
            onToggle={() => setActiveIdx(i)}
            categorySlug={categorySlug}
            hideLinks={hideLinks}
          />
        ))}
      </div>
    </>
  );
}
