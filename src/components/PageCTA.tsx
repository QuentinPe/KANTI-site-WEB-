import { Link } from "react-router-dom";

interface PageCTAProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
  secondaryText?: string;
  secondaryHref?: string;
  variant?: "navy" | "ivory";
}

export default function PageCTA({
  title = "Parlons de votre situation",
  subtitle = "Un premier échange de 30 minutes, gratuit et sans engagement, pour faire le point sur votre patrimoine et vos priorités.",
  buttonText = "Prendre rendez-vous",
  buttonHref = "/contact",
  secondaryText,
  secondaryHref,
  variant = "navy",
}: PageCTAProps) {
  const isNavy = variant === "navy";
  return (
    <section className={`section-padding ${isNavy ? "section-dark" : "section-glass"}`}>
      <div className="max-w-3xl mx-auto text-center reveal relative z-10">
        <div className={`glass${isNavy ? "-dark" : "-float"} rounded-3xl p-10 md:p-14`}>
          <h2 className={`text-3xl md:text-5xl font-heading font-light mb-5 tracking-tight leading-[1.1] ${isNavy ? "text-white" : "text-foreground"}`}>
            {title}
          </h2>
          <p className={`text-base md:text-lg leading-relaxed mb-10 font-light max-w-xl mx-auto ${isNavy ? "text-white/65" : "text-foreground/65"}`}>
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={buttonHref}
              className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium tracking-wide reflection-sweep transition-all duration-300 hover:-translate-y-0.5 ${
                isNavy
                  ? "bg-white text-navy-deep hover:shadow-2xl"
                  : "btn-primary-glass"
              }`}
            >
              {buttonText}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            {secondaryText && secondaryHref && (
              <Link
                to={secondaryHref}
                className={`inline-flex items-center justify-center px-7 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
                  isNavy
                    ? "btn-glass text-white"
                    : "glass border border-foreground/10 text-foreground hover:border-foreground/20"
                }`}
              >
                {secondaryText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
