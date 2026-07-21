import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CONTACT_URL = "/contact";
const SIMULATOR_URL = "/courtage-patrimonial/simulateur-financement";
const BILAN_URL = "/bilan-patrimonial-bordeaux";

export default function FinancingFinalCTA() {
  const reduce = useReducedMotion();

  return (
    <section
      className="section-padding"
      style={{ background: "hsl(var(--navy-deep))" }}
    >
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-60px" }}
        >
          <p className="text-[10px] tracking-[0.32em] uppercase text-white/35 mb-6 font-medium">
            Courtage &amp; financement
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-[52px] font-heading font-light text-white leading-[1.08] tracking-tight max-w-3xl mx-auto mb-8">
            Un financement se négocie. Une stratégie se construit.
          </h2>
          <p className="text-white/50 font-light text-base leading-relaxed max-w-xl mx-auto mb-12">
            Nous étudions votre projet de financement en cohérence avec
            l'ensemble de votre patrimoine · taux, assurance, garanties,
            trésorerie et stratégie à long terme.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0 }}
              viewport={{ once: true }}
            >
              <Link
                to={CONTACT_URL}
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full text-sm font-medium tracking-wide bg-white text-[hsl(224_60%_7%)] hover:shadow-2xl hover:shadow-white/10 transition-all duration-300 hover:-translate-y-0.5 group"
              >
                Étudier mon financement
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                to={SIMULATOR_URL}
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full text-sm font-medium tracking-wide border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all duration-300 hover:-translate-y-0.5"
              >
                Accéder au simulateur
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link
              to={BILAN_URL}
              className="inline-flex items-center gap-2 text-sm text-white/35 hover:text-white/65 transition-colors duration-200"
            >
              Réaliser un bilan patrimonial
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          <div className="mt-14 flex flex-wrap justify-center gap-x-8 gap-y-3 text-[11px] tracking-[0.18em] uppercase text-white/25">
            <span className="inline-flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-white/25" />
              Premier échange gratuit
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-white/25" />
              Indépendant
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-white/25" />
              Confidentiel
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
