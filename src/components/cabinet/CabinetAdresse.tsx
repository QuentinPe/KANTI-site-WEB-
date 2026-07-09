import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MapPin, Phone, Mail } from "lucide-react";

export default function CabinetAdresse() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <section
      ref={sectionRef}
      id="adresse"
      className="relative overflow-hidden bg-white"
      style={{ minHeight: 600 }}
    >
      {/* Bureau image — parallax */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ y: imageY, scale: 1.12 }}
      >
        <img
          src="/cabinet-bureau.png"
          alt="Bureau du cabinet KANTI, Bordeaux"
          className="w-full h-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
      </motion.div>

      {/* White gradient — left side, same logic as the hero */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(100deg, hsl(0 0% 100% / 0.98) 0%, hsl(0 0% 100% / 0.94) 28%, hsl(0 0% 100% / 0.65) 50%, hsl(0 0% 100% / 0.10) 68%, transparent 80%)",
        }}
      />

      {/* Top & bottom fades for seamless page blending */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-20 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, hsl(220 30% 97% / 0.9) 0%, transparent 100%)" }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
        style={{ background: "linear-gradient(to top, hsl(220 30% 97% / 0.9) 0%, transparent 100%)" }}
      />

      {/* Content — left column */}
      <div className="relative z-10 flex items-center py-20 md:py-28 min-h-[600px]">
        <div className="max-w-6xl mx-auto px-8 md:px-14 w-full">
          <div className="max-w-md">

            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-7 reveal">
              <span className="w-6 h-[2px] bg-[hsl(224_60%_22%)]" />
              <p className="text-[11px] tracking-[0.32em] uppercase font-medium text-[hsl(224_60%_22%)]">
                Nous trouver
              </p>
            </div>

            {/* Title */}
            <h2 className="font-heading text-4xl md:text-5xl font-light leading-[1.04] tracking-tight mb-8 text-[hsl(224_60%_12%)] reveal">
              L'adresse.
            </h2>

            {/* Contact block */}
            <div className="space-y-5 mb-10 reveal">

              {/* Adresse principale */}
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase font-medium text-[hsl(224_40%_45%)] mb-1">
                  Cabinet
                </p>
                <p className="text-[hsl(224_60%_12%)] text-[15px] font-light leading-snug">
                  12 Rue Ferrere
                  <br />
                  <span className="text-[hsl(224_40%_35%)]">33000 Bordeaux</span>
                </p>
              </div>

              {/* Téléphone & email */}
              <div className="flex flex-col gap-2">
                <a
                  href="tel:+33663324809"
                  className="inline-flex items-center gap-2 text-[hsl(224_40%_30%)] hover:text-[hsl(224_60%_12%)] transition-colors duration-300 text-[14px] font-light group"
                >
                  <Phone className="w-3.5 h-3.5 text-[hsl(224_40%_50%)]" strokeWidth={1.5} />
                  06 63 32 48 09
                </a>
                <a
                  href="mailto:kanti@adnfamily.com"
                  className="inline-flex items-center gap-2 text-[hsl(224_40%_30%)] hover:text-[hsl(224_60%_12%)] transition-colors duration-300 text-[14px] font-light group"
                >
                  <Mail className="w-3.5 h-3.5 text-[hsl(224_40%_50%)]" strokeWidth={1.5} />
                  kanti@adnfamily.com
                </a>
              </div>

              {/* Horaires */}
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase font-medium text-[hsl(224_40%_45%)] mb-1">
                  Horaires
                </p>
                <p className="text-[hsl(224_40%_30%)] text-[14px] font-light leading-relaxed">
                  Lundi — Vendredi · 9h00 — 19h00
                  <br />
                  Sur rendez-vous uniquement
                </p>
              </div>

              {/* Zone de conseil */}
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase font-medium text-[hsl(224_40%_45%)] mb-1">
                  Zone de conseil
                </p>
                <p className="text-[hsl(224_40%_30%)] text-[14px] font-light">
                  Bordeaux et tout le territoire national
                </p>
              </div>

              {/* Siège social — discret */}
              <p className="text-[12px] text-[hsl(224_20%_60%)] font-light">
                Siège social · 9 Rue de la Négresse, 64200 Biarritz
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 reveal">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[hsl(224_60%_18%)] text-white text-sm font-medium tracking-wide hover:bg-[hsl(224_60%_12%)] transition-all duration-300 shadow-lg hover:-translate-y-0.5"
              >
                Prendre rendez-vous
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
              </Link>
              <a
                href="https://share.google/dAsdiZH2F1BB2RXpd"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[hsl(224_60%_22%)/35] text-[hsl(224_60%_20%)] text-sm font-medium tracking-wide hover:border-[hsl(224_60%_22%)] transition-colors duration-300"
              >
                <MapPin className="w-4 h-4" strokeWidth={1.5} />
                Venir au cabinet
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
