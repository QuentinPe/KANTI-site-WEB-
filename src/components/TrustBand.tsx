export default function TrustBand() {
  return (
    <section className="py-12 relative">
      <div className="max-w-5xl mx-auto px-6">
        <div className="glass-float rounded-full px-8 py-5">
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-[12px] text-foreground/60 font-light">
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[hsl(var(--electric))]" />
              KANTI — ORIAS n° 00 000 000
            </span>
            <span className="hidden sm:inline text-foreground/15">·</span>
            <span>Membre CNCGP</span>
            <span className="hidden sm:inline text-foreground/15">·</span>
            <span>Supervision AMF / ACPR</span>
            <span className="hidden sm:inline text-foreground/15">·</span>
            <span>RC Pro & Garantie financière</span>
          </div>
        </div>
      </div>
    </section>
  );
}
