import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import SplitText from "./motion/SplitText";

const cas = [
  {
    profil: "Cadre dirigeant",
    situation: "Tranche marginale à 45 %, patrimoine financier important, peu d'optimisation fiscale en place.",
    axes: "Restructuration de l'épargne, PER, démembrement, création d'une holding patrimoniale.",
    chiffre: "Économie fiscale estimée : 42 K€/an",
  },
  {
    profil: "Couple avec enfants",
    situation: "Patrimoine immobilier et assurance-vie, aucune disposition successorale prévue.",
    axes: "Donation-partage, clause bénéficiaire, démembrement de la résidence principale.",
    chiffre: "Droits de succession réduits de 65 %",
  },
  {
    profil: "Chef d'entreprise",
    situation: "Trésorerie excédentaire en société, projet de cession à moyen terme.",
    axes: "Placement de la trésorerie, préparation à la cession, pacte Dutreil, réinvestissement post-cession.",
    chiffre: "Plus-value optimisée : -75 % de fiscalité",
  },
];

export default function HomeCasClients() {
  const reduce = useReducedMotion();
  return (
    <section className="section-padding section-glass relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-16 reveal max-w-2xl">
          <div className="electric-line mb-5" />
          <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-5 font-medium">
            Situations concrètes
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-light text-foreground mb-6 tracking-tight leading-[1.1]">
            <SplitText text="Des cas" by="word" stagger={0.07} />
            <br />
            <SplitText
              text="proches du vôtre"
              by="word"
              delay={0.25}
              itemClassName="italic text-foreground/70"
            />
          </h2>
          <p className="text-foreground/60 text-lg font-light">
            Chaque situation est différente. Voici comment nous avons accompagné des profils similaires, de façon anonymisée.
          </p>
        </div>
        <div className="group/fan grid md:grid-cols-3 gap-5 [perspective:1500px]">
          {cas.map((c, i) => {
            // fan rotation : -2deg / 0deg / +2deg
            const baseRot = (i - 1) * 2;
            return (
              <motion.article
                key={c.profil}
                initial={
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, y: 60 + Math.abs(i - 1) * 12, rotate: baseRot - 1 }
                }
                whileInView={{ opacity: 1, y: 0, rotate: baseRot }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{
                  duration: 0.95,
                  delay: 0.08 + i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={
                  reduce
                    ? {}
                    : {
                        rotate: 0,
                        y: -8,
                        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                      }
                }
                className="group/card relative glass-card p-7 overflow-hidden transition-shadow duration-500 hover:shadow-[0_30px_80px_-20px_hsl(var(--accent)/0.25)] [transform-style:preserve-3d] group-hover/fan:[&:not(:hover)]:opacity-60 group-hover/fan:[&:not(:hover)]:scale-[0.97]"
              >
                {/* Ghost dossier number */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-4 -right-2 font-heading font-light leading-none select-none text-[7rem] text-foreground/[0.04] tracking-tighter"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="relative flex items-center justify-between mb-4">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/45 font-medium">
                    Dossier N°{String(i + 1).padStart(2, "0")}
                  </p>
                  <span className="text-[9px] tracking-[0.25em] uppercase text-[hsl(var(--electric))] font-medium px-2 py-0.5 rounded-full border border-[hsl(var(--electric))/0.3]">
                    Anonymisé
                  </span>
                </div>
                <p className="relative text-[hsl(var(--electric))] text-[13px] tracking-wide font-medium mb-4">
                  {c.profil}
                </p>
                <p className="relative text-foreground/65 text-sm leading-relaxed mb-4 font-light">
                  {c.situation}
                </p>
                <div className="separator-fine my-4" />
                <p className="relative text-foreground/85 text-sm leading-relaxed mb-5">
                  {c.axes}
                </p>
                <p className="relative text-[12px] font-medium tracking-wide text-foreground border-l-2 border-[hsl(var(--accent))] pl-3 italic">
                  {c.chiffre}
                </p>
              </motion.article>
            );
          })}
        </div>
        <div className="mt-12 reveal">
          <Link
            to="/cas-clients"
            className="inline-flex items-center gap-2 px-6 py-3 btn-primary-glass text-sm tracking-wide reflection-sweep"
          >
            Voir tous les cas clients
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
