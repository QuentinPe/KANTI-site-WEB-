import { useEffect, useRef } from "react";
import { useScroll, useTransform, useMotionValueEvent, useReducedMotion } from "framer-motion";

type Props = {
  src: string;
  poster?: string;
  className?: string;
  /** 0 = video plays normally, 1 = full duration mapped to scroll. Default 1. */
  scrubAmount?: number;
  children?: React.ReactNode;
};

/**
 * Pinned scroll-driven video. The container is taller than the viewport;
 * inside, a sticky stage holds a <video> whose currentTime is driven by
 * scroll progress for a frame-by-frame "3D parallax" effect.
 */
export default function ScrollVideo({ src, poster, className = "", children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Normalize progress and map it to currentTime once metadata is loaded.
  const t = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(t, "change", (v) => {
    const video = videoRef.current;
    if (!video || !video.duration || isNaN(video.duration)) return;
    if (reduce) return;
    // Clamp & assign — assignment is cheap, browser decodes lazily.
    const target = Math.max(0, Math.min(video.duration - 0.05, v * video.duration));
    // Avoid jitter on tiny deltas
    if (Math.abs(video.currentTime - target) > 0.02) {
      try {
        video.currentTime = target;
      } catch {
        /* noop */
      }
    }
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Make sure the video is paused — we drive it manually
    video.pause();
    // For Safari: needs explicit load to allow seeking
    video.load();
  }, [src]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          playsInline
          preload="auto"
          // @ts-expect-error — non-standard but harmless attribute
          disablePictureInPicture
          className="absolute inset-0 w-full h-full object-cover"
        />
        {children}
      </div>
    </div>
  );
}