import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
  MotionValue,
} from "framer-motion";

interface Slide {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  caption?: string;
}

interface CinematicGalleryProps {
  eyebrow?: string;
  title?: string;
  intro?: string;
  slides: Slide[];
}

/**
 * Cinematic sticky-scroll gallery, full-screen photos that cross-fade
 * with parallax zoom as the user scrolls. Inspired by editorial film reveals.
 */
export default function CinematicGallery({ eyebrow, title, intro, slides }: CinematicGalleryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Each slide occupies an equal slice of the scroll
  const slideCount = slides.length;

  return (
    <section ref={ref} className="relative bg-black" style={{ height: `${slideCount * 100}vh` }}>
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Intro overlay (visible only at start) */}
        {(eyebrow || title) && (
          <IntroOverlay scrollYProgress={scrollYProgress} eyebrow={eyebrow} title={title} intro={intro} />
        )}

        {slides.map((slide, i) => (
          <Slide
            key={i}
            slide={slide}
            index={i}
            total={slideCount}
            scrollYProgress={scrollYProgress}
            reduce={!!reduce}
          />
        ))}

        {/* Progress indicator */}
        <Progress scrollYProgress={scrollYProgress} count={slideCount} />

        {/* Scroll hint (first slide) */}
        <ScrollHint scrollYProgress={scrollYProgress} />
      </div>
    </section>
  );
}

function Slide({
  slide,
  index,
  total,
  scrollYProgress,
  reduce,
}: {
  slide: Slide;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  reduce: boolean;
}) {
  const segment = 1 / total;
  const start = index * segment;
  const end = start + segment;
  // Build a strictly non-decreasing input range, clamped to [0, 1].
  const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
  const sortAsc = (arr: number[]) => {
    const out = [...arr];
    for (let i = 1; i < out.length; i++) {
      if (out[i] < out[i - 1]) out[i] = out[i - 1];
    }
    return out;
  };
  const opacityRange = sortAsc([
    clamp01(start - segment * 0.3),
    clamp01(start),
    clamp01(end - segment * 0.05),
    clamp01(end + segment * 0.05),
  ]);
  const opacity = useTransform(
    scrollYProgress,
    opacityRange,
    index === 0 ? [1, 1, 1, 0] : [0, 1, 1, 0],
  );
  const scale = useTransform(scrollYProgress, [start, end], reduce ? [1, 1] : [1.15, 1]);
  const y = useTransform(scrollYProgress, [start, end], reduce ? ["0%", "0%"] : ["-4%", "4%"]);
  const captionY = useTransform(scrollYProgress, [start, (start + end) / 2, end], [60, 0, -60]);
  const captionOpacity = useTransform(
    scrollYProgress,
    sortAsc([
      clamp01(start + segment * 0.25),
      clamp01(start + segment * 0.45),
      clamp01(end - segment * 0.15),
      clamp01(end),
    ]),
    [0, 1, 1, 0],
  );

  return (
    <motion.div
      className="absolute inset-0 will-change-[opacity,transform]"
      style={{ opacity }}
    >
      <motion.div className="absolute inset-0" style={{ scale, y }}>
        <img
          src={slide.image}
          alt={slide.alt}
          loading={index < 2 ? "eager" : "lazy"}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Cinematic vignette + bottom gradient for legibility */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 50%, hsl(0 0% 0% / 0.55) 100%), linear-gradient(180deg, hsl(0 0% 0% / 0.15) 0%, transparent 35%, transparent 55%, hsl(0 0% 0% / 0.85) 100%)",
          }}
        />
        {/* Blue light accent */}
        <div
          aria-hidden
          className="absolute top-[15%] right-[8%] w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, hsl(210 100% 60% / 0.18) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </motion.div>

      {/* Caption */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-10 px-6 md:px-12 pb-20 md:pb-28"
        style={{ y: captionY, opacity: captionOpacity }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-baseline gap-4 mb-5">
            <span className="font-heading text-xs md:text-sm font-light text-white/40 tabular-nums tracking-[0.32em]">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <div className="h-px flex-1 bg-white/15 max-w-[120px]" />
            <p className="text-[10px] tracking-[0.32em] uppercase text-white/55 font-medium">
              {slide.eyebrow}
            </p>
          </div>
          <h3 className="font-heading text-3xl md:text-5xl lg:text-6xl font-extralight text-white leading-[1.05] tracking-[-0.02em] text-balance max-w-3xl">
            {slide.title}
          </h3>
          {slide.caption && (
            <p className="mt-5 text-sm md:text-base text-white/65 max-w-xl font-light leading-relaxed">
              {slide.caption}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function IntroOverlay({
  scrollYProgress,
  eyebrow,
  title,
  intro,
}: {
  scrollYProgress: MotionValue<number>;
  eyebrow?: string;
  title?: string;
  intro?: string;
}) {
  // Fade out the intro quickly so it never overlaps the first slide caption.
  const opacity = useTransform(scrollYProgress, [0, 0.03, 0.06], [1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.06], [0, -40]);
  const [hidden, setHidden] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setHidden(v > 0.07);
  });
  return (
    <motion.div
      aria-hidden={hidden}
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6"
      style={{ opacity, y, visibility: hidden ? "hidden" : "visible" }}
    >
      <div className="text-center max-w-3xl">
        {eyebrow && (
          <p className="text-[10px] tracking-[0.32em] uppercase text-white/65 mb-6 font-medium">
            {eyebrow}
          </p>
        )}
        {title && (
          <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-extralight text-white leading-[1.05] tracking-[-0.02em] text-balance">
            {title}
          </h2>
        )}
        {intro && (
          <p className="mt-6 text-base md:text-lg text-white/70 max-w-xl mx-auto font-light leading-relaxed">
            {intro}
          </p>
        )}
      </div>
    </motion.div>
  );
}

function Progress({ scrollYProgress, count }: { scrollYProgress: MotionValue<number>; count: number }) {
  return (
    <div className="absolute top-1/2 right-6 md:right-10 -translate-y-1/2 z-20 flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => {
        const segment = 1 / count;
        const center = (i + 0.5) * segment;
        const lo = Math.max(0, center - segment);
        const hi = Math.min(1, center + segment);
        const opacity = useTransform(
          scrollYProgress,
          [lo, center, hi],
          [0.25, 1, 0.25],
        );
        const scaleY = useTransform(
          scrollYProgress,
          [lo, center, hi],
          [1, 2.2, 1],
        );
        return (
          <motion.div
            key={i}
            className="w-px h-8 bg-white origin-center"
            style={{ opacity, scaleY }}
          />
        );
      })}
    </div>
  );
}

function ScrollHint({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const opacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  return (
    <motion.div
      className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      style={{ opacity }}
    >
      <span className="text-[10px] tracking-[0.32em] uppercase text-white/55">Défilez</span>
      <motion.div
        className="w-px h-8 bg-white/40"
        animate={{ scaleY: [0.4, 1, 0.4], originY: [0, 0, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}