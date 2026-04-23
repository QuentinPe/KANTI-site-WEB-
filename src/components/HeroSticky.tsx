import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import Hero from "./Hero";

const VIDEO_SRC = "/video/hero-office-dolly.mp4";
const POSTER_SRC = "/video/hero-office-poster.jpg";

export default function HeroSticky() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const [ready, setReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Title fades out as we approach the end of the traveling
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7, 0.95], [1, 0.85, 0]);
  const titleY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -60]);
  const videoBlur = useTransform(scrollYProgress, [0.85, 1], [0, 6]);
  const videoFilter = useTransform(videoBlur, (b) => `blur(${b}px)`);

  // Drive video.currentTime from scroll progress
  useEffect(() => {
    if (isMobile || reduce) return;
    const video = videoRef.current;
    if (!video) return;

    let raf = 0;
    let targetTime = 0;

    const tick = () => {
      if (video.duration && Number.isFinite(video.duration)) {
        const current = video.currentTime;
        const delta = targetTime - current;
        // Smooth lerp toward target for fluidity
        if (Math.abs(delta) > 0.01) {
          video.currentTime = current + delta * 0.25;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    const unsub = scrollYProgress.on("change", (p) => {
      if (!video.duration || !Number.isFinite(video.duration)) return;
      targetTime = Math.max(0, Math.min(video.duration - 0.05, p * video.duration));
    });

    const onReady = () => {
      setReady(true);
      video.pause();
      raf = requestAnimationFrame(tick);
    };

    if (video.readyState >= 3) {
      onReady();
    } else {
      video.addEventListener("canplaythrough", onReady, { once: true });
    }

    return () => {
      cancelAnimationFrame(raf);
      unsub();
      video.removeEventListener("canplaythrough", onReady);
    };
  }, [isMobile, reduce, scrollYProgress]);

  // Cursor-tracked reflection (preserved from Hero)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!orbRef.current) return;
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      orbRef.current.style.background = `radial-gradient(circle at ${x}% ${y}%, hsl(210 100% 60% / 0.18) 0%, transparent 50%)`;
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  // Fallback: mobile or reduced-motion → original static Hero
  if (isMobile || reduce) {
    return <Hero />;
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative"
      style={{ height: "200vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        {/* Scroll-driven video */}
        <motion.video
          ref={videoRef}
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
          style={{ filter: videoFilter }}
          aria-hidden="true"
        />

        {/* Poster fallback while video buffers */}
        {!ready && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${POSTER_SRC})` }}
          />
        )}

        {/* Dark editorial overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, hsl(224 60% 7% / 0.78) 0%, hsl(222 50% 11% / 0.65) 50%, hsl(220 40% 18% / 0.85) 100%)",
          }}
        />

        {/* Cursor-tracked light */}
        <div ref={orbRef} className="absolute inset-0 pointer-events-none transition-all duration-700" />

        {/* Subtle blurred veil behind the editorial copy for legibility */}
        <div
          className="absolute inset-y-0 left-0 w-full md:w-2/3 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, hsl(224 60% 7% / 0.55) 0%, hsl(224 60% 7% / 0.35) 55%, transparent 100%)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            maskImage:
              "linear-gradient(90deg, black 0%, black 55%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(90deg, black 0%, black 55%, transparent 100%)",
          }}
        />

        {/* Floating ambient orbs */}
        <div
          className="absolute top-[15%] right-[10%] w-[400px] h-[400px] rounded-full pointer-events-none float-soft"
          style={{
            background: "radial-gradient(circle, hsl(210 100% 60% / 0.22) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute bottom-[20%] left-[5%] w-[300px] h-[300px] rounded-full pointer-events-none float-slow"
          style={{
            background: "radial-gradient(circle, hsl(38 35% 60% / 0.18) 0%, transparent 70%)",
            filter: "blur(50px)",
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
                KANTI · Cabinet indépendant · Bordeaux
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
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/50">Entrez dans le cabinet</span>
            <div className="w-[1px] h-10 bg-gradient-to-b from-white/50 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}