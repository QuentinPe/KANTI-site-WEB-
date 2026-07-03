import { useState } from "react";
import { Link } from "react-router-dom";

export interface FlipCardProps {
  tag: string;
  title: string;
  pitch: string;
  forWhom: string;
  benefits: string[];
  fiscality: string;
  horizon?: string;
  href: string;
  hideLink?: boolean;
}

/**
 * Liquid-glass flip card.
 * - Desktop: flips on hover.
 * - Touch / mobile: flips on tap (toggle).
 * - Keyboard accessible (Enter / Space toggles, Esc resets).
 */
export default function FlipCard({
  tag,
  title,
  pitch,
  forWhom,
  benefits,
  fiscality,
  horizon,
  href,
  hideLink = false,
}: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setFlipped((f) => !f);
    }
    if (e.key === "Escape") setFlipped(false);
  };

  return (
    <div
      className="group [perspective:1600px] h-[420px]"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped((f) => !f)}
      onKeyDown={handleKey}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`${title}, ${flipped ? "Voir résumé" : "Voir détails"}`}
    >
      <div
        className={`relative w-full h-full transition-transform duration-[700ms] [transform-style:preserve-3d] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* RECTO */}
        <div className="absolute inset-0 [backface-visibility:hidden] glass-card reflection-sweep p-7 md:p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[10px] tracking-[0.25em] uppercase text-foreground/55 font-medium">
              {tag}
            </span>
            <span className="w-8 h-8 rounded-full glass flex items-center justify-center text-foreground/50 text-xs">
              ↻
            </span>
          </div>

          <h3 className="font-heading text-2xl md:text-[26px] font-light text-foreground mb-4 tracking-tight leading-[1.15]">
            {title}
          </h3>
          <p className="text-foreground/65 text-[14.5px] leading-relaxed font-light flex-1">
            {pitch}
          </p>

          <div className="mt-6 pt-5 border-t border-foreground/10 flex items-center justify-between">
            <span className="text-[11px] tracking-wide text-foreground/50">
              Survolez pour explorer
            </span>
            <span className="text-[11px] text-foreground/70 font-medium">
              Détails →
            </span>
          </div>
        </div>

        {/* VERSO */}
        <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden] glass-strong p-7 md:p-8 rounded-[var(--radius)] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[hsl(var(--electric))] font-medium">
              {tag}
            </span>
            {horizon && (
              <span className="text-[10px] uppercase tracking-wider text-foreground/55 glass px-2.5 py-1 rounded-full">
                {horizon}
              </span>
            )}
          </div>

          <h3 className="font-heading text-lg md:text-xl font-normal text-foreground mb-4 tracking-tight">
            {title}
          </h3>

          <div className="space-y-3 text-[12.5px] flex-1 overflow-auto pr-1 -mr-1">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/45 mb-1">
                Pour qui
              </p>
              <p className="text-foreground/75 leading-relaxed font-light">
                {forWhom}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/45 mb-1.5">
                Atouts
              </p>
              <ul className="space-y-1">
                {benefits.map((b) => (
                  <li
                    key={b}
                    className="text-foreground/75 font-light flex gap-2 leading-snug"
                  >
                    <span className="text-[hsl(var(--gold))] mt-0.5">✦</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/45 mb-1">
                Fiscalité
              </p>
              <p className="text-foreground/70 leading-relaxed font-light">
                {fiscality}
              </p>
            </div>
          </div>

          {!hideLink && (
            <Link
              to={href}
              onClick={(e) => e.stopPropagation()}
              className="mt-5 inline-flex items-center gap-2 text-[12.5px] font-medium text-foreground hover:text-[hsl(var(--electric))] transition-colors self-start link-underline"
            >
              Approfondir cette solution
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}