import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Discreet bottom CTA bar that appears after the user scrolls past
 * the hero, hides on scroll-down and reveals on scroll-up.
 */
export default function MobileStickyCTA() {
  const [visible, setVisible] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const past = y > window.innerHeight * 0.6;
      const goingUp = y < lastY.current;
      const nearBottom =
        window.innerHeight + y >= document.body.scrollHeight - 240;
      // Hide near the very bottom (CTA section already on screen)
      if (nearBottom) {
        setVisible(false);
      } else if (past && (goingUp || y - lastY.current < 4)) {
        setVisible(true);
      } else if (!past) {
        setVisible(false);
      } else if (y - lastY.current > 8) {
        setVisible(false);
      }
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="md:hidden fixed inset-x-0 bottom-0 z-40 px-4"
          style={{ paddingBottom: "max(env(safe-area-inset-bottom), 12px)" }}
        >
          <div className="flex items-center gap-2 rounded-full bg-[hsl(224_60%_7%/0.92)] backdrop-blur-xl ring-1 ring-white/10 p-1.5 shadow-[0_18px_40px_-12px_hsl(0_0%_0%/0.35)]">
            <Link
              to="/contact"
              className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-full bg-white text-[hsl(var(--navy-deep))] text-[14px] font-medium tracking-wide"
            >
              Prendre rendez-vous
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.6}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
            <a
              href="tel:+33556000000"
              aria-label="Appeler le cabinet"
              className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white ring-1 ring-white/15"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.7}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102A1.125 1.125 0 005.872 2.25H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                />
              </svg>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}