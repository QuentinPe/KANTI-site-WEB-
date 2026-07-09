import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserRound, Monitor, Building2, ArrowRight } from "lucide-react";

/* ─── URLs à mettre à jour ─── */
const PORTAIL_WEB_URL = "#";   // → lien portail client en ligne
const ESPACE_CABINET_URL = "#"; // → lien espace cabinet KANTI

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ClientSpaceModal({ open, onClose }: Props) {
  /* Fermeture Échap */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        /* Backdrop + centrage */
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          style={{ background: "hsl(224 60% 8% / 0.42)", backdropFilter: "blur(10px)" }}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          {/* Carte liquid glass */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Espace client KANTI"
            className="w-full max-w-[480px] rounded-[22px] relative"
            style={{
              background: "hsl(0 0% 100% / 0.86)",
              backdropFilter: "blur(40px) saturate(170%)",
              border: "1px solid hsl(0 0% 100% / 0.95)",
              boxShadow:
                "0 32px 80px -20px hsl(224 60% 10% / 0.22), inset 0 1px 0 hsl(0 0% 100% / 0.96)",
            }}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.93, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 6 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Bouton fermer */}
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 hover:bg-[hsl(224_20%_12%/0.10)]"
              style={{ color: "hsl(224 20% 45%)" }}
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>

            <div className="p-7 md:p-8">
              {/* En-tête */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "hsl(224 60% 18%)" }}
                >
                  <UserRound className="w-[18px] h-[18px] text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.32em] uppercase font-medium" style={{ color: "hsl(224 20% 54%)" }}>
                    KANTI
                  </p>
                  <h2 className="font-heading text-[17px] font-light tracking-tight" style={{ color: "hsl(224 55% 12%)" }}>
                    Votre espace personnel
                  </h2>
                </div>
              </div>

              <p className="text-[13px] font-light leading-relaxed mb-6" style={{ color: "hsl(224 14% 44%)" }}>
                Choisissez votre mode d'accès à l'espace client KANTI.
              </p>

              {/* Deux options */}
              <div className="grid sm:grid-cols-2 gap-3">
                {/* Portail web */}
                <OptionCard
                  href={PORTAIL_WEB_URL}
                  icon={<Monitor className="w-4 h-4" strokeWidth={1.5} style={{ color: "hsl(224 52% 30%)" }} />}
                  title="Portail web"
                  description="Gérez votre profil, vos paramètres et consultez l'historique de vos échanges en ligne."
                />

                {/* Espace cabinet */}
                <OptionCard
                  href={ESPACE_CABINET_URL}
                  icon={<Building2 className="w-4 h-4" strokeWidth={1.5} style={{ color: "hsl(224 52% 30%)" }} />}
                  title="Espace cabinet"
                  description="Accédez à vos documents, rapports d'audit et lettres de recommandations archivés par KANTI."
                />
              </div>

              {/* Pied */}
              <p className="text-center text-[11px] font-light mt-6" style={{ color: "hsl(224 12% 60%)" }}>
                Problème de connexion ?{" "}
                <a
                  href="mailto:kanti@adnfamily.com"
                  className="underline decoration-dotted underline-offset-2 transition-opacity hover:opacity-70"
                >
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

/* ─── Carte option ─── */
function OptionCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <a
      href={href}
      target={href !== "#" ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="group flex flex-col p-5 rounded-[16px] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
      style={{
        background: "hsl(224 30% 12% / 0.03)",
        border: "1px solid hsl(224 20% 12% / 0.09)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "hsl(224 60% 18% / 0.05)";
        el.style.borderColor = "hsl(224 60% 18% / 0.22)";
        el.style.boxShadow = "0 8px 24px -8px hsl(224 60% 12% / 0.12)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "hsl(224 30% 12% / 0.03)";
        el.style.borderColor = "hsl(224 20% 12% / 0.09)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Icône */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center mb-4"
        style={{ background: "hsl(224 60% 18% / 0.08)" }}
      >
        {icon}
      </div>

      {/* Texte */}
      <h3 className="font-heading text-[15px] font-light mb-2 tracking-tight" style={{ color: "hsl(224 55% 12%)" }}>
        {title}
      </h3>
      <p className="text-[12px] font-light leading-relaxed flex-1 mb-4" style={{ color: "hsl(224 12% 48%)" }}>
        {description}
      </p>

      {/* CTA */}
      <span
        className="inline-flex items-center gap-1.5 text-[12px] font-medium"
        style={{ color: "hsl(224 50% 30%)" }}
      >
        Accéder
        <ArrowRight
          className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
          strokeWidth={1.5}
        />
      </span>
    </a>
  );
}
