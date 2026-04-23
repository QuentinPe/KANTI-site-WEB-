import { useEffect, useRef } from "react";

type Props = {
  count?: number;
  color?: string; // CSS color
  className?: string;
  /** speed multiplier */
  speed?: number;
};

/**
 * Lightweight drifting particles on a canvas. Pauses when offscreen and
 * respects prefers-reduced-motion.
 */
export default function AmbientParticles({
  count = 14,
  color = "rgba(180, 210, 255, 0.55)",
  className = "",
  speed = 0.15,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.max(1, Math.floor(w * dpr));
      canvas!.height = Math.max(1, Math.floor(h * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number };
    const particles: P[] = [];
    function init() {
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          r: 0.8 + Math.random() * 1.6,
          a: 0.2 + Math.random() * 0.55,
        });
      }
    }

    function frame() {
      if (!visible) {
        raf = requestAnimationFrame(frame);
        return;
      }
      ctx!.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
        ctx!.beginPath();
        ctx!.fillStyle = color.replace(/[\d.]+\)$/, `${p.a})`);
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    resize();
    init();
    if (!reduce) raf = requestAnimationFrame(frame);
    else {
      // single static frame
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        ctx.beginPath();
        ctx.fillStyle = color.replace(/[\d.]+\)$/, `${p.a})`);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const onResize = () => {
      resize();
      init();
    };
    window.addEventListener("resize", onResize);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      io.disconnect();
    };
  }, [count, color, speed]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
    />
  );
}