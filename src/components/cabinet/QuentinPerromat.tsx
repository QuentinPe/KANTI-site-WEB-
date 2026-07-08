import { motion, useReducedMotion } from "framer-motion";
import portrait from "@/assets/quentin-perromat-placeholder.jpg";

// ————————————————————————————————————————————————————————————
// Contenu éditable — modifier ici pour ajuster le texte, la timeline
// et les certifications. Remplacer le fichier
// src/assets/quentin-perromat-placeholder.jpg par la vraie photo.
// ————————————————————————————————————————————————————————————

const BIO: string[] = [
  "Après plus de quinze ans passés au sein de grandes maisons de banque privée et de gestion de patrimoine, Quentin Perromat fonde KANTI à Bordeaux avec une conviction : le conseil patrimonial doit être libre, argumenté et durable.",
  "Formé à l'ingénierie patrimoniale et à la fiscalité du dirigeant, il accompagne aujourd'hui familles, cadres, professions libérales et chefs d'entreprise sur l'ensemble de leurs problématiques — de la structuration de holding à la préparation de la transmission.",
];

const QUOTE =
  "Un bon conseil ne se mesure pas au produit qu'il vous vend, mais aux questions qu'il vous permet enfin de poser.";

const PARCOURS: {
  year: string;
  role: string;
  place: string;
  detail: string;
}[] = [
  {
    year: "2024",
    role: "Associé Fondateur",
    place: "KANTI · Bordeaux",
    detail:
      "Refondation du cabinet autour d'une approche patrimoniale globale en architecture ouverte.",
  },
  {
    year: "2018",
    role: "Directeur de clientèle privée",
    place: "Banque privée régionale",
    detail:
      "Suivi de familles et de dirigeants, coordination avec notaires et experts-comptables.",
  },
  {
    year: "2013",
    role: "Ingénieur patrimonial",
    place: "Grande banque française",
    detail:
      "Ingénierie de la transmission, structuration de holdings, optimisation fiscale du dirigeant.",
  },
  {
    year: "2009",
    role: "Conseiller en gestion de patrimoine",
    place: "Réseau national",
    detail:
      "Premières années de terrain — épargne, prévoyance, immobilier, allocation d'actifs.",
  },
];

const CREDENTIALS: string[] = [
  "Master 2 Gestion de Patrimoine",
  "CIF — CNCEF Patrimoine",
  "Inscrit ORIAS",
  "DU Ingénierie du Patrimoine",
];

const easing = [0.22, 1, 0.36, 1] as const;

export default function QuentinPerromat() {
  const reduce = useReducedMotion();

  return (
    <section id="quentin-perromat" className="bg-navy-deep text-ivory py-24 md:py-36 relative overflow-hidden">
      {/* Ambient halos */}
      <div
        aria-hidden
        className="absolute -top-24 -right-24 w-[560px] h-[560px] rounded-full pointer-events-none float-soft"
        style={{
          background: "radial-gradient(circle, hsl(var(--gold) / 0.12) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />
      <div
        aria-hidden
        className="absolute bottom-[10%] -left-24 w-[420px] h-[420px] rounded-full pointer-events-none float-slow"
        style={{
          background: "radial-gradient(circle, hsl(0 0% 100% / 0.05) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Chapter header */}
        <div className="mb-16 md:mb-20 flex items-end justify-between border-b border-ivory/15 pb-6">
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-gold mb-3 font-medium">
              Chapitre I
            </p>
            <h2 className="font-heading text-3xl md:text-5xl font-light leading-[1.05] tracking-tight text-white">
              Portrait.
            </h2>
          </div>
          <p className="hidden md:block font-heading italic text-[12px] tracking-[0.25em] text-ivory/55">
            Quentin Perromat, Associé fondateur.
          </p>
        </div>

        {/* A — Portrait + bio + citation */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.9, ease: easing }}
            className="lg:col-span-5"
          >
            <figure className="relative">
              {/* Gold halo behind card */}
              <div
                aria-hidden
                className="absolute -inset-6 rounded-[32px] opacity-80 pointer-events-none"
                style={{
                  background: "radial-gradient(circle at 30% 30%, hsl(var(--gold) / 0.35), transparent 65%)",
                  filter: "blur(24px)",
                }}
              />
              <div className="relative rounded-[22px] overflow-hidden ring-1 ring-white/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] aspect-[4/5] transition-transform duration-700 hover:-translate-y-1">
                <img
                  src={portrait}
                  alt="Portrait de Quentin Perromat, Associé Fondateur du cabinet KANTI"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 55%, hsl(224 60% 7% / 0.55) 100%)",
                  }}
                  aria-hidden
                />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-white/70 font-medium mb-1">
                      Associé Fondateur
                    </p>
                    <p className="font-heading text-white text-lg font-light">
                      Quentin Perromat
                    </p>
                  </div>
                  <span className="text-[10px] tracking-[0.25em] uppercase text-white/50">Bordeaux</span>
                </div>
              </div>
              <figcaption className="mt-4 font-heading italic text-[12px] leading-relaxed text-ivory/55 tracking-wide">
                Portrait &nbsp;—&nbsp; Bordeaux, Triangle d'Or, 2026.
              </figcaption>
            </figure>
          </motion.div>

          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.9, delay: 0.15, ease: easing }}
            className="lg:col-span-7"
          >
            <p className="text-[11px] tracking-[0.32em] uppercase text-gold mb-4 font-medium">
              — L'entretien —
            </p>
            <h3 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light text-white leading-[1.02] tracking-tight mb-10">
              Le bon conseil
              <br />
              <span className="italic text-white/80">ne se vend pas. Il s'écrit.</span>
            </h3>

            <div className="rounded-2xl glass-dark p-6 md:p-8 space-y-5">
              {BIO.map((p, i) => (
                <p key={i} className="text-ivory/75 text-[15.5px] leading-[1.75] font-light">
                  {p}
                </p>
              ))}
            </div>

            <blockquote className="mt-12 relative pl-8">
              <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-gold via-gold/60 to-transparent" aria-hidden />
              <span
                aria-hidden
                className="absolute -left-1 -top-8 font-heading text-gold text-[90px] leading-none select-none opacity-80"
                style={{ filter: "drop-shadow(0 0 12px hsl(var(--gold) / 0.35))" }}
              >
                "
              </span>
              <p className="font-heading text-2xl md:text-[28px] italic text-white leading-[1.3] tracking-tight">
                {QUOTE}
              </p>
              <footer className="mt-4 text-[11px] tracking-[0.28em] uppercase text-ivory/50">
                — Q. P.
              </footer>
            </blockquote>
          </motion.div>
        </div>

        {/* B — Parcours : cartes glass */}
        <div className="mt-24 md:mt-32">
          <div className="mb-10 flex items-end justify-between border-b border-ivory/15 pb-5">
            <p className="text-[10px] tracking-[0.35em] uppercase text-gold font-medium">
              Chapitre II &nbsp;·&nbsp; Parcours
            </p>
            <p className="hidden md:block font-heading italic text-[12px] tracking-[0.22em] text-ivory/50">
              Quinze années — de la banque privée au cabinet fondé.
            </p>
          </div>
          <ol className="space-y-3 md:space-y-4">
            {PARCOURS.map((step, i) => (
              <motion.li
                key={step.year + step.role}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: easing }}
                className="group grid grid-cols-12 gap-4 md:gap-8 items-baseline rounded-2xl glass-dark px-5 md:px-7 py-5 md:py-6 hover:-translate-y-0.5 hover:border-white/20 transition-all duration-300"
              >
                <span className="col-span-2 md:col-span-1 font-heading italic text-[14px] tracking-[0.2em] text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="col-span-10 md:col-span-2 font-heading text-2xl md:text-3xl font-light text-white tracking-tight">
                  {step.year}
                </span>
                <div className="col-span-12 md:col-span-4">
                  <p className="font-heading text-[17px] md:text-[19px] text-white leading-snug">
                    {step.role}
                  </p>
                  <p className="mt-1 font-heading italic text-[12px] tracking-[0.2em] text-ivory/55">
                    {step.place}
                  </p>
                </div>
                <p className="col-span-12 md:col-span-5 text-ivory/70 text-[14.5px] leading-relaxed font-light">
                  {step.detail}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* C — Credentials en ligne */}
        <div className="mt-16 md:mt-20 pt-8 border-t border-ivory/15">
          <p className="text-[10px] tracking-[0.35em] uppercase text-gold mb-6 font-medium">
            Références &nbsp;·&nbsp; diplômes & titres
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            {CREDENTIALS.map((c, i) => (
              <span key={c} className="inline-flex items-center gap-4">
                <span className="px-4 py-2 rounded-full glass-dark font-heading text-ivory text-[15px] md:text-[16px] tracking-wide">
                  {c}
                </span>
                {i < CREDENTIALS.length - 1 && (
                  <span
                    aria-hidden
                    className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_10px_hsl(var(--gold)/0.7)]"
                  />
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
