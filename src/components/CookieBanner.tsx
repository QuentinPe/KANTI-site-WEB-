import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "kanti-cookies-consent-v1";

type Consent = "all" | "essential" | null;

function readConsent(): Consent {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "all" || v === "essential" ? v : null;
}

/**
 * Bandeau cookies RGPD — front-only, persiste le choix dans localStorage.
 * Aucun script tiers n'est chargé : ce composant est purement déclaratif.
 */
export default function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (!readConsent()) setOpen(true);
    }, 900);
    return () => window.clearTimeout(t);
  }, []);

  const choose = (value: Exclude<Consent, null>) => {
    window.localStorage.setItem(STORAGE_KEY, value);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Préférences cookies"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[80] w-[min(680px,calc(100vw-2rem))] animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="glass-strong rounded-2xl p-5 md:p-6 shadow-2xl border border-foreground/10">
        <div className="flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1">
            <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 font-medium mb-1.5">
              Confidentialité
            </p>
            <p className="text-sm text-foreground/75 font-light leading-relaxed">
              Nous utilisons des cookies de mesure d'audience pour améliorer
              votre expérience.{" "}
              <Link
                to="/politique-de-confidentialite"
                className="text-foreground hover:underline underline-offset-4"
              >
                En savoir plus
              </Link>
              .
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => choose("essential")}
              className="px-4 py-2.5 text-xs font-medium tracking-wide text-foreground/70 hover:text-foreground transition-colors rounded-full"
            >
              Refuser
            </button>
            <button
              type="button"
              onClick={() => choose("all")}
              className="px-5 py-2.5 text-xs font-medium tracking-wide btn-primary-glass reflection-sweep"
            >
              Accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}