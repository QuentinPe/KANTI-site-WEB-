import { ReactNode } from "react";

interface SimulatorShellProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/**
 * Liquid-glass shell for expertise simulators.
 * Large, premium, with discreet KANTI watermark behind.
 */
export default function SimulatorShell({ eyebrow = "Simulateur", title, subtitle, children }: SimulatorShellProps) {
  return (
    <div className="relative w-full">
      {/* Ambient glass orbs */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[hsl(var(--accent)/0.15)] blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[hsl(var(--primary)/0.10)] blur-3xl" />

      <div className="relative glass-card rounded-[2rem] overflow-hidden">
        {/* KANTI watermark */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
        >
          <span
            className="font-heading font-light tracking-[0.25em] text-foreground/[0.035] whitespace-nowrap"
            style={{ fontSize: "clamp(8rem, 18vw, 18rem)", lineHeight: 1 }}
          >
            KANTI
          </span>
        </div>

        {/* Top hairline shimmer */}
        <div aria-hidden className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent" />

        <div className="relative z-10 p-8 md:p-12 lg:p-16">
          <div className="mb-8 md:mb-12 max-w-2xl">
            <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 mb-3 font-medium">
              {eyebrow}
            </p>
            <h3 className="font-heading text-2xl md:text-4xl font-light text-foreground tracking-tight leading-[1.15]">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-3 text-foreground/60 text-sm md:text-base font-light leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
