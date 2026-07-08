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
    <section id="quentin-perromat" className="paper-grain text-ink py-24 md:py-36 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Chapter header */}
        <div className="mb-16 md:mb-20 flex items-end justify-between border-b border-ink/25 pb-6">
          <div>
            <p className="font-editorial text-[10px] tracking-[0.35em] uppercase text-ink/60 mb-3">
              Chapitre I
            </p>
            <h2 className="font-editorial text-3xl md:text-5xl font-normal leading-[1.05] tracking-tight">
              Portrait.
            </h2>
          </div>
          <p className="hidden md:block font-editorial italic text-[12px] tracking-[0.25em] text-ink/55">
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
            <figure>
              <div className="relative aspect-[4/5] overflow-hidden ring-1 ring-ink/20 outline outline-1 outline-offset-4 outline-gold/50">
                <img
                  src={portrait}
                  alt="Portrait de Quentin Perromat, Associé Fondateur du cabinet KANTI"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover grayscale-[15%]"
                />
              </div>
              <figcaption className="mt-4 font-editorial italic text-[12px] leading-relaxed text-ink/60 tracking-wide">
                Portrait &nbsp;—&nbsp; Quentin Perromat, Associé fondateur.
                <br />
                Bordeaux, Triangle d'Or, 2026.
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
            <p className="font-editorial italic text-[12px] tracking-[0.28em] text-gold mb-4">
              — L'entretien —
            </p>
            <h3 className="font-editorial text-4xl md:text-5xl lg:text-6xl font-normal text-ink leading-[1.02] tracking-tight mb-10">
              « Le bon conseil ne se
              <br />
              <span className="italic">vend pas. Il s'écrit.</span> »
            </h3>

            <div className="magazine-columns text-ink/80 text-[15.5px] leading-[1.7] font-light drop-cap">
              {BIO.join(" ")}
            </div>

            <blockquote className="mt-12 relative pl-8 border-l-2 border-gold py-2">
              <span
                aria-hidden
                className="absolute -left-1 -top-6 font-editorial text-gold text-[90px] leading-none select-none"
              >
                “
              </span>
              <p className="font-editorial text-2xl md:text-[28px] italic text-ink leading-[1.3] tracking-tight">
                {QUOTE}
              </p>
              <footer className="mt-4 font-editorial text-[11px] tracking-[0.28em] uppercase text-ink/55">
                — Q. P.
              </footer>
            </blockquote>
          </motion.div>
        </div>

        {/* B — Parcours : tableau éditorial */}
        <div className="mt-24 md:mt-32">
          <div className="mb-10 flex items-end justify-between border-b border-ink/25 pb-5">
            <p className="font-editorial text-[10px] tracking-[0.35em] uppercase text-ink/60">
              Curriculum &nbsp;·&nbsp; Parcours
            </p>
            <p className="hidden md:block font-editorial italic text-[11px] tracking-[0.22em] text-ink/50">
              Quinze années — de la banque privée au cabinet fondé.
            </p>
          </div>
          <ol>
            {PARCOURS.map((step, i) => (
              <motion.li
                key={step.year + step.role}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: easing }}
                className="grid grid-cols-12 gap-4 md:gap-8 py-6 md:py-7 border-b border-ink/12 items-baseline"
              >
                <span className="col-span-2 md:col-span-1 font-editorial text-[13px] tracking-[0.2em] text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="col-span-10 md:col-span-2 font-editorial text-2xl md:text-3xl text-ink tracking-tight">
                  {step.year}
                </span>
                <div className="col-span-12 md:col-span-4">
                  <p className="font-editorial text-[17px] md:text-[19px] text-ink leading-snug">
                    {step.role}
                  </p>
                  <p className="mt-1 font-editorial italic text-[12px] tracking-[0.2em] text-ink/55">
                    {step.place}
                  </p>
                </div>
                <p className="col-span-12 md:col-span-5 text-ink/70 text-[14.5px] leading-relaxed font-light">
                  {step.detail}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* C — Credentials en ligne */}
        <div className="mt-16 md:mt-20 pt-8 border-t border-ink/25">
          <p className="font-editorial text-[10px] tracking-[0.35em] uppercase text-ink/60 mb-5">
            Références &nbsp;·&nbsp; diplômes & titres
          </p>
          <p className="font-editorial text-lg md:text-2xl leading-relaxed text-ink">
            {CREDENTIALS.map((c, i) => (
              <span key={c}>
                {c}
                {i < CREDENTIALS.length - 1 && (
                  <span className="mx-3 md:mx-4 text-gold align-middle">◆</span>
                )}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
