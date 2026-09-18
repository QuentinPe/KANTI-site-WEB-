import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users } from "lucide-react";
import logoDark from "@/assets/logo-kanti-dark.png.asset.json";
import { PartnerModal } from "./PartnerApporteurSection";

const SESSION_KEY = "kanti_apporteur_toast_dismissed";
const DELAY_MS = 5000;

export default function ApporteurToastPopup() {
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const t = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(SESSION_KEY, "1");
  };

  const openModal = () => {
    dismiss();
    setModalOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            role="dialog"
            aria-label="Devenir partenaire apporteur KANTI"
            className="fixed bottom-6 right-6 z-40 w-[320px] max-w-[calc(100vw-2rem)]"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: "white",
                border: "1px solid hsl(224 20% 12% / 0.10)",
                boxShadow: "0 20px 60px -16px hsl(224 60% 12% / 0.22), 0 4px 16px -6px hsl(224 60% 12% / 0.12)",
              }}
            >
              {/* Top bar navy */}
              <div
                className="px-5 pt-4 pb-3 flex items-center justify-between"
                style={{ background: "hsl(224 60% 10%)" }}
              >
                <img src={logoDark.url} alt="KANTI" className="h-5 w-auto brightness-0 invert" />
                <button
                  onClick={dismiss}
                  aria-label="Fermer"
                  className="p-1 rounded-full transition-colors hover:bg-white/10"
                  style={{ color: "hsl(0 0% 100% / 0.55)" }}
                >
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>

              {/* Body */}
              <div className="px-5 py-4">
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-3 text-[10px] font-medium tracking-[0.2em] uppercase"
                  style={{ background: "hsl(224 30% 12% / 0.06)", color: "hsl(224 40% 42%)" }}
                >
                  <Users className="w-3 h-3" strokeWidth={1.5} />
                  Apporteurs d'affaires
                </div>

                <p
                  className="font-heading text-[17px] font-light leading-snug tracking-tight mb-2"
                  style={{ color: "hsl(224 60% 10%)" }}
                >
                  Vous accompagnez des acquéreurs ?
                </p>
                <p
                  className="text-[13px] font-light leading-relaxed mb-4"
                  style={{ color: "hsl(224 15% 45%)" }}
                >
                  Agents immobiliers, notaires, experts-comptables — construisons une collaboration structurée.
                </p>

                <button
                  onClick={openModal}
                  className="w-full py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-300 hover:opacity-90"
                  style={{ background: "hsl(224 60% 10%)", color: "white" }}
                >
                  Devenir partenaire →
                </button>

                <p
                  className="text-center text-[11px] mt-2.5 font-light"
                  style={{ color: "hsl(224 15% 58%)" }}
                >
                  Réponse sous 24h · Cadre formalisé
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalOpen && <PartnerModal onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
