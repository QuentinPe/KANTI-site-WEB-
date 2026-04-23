import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import Hero from "./Hero";

const POSTER_SRC = "/video/hero-office-poster.jpg";
const FRAME_COUNT = 192;
// Pick the right resolution per device — saves ~4 MB on small screens.
const pickFrameDir = () => {
  if (typeof window === "undefined") return "frames-1280";
  const dpr = window.devicePixelRatio || 1;
  const effectiveWidth = window.innerWidth * dpr;
  return effectiveWidth >= 1600 ? "frames-1920" : "frames-1280";
};
const frameSrc = (dir: string, i: number) =>
  `/video/${dir}/frame-${String(i).padStart(3, "0")}.jpg`;

export default function HeroSticky() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const [ready, setReady] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const titleOpacity = useTransform(scrollYProgress, [0, 0.7, 0.95], [1, 0.85, 0]);
  const titleY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -60]);

  // Preload all frames as <img> elements + drive canvas from scroll
  useEffect(() => {
    if (isMobile || reduce) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    let loaded = 0;
    let firstReady = false;

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawFrame = (index: number) => {
      const img = images[index];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      // object-fit: cover
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = cw / ch;
      let dw = cw;
      let dh = ch;
      let dx = 0;
      let dy = 0;
      if (ir > cr) {
        dh = ch;
        dw = ch * ir;
        dx = (cw - dw) / 2;
      } else {
        dw = cw;
        dh = cw / ir;
        dy = (ch - dh) / 2;
      }
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    sizeCanvas();
    const onResize = () => {
      sizeCanvas();
      drawFrame(currentFrameRef.current);
    };
    window.addEventListener("resize", onResize);

    // Prioritize the first frame, then load the rest progressively
    const loadOne = (i: number, priority: boolean) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        if (priority) {
          // hint browser
          img.decoding = "sync";
          (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = "high";
        } else {
          img.decoding = "async";
        }
        img.onload = () => {
          images[i] = img;
          loaded += 1;
          setLoadedCount(loaded);
          if (!firstReady && i === 0) {
            firstReady = true;
            setReady(true);
            drawFrame(0);
          }
          resolve();
        };
        img.onerror = () => {
          loaded += 1;
          setLoadedCount(loaded);
          resolve();
        };
        img.src = frameSrc(i + 1);
      });

    // Load frame 0 first (blocks "ready"), then everything else in parallel
    (async () => {
      await loadOne(0, true);
      // fire-and-forget the rest
      for (let i = 1; i < FRAME_COUNT; i++) {
        loadOne(i, false);
      }
    })();

    // RAF loop — lerp current frame towards target for smooth scrubbing
    let raf = 0;
    const tick = () => {
      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const delta = target - current;
      if (Math.abs(delta) > 0.01) {
        currentFrameRef.current = current + delta * 0.18;
        const idx = Math.round(currentFrameRef.current);
        // Find nearest available frame if the exact one isn't loaded yet
        let drawIdx = idx;
        if (!images[drawIdx]) {
          for (let off = 1; off < FRAME_COUNT; off++) {
            if (images[idx - off]) {
              drawIdx = idx - off;
              break;
            }
            if (images[idx + off]) {
              drawIdx = idx + off;
              break;
            }
          }
        }
        drawFrame(drawIdx);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const unsub = scrollYProgress.on("change", (p) => {
      targetFrameRef.current = Math.max(
        0,
        Math.min(FRAME_COUNT - 1, p * (FRAME_COUNT - 1))
      );
    });

    framesRef.current = images;

    return () => {
      cancelAnimationFrame(raf);
      unsub();
      window.removeEventListener("resize", onResize);
    };
  }, [isMobile, reduce, scrollYProgress]);

  // Fallback: mobile or reduced-motion → original static Hero
  if (isMobile || reduce) {
    return <Hero />;
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative"
      style={{ height: "550vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        {/* Scroll-driven canvas — frames are individual JPEGs, works on any CDN */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        />

        {/* Poster fallback while the first frame loads */}
        {!ready && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${POSTER_SRC})` }}
          />
        )}

        {/* Subtle dark gradient — only at top & bottom for legibility, preserves video colors */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, hsl(224 60% 5% / 0.55) 0%, transparent 25%, transparent 70%, hsl(224 60% 5% / 0.65) 100%)",
          }}
        />

        {/* Soft readability shade behind the left text column only */}
        <div
          className="absolute inset-y-0 left-0 w-full md:w-1/2 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, hsl(224 60% 5% / 0.45) 0%, transparent 100%)",
          }}
        />

        {/* Editorial content */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="relative z-10 max-w-6xl mx-auto px-6 py-32 w-full will-change-transform"
        >
          <div className="max-w-3xl">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark mb-8 opacity-0"
              style={{ animation: "fade-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s forwards" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <p className="text-[11px] tracking-[0.2em] uppercase text-white/85 font-medium">
                KANTI · Cabinet · Bordeaux
              </p>
            </div>

            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-heading font-light text-white leading-[1.05] mb-10 tracking-tight opacity-0"
              style={{ animation: "fade-in-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.4s forwards" }}
            >
              Votre patrimoine mérite
              <br />
              <span className="italic font-normal bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                un conseil à la hauteur
              </span>
            </h1>

            <p
              className="text-base md:text-lg text-white/65 max-w-xl leading-relaxed mb-12 font-light opacity-0"
              style={{ animation: "fade-in-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.7s forwards" }}
            >
              Nous accompagnons les particuliers, les dirigeants et les familles dans la
              structuration, l'optimisation et la transmission de leur patrimoine. À Bordeaux,
              depuis plus de quinze ans.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 opacity-0"
              style={{ animation: "fade-in-up 1s cubic-bezier(0.22, 1, 0.36, 1) 1s forwards" }}
            >
              <Link
                to="/bilan-patrimonial-bordeaux"
                data-magnetic
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-navy-deep text-sm font-medium tracking-wide rounded-full reflection-sweep hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5"
              >
                Demander un bilan patrimonial
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                to="/contact"
                data-magnetic
                className="inline-flex items-center justify-center px-7 py-3.5 btn-glass text-white text-sm font-medium tracking-wide"
              >
                Prendre rendez-vous
              </Link>
            </div>

            <div
              className="mt-16 flex flex-wrap gap-x-8 gap-y-3 opacity-0"
              style={{ animation: "fade-in 1s ease-out 1.4s forwards" }}
            >
              {[
                { k: "ORIAS", v: "Inscrit & vérifié" },
                { k: "CNCGP", v: "Membre certifié" },
                { k: "15+ ans", v: "d'expertise" },
                { k: "500+", v: "familles accompagnées" },
              ].map((item) => (
                <div key={item.k} className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold text-white tracking-wider">{item.k}</span>
                  <span className="text-xs text-white/50 font-light">{item.v}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          style={{ opacity: titleOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-[1px] h-10 bg-gradient-to-b from-white/50 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}