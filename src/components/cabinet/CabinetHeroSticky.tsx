import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import CabinetHeroSequence from "./CabinetHeroSequence";

const POSTER_SRC = "/video/cabinet-poster.jpg";
const FRAME_COUNT = 121;
const FRAME_DIR = "cabinet-frames-1280";
const frameSrc = (i: number) =>
  `/video/${FRAME_DIR}/frame-${String(i).padStart(3, "0")}.webp`;

export default function CabinetHeroSticky() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const [ready, setReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const titleOpacity = useTransform(scrollYProgress, [0, 0.65, 0.9], [1, 0.9, 0]);
  const titleY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -50]);

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
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = cw / ch;
      let dw = cw, dh = ch, dx = 0, dy = 0;
      if (ir > cr) {
        dh = ch; dw = ch * ir; dx = (cw - dw) / 2;
      } else {
        dw = cw; dh = cw / ir; dy = (ch - dh) / 2;
      }
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    sizeCanvas();
    const onResize = () => { sizeCanvas(); drawFrame(currentFrameRef.current); };
    window.addEventListener("resize", onResize);

    const loadOne = (i: number, priority: boolean) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        if (priority) {
          img.decoding = "sync";
          (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = "high";
        } else {
          img.decoding = "async";
        }
        img.onload = () => {
          images[i] = img;
          loaded += 1;
          if (!firstReady && i === 0) { firstReady = true; setReady(true); drawFrame(0); }
          resolve();
        };
        img.onerror = () => { loaded += 1; resolve(); };
        img.src = frameSrc(i + 1);
      });

    (async () => {
      await loadOne(0, true);
      for (let i = 1; i < FRAME_COUNT; i++) loadOne(i, false);
    })();

    let raf = 0;
    const tick = () => {
      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const delta = target - current;
      if (Math.abs(delta) > 0.01) {
        currentFrameRef.current = current + delta * 0.18;
        const idx = Math.round(currentFrameRef.current);
        let drawIdx = idx;
        if (!images[drawIdx]) {
          for (let off = 1; off < FRAME_COUNT; off++) {
            if (images[idx - off]) { drawIdx = idx - off; break; }
            if (images[idx + off]) { drawIdx = idx + off; break; }
          }
        }
        drawFrame(drawIdx);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const unsub = scrollYProgress.on("change", (p) => {
      targetFrameRef.current = Math.max(0, Math.min(FRAME_COUNT - 1, p * (FRAME_COUNT - 1)));
    });

    framesRef.current = images;
    return () => { cancelAnimationFrame(raf); unsub(); window.removeEventListener("resize", onResize); };
  }, [isMobile, reduce, scrollYProgress]);

  if (isMobile || reduce) return <CabinetHeroSequence />;

  return (
    <section
      ref={sectionRef}
      id="hero-cabinet"
      className="relative"
      style={{ height: "400vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

        {!ready && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${POSTER_SRC})` }}
          />
        )}

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, hsl(224 60% 5% / 0.60) 0%, hsl(224 60% 5% / 0.10) 25%, hsl(224 60% 5% / 0.10) 65%, hsl(224 60% 5% / 0.80) 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 55% 70% at 20% 55%, hsl(224 60% 5% / 0.65) 0%, hsl(224 60% 5% / 0.30) 45%, transparent 75%)",
          }}
        />

        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="relative z-10 max-w-6xl mx-auto px-6 pt-44 pb-32 w-full will-change-transform"
        >
          <div className="max-w-3xl">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark mb-8 opacity-0"
              style={{
                animation: "fade-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s forwards",
                backgroundColor: "hsl(224 60% 5% / 0.4)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <p className="text-[11px] tracking-[0.2em] uppercase text-white/85 font-medium">
                Le Cabinet · KANTI · Biarritz
              </p>
            </div>

            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-heading font-light text-white leading-[1.05] mb-10 tracking-tight opacity-0"
              style={{
                animation: "fade-in-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.4s forwards",
                textShadow: "0 2px 24px hsl(224 60% 5% / 0.55), 0 1px 2px hsl(224 60% 5% / 0.4)",
              }}
            >
              Ancré à Biarritz.
              <br />
              <span className="italic font-normal text-white">
                Rigoureux pour chaque client.
              </span>
            </h1>

            <p
              className="text-base md:text-lg text-white/65 max-w-xl leading-relaxed mb-12 font-light opacity-0"
              style={{
                animation: "fade-in-up 1s cubic-bezier(0.22, 1, 0.36, 1) 0.7s forwards",
                textShadow: "0 1px 12px hsl(224 60% 5% / 0.6)",
              }}
            >
              Un cabinet de conseil en gestion de patrimoine implanté en Pays Basque, au service des familles, des entrepreneurs et des investisseurs de la Côte Atlantique.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 opacity-0"
              style={{ animation: "fade-in-up 1s cubic-bezier(0.22, 1, 0.36, 1) 1s forwards" }}
            >
              <Link
                to="/contact"
                data-magnetic
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-navy-deep text-sm font-medium tracking-wide rounded-full reflection-sweep hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5"
              >
                Prendre rendez-vous
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                to="/notre-methode"
                data-magnetic
                className="inline-flex items-center justify-center px-7 py-3.5 btn-glass text-white text-sm font-medium tracking-wide"
              >
                Notre méthode
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: titleOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-[1px] h-10 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
