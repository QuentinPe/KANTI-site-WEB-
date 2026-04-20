interface PageHeroProps {
  title: string;
  subtitle: string;
  highlight?: string;
  breadcrumb?: string;
}

export default function PageHero({ title, subtitle, highlight, breadcrumb }: PageHeroProps) {
  return (
    <section className="relative min-h-[60vh] flex items-end overflow-hidden section-dark">
      {/* Floating ambient orbs */}
      <div
        className="absolute top-[10%] right-[5%] w-[400px] h-[400px] rounded-full pointer-events-none float-soft"
        style={{
          background: "radial-gradient(circle, hsl(210 100% 60% / 0.2) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="absolute bottom-[10%] left-[5%] w-[300px] h-[300px] rounded-full pointer-events-none float-slow"
        style={{
          background: "radial-gradient(circle, hsl(38 35% 60% / 0.12) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-16 pt-40 w-full">
        {breadcrumb && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark mb-7 text-xs text-white/65 tracking-wide">
            <a href="/" className="hover:text-white transition-colors">Accueil</a>
            <span className="text-white/30">/</span>
            <span className="text-white/85">{breadcrumb}</span>
          </div>
        )}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light text-white leading-[1.1] mb-6 tracking-tight">
          {title}
          {highlight && (
            <>
              <br />
              <span className="italic font-normal text-white/75">{highlight}</span>
            </>
          )}
        </h1>
        <p className="text-base md:text-lg text-white/60 max-w-2xl leading-relaxed font-light">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
