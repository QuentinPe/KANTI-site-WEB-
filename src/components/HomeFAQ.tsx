import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "À partir de quel patrimoine est-il pertinent de faire appel à vous ?",
    a: "Nous accompagnons des clients à partir de 250 000 € d'actifs financiers ou immobiliers à structurer. Au-delà de ce seuil, l'arbitrage entre fiscalité, transmission et investissement justifie un accompagnement professionnel.",
  },
  {
    q: "Combien coûte un premier rendez-vous ?",
    a: "Le premier entretien de 30 minutes est gratuit et sans engagement. Il nous permet de comprendre votre situation et de vous indiquer si un accompagnement a du sens. Aucune recommandation n'est faite à ce stade.",
  },
  {
    q: "Comment êtes-vous rémunérés ?",
    a: "Deux modes possibles : honoraires de conseil (transparents, facturés directement) ou commissions sur les contrats souscrits (rétrocédées par les compagnies). Nous vous l'indiquons systématiquement avant toute recommandation, conformément à la réglementation CIF.",
  },
  {
    q: "Travaillez-vous avec une seule banque ou compagnie d'assurance ?",
    a: "Non. KANTI est totalement indépendant. Nous sélectionnons les meilleurs contrats du marché parmi plus de 30 partenaires (assureurs, banques privées, sociétés de gestion) en fonction de votre profil et de vos objectifs.",
  },
  {
    q: "Êtes-vous tenus au secret professionnel ?",
    a: "Oui, en tant que CIF supervisé par l'AMF et adhérent de la CNCEF, nous sommes soumis à un strict devoir de confidentialité et à un code de déontologie. Aucune information ne sort du cabinet sans votre accord explicite.",
  },
];

export default function HomeFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section-padding texture-paper relative overflow-hidden">
      <div
        aria-hidden
        className="absolute -bottom-40 -left-32 w-[480px] h-[480px] rounded-full pointer-events-none opacity-50"
        style={{
          background: "radial-gradient(circle, hsl(38 35% 60% / 0.18) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 md:gap-10 lg:gap-16 items-start">
          <aside className="lg:col-span-5 reveal lg:sticky lg:top-32 lg:self-start mb-2 lg:mb-0">
            <div className="electric-line mb-5" />
            <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-5 font-medium">
              Questions fréquentes
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-heading font-light text-foreground mb-6 tracking-tight leading-[1.05]">
              Les réponses<br />
              <span className="italic text-foreground/70">avant d'avancer</span>
            </h2>
            <p className="text-foreground/60 text-base lg:text-lg font-light leading-relaxed mb-8 max-w-md">
              Les questions qu'on nous pose le plus souvent. Si la vôtre n'y figure pas, écrivez-nous, nous répondons sous 24 heures ouvrées.
            </p>
            <Link
              to="/faq-patrimoniale"
              data-magnetic
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground link-underline pb-1"
            >
              Voir toutes les questions
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </aside>

          <div className="lg:col-span-7 reveal reveal-delay-2">
            <ul className="space-y-3">
              {faqs.map((item, i) => {
                const isOpen = open === i;
                return (
                  <li
                    key={item.q}
                    className="rounded-[1.25rem] border border-foreground/[0.08] bg-white/45 backdrop-blur-sm hover:border-foreground/15 transition-colors duration-300"
                  >
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="w-full flex items-start justify-between gap-6 text-left p-6 lg:p-7 group"
                      aria-expanded={isOpen}
                    >
                      <span className="flex items-start gap-4 flex-1">
                        <span className="text-[11px] font-medium text-foreground/40 tracking-[0.2em] mt-1">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-heading text-lg lg:text-xl font-light text-foreground tracking-tight leading-snug">
                          {item.q}
                        </span>
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="flex-shrink-0 mt-1 w-8 h-8 rounded-full border border-foreground/15 flex items-center justify-center text-foreground/60 group-hover:border-foreground/30 group-hover:text-foreground transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                        </svg>
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="px-6 lg:px-7 pb-6 lg:pb-7 pl-[3.75rem] text-foreground/65 text-[15px] leading-relaxed font-light max-w-2xl">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}