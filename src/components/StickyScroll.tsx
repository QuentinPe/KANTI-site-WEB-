import { useEffect, useRef, useState } from "react";

interface Step {
  title: string;
  description: string;
}

interface StickyScrollProps {
  title: string;
  subtitle: string;
  steps: Step[];
}

export default function StickyScroll({ title, subtitle, steps }: StickyScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
      const index = Math.min(steps.length - 1, Math.floor(progress * steps.length));
      setActiveIndex(index);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [steps.length]);

  return (
    <section
      ref={containerRef}
      className="relative section-navy"
      style={{ minHeight: `${(steps.length + 1) * 50}vh` }}
    >
      <div className="sticky top-0 min-h-screen flex items-center">
        <div className="max-w-6xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 py-20">
          {/* Fixed left side */}
          <div>
            <div className="gold-line mb-6" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold mb-4">
              {title}
            </h2>
            <p className="text-primary-foreground/70 text-lg leading-relaxed">
              {subtitle}
            </p>
            {/* Progress dots */}
            <div className="flex gap-2 mt-8">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === activeIndex ? "w-8 bg-gold" : "w-2 bg-primary-foreground/20"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Changing right side */}
          <div className="flex items-center">
            <div className="relative w-full">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`transition-all duration-700 ${
                    i === activeIndex
                      ? "opacity-100 translate-y-0"
                      : i < activeIndex
                      ? "opacity-0 -translate-y-8 absolute inset-0"
                      : "opacity-0 translate-y-8 absolute inset-0"
                  }`}
                >
                  <div className="bg-navy-light/50 backdrop-blur-sm border border-primary-foreground/10 rounded-sm p-8">
                    <span className="text-gold font-heading text-5xl font-bold opacity-40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-heading text-2xl font-semibold mt-3 mb-4">{step.title}</h3>
                    <p className="text-primary-foreground/70 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
