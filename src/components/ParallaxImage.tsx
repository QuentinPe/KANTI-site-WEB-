import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import { useRef } from "react";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Range in pixels: how far the image translates over the scroll. Default 120 */
  intensity?: number;
  overlayClassName?: string;
  children?: React.ReactNode;
  rounded?: string;
  priority?: boolean;
}

export default function ParallaxImage({
  src,
  alt,
  className = "",
  intensity = 120,
  overlayClassName = "bg-gradient-to-t from-navy-deep/70 via-navy-deep/10 to-transparent",
  children,
  rounded = "rounded-[1.5rem]",
  priority = false,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y: MotionValue<string> = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${intensity / 2}px`, `${intensity / 2}px`],
  );
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.08, 1.15]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${rounded} ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        style={{ y, scale }}
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
      />
      <div aria-hidden className={`absolute inset-0 pointer-events-none ${overlayClassName}`} />
      {children && <div className="relative z-10 h-full w-full">{children}</div>}
    </div>
  );
}