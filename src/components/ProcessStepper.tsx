import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface Step {
  label: string;
  description: string;
  image: string;
  imageAlt?: string;
}

interface ProcessStepperProps {
  eyebrow?: string;
  title: string;
  steps: Step[];
}

export default function ProcessStepper({
  eyebrow = "Notre méthode",
  title,
  steps,
}: ProcessStepperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map scroll progress → active step index
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      // Reserve last 15% of scroll for final step
      const index = Math.min(
        Math.floor(v * steps.length),
        steps.length - 1
      );
      setActiveIndex(index);
    });
    return unsubscribe;
  }, [scrollYProgress, steps.length]);

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: `${steps.length * 60}vh` }}
      aria-label={title}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen flex items-stretch overflow-hidden"
        style={{ background: "hsl(224 60% 12%)" }}
      >
        {/* Ambient glow */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 70% 50%, hsl(210 100% 60% / 0.12) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-7xl w-full mx-auto px-6 md:px-10 flex flex-col lg:flex-row gap-8 lg:gap-16 py-16 md:py-20 items-center relative z-10">

          {/* LEFT — steps list */}
          <div className="lg:w-[45%] flex flex-col justify-center gap-0">
            <p className="text-[10px] tracking-[0.32em] uppercase text-white/40 mb-6 font-medium">
              {eyebrow}
            </p>
            <h2
              className="font-heading text-3xl md:text-4xl lg:text-[42px] font-light text-white leading-[1.1] tracking-tight mb-10 text-balance"
            >
              {title}
            </h2>

            <div className="flex flex-col gap-0 border-l border-white/10 pl-6">
              {steps.map((step, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className="text-left py-5 border-b border-white/08 last:border-b-0 group transition-all duration-300 focus:outline-none"
                  >
                    <div className="flex items-start gap-4">
                      <motion.div
                        animate={{
                          background: isActive
                            ? "hsl(var(--gold))"
                            : "hsl(0 0% 100% / 0.12)",
                          scale: isActive ? 1 : 0.85,
                        }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="w-6 h-6 rounded-full flex-shrink-0 mt-0.5"
                      />
                      <div>
                        <motion.p
                          animate={{
                            color: isActive
                              ? "hsl(0 0% 100%)"
                              : "hsl(0 0% 100% / 0.40)",
                            fontSize: isActive ? "17px" : "15px",
                          }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="font-heading font-normal leading-snug tracking-tight mb-1"
                        >
                          {step.label}
                        </motion.p>
                        <motion.p
                          animate={{ opacity: isActive ? 0.65 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-white text-[13.5px] leading-relaxed font-light"
                        >
                          {step.description}
                        </motion.p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT — image panel */}
          <div className="lg:w-[55%] h-full flex items-center">
            <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:h-[65vh] rounded-[1.75rem] overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeIndex}
                  src={steps[activeIndex].image}
                  alt={steps[activeIndex].imageAlt ?? steps[activeIndex].label}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </AnimatePresence>
              {/* Subtle overlay */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(160deg, transparent 40%, hsl(224 60% 8% / 0.5) 100%)",
                }}
              />
              {/* Step counter */}
              <div className="absolute bottom-5 right-5 glass-dark rounded-full px-4 py-1.5 text-[11px] tracking-[0.22em] uppercase text-white/70">
                {String(activeIndex + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
