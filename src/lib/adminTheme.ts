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

// ── Card surface — white card with subtle shadow (light mode default) ──────────
export const CARD: CSSProperties = {
  background: "var(--at-glass-bg)",
  border: "1px solid var(--at-glass-border)",
  boxShadow: "var(--at-glass-shadow)",
  borderRadius: "1rem",
};

export const CARD_HOVER: CSSProperties = {
  ...CARD,
  boxShadow: "var(--at-glass-hover-shadow)",
};

// ── Glass surface (alias to CARD — kept for back-compat) ──────────────────────
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

// Inner surface nested inside a card
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
  borderRadius: "0.5rem",
  padding: "0.5625rem 0.875rem",
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
    background: up ? "hsl(142 55% 36% / 0.12)" : "hsl(5 58% 50% / 0.12)",
    color: up ? "hsl(142 55% 34%)" : "hsl(5 58% 46%)",
    border: up ? "1px solid hsl(142 55% 36% / 0.20)" : "1px solid hsl(5 58% 50% / 0.20)",
    borderRadius: "9999px",
    padding: "0.15rem 0.55rem",
    fontSize: "0.72rem",
    fontWeight: 500,
  };
}

export function statusChipStyle(active: boolean): CSSProperties {
  return {
    background: active ? "hsl(142 55% 36% / 0.12)" : "var(--at-inner-bg)",
    color: active ? "hsl(142 55% 30%)" : "var(--at-secondary)",
    border: active ? "1px solid hsl(142 55% 36% / 0.20)" : "1px solid var(--at-inner-border)",
    borderRadius: "9999px",
    padding: "0.15rem 0.55rem",
    fontSize: "0.65rem",
    fontWeight: 500,
  };
}

// ── Semantic color helpers ─────────────────────────────────────────────────────
export const SEMANTIC = {
  success: { bg: "hsl(142 55% 36% / 0.10)", text: "hsl(142 55% 28%)", border: "hsl(142 55% 36% / 0.20)" },
  warning: { bg: "hsl(38 85% 48% / 0.10)", text: "hsl(38 72% 32%)", border: "hsl(38 85% 48% / 0.20)" },
  error:   { bg: "hsl(5 58% 50% / 0.10)", text: "hsl(5 58% 42%)", border: "hsl(5 58% 50% / 0.20)" },
  info:    { bg: "hsl(214 55% 50% / 0.10)", text: "hsl(214 55% 38%)", border: "hsl(214 55% 50% / 0.20)" },
};
