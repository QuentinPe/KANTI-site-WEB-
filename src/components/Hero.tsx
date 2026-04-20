import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import heroBg from "@/assets/hero-bg.jpg";

export default function Hero() {
  const orbRef = useRef<HTMLDivElement>(null);

  // Subtle cursor-tracked light reflection
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
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat parallax-bg"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, hsl(224 60% 7% / 0.85) 0%, hsl(222 50% 11% / 0.75) 50%, hsl(220 40% 18% / 0.85) 100%)",
        }}
      />
      {/* Cursor-tracked reflection */}
      <div ref={orbRef} className="absolute inset-0 pointer-events-none transition-all duration-700" />

      {/* Floating ambient orbs */}
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
          background: "radial-gradient(circle, hsl(38 35% 60% / 0.18) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 w-full">
        <div className="max-w-3xl">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark mb-8 opacity-0"
            style={{ animation: "fade-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s forwards" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <p className="text-[11px] tracking-[0.2em] uppercase text-white/85 font-medium">
              KANTI · Cabinet indépendant · Bordeaux
            </p>
          </div>

          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-heading font-light text-white leading-[1.05] mb-10 tracking-tight opacity-0"
            style={{ animation: "fade-in-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.4s forwards" }}
          >
            Votre patrimoine mérite
            <br />
            <span className="italic font-normal bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
              un conseil à la hauteur
            </span>
          </h1>

          <p
            className="text-base md:text-lg text-white/65 max-w-xl leading-relaxed mb-12 font-light opacity-0"
            style={{ animation: "fade-in-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.7s forwards" }}
          >
            Nous accompagnons les particuliers, les dirigeants et les familles dans la
            structuration, l'optimisation et la transmission de leur patrimoine. À Bordeaux,
            depuis plus de quinze ans.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 opacity-0"
            style={{ animation: "fade-in-up 1s cubic-bezier(0.22, 1, 0.36, 1) 1s forwards" }}
          >
            <Link
              to="/bilan-patrimonial-bordeaux"
              data-magnetic
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-navy-deep text-sm font-medium tracking-wide rounded-full reflection-sweep hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5"
            >
              Demander un bilan patrimonial
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              to="/contact"
              data-magnetic
              className="inline-flex items-center justify-center px-7 py-3.5 btn-glass text-white text-sm font-medium tracking-wide"
            >
              Prendre rendez-vous
            </Link>
          </div>

          {/* Trust micro-bar */}
          <div
            className="mt-16 flex flex-wrap gap-x-8 gap-y-3 opacity-0"
            style={{ animation: "fade-in 1s ease-out 1.4s forwards" }}
          >
            {[
              { k: "ORIAS", v: "Inscrit & vérifié" },
              { k: "CNCGP", v: "Membre certifié" },
              { k: "15+ ans", v: "d'expertise" },
              { k: "500+", v: "familles accompagnées" },
            ].map((item) => (
              <div key={item.k} className="flex items-center gap-2.5">
                <span className="text-xs font-semibold text-white tracking-wider">{item.k}</span>
                <span className="text-xs text-white/50 font-light">{item.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0" style={{ animation: "fade-in 1s ease-out 1.8s forwards" }}>
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">Découvrir</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}
