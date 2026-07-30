import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type AdminTheme = "dark" | "light";

const LS_KEY = "kanti-admin-theme";

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

const LIGHT_VARS: Record<string, string> = {
  "--at-blue":               "215 55% 38%",
  "--at-gold":               "38 62% 34%",
  "--at-sage":               "158 48% 30%",
  "--at-mauve":              "270 38% 46%",
  "--at-coral":              "5 58% 42%",
  "--at-teal":               "180 45% 32%",
  "--at-primary":            "hsl(220 40% 12%)",
  "--at-secondary":          "hsl(220 18% 40%)",
  "--at-muted":              "hsl(220 12% 58%)",
  "--at-heading":            "hsl(220 45% 10%)",
  "--at-label":              "hsl(220 22% 32%)",
  "--at-inner-bg":           "rgba(0,0,0,0.04)",
  "--at-inner-border":       "rgba(0,0,0,0.10)",
  "--at-glass-bg":           "rgba(255,255,255,0.84)",
  "--at-glass-border":       "rgba(0,0,0,0.10)",
  "--at-glass-shadow":       "0 2px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)",
  "--at-glass-hover-shadow": "0 4px 20px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.05)",
  "--at-blur":               "blur(20px) saturate(130%)",
  "--at-input-bg":           "rgba(0,0,0,0.04)",
  "--at-input-border":       "rgba(0,0,0,0.14)",
  "--at-input-focus-bg":     "rgba(0,0,0,0.07)",
  "--at-input-focus-border": "rgba(0,0,0,0.30)",
  "--at-main-bg":            "linear-gradient(160deg, rgba(245,248,255,0.93) 0%, rgba(238,244,255,0.95) 100%)",
};

interface AdminThemeCtx {
  theme: AdminTheme;
  toggleTheme: () => void;
}

const Ctx = createContext<AdminThemeCtx>({ theme: "dark", toggleTheme: () => {} });

export function AdminThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<AdminTheme>(() => {
    try { return (localStorage.getItem(LS_KEY) as AdminTheme) || "dark"; }
    catch { return "dark"; }
  });

  useEffect(() => {
    const vars = theme === "dark" ? DARK_VARS : LIGHT_VARS;
    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    localStorage.setItem(LS_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  return <Ctx.Provider value={{ theme, toggleTheme }}>{children}</Ctx.Provider>;
}

export const useAdminTheme = () => useContext(Ctx);
