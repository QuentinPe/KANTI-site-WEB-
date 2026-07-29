import type { CSSProperties } from "react";

// ── Refined accent palette ─────────────────────────────────────────────────────
// Lower saturation, higher lightness = editorial / luxury feel on dark glass
export const C_BLUE  = "hsl(215 42% 65%)";   // periwinkle slate
export const C_GOLD  = "hsl(40 50% 62%)";    // champagne gold
export const C_SAGE  = "hsl(158 32% 56%)";   // sage
export const C_MAUVE = "hsl(270 26% 66%)";   // dusty mauve
export const C_CORAL = "hsl(5 45% 56%)";     // terracotta (alert/negative)
export const C_TEAL  = "hsl(180 32% 54%)";   // teal (neutral positive)

// ── Glass surface ──────────────────────────────────────────────────────────────
// No left-edge catchlight (inset 1px 0 0) — causes a visual vertical streak
export const GLASS: CSSProperties = {
  background: "rgba(255, 255, 255, 0.09)",
  backdropFilter: "blur(48px) saturate(200%)",
  WebkitBackdropFilter: "blur(48px) saturate(200%)",
  border: "1px solid rgba(255, 255, 255, 0.14)",
  boxShadow: [
    "inset 0 1.5px 0 rgba(255,255,255,0.24)",
    "inset 0 -1px 0 rgba(0,0,0,0.10)",
    "0 20px 56px rgba(0,0,0,0.28)",
  ].join(", "),
};

export const GLASS_HOVER: CSSProperties = {
  ...GLASS,
  boxShadow: [
    "inset 0 1.5px 0 rgba(255,255,255,0.32)",
    "inset 0 -1px 0 rgba(0,0,0,0.12)",
    "0 28px 72px rgba(0,0,0,0.40)",
  ].join(", "),
};

export const GLASS_HOVER_SHADOW = GLASS_HOVER.boxShadow as string;

// Inner surface nested inside a glass card
export const INNER_BG     = "rgba(255,255,255,0.06)";
export const INNER_BORDER = "rgba(255,255,255,0.09)";

// ── Text hierarchy ─────────────────────────────────────────────────────────────
export const T_PRIMARY   = "rgba(255,255,255,0.95)";
export const T_SECONDARY = "rgba(255,255,255,0.52)";
export const T_MUTED     = "rgba(255,255,255,0.32)";
export const T_HEADING   = "rgba(255,255,255,0.86)";
export const T_LABEL     = "rgba(255,255,255,0.62)";

// ── Input style (for forms) ────────────────────────────────────────────────────
export const INPUT_STYLE: CSSProperties = {
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: T_PRIMARY,
  borderRadius: "0.75rem",
  padding: "0.625rem 0.875rem",
  outline: "none",
  width: "100%",
};

export const INPUT_FOCUS_STYLE: CSSProperties = {
  ...INPUT_STYLE,
  border: "1px solid rgba(255,255,255,0.28)",
  background: "rgba(255,255,255,0.10)",
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
    background: active ? "rgba(52,190,90,0.16)" : "rgba(255,255,255,0.08)",
    color: active ? "rgb(62,200,100)" : T_SECONDARY,
    border: active ? "1px solid rgba(52,190,90,0.22)" : `1px solid ${INNER_BORDER}`,
    borderRadius: "9999px",
    padding: "0.15rem 0.55rem",
    fontSize: "0.65rem",
    fontWeight: 500,
  };
}
