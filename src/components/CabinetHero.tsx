import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import heroRue from "@/assets/hero-rue-bordeaux.jpg";

export default function CabinetHero() {
  const orbRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.6, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.05, 1.18]);
  const imageY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 60]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!orbRef.current) return;
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      orbRef.current.style.background = `radial-gradient(circle at ${x}% ${y}%, hsl(0 0% 100% / 0.10) 0%, transparent 50%)`;
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cabinet-hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          backgroundImage: `url(${heroRue})`,
          scale: imageScale,
          y: imageY,
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, hsl(224 60% 7% / 0.85) 0%, hsl(222 50% 11% / 0.72) 55%, hsl(220 40% 18% / 0.88) 100%)",
        }}
        aria-hidden
      />
      <div ref={orbRef} className="absolute inset-0 pointer-events-none transition-all duration-700" aria-hidden />

      <div
        className="absolute top-[18%] right-[8%] w-[420px] h-[420px] rounded-full pointer-events-none float-soft"
        style={{
          background: "radial-gradient(circle, hsl(43 68% 62% / 0.14) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
        aria-hidden
      />
      <div
        className="absolute bottom-[15%] left-[6%] w-[320px] h-[320px] rounded-full pointer-events-none float-slow"
        style={{
          background: "radial-gradient(circle, hsl(0 0% 100% / 0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        aria-hidden
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 max-w-6xl mx-auto px-6 py-32 w-full will-change-transform"
      >
        <div className="max-w-3xl">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark mb-8 opacity-0"
            style={{ animation: "fade-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s forwards" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <p className="text-[11px] tracking-[0.24em] uppercase text-white/85 font-medium">
              KANTI · Bordeaux · Triangle d'Or
            </p>
          </div>

          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-heading font-light text-white leading-[1.05] mb-10 tracking-tight opacity-0"
            style={{ animation: "fade-in-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.4s forwards" }}
          >
            Le Cabinet.
            <br />
            <span className="italic font-normal text-white/90">
              Un ancrage bordelais,
            </span>
            <br />
            <span className="italic font-normal text-white/70">
              une exigence sans frontière.
            </span>
          </h1>

          <p
            className="text-base md:text-lg text-white/65 max-w-xl leading-relaxed mb-12 font-light opacity-0"
            style={{ animation: "fade-in-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.7s forwards" }}
          >
            Installé au cœur du Triangle d'Or, KANTI accompagne particuliers, familles et
            dirigeants dans la structuration, l'optimisation et la transmission de leur
            patrimoine. Une maison à taille humaine, à la hauteur des enjeux qui vous animent.
          </p>

          <div
            className="mt-4 flex flex-wrap gap-x-8 gap-y-3 opacity-0"
            style={{ animation: "fade-in 1s ease-out 1.1s forwards" }}
          >
            {[
              { k: "ORIAS", v: "Inscrit & vérifié" },
              { k: "CNCEF", v: "Membre certifié" },
              { k: "2009", v: "Année de fondation" },
              { k: "500+", v: "Familles accompagnées" },
            ].map((item) => (
              <div key={item.k} className="flex items-center gap-2.5">
                <span className="text-xs font-semibold text-white tracking-wider">{item.k}</span>
                <span className="text-xs text-white/50 font-light">{item.v}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0"
        style={{ animation: "fade-in 1s ease-out 1.6s forwards" }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">Découvrir</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}
