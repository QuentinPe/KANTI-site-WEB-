import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const team = [
  {
    name: "Quentin Perromat",
    role: "Associé Fondateur",
    badge: "Associé fondateur",
    short: "Vision, stratégie & clientèle",
    bio: "Fondateur de KANTI, Quentin accompagne ses clients avec une approche globale et indépendante de la gestion de patrimoine. Passionné par la transmission et l'optimisation fiscale, il construit avec chaque famille une stratégie patrimoniale sur mesure, fondée sur la confiance et la durée.",
    image: "/quentin-perromat.png",
    credentials: ["Associé Fondateur · KANTI", "Gestion de patrimoine indépendante", "ORIAS n° 20 000 855"],
  },
  {
    name: "Thomas Robert",
    role: "Courtier & Assistant en gestion de patrimoine",
    badge: "Salarié",
    short: "Financement & suivi client",
    bio: "Thomas intervient aux côtés des clients sur les problématiques de financement et d'investissement. Rigoureux et à l'écoute, il assure le suivi opérationnel des dossiers et veille à ce que chaque solution retenue soit parfaitement adaptée à la situation personnelle et professionnelle de chaque client.",
    image: "/thomas-robert.png",
    credentials: ["Courtier en financement", "Assistant gestion de patrimoine", "Cabinet KANTI · Bordeaux"],
  },
];

export default function Equipe() {
  return (
    <section id="equipe" className="section-padding texture-paper relative overflow-hidden">
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full pointer-events-none opacity-40"
        style={{
          background: "radial-gradient(circle, hsl(0 0% 100% / 0.10) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-20 reveal max-w-2xl">
          <div className="electric-line mb-5" />
          <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-5 font-medium">
            L'équipe · Bordeaux
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-light text-foreground mb-6 tracking-tight leading-[1.05]">
            L'équipe,<br />
            <span className="italic text-foreground/70">à votre service</span>
          </h2>
          <p className="text-foreground/60 text-lg font-light leading-relaxed max-w-xl">
            Chaque client a un interlocuteur dédié. L'équipe collabore sur les dossiers qui l'exigent : un seul cabinet, plusieurs cerveaux.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl">
          {team.map((member, i) => (
            <motion.article
              key={member.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative rounded-[2rem] overflow-hidden bg-white/40 backdrop-blur-sm border border-foreground/[0.06] hover:border-foreground/15 transition-all duration-500"
            >
              {/* Portrait */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center grayscale-[0.35] transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:grayscale-0"
                  style={{ backgroundImage: `url(${member.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/10 to-transparent" />
                <span className="absolute top-5 left-5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[10px] tracking-[0.3em] uppercase text-white/90 font-medium">
                  <span className="w-1 h-1 rounded-full bg-[hsl(var(--electric-soft))]" />
                  {String(i + 1).padStart(2, "0")} · {member.badge}
                </span>
                <div className="absolute bottom-0 inset-x-0 p-6">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-white/70 mb-2 font-medium">{member.short}</p>
                  <h3 className="font-heading text-2xl font-light text-white tracking-tight leading-tight">
                    {member.name}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 lg:p-7">
                <p className="text-[hsl(var(--electric))] text-[11px] font-medium mb-4 tracking-[0.15em] uppercase">
                  {member.role}
                </p>
                <p className="text-foreground/65 text-[14px] leading-relaxed font-light mb-5">
                  {member.bio}
                </p>
                <ul className="space-y-1.5 border-t border-foreground/10 pt-4">
                  {member.credentials.map((c) => (
                    <li key={c} className="flex items-center gap-2 text-[12px] text-foreground/55 font-light">
                      <span className="w-1 h-1 rounded-full bg-[hsl(var(--electric))]" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-16 flex flex-col sm:flex-row sm:items-center justify-between gap-6 reveal">
          <p className="text-foreground/55 text-sm font-light max-w-md">
            Vous préférez rencontrer l'un de nous spécifiquement ? Indiquez-le lors de la prise de rendez-vous.
          </p>
          <Link
            to="/cabinet"
            data-magnetic
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-foreground/15 text-foreground text-sm tracking-wide hover:bg-foreground hover:text-background transition-all duration-500"
          >
            Découvrir le cabinet
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
