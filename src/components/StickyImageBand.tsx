import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface StickyImageBandProps {
  image: string;
  imageAlt?: string;
  caption?: string;
  eyebrow?: string;
}

/**
 * Full-width sticky image band with parallax scale + caption overlay.
 * Used between ExpertiseShowcase and Simulator on expertise pages.
 */
export default function StickyImageBand({
  image,
  imageAlt = "",
  caption,
  eyebrow,
}: StickyImageBandProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.15, 1]);
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-6%", "6%"]);
  const captionY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40]);
  const captionOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-[180vh]"
      aria-label={caption || "Image éditoriale"}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ scale, y }}
        >
          <img
            src={image}
            alt={imageAlt}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Editorial dark gradient */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, hsl(224 60% 7% / 0.55) 0%, hsl(222 50% 11% / 0.35) 50%, hsl(220 40% 18% / 0.75) 100%)",
            }}
          />
          {/* Blue halo accent */}
          <div
            aria-hidden
            className="absolute top-[20%] right-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, hsl(210 100% 60% / 0.20) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
        </motion.div>

        {(caption || eyebrow) && (
          <motion.div
            className="relative z-10 h-full flex items-center justify-center px-6"
            style={{ y: captionY, opacity: captionOpacity }}
          >
            <div className="max-w-4xl text-center">
              {eyebrow && (
                <p className="text-[10px] tracking-[0.32em] uppercase text-white/65 mb-6 font-medium">
                  {eyebrow}
                </p>
              )}
              {caption && (
                <p className="font-heading text-2xl md:text-4xl lg:text-5xl font-extralight text-white leading-[1.15] tracking-[-0.01em] text-balance">
                  {caption}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}