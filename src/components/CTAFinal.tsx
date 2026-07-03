import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import SplitText from "./motion/SplitText";
import AmbientParticles from "./motion/AmbientParticles";

const POSTER_SRC = "/video/cta-mountain-poster.jpg";
const FRAME_COUNT = 121;
const pickFrameDir = () => {
  if (typeof window === "undefined") return "cta-frames-1280";
  const dpr = window.devicePixelRatio || 1;
  const effectiveWidth = window.innerWidth * dpr;
  return effectiveWidth >= 1600 ? "cta-frames-2560" : "cta-frames-1280";
};
const frameSrc = (dir: string, i: number) =>
  `/video/${dir}/frame-${String(i).padStart(3, "0")}.webp`;

export default function CTAFinal() {
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const [ready, setReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.55, 0.45, 0.85]);
  const contentOpacity = useTransform(scrollYProgress, [0.15, 0.4, 0.85, 1], [0, 1, 1, 0.6]);
  const contentY = useTransform(scrollYProgress, [0.15, 0.4], [40, 0]);

  // Preload frames as <img> elements + drive a canvas from scroll
  useEffect(() => {
    if (isMobile || reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    let firstReady = false;
    const dir = pickFrameDir();

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
          if (!firstReady && i === 0) {
            firstReady = true;
            setReady(true);
            drawFrame(0);
          }
          resolve();
        };
        img.onerror = () => resolve();
        img.src = frameSrc(dir, i + 1);
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

    return () => {
      cancelAnimationFrame(raf);
      unsub();
      window.removeEventListener("resize", onResize);
    };
  }, [isMobile, reduce, scrollYProgress]);

  return (
    <section
      id="contact"
      ref={ref}
      className="relative isolate text-white"
      style={{ height: isMobile || reduce ? undefined : "320vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        />
        {!ready && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${POSTER_SRC})` }}
          />
        )}
        {/* Dark gradient overlay */}
        <motion.div
          aria-hidden
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--navy-deep))]/70 via-[hsl(var(--navy-deep))]/45 to-[hsl(var(--navy-deep))]/95"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 30%, hsl(210 100% 60% / 0.20) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, hsl(38 35% 60% / 0.10) 0%, transparent 60%)",
          }}
        />
        <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
          <AmbientParticles count={14} color="rgba(180, 210, 255, 0.55)" speed={0.18} />
        </div>

        {/* Pinned content — sits over the sticky video and reveals as scroll progresses */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="absolute inset-0 flex items-end pointer-events-none"
        >
          <div className="relative w-full pointer-events-auto max-w-6xl mx-auto px-6 lg:px-12 pb-20 md:pb-28 grid lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-7">
              <p className="text-[11px] tracking-[0.35em] uppercase text-white/55 mb-6 font-medium">
                Premier rendez-vous · Bordeaux
              </p>
              <h2 className="font-heading font-light tracking-tight leading-[1] text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem] mb-10 max-w-3xl">
                <SplitText text="Parlons de votre" by="char" stagger={0.025} y={32} />
                <br />
                <SplitText
                  text="patrimoine."
                  by="char"
                  stagger={0.025}
                  delay={0.5}
                  itemClassName="italic text-white/85"
                />
              </h2>
              <p className="text-white/70 text-lg lg:text-xl font-light leading-relaxed max-w-xl mb-10">
                30 minutes en visio ou dans nos bureaux du Rue de la Négresse. Gratuit, confidentiel, sans engagement. Vous repartez avec un regard expert sur votre situation.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  data-magnetic
                  className="group relative inline-flex items-center gap-3 pl-8 pr-3 py-3 rounded-full bg-white text-[hsl(var(--navy-deep))] text-sm font-medium tracking-wide reflection-sweep shadow-2xl hover:-translate-y-0.5 transition-transform duration-300 before:content-[''] before:absolute before:inset-0 before:rounded-full before:ring-2 before:ring-white/40 before:animate-[pulse_4s_ease-in-out_infinite] before:pointer-events-none"
                >
                  <span>Prendre rendez-vous</span>
                  <span className="w-10 h-10 rounded-full bg-[hsl(var(--navy-deep))] text-white flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </Link>
                <Link
                  to="/bilan-patrimonial-bordeaux"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-white/30 text-white text-sm tracking-wide hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                >
                  Demander un bilan patrimonial
                </Link>
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="rounded-[2rem] p-7 lg:p-8 bg-white/[0.06] backdrop-blur-xl border border-white/15">
                <p className="text-[10px] tracking-[0.3em] uppercase text-white/55 mb-5 font-medium">
                  Coordonnées
                </p>
                <ul className="space-y-4 text-white/85 text-[15px] font-light">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--electric-soft))] mt-2 flex-shrink-0" />
                    <span>
                      9 Rue de la Négresse<br />
                      <span className="text-white/55 text-sm">64200 Biarritz</span>
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--electric-soft))] flex-shrink-0" />
                    <a href="tel:+33663324809" className="hover:text-[hsl(var(--electric-soft))] transition-colors">06 63 32 48 09</a>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--electric-soft))] flex-shrink-0" />
                    <a href="mailto:kanti@adnfamily.com" className="hover:text-[hsl(var(--electric-soft))] transition-colors">kanti@adnfamily.com</a>
                  </li>
                </ul>
                <div className="mt-7 pt-6 border-t border-white/10 text-white/55 text-[12px] font-light tracking-wide leading-relaxed">
                  Du lundi au vendredi · 9h–18h<br />
                  Réponse sous 24 h ouvrées · Confidentiel
                </div>
              </div>
            </aside>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
