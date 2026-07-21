import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const reduce = useReducedMotion();

  return (
    <section
      className="section-padding section-ivory"
      aria-label={title}
    >
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="mb-14 max-w-2xl">
          <div className="electric-line mb-5" />
          <p className="text-[11px] tracking-[0.3em] uppercase text-[hsl(224_55%_35%)] mb-4 font-medium">
            {eyebrow}
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-light text-[hsl(224_60%_12%)] mb-5 tracking-tight leading-[1.05]">
            {title.split(",").map((part, i) => (
              i === 0 ? (
                <span key={i}>{part},<br /></span>
              ) : (
                <span key={i} className="italic text-[hsl(224_55%_30%)]">{part}</span>
              )
            ))}
          </h2>
        </div>

        {/* Two-column grid */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* LEFT · accordion steps */}
          <div className="order-2 lg:order-1">
            {steps.map((step, i) => {
              const isActive = i === activeIndex;
              return (
                <motion.button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-full text-left py-6 border-b transition-colors duration-300 focus:outline-none group ${
                    isActive
                      ? "border-[hsl(224_60%_12%/0.18)]"
                      : "border-[hsl(224_60%_12%/0.08)] hover:border-[hsl(224_60%_12%/0.14)]"
                  }`}
                  whileHover={{ x: reduce ? 0 : 4 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <div className="flex items-start gap-5">
                    {/* Step number */}
                    <span
                      className="font-heading text-sm font-light tracking-widest mt-0.5 flex-shrink-0 transition-colors duration-300"
                      style={{ color: isActive ? "hsl(var(--electric))" : "hsl(224 55% 60%)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="flex-1 min-w-0">
                      {/* Step label */}
                      <motion.p
                        animate={{
                          color: isActive ? "hsl(224 60% 12%)" : "hsl(224 50% 35%)",
                          fontSize: isActive ? "18px" : "16px",
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="font-heading font-normal tracking-tight leading-snug"
                      >
                        {step.label}
                      </motion.p>

                      {/* Description · accordion */}
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                            style={{ overflow: "hidden" }}
                          >
                            <p className="text-[hsl(224_40%_38%)] text-[14px] leading-relaxed font-light mt-3 pr-2">
                              {step.description}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Arrow indicator */}
                    <motion.span
                      animate={{
                        opacity: isActive ? 1 : 0,
                        x: isActive ? 0 : -8,
                      }}
                      transition={{ duration: 0.25 }}
                      className="text-[hsl(224_60%_18%)] mt-0.5 flex-shrink-0 text-sm"
                    >
                      →
                    </motion.span>
                  </div>
                </motion.button>
              );
            })}

            {/* Progress dots */}
            <div className="flex gap-2 mt-8">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Étape ${i + 1}`}
                  className="h-[3px] rounded-full transition-all duration-400 focus:outline-none"
                  style={{
                    width: i === activeIndex ? 28 : 12,
                    background: i === activeIndex
                      ? "hsl(224 60% 18%)"
                      : "hsl(224 60% 12% / 0.15)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* RIGHT · sticky image */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-28 lg:self-start">
            <div className="relative aspect-[4/3] lg:aspect-[3/4] rounded-[1.75rem] overflow-hidden shadow-[0_24px_64px_-16px_hsl(224_60%_12%/0.22)]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeIndex}
                  src={steps[activeIndex].image}
                  alt={steps[activeIndex].imageAlt ?? steps[activeIndex].label}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </AnimatePresence>

              {/* Subtle gradient vignette */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(160deg, transparent 45%, hsl(224 60% 8% / 0.3) 100%)",
                }}
              />

              {/* Step counter */}
              <div className="absolute bottom-5 right-5 glass-dark rounded-full px-4 py-1.5 text-[11px] tracking-[0.22em] uppercase text-white/75 font-medium">
                {String(activeIndex + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
