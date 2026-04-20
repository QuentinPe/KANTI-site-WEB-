import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

interface Step {
  id: string;
  label: string;
}

const STEPS: Step[] = [
  { id: "hero", label: "Accueil" },
  { id: "about", label: "Vision" },
  { id: "expertises", label: "Expertises" },
  { id: "methode", label: "Méthode" },
  { id: "equipe", label: "Équipe" },
  { id: "actualites", label: "Insights" },
  { id: "contact", label: "Contact" },
];

/**
 * Discreet vertical progress rail (desktop only).
 * Shows current chapter + smooth scroll progress.
 */
export default function ScrollProgressRail() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = STEPS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = STEPS.findIndex((s) => s.id === e.target.id);
            if (idx >= 0) setActive(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <div
      aria-hidden
      className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-4 pointer-events-none"
    >
      {/* Vertical track */}
      <div className="relative w-[1px] h-[260px] bg-foreground/10 overflow-hidden rounded-full">
        <motion.div
          className="absolute top-0 left-0 w-full bg-foreground/60 origin-top"
          style={{ scaleY: progress, height: "100%" }}
        />
      </div>
      {/* Steps */}
      <ul className="flex flex-col gap-2 pointer-events-auto">
        {STEPS.map((s, i) => (
          <li key={s.id} className="group flex items-center justify-end gap-2">
            <span
              className={`text-[10px] tracking-[0.2em] uppercase transition-all duration-500 ${
                i === active ? "opacity-80 text-foreground" : "opacity-0 group-hover:opacity-50 text-foreground/60"
              }`}
            >
              {s.label}
            </span>
            <a
              href={`#${s.id}`}
              className={`block w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                i === active ? "bg-foreground scale-150" : "bg-foreground/30 hover:bg-foreground/60"
              }`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
