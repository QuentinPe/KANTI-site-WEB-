import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  direction?: "left" | "right" | "up" | "down" | "diagonal";
  duration?: number;
  delay?: number;
  className?: string;
  once?: boolean;
};

/**
 * Cinematic clip-path wipe reveal. Useful for images and headlines.
 */
export default function MaskReveal({
  children,
  direction = "up",
  duration = 1.1,
  delay = 0,
  className = "",
  once = true,
}: Props) {
  const reduce = useReducedMotion();

  const initial = {
    left: "inset(0 100% 0 0)",
    right: "inset(0 0 0 100%)",
    up: "inset(100% 0 0 0)",
    down: "inset(0 0 100% 0)",
    diagonal: "polygon(0 0, 0 0, 0 0, 0 0)",
  }[direction];

  const animate =
    direction === "diagonal"
      ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
      : "inset(0 0 0 0)";

  return (
    <motion.div
      className={className}
      initial={{ clipPath: reduce ? animate : initial }}
      whileInView={{ clipPath: animate }}
      viewport={{ once, margin: "-10%" }}
      transition={{ duration: reduce ? 0 : duration, delay, ease: [0.77, 0, 0.18, 1] }}
    >
      {children}
    </motion.div>
  );
}