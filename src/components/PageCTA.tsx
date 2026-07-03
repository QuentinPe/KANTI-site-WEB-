import { Link } from "react-router-dom";

interface PageCTAProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
  secondaryText?: string;
  secondaryHref?: string;
  variant?: "navy" | "ivory";
  /** Petite étiquette thématique au-dessus du titre, ex. "Bilan patrimonial". */
  eyebrow?: string;
  /** Numéro éditorial affiché en grand à gauche (ex. "07"). */
  index?: string;
}

export default function PageCTA({
  title = "Parlons de votre situation",
  subtitle = "Un premier échange de 30 minutes, gratuit et sans engagement, pour faire le point sur votre patrimoine et vos priorités.",
  buttonText = "Prendre rendez-vous",
  buttonHref = "/contact",
  secondaryText,
  secondaryHref,
  variant = "navy",
  eyebrow = "Premier échange",
  index,
}: PageCTAProps) {
  const isNavy = variant === "navy";
  const fg = isNavy ? "text-white" : "text-foreground";
  const fgMuted = isNavy ? "text-white/55" : "text-foreground/55";
  const fgSoft = isNavy ? "text-white/70" : "text-foreground/70";
  const hairline = isNavy ? "border-white/15" : "border-foreground/12";
  const indexColor = isNavy ? "text-white/15" : "text-foreground/12";

  return (
    <section className={`section-padding ${isNavy ? "section-dark" : "section-glass"}`}>
      <div className="max-w-6xl mx-auto relative z-10 reveal">
        <div className={`grid lg:grid-cols-12 gap-10 lg:gap-16 items-end border-t ${hairline} pt-12 md:pt-16`}>
          {/* Colonne éditoriale gauche */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4 mb-8">
              {index && (
                <span className={`font-heading font-extralight text-5xl md:text-6xl tabular-nums leading-none ${indexColor}`}>
                  {index}
                </span>
              )}
              <span className={`text-[10px] tracking-[0.32em] uppercase font-medium ${fgMuted}`}>
                {eyebrow}
              </span>
            </div>
            <h2
              className={`text-3xl md:text-5xl lg:text-[52px] font-heading font-light tracking-tight leading-[1.05] ${fg}`}
            >
              {title}
            </h2>
          </div>

          {/* Colonne droite : sous-titre + actions */}
          <div className={`lg:col-span-7 lg:pl-10 lg:border-l ${hairline}`}>
            <p className={`text-base md:text-lg leading-relaxed mb-10 font-light max-w-xl ${fgSoft}`}>
              {subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <Link
                to={buttonHref}
                className={`group inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full text-sm font-medium tracking-wide reflection-sweep transition-all duration-300 hover:-translate-y-0.5 ${
                  isNavy
                    ? "bg-white text-navy-deep hover:shadow-2xl"
                    : "btn-primary-glass"
                }`}
              >
                {buttonText}
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.25}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>

              {secondaryText && secondaryHref && (
                <Link
                  to={secondaryHref}
                  className={`group inline-flex items-center justify-center gap-2 px-2 py-3.5 text-sm font-light tracking-wide transition-colors duration-300 ${
                    isNavy ? "text-white/75 hover:text-white" : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  <span className="link-underline-light">{secondaryText}</span>
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                </Link>
              )}
            </div>

            <div className={`mt-12 flex flex-wrap gap-x-8 gap-y-3 text-[11px] tracking-[0.18em] uppercase ${fgMuted}`}>
              <span className="inline-flex items-center gap-2">
                <span className={`w-1 h-1 rounded-full ${isNavy ? "bg-white/40" : "bg-foreground/40"}`} />
                30 min, sans engagement
              </span>
              <span className="inline-flex items-center gap-2">
                <span className={`w-1 h-1 rounded-full ${isNavy ? "bg-white/40" : "bg-foreground/40"}`} />
                Confidentiel
              </span>
              <span className="inline-flex items-center gap-2">
                <span className={`w-1 h-1 rounded-full ${isNavy ? "bg-white/40" : "bg-foreground/40"}`} />
                Réponse sous 24 h
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
