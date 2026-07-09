import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VirtualTourFABProps {
  href: string;
  label?: string;
}

export default function VirtualTourFAB({ href, label = "Visite virtuelle" }: VirtualTourFABProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.92 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="fixed bottom-7 right-7 md:bottom-10 md:right-10 z-50"
        >
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="group relative flex items-center gap-3 pl-3.5 pr-5 py-3 rounded-full overflow-hidden"
            style={{
              background: "hsl(224 60% 7% / 0.75)",
              backdropFilter: "blur(28px) saturate(200%)",
              WebkitBackdropFilter: "blur(28px) saturate(200%)",
              border: "1px solid hsl(0 0% 100% / 0.14)",
              borderTopColor: "hsl(0 0% 100% / 0.28)",
              boxShadow:
                "inset 0 1.5px 0 0 hsl(0 0% 100% / 0.18), 0 16px 48px -12px hsl(224 60% 7% / 0.55), 0 4px 16px -4px hsl(0 0% 0% / 0.25)",
            }}
          >
            {/* 360° badge */}
            <span
              className="relative flex items-center justify-center w-8 h-8 rounded-full text-white flex-shrink-0"
              style={{
                background: "hsl(218 45% 38% / 0.45)",
                border: "1px solid hsl(218 45% 60% / 0.35)",
                boxShadow: "inset 0 1px 0 hsl(0 0% 100% / 0.18)",
              }}
            >
              <span className="text-[10px] font-semibold tracking-tight text-white/90">360°</span>
            </span>

            {/* Label */}
            <span className="flex flex-col leading-tight">
              <span className="text-[10px] tracking-[0.28em] uppercase text-white/45 font-medium">
                Cabinet KANTI
              </span>
              <span className="text-[13px] font-light text-white/90 tracking-wide">{label}</span>
            </span>

            {/* Arrow */}
            <svg
              className="w-3.5 h-3.5 text-white/55 ml-0.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15M19.5 4.5H8.25M19.5 4.5v11.25" />
            </svg>

            {/* Specular top-edge highlight */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                background: "linear-gradient(180deg, hsl(0 0% 100% / 0.10) 0%, transparent 40%)",
              }}
            />

            {/* Hover shimmer sweep */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full overflow-hidden"
            >
              <span className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/12 to-transparent skew-x-12 transition-transform duration-700 group-hover:translate-x-[380%]" />
            </span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
