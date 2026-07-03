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
  stats,
}: PageHeroProps) {
  const orbRef = useRef<HTMLDivElement>(null);

  // Cursor-tracked blue light reflection, same as homepage Hero
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
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center overflow-hidden section-dark">
      {/* Cursor-tracked reflection */}
      <div ref={orbRef} aria-hidden className="absolute inset-0 pointer-events-none transition-all duration-700" />

      {/* Floating ambient blue halos, aligned with homepage Hero */}
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

      <div
        className="relative z-10 max-w-5xl mx-auto px-6 pt-28 md:pt-36 pb-16 md:pb-20 w-full text-center"
        style={{ paddingTop: "calc(max(env(safe-area-inset-top), 12px) + 96px)" }}
      >
        {breadcrumb && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark mb-8 md:mb-10 text-[11px] md:text-xs text-white/65 tracking-wide">
            <a href="/" className="hover:text-white transition-colors">Accueil</a>
            <span className="text-white/30">/</span>
            <span className="text-white/85">{breadcrumb}</span>
          </div>
        )}

        <p className="text-[10px] tracking-[0.32em] uppercase text-white/55 mb-5 md:mb-7 font-medium">
          {eyebrow}
        </p>
        <h1 className="text-[34px] md:text-5xl lg:text-[68px] font-heading font-light text-white leading-[1.08] md:leading-[1.05] mb-6 md:mb-8 tracking-tight text-balance">
          {title}
          {highlight && (
            <>
              <br />
              <span className="italic font-normal text-white/75">{highlight}</span>
            </>
          )}
        </h1>
        <p className="text-[15px] md:text-lg text-white/65 max-w-2xl mx-auto leading-relaxed font-light">
          {subtitle}
        </p>

        {stats && stats.length > 0 && (
          <div className="mt-10 md:mt-14 grid grid-cols-3 gap-3 md:gap-6 max-w-2xl mx-auto border-t border-white/10 pt-8 md:pt-10">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-heading text-xl md:text-3xl font-light text-white tracking-tight">
                  {s.value}
                </div>
                <div className="text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-white/45 mt-2 leading-snug">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
