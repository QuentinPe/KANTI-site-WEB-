import { ReactNode } from "react";

interface SimulatorShellProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/**
 * Editorial shell for expertise simulators.
 * Magazine-like header with hairlines, numbered eyebrow,
 * generous typography. No heavy card — sits inline like a feature spread.
 */
export default function SimulatorShell({ eyebrow = "Simulateur", title, subtitle, children }: SimulatorShellProps) {
  return (
    <div className="relative w-full">
      {/* Subtle ambient glow — restrained */}
      <div aria-hidden className="pointer-events-none absolute -top-32 right-0 w-[40rem] h-[40rem] rounded-full bg-[hsl(var(--accent)/0.06)] blur-[120px]" />

      {/* Editorial header: number, eyebrow, oversized title */}
      <div className="relative grid md:grid-cols-12 gap-6 md:gap-10 mb-12 md:mb-16">
        <div className="md:col-span-4 lg:col-span-3 flex md:flex-col items-baseline md:items-start gap-4 md:gap-3">
          <span className="font-heading text-5xl md:text-6xl font-extralight text-foreground/15 tabular-nums leading-none">
            01
          </span>
          <div className="h-px w-12 bg-foreground/20 hidden md:block" />
          <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/55 font-medium">
            {eyebrow}
          </p>
        </div>
        <div className="md:col-span-8 lg:col-span-9">
          <h3 className="font-heading text-3xl md:text-5xl lg:text-[3.25rem] font-extralight text-foreground tracking-[-0.02em] leading-[1.05] text-balance">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-5 text-foreground/55 text-base md:text-lg font-light leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Hairline divider */}
      <div aria-hidden className="separator-fine mb-10 md:mb-14" />

      {/* Working area — open, no heavy card */}
      <div className="relative">
        {children}
      </div>

      {/* Footer hairline */}
      <div aria-hidden className="separator-fine mt-12 md:mt-16" />
    </div>
  );
}
