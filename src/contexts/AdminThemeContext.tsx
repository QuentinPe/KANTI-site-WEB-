import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type AdminTheme = "dark" | "light";

const LS_KEY = "kanti-admin-theme";

// ── Light mode — CRM professionnel (défaut) ───────────────────────────────────
const LIGHT_VARS: Record<string, string> = {
  "--at-blue":               "214 55% 50%",          // #3978C6 bleu action
  "--at-gold":               "38 62% 48%",
  "--at-sage":               "158 48% 38%",
  "--at-mauve":              "270 38% 52%",
  "--at-coral":              "5 58% 50%",
  "--at-teal":               "180 45% 38%",
  "--at-primary":            "hsl(220 60% 10%)",     // texte principal, presque navy
  "--at-secondary":          "hsl(220 20% 42%)",
  "--at-muted":              "hsl(220 15% 62%)",
  "--at-heading":            "hsl(220 60% 8%)",
  "--at-label":              "hsl(220 25% 35%)",
  "--at-inner-bg":           "hsl(216 35% 96%)",     // fond intérieur teinté
  "--at-inner-border":       "hsl(216 18% 89%)",
  "--at-glass-bg":           "hsl(0 0% 100%)",       // carte blanche
  "--at-glass-border":       "hsl(216 18% 91%)",
  "--at-glass-shadow":       "0 1px 3px hsl(220 60% 8% / 0.06), 0 4px 12px hsl(220 60% 8% / 0.04)",
  "--at-glass-hover-shadow": "0 2px 8px hsl(220 60% 8% / 0.10), 0 8px 24px hsl(220 60% 8% / 0.06)",
  "--at-blur":               "none",
  "--at-input-bg":           "hsl(0 0% 100%)",
  "--at-input-border":       "hsl(216 18% 84%)",
  "--at-input-focus-bg":     "hsl(0 0% 100%)",
  "--at-input-focus-border": "hsl(214 55% 50%)",
  "--at-main-bg":            "hsl(216 30% 97%)",     // fond page #F7F9FC
};

// ── Dark mode — glassmorphisme (conservé) ─────────────────────────────────────
const DARK_VARS: Record<string, string> = {
  "--at-blue":               "215 42% 65%",
  "--at-gold":               "40 50% 62%",
  "--at-sage":               "158 32% 56%",
  "--at-mauve":              "270 26% 66%",
  "--at-coral":              "5 45% 56%",
  "--at-teal":               "180 32% 54%",
  "--at-primary":            "rgba(255,255,255,0.95)",
  "--at-secondary":          "rgba(255,255,255,0.52)",
  "--at-muted":              "rgba(255,255,255,0.32)",
  "--at-heading":            "rgba(255,255,255,0.86)",
  "--at-label":              "rgba(255,255,255,0.62)",
  "--at-inner-bg":           "rgba(255,255,255,0.06)",
  "--at-inner-border":       "rgba(255,255,255,0.09)",
  "--at-glass-bg":           "rgba(255,255,255,0.09)",
  "--at-glass-border":       "rgba(255,255,255,0.14)",
  "--at-glass-shadow":       "inset 0 -1px 0 rgba(0,0,0,0.10), 0 20px 56px rgba(0,0,0,0.28)",
  "--at-glass-hover-shadow": "inset 0 -1px 0 rgba(0,0,0,0.12), 0 28px 72px rgba(0,0,0,0.40)",
  "--at-blur":               "blur(48px) saturate(200%)",
  "--at-input-bg":           "rgba(255,255,255,0.07)",
  "--at-input-border":       "rgba(255,255,255,0.12)",
  "--at-input-focus-bg":     "rgba(255,255,255,0.10)",
  "--at-input-focus-border": "rgba(255,255,255,0.28)",
  "--at-main-bg":            "linear-gradient(160deg, rgba(11,14,28,0.82) 0%, rgba(8,11,22,0.88) 100%)",
};

interface AdminThemeCtx {
  theme: AdminTheme;
  toggleTheme: () => void;
}

const Ctx = createContext<AdminThemeCtx>({ theme: "light", toggleTheme: () => {} });

export function AdminThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<AdminTheme>(() => {
    try { return (localStorage.getItem(LS_KEY) as AdminTheme) || "light"; }
    catch { return "light"; }
  });

  useEffect(() => {
    const vars = theme === "light" ? LIGHT_VARS : DARK_VARS;
    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    localStorage.setItem(LS_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === "light" ? "dark" : "light");

  return <Ctx.Provider value={{ theme, toggleTheme }}>{children}</Ctx.Provider>;
}

export const useAdminTheme = () => useContext(Ctx);
