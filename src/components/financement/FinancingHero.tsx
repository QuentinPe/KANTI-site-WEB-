import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

const IMAGE_URL = "/financement-hero.png";

const STATS = [
  { value: "20+", label: "Établissements partenaires" },
  { value: "100%", label: "Indépendant" },
  { value: "360°", label: "Vision patrimoniale" },
];

const CONTACT_URL = "/contact";
const SIMULATOR_URL = "/courtage-patrimonial/simulateur-financement";

export default function FinancingHero() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);

  return (
    <section
      ref={sectionRef}
      id="hero-financement"
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
          alt="Bureau minimaliste — financement patrimonial KANTI"
          className="w-full h-full object-cover object-center"
          fetchPriority="high"
          decoding="sync"
        />
      </motion.div>

      {/* Left gradient — image already dark, overlay stays light */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(108deg, hsl(220 25% 8% / 0.78) 0%, hsl(220 25% 8% / 0.52) 38%, hsl(220 25% 8% / 0.14) 62%, transparent 80%)",
        }}
      />

      {/* Bottom vignette — stronger to dissolve the dark desk into white */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: "52%",
          background:
            "linear-gradient(to top, hsl(220 30% 97%) 0%, hsl(220 30% 97% / 0.70) 28%, hsl(220 30% 97% / 0.18) 58%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center h-full">
        <div className="max-w-6xl mx-auto px-8 md:px-14 w-full">
          <div className="max-w-xl">
            {/* Eyebrow */}
            <p
              className="text-[10px] tracking-[0.32em] uppercase text-white/55 mb-5 font-medium opacity-0"
              style={{ animation: "fade-in 0.8s ease 0.15s forwards" }}
            >
              Courtage patrimonial
            </p>

            {/* Headline */}
            <h1
              className="font-heading text-5xl md:text-6xl lg:text-[68px] font-light leading-[1.04] tracking-tight mb-6 text-white opacity-0"
              style={{
                animation:
                  "fade-in-up 0.9s cubic-bezier(0.22,1,0.36,1) 0.28s forwards",
              }}
            >
              Financement
              <br />
              <span className="italic text-white/65">&amp; crédit.</span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-white/65 text-[15px] md:text-base font-light leading-relaxed mb-4 opacity-0"
              style={{
                animation:
                  "fade-in-up 0.9s cubic-bezier(0.22,1,0.36,1) 0.38s forwards",
              }}
            >
              Structurer le financement de vos projets sans perdre de vue
              l'ensemble de votre patrimoine.
            </p>

            <p
              className="text-white/50 text-sm font-light leading-relaxed mb-10 opacity-0"
              style={{
                animation:
                  "fade-in-up 0.9s cubic-bezier(0.22,1,0.36,1) 0.44s forwards",
              }}
            >
              Nous vous accompagnons dans l'analyse, la préparation et la
              négociation de vos financements immobiliers et professionnels. Le
              taux compte, mais il ne suffit pas.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-wrap gap-3 mb-14 opacity-0"
              style={{
                animation:
                  "fade-in-up 0.9s cubic-bezier(0.22,1,0.36,1) 0.58s forwards",
              }}
            >
              <Link
                to={CONTACT_URL}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[hsl(224_60%_12%)] text-sm font-medium tracking-wide hover:bg-white/90 transition-colors duration-300 shadow-lg"
              >
                Étudier mon financement
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
                to={SIMULATOR_URL}
                className="inline-flex items-center px-6 py-3 rounded-full border border-white/30 text-white/85 text-sm font-medium tracking-wide hover:border-white/60 hover:text-white transition-colors duration-300"
              >
                Accéder au simulateur
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
