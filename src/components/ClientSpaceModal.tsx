import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserRound, Monitor, Building2, ArrowUpRight } from "lucide-react";
import logoWhite from "@/assets/logo-kanti-white.png.asset.json";

const ESPACE_CABINET_URL = "https://app.wealthcome.fr/login"; // → Wealthcome

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ClientSpaceModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          style={{ backdropFilter: "blur(14px) saturate(160%)", background: "hsl(224 60% 6% / 0.60)" }}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.20 }}
        >
          {/* ── Carte liquid glass ── */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Espace client KANTI"
            className="w-full max-w-[460px] rounded-[24px] relative overflow-hidden"
            style={{
              background: "hsl(224 55% 10% / 0.82)",
              backdropFilter: "blur(56px) saturate(200%)",
              /* Specular top highlight */
              boxShadow: [
                "inset 0 1.5px 0 hsl(0 0% 100% / 0.20)",
                "inset 1px 0 0 hsl(0 0% 100% / 0.06)",
                "inset -1px 0 0 hsl(0 0% 100% / 0.06)",
                "inset 0 -1px 0 hsl(0 0% 100% / 0.04)",
                "0 40px 100px -20px hsl(0 0% 0% / 0.60)",
                "0 0 0 0.5px hsl(0 0% 100% / 0.10)",
              ].join(", "),
            }}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 6 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Grain texture subtile */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.025] pointer-events-none"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }}
            />

            {/* Bouton fermer */}
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
              style={{ background: "hsl(0 0% 100% / 0.08)", color: "hsl(0 0% 100% / 0.50)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(0 0% 100% / 0.16)"; (e.currentTarget as HTMLElement).style.color = "hsl(0 0% 100% / 0.90)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(0 0% 100% / 0.08)"; (e.currentTarget as HTMLElement).style.color = "hsl(0 0% 100% / 0.50)"; }}
            >
              <X className="w-3.5 h-3.5" strokeWidth={2} />
            </button>

            <div className="p-7">
              {/* En-tête */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "hsl(0 0% 100% / 0.12)", border: "1px solid hsl(0 0% 100% / 0.14)" }}>
                  <UserRound className="w-[18px] h-[18px]" strokeWidth={1.5} style={{ color: "hsl(0 0% 100% / 0.85)" }} />
                </div>
                <img
                  src={logoWhite.url}
                  alt="KANTI"
                  className="h-6 w-auto"
                  style={{ opacity: 0.88 }}
                />
              </div>

              {/* Séparateur */}
              <div className="mb-5" style={{ height: 1, background: "hsl(0 0% 100% / 0.08)" }} />

              {/* Deux cartes */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <PortailCard
                  icon={<Monitor className="w-4 h-4" strokeWidth={1.5} style={{ color: "hsl(0 0% 100% / 0.72)" }} />}
                  title="Portail web"
                  description="Consultez vos documents et échanges en ligne."
                  onClose={onClose}
                />
                <OptionCard
                  href={ESPACE_CABINET_URL}
                  icon={<Building2 className="w-4 h-4" strokeWidth={1.5} style={{ color: "hsl(0 0% 100% / 0.72)" }} />}
                  title="Espace cabinet"
                  description="Documents, rapports et suivi de votre dossier KANTI."
                />
              </div>

              {/* Pied */}
              <p className="text-center text-[11px] font-light" style={{ color: "hsl(0 0% 100% / 0.30)" }}>
                Problème de connexion ?{" "}
                <a href="mailto:kanti@adnfamily.com"
                  className="transition-opacity hover:opacity-80"
                  style={{ color: "hsl(0 0% 100% / 0.52)", textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: "3px" }}>
                  kanti@adnfamily.com
                </a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Carte portail web (Link interne) ── */
function PortailCard({ icon, title, description, onClose }: {
  icon: React.ReactNode; title: string; description: string; onClose: () => void;
}) {
  return (
    <Link
      to="/login"
      onClick={onClose}
      className="group flex flex-col p-4 rounded-[16px] transition-all duration-300 relative"
      style={{
        background: "hsl(0 0% 100% / 0.06)",
        border: "1px solid hsl(0 0% 100% / 0.10)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "hsl(0 0% 100% / 0.12)";
        el.style.borderColor = "hsl(0 0% 100% / 0.22)";
        el.style.transform = "translateY(-1px)";
        el.style.boxShadow = "0 8px 24px -8px hsl(0 0% 0% / 0.30)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "hsl(0 0% 100% / 0.06)";
        el.style.borderColor = "hsl(0 0% 100% / 0.10)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      <div className="w-8 h-8 rounded-full flex items-center justify-center mb-3"
        style={{ background: "hsl(0 0% 100% / 0.09)" }}>
        {icon}
      </div>
      <h3 className="text-[14px] font-medium mb-1.5 tracking-tight" style={{ color: "hsl(0 0% 100% / 0.88)" }}>
        {title}
      </h3>
      <p className="text-[12px] font-light leading-relaxed flex-1 mb-4" style={{ color: "hsl(0 0% 100% / 0.46)" }}>
        {description}
      </p>
      <span className="inline-flex items-center gap-1.5 text-[12px] font-medium transition-all duration-300 group-hover:gap-2"
        style={{ color: "hsl(0 0% 100% / 0.65)" }}>
        Se connecter
        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
      </span>
    </Link>
  );
}

/* ── Carte option externe ── */
function OptionCard({ href, icon, title, description }: {
  href: string; icon: React.ReactNode; title: string; description: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col p-4 rounded-[16px] transition-all duration-300 relative"
      style={{
        background: "hsl(0 0% 100% / 0.06)",
        border: "1px solid hsl(0 0% 100% / 0.10)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "hsl(0 0% 100% / 0.12)";
        el.style.borderColor = "hsl(0 0% 100% / 0.22)";
        el.style.transform = "translateY(-1px)";
        el.style.boxShadow = "0 8px 24px -8px hsl(0 0% 0% / 0.30)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "hsl(0 0% 100% / 0.06)";
        el.style.borderColor = "hsl(0 0% 100% / 0.10)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      <div className="w-8 h-8 rounded-full flex items-center justify-center mb-3"
        style={{ background: "hsl(0 0% 100% / 0.09)" }}>
        {icon}
      </div>
      <h3 className="text-[14px] font-medium mb-1.5 tracking-tight" style={{ color: "hsl(0 0% 100% / 0.88)" }}>
        {title}
      </h3>
      <p className="text-[12px] font-light leading-relaxed flex-1 mb-4" style={{ color: "hsl(0 0% 100% / 0.46)" }}>
        {description}
      </p>
      <span className="inline-flex items-center gap-1.5 text-[12px] font-medium transition-all duration-300 group-hover:gap-2"
        style={{ color: "hsl(0 0% 100% / 0.65)" }}>
        Accéder
        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
      </span>
    </a>
  );
}
