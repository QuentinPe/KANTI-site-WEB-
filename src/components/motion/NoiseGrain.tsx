type Props = {
  opacity?: number;
  className?: string;
  blendMode?: React.CSSProperties["mixBlendMode"];
};

/**
 * SVG turbulence grain overlay. Pure CSS/SVG, no JS. Position with
 * absolute inset-0 inside a relative parent.
 */
export default function NoiseGrain({
  opacity = 0.06,
  className = "",
  blendMode = "overlay",
}: Props) {
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'>
      <filter id='n'>
        <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>
        <feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/>
      </filter>
      <rect width='100%' height='100%' filter='url(#n)'/>
    </svg>`.trim();
  const url = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage: url,
        opacity,
        mixBlendMode: blendMode,
      }}
    />
  );
}