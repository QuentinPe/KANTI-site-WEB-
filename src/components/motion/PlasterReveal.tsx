import { useEffect, useRef } from "react";
import plasterTexture from "@/assets/plaster-texture.jpg";

type Props = {
  /** Reveal radius in pixels */
  radius?: number;
  /** Max opacity of the texture layer */
  opacity?: number;
  /** Lerp factor for smoothing (0-1, lower = smoother) */
  lerp?: number;
  /** Mix blend mode for the texture */
  blendMode?: React.CSSProperties["mixBlendMode"];
};

/**
 * Subtle full-page texture layer revealed only around the cursor via a radial
 * mask. Sits behind the main content so opaque sections naturally hide it —
 * the texture only appears in the empty "breaths" between sections.
 *
 * Disabled on touch devices, sub-768px viewports, and prefers-reduced-motion.
 */
export default function PlasterReveal({
  radius = 280,
  opacity = 0.32,
  lerp = 0.08,
  blendMode = "multiply",
}: Props) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touch = window.matchMedia("(hover: none)");
    const small = window.matchMedia("(max-width: 767px)");

    if (mql.matches || touch.matches || small.matches) {
      layer.style.display = "none";
      return;
    }

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let curX = targetX;
    let curY = targetY;
    let raf = 0;
    let visible = false;

    const setMask = (x: number, y: number) => {
      const mask = `radial-gradient(circle ${radius}px at ${x}px ${y}px, hsl(0 0% 0% / 1) 0%, hsl(0 0% 0% / 0) 70%)`;
      layer.style.webkitMaskImage = mask;
      layer.style.maskImage = mask;
    };

    const tick = () => {
      curX += (targetX - curX) * lerp;
      curY += (targetY - curY) * lerp;
      setMask(curX, curY);
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) {
        layer.style.opacity = String(opacity);
        visible = true;
      }
    };
    const onLeave = () => {
      layer.style.opacity = "0";
      visible = false;
    };

    setMask(curX, curY);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [radius, opacity, lerp]);

  return (
    <div
      ref={layerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500"
      style={{
        backgroundImage: `url(${plasterTexture})`,
        backgroundSize: "640px 640px",
        backgroundRepeat: "repeat",
        mixBlendMode: blendMode,
        opacity: 0,
        willChange: "mask-image",
      }}
    />
  );
}