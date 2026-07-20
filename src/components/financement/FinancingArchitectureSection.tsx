import { motion, useReducedMotion } from "framer-motion";

const NODES = [
  "Projet",
  "Apport",
  "Revenus",
  "Charges",
  "Durée",
  "Taux",
  "Assurance",
  "Garanties",
];

export default function FinancingArchitectureSection() {
  const reduce = useReducedMotion();

  return (
    <section
      className="section-padding"
      style={{ background: "hsl(220 30% 97%)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-60px" }}
        >
          <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/45 mb-4 font-medium">
            01 · Le financement comme architecture
          </p>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-[1.1] tracking-tight max-w-2xl mx-auto mb-5">
            Un financement bien construit repose sur plusieurs équilibres.
          </h2>
          <p className="text-foreground/55 font-light text-sm max-w-xl mx-auto">
            Chaque composante interagit avec les autres. Optimiser l'une sans
            considérer l'ensemble peut fragiliser la cohérence globale du projet.
          </p>
        </motion.div>

        {/* Node diagram */}
        <motion.div
          className="relative flex items-center justify-center mb-14"
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-60px" }}
        >
          <div className="relative w-full max-w-lg h-80 md:h-96">
            {/* Center node */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-2 border-foreground/15 bg-white shadow-sm flex items-center justify-center z-10">
                <span className="text-xs font-medium text-foreground/70 text-center leading-snug px-3">
                  Cohérence du<br />financement
                </span>
              </div>
            </div>

            {/* Satellite nodes */}
            {NODES.map((node, i) => {
              const angle = (i / NODES.length) * 2 * Math.PI - Math.PI / 2;
              const radiusX = 44; // percent from center
              const radiusY = 38;
              const x = 50 + radiusX * Math.cos(angle);
              const y = 50 + radiusY * Math.sin(angle);

              // Line from center to node
              const cx = 50;
              const cy = 50;
              const lineLen = Math.sqrt(
                Math.pow((x - cx) * 4, 2) + Math.pow((y - cy) * 3.84, 2)
              );

              return (
                <motion.div
                  key={node}
                  className="absolute"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.07,
                  }}
                  viewport={{ once: true }}
                >
                  {/* Connector line */}
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: "50%",
                      top: "50%",
                      width: `${lineLen}px`,
                      height: "1px",
                      background: "hsl(222 35% 12% / 0.10)",
                      transformOrigin: "0 0",
                      transform: `rotate(${Math.atan2(
                        (cy - y) * 3.84,
                        (cx - x) * 4
                      )}rad)`,
                    }}
                    aria-hidden
                  />
                  <div className="relative z-10 px-3 py-1.5 rounded-full border border-foreground/12 bg-white shadow-sm text-xs font-medium text-foreground/65 whitespace-nowrap">
                    {node}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Blockquote */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true, margin: "-40px" }}
        >
          <div className="rounded-2xl border border-foreground/8 bg-white p-8 md:p-10 text-center shadow-sm">
            <span
              aria-hidden
              className="block text-5xl font-heading text-foreground/15 mb-3 leading-none select-none"
            >
              "
            </span>
            <p className="text-lg md:text-xl font-heading font-light text-foreground/75 leading-relaxed italic">
              Une mensualité plus faible ne signifie pas nécessairement un
              financement plus avantageux.
            </p>
            <p className="text-[11px] text-foreground/35 tracking-wide uppercase mt-5">
              Courtage patrimonial KANTI
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
