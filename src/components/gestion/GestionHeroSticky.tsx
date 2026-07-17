import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

const IMAGE_URL =
  "https://images.unsplash.com/photo-1759876741967-344a7ac3668b?w=1800&auto=format&fit=crop&q=85";

const STATS = [
  { value: "100%", label: "Architecture ouverte" },
  { value: "0", label: "Produit maison" },
  { value: "12+", label: "Partenaires" },
];

export default function GestionHeroSticky() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);

  return (
    <section
      ref={sectionRef}
      id="hero-gestion"
      className="relative overflow-hidden"
      style={{ height: "92vh", minHeight: 560 }}
    >
      {/* Parallax background image */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ y: imageY, scale: 1.18 }}
      >
        <img
          src={IMAGE_URL}
          alt="Gestion patrimoniale abstraite KANTI"
          className="w-full h-full object-cover object-center"
          fetchPriority="high"
          decoding="sync"
        />
      </motion.div>

      {/* Dark left gradient — keeps white text readable */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(105deg, hsl(224 60% 7% / 0.93) 0%, hsl(224 60% 7% / 0.72) 32%, hsl(224 60% 7% / 0.28) 58%, transparent 78%)",
        }}
      />

      {/* Bottom vignette → fades into page background */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, hsl(220 30% 97% / 0.88) 0%, transparent 100%)",
        }}
      />

      {/* Editorial content — left column */}
      <div className="relative z-10 flex items-center h-full">
        <div className="max-w-6xl mx-auto px-8 md:px-14 w-full">
          <div className="max-w-xl">

            {/* Eyebrow */}
            <p
              className="text-[10px] tracking-[0.32em] uppercase text-white/55 mb-5 font-medium opacity-0"
              style={{ animation: "fade-in 0.8s ease 0.15s forwards" }}
            >
              Allocation & placements
            </p>

            {/* Headline */}
            <h1
              className="font-heading text-5xl md:text-6xl lg:text-[68px] font-light leading-[1.04] tracking-tight mb-6 text-white opacity-0"
              style={{ animation: "fade-in-up 0.9s cubic-bezier(0.22,1,0.36,1) 0.28s forwards" }}
            >
              Gestion patrimoniale
              <br />
              <span className="italic text-white/65">& placements.</span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-white/65 text-[15px] md:text-base font-light leading-relaxed mb-10 opacity-0"
              style={{ animation: "fade-in-up 0.9s cubic-bezier(0.22,1,0.36,1) 0.44s forwards" }}
            >
              Construire une allocation d'actifs cohérente avec vos objectifs,
              votre horizon et votre tolérance au risque. En architecture ouverte.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-wrap gap-3 mb-14 opacity-0"
              style={{ animation: "fade-in-up 0.9s cubic-bezier(0.22,1,0.36,1) 0.58s forwards" }}
            >
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[hsl(224_60%_12%)] text-sm font-medium tracking-wide hover:bg-white/90 transition-colors duration-300 shadow-lg"
              >
                Prendre rendez-vous
                <svg
                  className="w-4 h-4"
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
              <Link
                to="/bilan-patrimonial-bordeaux"
                className="inline-flex items-center px-6 py-3 rounded-full border border-white/30 text-white/85 text-sm font-medium tracking-wide hover:border-white/60 hover:text-white transition-colors duration-300"
              >
                Bilan patrimonial
              </Link>
            </div>

            {/* Stats */}
            <div
              className="flex flex-wrap gap-8 opacity-0"
              style={{ animation: "fade-in 1s ease 0.72s forwards" }}
            >
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="border-l border-white/20 pl-4"
                >
                  <div className="font-heading text-2xl md:text-3xl font-light text-white tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/45 mt-1 leading-snug">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30">
        <div className="w-[1px] h-8 bg-white" />
      </div>
    </section>
  );
}
