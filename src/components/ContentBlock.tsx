interface ContentBlockProps {
  title: string;
  text: string[];
  features?: string[];
  variant?: "ivory" | "white";
  reversed?: boolean;
  children?: React.ReactNode;
}

export default function ContentBlock({
  title,
  text,
  features,
  variant = "white",
  reversed = false,
  children,
}: ContentBlockProps) {
  return (
    <section
      className={`section-padding texture-paper relative ${
        variant === "ivory" ? "section-glass" : ""
      }`}
    >
      <div className="max-w-5xl mx-auto relative z-10">
        <div
          className={`grid lg:grid-cols-5 gap-12 lg:gap-16 items-start ${
            reversed ? "lg:[direction:rtl]" : ""
          }`}
        >
          <div className={`lg:col-span-3 reveal ${reversed ? "lg:[direction:ltr]" : ""}`}>
            <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-[1.15] mb-7 tracking-tight">
              {title}
            </h2>
            {text.map((p, i) => (
              <p key={i} className="text-foreground/65 leading-relaxed mb-4 font-light text-[16px]">
                {p}
              </p>
            ))}
            {features && features.length > 0 && (
              <ul className="mt-8 space-y-3">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[hsl(var(--electric))] flex-shrink-0" />
                    <span className="text-foreground/70 leading-relaxed text-[15px] font-light">
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={`lg:col-span-2 reveal reveal-delay-2 ${reversed ? "lg:[direction:ltr]" : ""}`}>
            {children || (
              <div className="glass-card aspect-[4/3] flex items-center justify-center">
                <div className="w-14 h-14 rounded-full glass flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[hsl(var(--electric))]" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
