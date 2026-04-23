import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import SplitText from "./motion/SplitText";
import AmbientParticles from "./motion/AmbientParticles";

export default function CTAFinal() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-12%", "12%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.15, 1]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 0.55, 0.75]);

  return (
    <section
      id="contact"
      ref={ref}
      className="relative isolate overflow-hidden text-white"
    >
      {/* Background image with parallax */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 -z-10 will-change-transform"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=2400&q=80)",
          }}
        />
      </motion.div>
      <motion.div
        aria-hidden
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[hsl(var(--navy-deep))]/85 via-[hsl(var(--navy-deep))]/65 to-[hsl(var(--navy-deep))]/95"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 30% 30%, hsl(210 100% 60% / 0.22) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, hsl(38 35% 60% / 0.12) 0%, transparent 60%)",
        }}
      />
      {/* Drifting ambient particles */}
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <AmbientParticles count={14} color="rgba(180, 210, 255, 0.55)" speed={0.18} />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-12 py-32 md:py-40 lg:py-48 grid lg:grid-cols-12 gap-12 items-end">
        <div className="lg:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[11px] tracking-[0.35em] uppercase text-white/55 mb-6 font-medium"
          >
            Premier rendez-vous · Bordeaux
          </motion.p>
          <h2 className="font-heading font-light tracking-tight leading-[1] text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem] mb-10 max-w-3xl">
            <SplitText text="Parlons de votre" by="char" stagger={0.025} y={32} />
            <br />
            <SplitText
              text="patrimoine."
              by="char"
              stagger={0.025}
              delay={0.5}
              itemClassName="italic text-white/85"
            />
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-white/70 text-lg lg:text-xl font-light leading-relaxed max-w-xl mb-10"
          >
            30 minutes en visio ou dans nos bureaux du Cours de l'Intendance. Gratuit, confidentiel, sans engagement. Vous repartez avec un regard expert sur votre situation.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              to="/contact"
              data-magnetic
              className="group relative inline-flex items-center gap-3 pl-8 pr-3 py-3 rounded-full bg-white text-[hsl(var(--navy-deep))] text-sm font-medium tracking-wide reflection-sweep shadow-2xl hover:-translate-y-0.5 transition-transform duration-300 before:content-[''] before:absolute before:inset-0 before:rounded-full before:ring-2 before:ring-white/40 before:animate-[pulse_4s_ease-in-out_infinite] before:pointer-events-none"
            >
              <span>Prendre rendez-vous</span>
              <span className="w-10 h-10 rounded-full bg-[hsl(var(--navy-deep))] text-white flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </Link>
            <Link
              to="/bilan-patrimonial-bordeaux"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-white/30 text-white text-sm tracking-wide hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              Demander un bilan patrimonial
            </Link>
          </motion.div>
        </div>

        <aside className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-[2rem] p-7 lg:p-8 bg-white/[0.06] backdrop-blur-xl border border-white/15"
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/55 mb-5 font-medium">
              Coordonnées
            </p>
            <ul className="space-y-4 text-white/85 text-[15px] font-light">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--electric-soft))] mt-2 flex-shrink-0" />
                <span>
                  12 Cours de l'Intendance<br />
                  <span className="text-white/55 text-sm">33000 Bordeaux</span>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--electric-soft))] flex-shrink-0" />
                <a href="tel:+33556000000" className="hover:text-[hsl(var(--electric-soft))] transition-colors">05 56 00 00 00</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--electric-soft))] flex-shrink-0" />
                <a href="mailto:contact@kanti.fr" className="hover:text-[hsl(var(--electric-soft))] transition-colors">contact@kanti.fr</a>
              </li>
            </ul>
            <div className="mt-7 pt-6 border-t border-white/10 text-white/55 text-[12px] font-light tracking-wide leading-relaxed">
              Du lundi au vendredi · 9h–18h<br />
              Réponse sous 24 h ouvrées · Confidentiel
            </div>
          </motion.div>
        </aside>
      </div>
    </section>
  );
}