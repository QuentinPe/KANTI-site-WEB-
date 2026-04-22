import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, ArrowUpRight } from "lucide-react";

interface VirtualTourFABProps {
  href: string;
  label?: string;
}

/**
 * Floating Action Button for the virtual 360° tour.
 * Pulsing blue halo, animated icon, premium reveal on scroll.
 */
export default function VirtualTourFAB({ href, label = "Visite virtuelle 360°" }: VirtualTourFABProps) {
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
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50"
        >
          {/* Pulsing halo */}
          <motion.div
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(210 100% 60% / 0.55) 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.2, 0.6] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />

          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="group relative flex items-center gap-3 pl-4 pr-5 py-3.5 rounded-full bg-[hsl(220_45%_10%/0.92)] backdrop-blur-xl border border-white/15 text-white shadow-[0_20px_60px_-15px_hsl(210_100%_50%/0.55)] hover:border-[hsl(210_100%_60%/0.6)] transition-all duration-500 hover:shadow-[0_25px_70px_-10px_hsl(210_100%_50%/0.7)]"
          >
            {/* Spinning compass */}
            <motion.span
              className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[hsl(210_100%_60%/0.18)] border border-[hsl(210_100%_60%/0.4)]"
              animate={{ rotate: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            >
              <Compass className="w-4 h-4 text-[hsl(210_100%_75%)]" strokeWidth={1.6} />
            </motion.span>
            <span className="flex flex-col leading-tight">
              <span className="text-[9px] tracking-[0.32em] uppercase text-white/55 font-medium">
                360°
              </span>
              <span className="text-sm font-light tracking-wide">{label}</span>
            </span>
            <ArrowUpRight
              className="w-4 h-4 text-white/70 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.5}
            />

            {/* Reflection sweep on hover */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full overflow-hidden"
            >
              <span className="absolute inset-y-0 -left-1/2 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 transition-transform duration-700 group-hover:translate-x-[400%]" />
            </span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}