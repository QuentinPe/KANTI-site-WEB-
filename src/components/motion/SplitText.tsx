import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  text: string;
  as?: "span" | "div";
  by?: "word" | "char";
  className?: string;
  itemClassName?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  once?: boolean;
  y?: number;
  blur?: boolean;
  children?: ReactNode;
};

/**
 * Splits text into words or characters and reveals each with a staggered
 * blur→sharp + Y motion. Respects prefers-reduced-motion.
 */
export default function SplitText({
  text,
  as: Tag = "span",
  by = "word",
  className = "",
  itemClassName = "",
  delay = 0,
  stagger = 0.06,
  duration = 0.9,
  once = true,
  y = 24,
  blur = true,
}: Props) {
  const reduce = useReducedMotion();
  const tokens = by === "word" ? text.split(/(\s+)/) : Array.from(text);

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        delayChildren: delay,
        staggerChildren: reduce ? 0 : stagger,
      },
    },
  };

  const item: Variants = {
    hidden: {
      opacity: 0,
      y: reduce ? 0 : y,
      filter: blur && !reduce ? "blur(8px)" : "blur(0px)",
    },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-10%" }}
      style={{ display: "inline-block" }}
    >
      {tokens.map((tok, i) =>
        /^\s+$/.test(tok) ? (
          <span key={i}>{tok}</span>
        ) : (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.15em", marginBottom: "-0.15em" }}>
            <motion.span
              variants={item}
              className={itemClassName}
              style={{ display: "inline-block", willChange: "transform, filter, opacity" }}
            >
              {tok}
            </motion.span>
          </span>
        )
      )}
    </motion.span>
  );
}