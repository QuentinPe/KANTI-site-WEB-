import { motion, useReducedMotion } from "framer-motion";
import { Award, GraduationCap, ShieldCheck, BookOpen } from "lucide-react";
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

const CERTIFICATIONS: {
  icon: typeof Award;
  label: string;
  meta: string;
}[] = [
  { icon: GraduationCap, label: "Master 2 Gestion de Patrimoine", meta: "Université de Bordeaux" },
  { icon: ShieldCheck, label: "CIF · Conseiller en Investissements Financiers", meta: "CNCEF Patrimoine" },
  { icon: Award, label: "Inscription ORIAS", meta: "IAS · IOBSP · COA · CIF" },
  { icon: BookOpen, label: "DU Ingénierie du Patrimoine", meta: "Formation continue" },
];

const easing = [0.22, 1, 0.36, 1] as const;

export default function QuentinPerromat() {
  const reduce = useReducedMotion();

  return (
    <section id="quentin-perromat" className="section-padding section-glass texture-paper relative overflow-hidden">
      {/* Ambient decorative halos */}
      <div
        className="absolute -top-32 -right-24 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(43 68% 62% / 0.10) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        aria-hidden
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* A — Portrait + bio + citation */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.9, ease: easing }}
            className="lg:col-span-5"
          >
            <div className="relative group">
              {/* Golden thin border frame */}
              <div
                className="absolute -inset-2 rounded-[28px] opacity-70"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(43 68% 62% / 0.35), transparent 60%)",
                  filter: "blur(12px)",
                }}
                aria-hidden
              />
              <div className="relative rounded-[22px] overflow-hidden ring-1 ring-foreground/10 shadow-[0_30px_80px_-20px_rgba(15,25,50,0.35)] aspect-[4/5] transition-transform duration-700 group-hover:-translate-y-1">
                <img
                  src={portrait}
                  alt="Portrait de Quentin Perromat, Associé Fondateur du cabinet KANTI"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                {/* editorial vignette */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 55%, hsl(224 60% 7% / 0.35) 100%)",
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
            </div>
          </motion.div>

          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.9, delay: 0.15, ease: easing }}
            className="lg:col-span-7"
          >
            <p className="text-[11px] tracking-[0.32em] uppercase text-gold mb-4 font-medium">
              L'homme derrière le cabinet
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-light text-foreground leading-[1.08] tracking-tight mb-8">
              Quentin Perromat,
              <br />
              <span className="italic text-foreground/70">Associé Fondateur.</span>
            </h2>

            {BIO.map((p, i) => (
              <p key={i} className="text-foreground/70 leading-relaxed mb-5 font-light text-[16px]">
                {p}
              </p>
            ))}

            <blockquote className="mt-10 border-l-2 border-gold/60 pl-6 py-2">
              <p className="font-heading text-2xl md:text-[26px] italic text-foreground/85 leading-[1.35] tracking-tight">
                « {QUOTE} »
              </p>
              <footer className="mt-4 text-[11px] tracking-[0.28em] uppercase text-foreground/50">
                — Quentin Perromat
              </footer>
            </blockquote>
          </motion.div>
        </div>

        {/* B — Timeline verticale */}
        <div className="mt-28 md:mt-36">
          <div className="max-w-2xl mb-14">
            <p className="text-[11px] tracking-[0.32em] uppercase text-gold mb-4 font-medium">
              Le parcours
            </p>
            <h3 className="text-3xl md:text-4xl font-heading font-light text-foreground leading-[1.1] tracking-tight">
              Quinze années sur le terrain,
              <br />
              <span className="italic text-foreground/65">de la banque privée au cabinet fondé.</span>
            </h3>
          </div>

          <ol className="relative">
            {/* Vertical rail */}
            <span
              className="absolute left-[7px] md:left-[9px] top-2 bottom-2 w-px"
              style={{
                background:
                  "linear-gradient(180deg, hsl(43 68% 62% / 0.6) 0%, hsl(43 68% 62% / 0.2) 60%, transparent 100%)",
              }}
              aria-hidden
            />
            {PARCOURS.map((step, i) => (
              <motion.li
                key={step.year + step.role}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: easing }}
                className="relative pl-10 md:pl-14 pb-10 last:pb-0"
              >
                <span
                  className="absolute left-0 top-1.5 w-[15px] h-[15px] md:w-[19px] md:h-[19px] rounded-full border border-gold/60 bg-background flex items-center justify-center"
                  aria-hidden
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_10px_hsl(43_68%_62%/0.6)]" />
                </span>
                <div className="grid md:grid-cols-[110px_1fr] gap-4 md:gap-8 items-baseline">
                  <span className="font-heading text-2xl md:text-3xl font-light text-foreground tracking-tight">
                    {step.year}
                  </span>
                  <div className="rounded-2xl bg-white/55 backdrop-blur-sm ring-1 ring-foreground/[0.06] p-5 md:p-6">
                    <p className="text-[10px] tracking-[0.28em] uppercase text-foreground/50 font-medium mb-2">
                      {step.place}
                    </p>
                    <h4 className="font-heading text-lg md:text-xl font-normal text-foreground mb-2 tracking-tight">
                      {step.role}
                    </h4>
                    <p className="text-foreground/60 text-[14.5px] leading-relaxed font-light">
                      {step.detail}
                    </p>
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* C — Certifications */}
        <div className="mt-28 md:mt-32">
          <div className="max-w-2xl mb-10">
            <p className="text-[11px] tracking-[0.32em] uppercase text-gold mb-4 font-medium">
              Diplômes & certifications
            </p>
            <h3 className="text-2xl md:text-3xl font-heading font-light text-foreground leading-tight tracking-tight">
              Une expertise vérifiable, encadrée par la profession.
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {CERTIFICATIONS.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={c.label}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.6, delay: i * 0.07, ease: easing }}
                  className="rounded-2xl bg-white/70 ring-1 ring-foreground/[0.07] p-6 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-full ring-1 ring-gold/40 flex items-center justify-center mb-5">
                    <Icon className="w-4 h-4 text-gold" strokeWidth={1.5} />
                  </div>
                  <h4 className="font-heading text-[15px] font-medium text-foreground leading-snug mb-2">
                    {c.label}
                  </h4>
                  <p className="text-[12px] text-foreground/55 font-light tracking-wide">
                    {c.meta}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
