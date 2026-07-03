import derAsset from "@/assets/der-kanti-2026.pdf.asset.json";

export default function DERSection() {
  return (
    <section id="der" className="section-padding section-dark relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, hsl(210 100% 60% / 0.12) 0%, transparent 70%)",
        }}
      />
      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <p className="text-[11px] tracking-[0.3em] uppercase text-white/55 mb-5 font-medium">
          Transparence · Document réglementaire
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light text-white tracking-tight leading-[1.05] mb-6">
          Document d'Entrée
          <br />
          <span className="italic text-white">en Relation</span>
        </h2>
        <p className="text-[15px] md:text-lg text-white/65 max-w-2xl mx-auto leading-relaxed font-light mb-12">
          Conformément à nos obligations réglementaires, retrouvez l'ensemble des
          informations sur notre cabinet, nos statuts, nos partenaires et nos modes
          de rémunération dans notre Document d'Entrée en Relation (DER 2026).
        </p>

        <a
          href={derAsset.url}
          target="_blank"
          rel="noopener noreferrer"
          data-magnetic
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full text-white text-sm font-medium tracking-wide overflow-hidden transition-all duration-500 hover:-translate-y-0.5"
          style={{
            background:
              "linear-gradient(135deg, hsl(0 0% 100% / 0.14) 0%, hsl(0 0% 100% / 0.06) 100%)",
            backdropFilter: "blur(20px) saturate(140%)",
            WebkitBackdropFilter: "blur(20px) saturate(140%)",
            boxShadow:
              "inset 0 1px 0 hsl(0 0% 100% / 0.35), inset 0 -1px 0 hsl(0 0% 100% / 0.08), 0 10px 40px -12px hsl(224 60% 5% / 0.6)",
            border: "1px solid hsl(0 0% 100% / 0.18)",
          }}
        >
          <span
            aria-hidden
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background:
                "linear-gradient(120deg, transparent 20%, hsl(0 0% 100% / 0.22) 50%, transparent 80%)",
            }}
          />
          <svg
            className="w-4 h-4 relative z-10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"
            />
          </svg>
          <span className="relative z-10">Télécharger le DER 2026 (PDF)</span>
          <span className="relative z-10 text-white/50 text-xs font-light">
            {(derAsset.size / 1024).toFixed(0)} Ko
          </span>
        </a>

        <p className="mt-8 text-[11px] uppercase tracking-[0.24em] text-white/40">
          Mise à jour, janvier 2026
        </p>
      </div>
    </section>
  );
}