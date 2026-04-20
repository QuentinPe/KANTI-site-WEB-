import { ReactNode } from "react";

interface GlassSliderProps {
  label: string;
  value: ReactNode;
  min: number;
  max: number;
  step?: number;
  current: number;
  onChange: (v: number) => void;
}

export default function GlassSlider({ label, value, min, max, step = 1, current, onChange }: GlassSliderProps) {
  const pct = ((current - min) / (max - min)) * 100;
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <label className="text-[10px] uppercase tracking-[0.2em] text-foreground/55 font-medium">
          {label}
        </label>
        <span className="text-base md:text-lg font-heading font-light text-foreground tracking-tight">
          {value}
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-foreground/[0.06] backdrop-blur-sm overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--accent)/0.6)] transition-[width] duration-150"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={current}
          onChange={(e) => onChange(+e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          aria-hidden
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-[0_2px_10px_hsl(var(--accent)/0.45)] ring-1 ring-foreground/10 pointer-events-none transition-[left] duration-150"
          style={{ left: `${pct}%` }}
        />
      </div>
    </div>
  );
}
