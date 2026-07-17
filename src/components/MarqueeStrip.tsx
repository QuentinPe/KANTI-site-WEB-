import { motion } from "framer-motion";

const ITEMS_A = [
  "Indépendant",
  "Architecture ouverte",
  "Sans conflit d'intérêts",
  "ORIAS & CNCEF",
  "Confidentiel",
  "Bordeaux",
  "Sur-mesure",
  "Engagement total",
];

const ITEMS_B = [
  "Gestion patrimoniale",
  "Fiscalité",
  "Transmission",
  "Retraite",
  "Financement",
  "Épargne",
  "Immobilier",
  "Entreprise",
];

function MarqueeRow({
  items,
  reverse = false,
  speed = 38,
}: {
  items: string[];
  reverse?: boolean;
  speed?: number;
}) {
  const doubled = [...items, ...items];
  return (
    <div
      className="flex overflow-hidden"
      style={{
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
        maskImage:
          "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      <motion.div
        className="flex flex-shrink-0 items-center"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
        style={{ willChange: "transform" }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center flex-shrink-0">
            <span
              className="text-[9.5px] md:text-[10px] tracking-[0.42em] uppercase font-medium whitespace-nowrap px-5"
            >
              {item}
            </span>
            <span aria-hidden className="opacity-25 text-[8px] flex-shrink-0">
              ·
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function MarqueeStrip() {
  return (
    <div
      className="relative overflow-hidden py-0 select-none"
      style={{
        background: "hsl(var(--navy-deep))",
        color: "hsl(0 0% 100% / 0.32)",
        borderTop: "1px solid hsl(0 0% 100% / 0.05)",
        borderBottom: "1px solid hsl(0 0% 100% / 0.05)",
      }}
      aria-hidden
    >
      <div className="py-3">
        <MarqueeRow items={ITEMS_A} speed={40} />
      </div>
      <div
        className="py-3"
        style={{ borderTop: "1px solid hsl(0 0% 100% / 0.04)" }}
      >
        <MarqueeRow items={ITEMS_B} reverse speed={32} />
      </div>
    </div>
  );
}
