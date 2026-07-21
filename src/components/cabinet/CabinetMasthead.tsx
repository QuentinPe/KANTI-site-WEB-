export default function CabinetMasthead() {
  return (
    <section
      aria-label="Bandeau éditorial du cabinet"
      className="relative bg-navy-deep pt-24 md:pt-28 pb-6 overflow-hidden"
    >
      {/* Ambient gold halo */}
      <div
        aria-hidden
        className="absolute -top-10 right-[10%] w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(var(--gold) / 0.10) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="hairline-gold mb-5" aria-hidden />
        <div className="grid grid-cols-12 items-baseline gap-6 text-ivory">
          <div className="col-span-6 md:col-span-3">
            <p className="font-heading text-2xl md:text-3xl tracking-[0.35em] leading-none text-ivory">
              KANTI
            </p>
          </div>
          <div className="hidden md:flex col-span-6 items-center justify-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" aria-hidden />
            <p className="text-[11px] tracking-[0.35em] uppercase text-ivory/70 font-medium">
              Numéro 01 &nbsp;·&nbsp; Le Cabinet &nbsp;·&nbsp; Bordeaux &nbsp;·&nbsp; MMXXVI
            </p>
            <span className="w-1.5 h-1.5 rounded-full bg-gold/60" aria-hidden />
          </div>
          <div className="col-span-6 md:col-span-3 text-right">
            <p className="font-heading italic text-[12px] tracking-[0.2em] text-ivory/55">
              Édition permanente
            </p>
          </div>
        </div>
        <div className="hairline-gold mt-5" aria-hidden />
      </div>
    </section>
  );
}