export default function PromesseMobile() {
  return (
    <section
      id="promesse"
      className="md:hidden relative section-padding-mobile overflow-hidden text-white"
      style={{ background: "hsl(var(--navy-deep))" }}
    >
      <div className="max-w-md mx-auto">
        <div
          className="electric-line mb-4"
          style={{ background: "hsl(var(--gold) / 0.6)" }}
        />
        <p className="text-[10px] tracking-[0.32em] uppercase text-white/55 mb-5 font-medium">
          Notre promesse
        </p>
        <h2 className="font-heading text-[28px] font-light leading-[1.25] tracking-tight">
          Un cabinet{" "}
          <span className="italic font-normal">indépendant</span>, une vision{" "}
          <span className="italic font-normal">globale</span>, et la conviction
          qu'un patrimoine se construit{" "}
          <span className="italic font-normal">dans la durée</span>.
        </h2>
        <p className="mt-8 text-white/65 text-[15.5px] leading-relaxed font-light">
          Inscrits à l'ORIAS et adhérents de la CNCEF, sans lien capitalistique
          avec aucune banque ni assureur. Votre intérêt est notre seule
          boussole.
        </p>
      </div>
    </section>
  );
}