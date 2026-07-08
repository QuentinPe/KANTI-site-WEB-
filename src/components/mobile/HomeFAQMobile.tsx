import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const faqs = [
  {
    q: "À partir de quel patrimoine faire appel à vous ?",
    a: "Nous accompagnons des clients à partir de 250 000 € d'actifs financiers ou immobiliers à structurer.",
  },
  {
    q: "Combien coûte un premier rendez-vous ?",
    a: "Le premier entretien de 30 minutes est gratuit et sans engagement. Aucune recommandation à ce stade.",
  },
  {
    q: "Comment êtes-vous rémunérés ?",
    a: "Honoraires de conseil ou commissions sur les contrats. Le mode est indiqué avant toute recommandation, conformément à la réglementation CIF.",
  },
  {
    q: "Travaillez-vous avec une seule banque ?",
    a: "Non. KANTI travaille en architecture ouverte. Nous sélectionnons les meilleurs contrats parmi plus de 30 partenaires.",
  },
  {
    q: "Êtes-vous tenus au secret professionnel ?",
    a: "Oui, en tant que CIF supervisé par l'AMF et adhérent de la CNCEF, nous sommes soumis à un strict devoir de confidentialité.",
  },
];

export default function HomeFAQMobile() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="md:hidden relative section-padding-mobile texture-paper"
    >
      <div className="max-w-md mx-auto">
        <div className="electric-line mb-4" />
        <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/50 mb-3 font-medium">
          Questions fréquentes
        </p>
        <h2 className="font-heading text-[32px] font-light text-foreground tracking-tight leading-[1.1] mb-8">
          Les réponses
          <br />
          <span className="italic text-foreground/65">avant d'avancer</span>
        </h2>

        <ul className="space-y-2.5">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <li
                key={item.q}
                className="rounded-2xl border border-foreground/[0.08] bg-white/55 backdrop-blur-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-start justify-between gap-4 text-left p-5 min-h-[60px]"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-[15.5px] font-normal text-foreground tracking-tight leading-snug flex-1">
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="flex-shrink-0 mt-0.5 w-7 h-7 rounded-full border border-foreground/15 flex items-center justify-center text-foreground/60"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.6}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 5v14M5 12h14"
                      />
                    </svg>
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-foreground/65 text-[14.5px] leading-relaxed font-light">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>

        <Link
          to="/faq-patrimoniale"
          className="mt-8 inline-flex items-center gap-2 text-[14px] font-medium text-foreground link-underline pb-1"
        >
          Voir toutes les questions →
        </Link>
      </div>
    </section>
  );
}