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
    <div className="group space-y-4 py-2">
      <div className="flex items-baseline justify-between gap-4">
        <label className="text-[10px] uppercase tracking-[0.28em] text-foreground/50 font-medium">
          {label}
        </label>
        <span className="text-xl md:text-2xl font-heading font-extralight text-foreground tracking-[-0.02em] tabular-nums">
          {value}
        </span>
      </div>

      {/* Hairline track */}
      <div className="relative h-px bg-foreground/12">
        {/* Filled portion */}
        <div
          className="absolute inset-y-0 left-0 bg-foreground transition-[width] duration-150"
          style={{ width: `${pct}%` }}
        />
        {/* Native input, invisible but interactive */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={current}
          onChange={(e) => onChange(+e.target.value)}
          className="absolute -inset-y-3 inset-x-0 w-full h-7 opacity-0 cursor-pointer"
          aria-label={label}
        />
        {/* Thumb, minimalist line */}
        <div
          aria-hidden
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-[left] duration-150"
          style={{ left: `${pct}%` }}
        >
          <div className="w-px h-4 bg-foreground" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-background border border-foreground transition-transform group-hover:scale-125" />
        </div>
        {/* Min / max ticks */}
        <div aria-hidden className="absolute -bottom-3 left-0 w-px h-1.5 bg-foreground/20" />
        <div aria-hidden className="absolute -bottom-3 right-0 w-px h-1.5 bg-foreground/20" />
      </div>
    </div>
  );
}
