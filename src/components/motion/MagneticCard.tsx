import { useRef, ReactNode, CSSProperties, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Max tilt in degrees */
  intensity?: number;
  /** Glow color (HSL string like "var(--accent)") */
  glow?: string;
};

/**
 * 3D tilt card that follows the cursor. Adds a soft glow that tracks
 * the pointer. Disabled under reduced-motion or touch (no hover).
 */
export default function MagneticCard({
  children,
  className = "",
  style,
  intensity = 4,
  glow = "var(--accent)",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const sx = useSpring(mx, { stiffness: 150, damping: 18, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 150, damping: 18, mass: 0.4 });

  const rotateY = useTransform(sx, [0, 1], [-intensity, intensity]);
  const rotateX = useTransform(sy, [0, 1], [intensity, -intensity]);
  const glowX = useTransform(sx, (v) => `${v * 100}%`);
  const glowY = useTransform(sy, (v) => `${v * 100}%`);

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }

  function handleLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX: reduce ? 0 : rotateX,
        rotateY: reduce ? 0 : rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
        ...style,
      }}
      className={`relative ${className}`}
    >
      {/* Glow layer */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(360px circle at ${glowX.get()} ${glowY.get()}, hsl(${glow} / 0.18), transparent 60%)`,
            // also reactive
            ["--glow-x" as never]: glowX,
            ["--glow-y" as never]: glowY,
          }}
        />
      )}
      <div style={{ transform: "translateZ(0)" }}>{children}</div>
    </motion.div>
  );
}