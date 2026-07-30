import type { CSSProperties } from "react";

// ── Accent colors — CSS vars; values injected by AdminThemeContext ─────────────
export const C_BLUE  = "hsl(var(--at-blue))";
export const C_GOLD  = "hsl(var(--at-gold))";
export const C_SAGE  = "hsl(var(--at-sage))";
export const C_MAUVE = "hsl(var(--at-mauve))";
export const C_CORAL = "hsl(var(--at-coral))";
export const C_TEAL  = "hsl(var(--at-teal))";

// cA(C_BLUE, 0.18) → "hsl(var(--at-blue) / 0.18)"
export function cA(c: string, a: number): string {
  return c.replace(/\)$/, ` / ${a})`);
}

// ── Glass surface ──────────────────────────────────────────────────────────────
export const GLASS: CSSProperties = {
  background: "var(--at-glass-bg)",
  backdropFilter: "var(--at-blur)",
  WebkitBackdropFilter: "var(--at-blur)",
  border: "1px solid var(--at-glass-border)",
  boxShadow: "var(--at-glass-shadow)",
};

export const GLASS_HOVER: CSSProperties = {
  ...GLASS,
  boxShadow: "var(--at-glass-hover-shadow)",
};

export const GLASS_HOVER_SHADOW = "var(--at-glass-hover-shadow)";

// Inner surface nested inside a glass card
export const INNER_BG     = "var(--at-inner-bg)";
export const INNER_BORDER = "var(--at-inner-border)";

// ── Text hierarchy ─────────────────────────────────────────────────────────────
export const T_PRIMARY   = "var(--at-primary)";
export const T_SECONDARY = "var(--at-secondary)";
export const T_MUTED     = "var(--at-muted)";
export const T_HEADING   = "var(--at-heading)";
export const T_LABEL     = "var(--at-label)";

// ── Input style (for forms) ────────────────────────────────────────────────────
export const INPUT_STYLE: CSSProperties = {
  background: "var(--at-input-bg)",
  border: "1px solid var(--at-input-border)",
  color: "var(--at-primary)",
  borderRadius: "0.75rem",
  padding: "0.625rem 0.875rem",
  outline: "none",
  width: "100%",
};

export const INPUT_FOCUS_STYLE: CSSProperties = {
  ...INPUT_STYLE,
  background: "var(--at-input-focus-bg)",
  border: "1px solid var(--at-input-focus-border)",
};

// ── Badge helpers ──────────────────────────────────────────────────────────────
export function deltaBadgeStyle(up: boolean): CSSProperties {
  return {
    background: up ? "rgba(52,190,90,0.18)" : "rgba(200,80,65,0.18)",
    color: up ? "rgb(62,200,100)" : "rgb(210,90,78)",
    border: up ? "1px solid rgba(52,190,90,0.25)" : "1px solid rgba(200,80,65,0.25)",
  };
}

export function statusChipStyle(active: boolean): CSSProperties {
  return {
    background: active ? "rgba(52,190,90,0.16)" : "var(--at-inner-bg)",
    color: active ? "rgb(62,200,100)" : "var(--at-secondary)",
    border: active ? "1px solid rgba(52,190,90,0.22)" : "1px solid var(--at-inner-border)",
    borderRadius: "9999px",
    padding: "0.15rem 0.55rem",
    fontSize: "0.65rem",
    fontWeight: 500,
  };
}
