import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

export default function CabinetHeroSticky() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Image moves up slower than scroll → parallax
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);

  return (
    <section
      ref={sectionRef}
      id="hero-cabinet"
      className="relative overflow-hidden"
      style={{ height: "92vh", minHeight: 560 }}
    >
      {/* Parallax background image */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ y: imageY, scale: 1.18 }}
      >
        <img
          src="/cabinet-hero.png"
          alt="Intérieur du cabinet KANTI, Bordeaux"
          className="w-full h-full object-cover object-center"
          fetchPriority="high"
          decoding="sync"
        />
      </motion.div>

      {/* Left ivory gradient — keeps text readable against the light wall */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(100deg, hsl(210 100% 96% / 0.92) 0%, hsl(210 100% 96% / 0.75) 30%, hsl(210 100% 96% / 0.30) 55%, transparent 75%)",
        }}
      />

      {/* Bottom vignette */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to top, hsl(220 30% 97% / 0.9) 0%, transparent 100%)",
        }}
      />

      {/* Editorial content — left column */}
      <div className="relative z-10 flex items-center h-full">
        <div className="max-w-6xl mx-auto px-8 md:px-14 w-full">
          <div className="max-w-lg">

            {/* Eyebrow */}
            <div
              className="flex items-center gap-2 mb-8 opacity-0"
              style={{ animation: "fade-in 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s forwards" }}
            >
              <span className="w-6 h-[2px] bg-[hsl(224_60%_22%)]" />
              <p className="text-[11px] tracking-[0.32em] uppercase font-medium text-[hsl(224_60%_22%)]">
                Le Cabinet · KANTI · Bordeaux
              </p>
            </div>

            {/* Headline */}
            <h1
              className="font-heading text-5xl md:text-6xl lg:text-[68px] font-light leading-[1.04] tracking-tight mb-6 opacity-0 text-[hsl(224_60%_12%)]"
              style={{ animation: "fade-in-up 0.9s cubic-bezier(0.22,1,0.36,1) 0.25s forwards" }}
            >
              Ancré à Bordeaux.
              <br />
              <span className="italic text-[hsl(224_55%_30%)]">
                Exigeant partout ailleurs.
              </span>
            </h1>

            {/* Description */}
            <p
              className="text-[hsl(224_40%_22%)] text-[15px] md:text-base font-light leading-relaxed mb-2 opacity-0"
              style={{ animation: "fade-in-up 0.9s cubic-bezier(0.22,1,0.36,1) 0.45s forwards" }}
            >
              Cabinet de conseil en gestion de patrimoine. Nous accompagnons les familles, les chefs d'entreprise et les investisseurs en architecture ouverte.
            </p>
            <p
              className="text-[hsl(224_40%_35%)] text-[13px] font-light mb-2 opacity-0"
              style={{ animation: "fade-in 0.9s ease 0.55s forwards" }}
            >
              Présents à Bordeaux et sur tout le territoire national.
            </p>

            {/* Address chip */}
            <p
              className="text-[hsl(224_40%_45%)] text-[12px] tracking-wide font-light mb-10 opacity-0"
              style={{ animation: "fade-in 0.9s ease 0.65s forwards" }}
            >
              12 rue Ferrere · 33000 Bordeaux
            </p>

            {/* CTAs */}
            <div
              className="flex flex-wrap gap-3 opacity-0"
              style={{ animation: "fade-in-up 0.9s cubic-bezier(0.22,1,0.36,1) 0.75s forwards" }}
            >
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[hsl(224_60%_18%)] text-white text-sm font-medium tracking-wide hover:bg-[hsl(224_60%_12%)] transition-colors duration-300 shadow-lg"
              >
                Prendre rendez-vous
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                to="/notre-methode"
                className="inline-flex items-center px-6 py-3 rounded-full border border-[hsl(224_60%_22%)/40] text-[hsl(224_60%_20%)] text-sm font-medium tracking-wide hover:border-[hsl(224_60%_22%)] transition-colors duration-300"
              >
                Notre méthode
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
        <div className="w-[1px] h-8 bg-[hsl(224_60%_20%)]" />
      </div>
    </section>
  );
}
