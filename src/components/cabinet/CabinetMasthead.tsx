export default function CabinetMasthead() {
  return (
    <section
      aria-label="Masthead éditorial"
      className="paper-grain text-ink border-b border-ink/20"
    >
      <div className="max-w-6xl mx-auto px-6 pt-24 md:pt-28 pb-6">
        <div className="editorial-rule-solid mb-5" aria-hidden />
        <div className="grid grid-cols-12 items-baseline gap-6">
          <div className="col-span-6 md:col-span-3">
            <p className="font-editorial text-2xl md:text-3xl tracking-[0.35em] leading-none">
              KANTI
            </p>
          </div>
          <div className="hidden md:block col-span-6 text-center">
            <p className="font-editorial text-[11px] tracking-[0.35em] uppercase text-ink/70">
              Numéro 01 &nbsp;—&nbsp; Le Cabinet &nbsp;·&nbsp; Bordeaux &nbsp;·&nbsp; MMXXVI
            </p>
          </div>
          <div className="col-span-6 md:col-span-3 text-right">
            <p className="font-editorial italic text-[11px] md:text-[12px] tracking-[0.2em] text-ink/60">
              Édition permanente
            </p>
          </div>
        </div>
        <div className="editorial-rule mt-5" aria-hidden />
      </div>
    </section>
  );
}