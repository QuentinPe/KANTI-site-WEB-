interface PageHeroProps {
  title: string;
  subtitle: string;
  highlight?: string;
  breadcrumb?: string;
  eyebrow?: string;
  image?: string;
  imageAlt?: string;
  stats?: { value: string; label: string }[];
}

import { useEffect, useRef } from "react";

export default function PageHero({
  title,
  subtitle,
  highlight,
  breadcrumb,
  eyebrow = "Expertise",
  image,
  imageAlt,
  stats,
}: PageHeroProps) {
  const orbRef = useRef<HTMLDivElement>(null);

  // Cursor-tracked blue light reflection — same as homepage Hero
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!orbRef.current) return;
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      orbRef.current.style.background = `radial-gradient(circle at ${x}% ${y}%, hsl(210 100% 60% / 0.18) 0%, transparent 50%)`;
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <section className="relative min-h-[88vh] flex items-end overflow-hidden section-dark">
      {/* Cursor-tracked reflection */}
      <div ref={orbRef} aria-hidden className="absolute inset-0 pointer-events-none transition-all duration-700" />

      {/* Floating ambient blue halos — aligned with homepage Hero */}
      <div
        className="absolute top-[15%] right-[10%] w-[400px] h-[400px] rounded-full pointer-events-none float-soft"
        style={{
          background: "radial-gradient(circle, hsl(210 100% 60% / 0.25) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-[20%] left-[5%] w-[300px] h-[300px] rounded-full pointer-events-none float-slow"
        style={{
          background: "radial-gradient(circle, hsl(210 100% 60% / 0.12) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 pt-36 w-full">
        {breadcrumb && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark mb-8 text-xs text-white/65 tracking-wide">
            <a href="/" className="hover:text-white transition-colors">Accueil</a>
            <span className="text-white/30">/</span>
            <span className="text-white/85">{breadcrumb}</span>
          </div>
        )}

        <div className={`grid ${image ? "lg:grid-cols-12" : "lg:grid-cols-1"} gap-10 lg:gap-16 items-end`}>
          <div className={image ? "lg:col-span-7" : ""}>
            <p className="text-[10px] tracking-[0.32em] uppercase text-white/45 mb-5 font-medium">
              {eyebrow}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-[64px] font-heading font-light text-white leading-[1.05] mb-7 tracking-tight">
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

            {stats && stats.length > 0 && (
              <div className="mt-12 grid grid-cols-3 gap-6 max-w-xl border-t border-white/10 pt-8">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="font-heading text-2xl md:text-3xl font-light text-white tracking-tight">
                      {s.value}
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-white/45 mt-2 leading-snug">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {image && (
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] glass-dark border border-white/10 shadow-2xl">
                <img
                  src={image}
                  alt={imageAlt || ""}
                  width={1280}
                  height={896}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-transparent to-navy-deep/20"
                />
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-[hsl(var(--electric)/0.18)] blur-2xl"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
