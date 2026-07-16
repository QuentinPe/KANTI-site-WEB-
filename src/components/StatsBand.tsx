import { useRef } from "react";
import { useCountUp } from "@/hooks/useCountUp";

interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

interface StatsBandProps {
  eyebrow?: string;
  headline: string;
  stats: Stat[];
  image: string;
}

function AnimatedStat({ stat }: { stat: Stat }) {
  const { value, ref } = useCountUp(stat.value, 1400);
  return (
    <div className="text-center" ref={ref as React.Ref<HTMLDivElement>}>
      <div
        className="font-heading font-light text-white leading-none mb-3 tracking-tight"
        style={{ fontSize: "clamp(40px, 7vw, 64px)" }}
      >
        {value}{stat.suffix ?? ""}
      </div>
      <div className="text-[11px] tracking-[0.22em] uppercase text-white/45 font-medium">
        {stat.label}
      </div>
    </div>
  );
}

export default function StatsBand({ eyebrow = "En chiffres", headline, stats, image }: StatsBandProps) {
  return (
    <section className="relative overflow-hidden" aria-label={eyebrow}>
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt=""
          aria-hidden
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, hsl(224 60% 7% / 0.92) 0%, hsl(224 55% 12% / 0.85) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="text-center mb-14">
          <p className="text-[10px] tracking-[0.32em] uppercase text-white/35 mb-5 font-medium">
            {eyebrow}
          </p>
          <p
            className="font-heading font-light text-white/80 leading-[1.25] tracking-tight text-balance"
            style={{ fontSize: "clamp(18px, 3vw, 26px)", maxWidth: "680px", margin: "0 auto" }}
          >
            {headline}
          </p>
        </div>

        <div
          className="grid gap-px"
          style={{
            gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
            background: "hsl(0 0% 100% / 0.08)",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="py-10 px-6"
              style={{ background: "hsl(224 60% 12% / 0.6)", backdropFilter: "blur(20px)" }}
            >
              <AnimatedStat stat={stat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
