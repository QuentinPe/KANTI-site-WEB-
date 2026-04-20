import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Premium minimal cursor.
 * - Hidden on touch devices and prefers-reduced-motion.
 * - Halo grows on interactive zones.
 * - Magnetic pull on [data-magnetic] elements (CTA).
 * - State labels: discover (cards), open (links).
 */
export default function PremiumCursor() {
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<"default" | "discover" | "open">("default");
  const [hidden, setHidden] = useState(true);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 350, damping: 30, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 350, damping: 30, mass: 0.4 });
  const dotX = useSpring(x, { stiffness: 800, damping: 35, mass: 0.2 });
  const dotY = useSpring(y, { stiffness: 800, damping: 35, mass: 0.2 });

  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mqHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mqHover.matches || mqMotion.matches) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      // Magnetic pull
      const target = (e.target as HTMLElement)?.closest<HTMLElement>("[data-magnetic]");
      let tx = e.clientX;
      let ty = e.clientY;
      if (target) {
        const r = target.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        tx = cx + (e.clientX - cx) * 0.7;
        ty = cy + (e.clientY - cy) * 0.7;
      }
      x.set(tx);
      y.set(ty);
      setHidden(false);

      const el = e.target as HTMLElement | null;
      if (!el) return setVariant("default");
      if (el.closest("a, button, [role='button'], [data-cursor='open']")) {
        setVariant("open");
      } else if (el.closest("[data-cursor='discover'], .glass-card")) {
        setVariant("discover");
      } else {
        setVariant("default");
      }
    };
    const leave = () => setHidden(true);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);
    document.documentElement.classList.add("cursor-premium-on");
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
      document.documentElement.classList.remove("cursor-premium-on");
    };
  }, [x, y]);

  if (!enabled) return null;

  const ringSize = variant === "open" ? 56 : variant === "discover" ? 64 : 32;

  return (
    <>
      {/* Halo ring */}
      <motion.div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full mix-blend-difference"
        style={{
          x: sx,
          y: sy,
          width: ringSize,
          height: ringSize,
          translateX: "-50%",
          translateY: "-50%",
          border: "1px solid hsl(0 0% 100% / 0.85)",
          opacity: hidden ? 0 : 1,
          transition: "width 220ms cubic-bezier(0.22,1,0.36,1), height 220ms cubic-bezier(0.22,1,0.36,1), opacity 250ms ease",
        }}
      >
        {variant !== "default" && (
          <span className="absolute inset-0 flex items-center justify-center text-[9px] uppercase tracking-[0.18em] text-white font-medium">
            {variant === "open" ? "Ouvrir" : "Voir"}
          </span>
        )}
      </motion.div>
      {/* Dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9999] w-1 h-1 rounded-full bg-white mix-blend-difference"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: hidden || variant !== "default" ? 0 : 1,
          transition: "opacity 200ms ease",
        }}
      />
    </>
  );
}
