import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import TrustBand from "@/components/TrustBand";

const faqCategories = [
  {
    category: "Le cabinet",
    intro: "Notre cadre, notre indépendance et notre rémunération.",
    questions: [
      { q: "Qu'est-ce qu'un conseiller en gestion de patrimoine indépendant ?", a: "Un CGP indépendant est un professionnel enregistré à l'ORIAS, habilité à délivrer des conseils en investissements financiers (CIF), en assurance (COA) et en opérations de banque (COBSP). Contrairement à un conseiller bancaire, il n'a aucun produit maison et travaille en architecture ouverte — il compare l'ensemble du marché pour sélectionner ce qui convient le mieux à votre situation." },
      { q: "Comment êtes-vous rémunérés ?", a: "Nous pouvons travailler en honoraires de conseil (facturation directe pour l'audit et les recommandations) ou en commissions sur les produits souscrits (versées par les compagnies d'assurance ou les sociétés de gestion). Dans tous les cas, notre mode de rémunération est communiqué en amont, de façon transparente, avant toute recommandation." },
      { q: "Êtes-vous contrôlés par un organisme ?", a: "Oui. En tant que membre de la CNCGP (Chambre Nationale des Conseils en Gestion de Patrimoine), nous sommes soumis au contrôle de l'Autorité des Marchés Financiers (AMF) et de l'ACPR. Nous disposons également d'une assurance responsabilité civile professionnelle et d'une garantie financière." },
      { q: "Quelle est la différence avec un banquier privé ?", a: "Un banquier privé distribue les produits de son établissement. Nous, nous n'avons aucune obligation de placement auprès d'un partenaire donné. Notre seul engagement est de vous recommander les solutions les plus adaptées, quel que soit l'émetteur." },
    ],
  },
  {
    category: "Premier rendez-vous",
    intro: "Comment se déroule la prise de contact et le premier échange.",
    questions: [
      { q: "Le premier rendez-vous est-il payant ?", a: "Non. Le premier échange de 30 minutes est gratuit et sans engagement. Il sert à comprendre votre situation et à évaluer ensemble la pertinence d'un accompagnement." },
      { q: "Quels documents apporter ?", a: "Pour le premier échange, rien d'obligatoire. Si nous engageons un audit patrimonial, nous vous demanderons : dernier avis d'imposition, relevés de patrimoine (immobilier, financier), contrats d'assurance-vie ou de prévoyance en cours, régime matrimonial." },
      { q: "Le rendez-vous peut-il se faire à distance ?", a: "Oui. Nous recevons nos clients dans nos locaux au cœur de Bordeaux, mais nous réalisons également des rendez-vous en visioconférence pour les clients éloignés ou les expatriés." },
    ],
  },
  {
    category: "Accompagnement",
    intro: "La méthode, le périmètre et la coordination avec vos conseils.",
    questions: [
      { q: "À partir de quel montant de patrimoine intervenez-vous ?", a: "Nous ne fixons pas de seuil d'entrée formel. En pratique, notre accompagnement est pertinent à partir d'un patrimoine financier et/ou immobilier de 200 000 € environ, ou lorsque la complexité de la situation le justifie (dirigeant, profession libérale, expatriation)." },
      { q: "Combien de temps dure un audit patrimonial ?", a: "En moyenne deux à trois semaines entre la remise des documents et la présentation du rapport. Ce délai peut varier selon la complexité de votre situation et la complétude des documents fournis." },
      { q: "Travaillez-vous avec notre notaire ou notre expert-comptable ?", a: "Oui, systématiquement. La coordination avec vos autres conseils est un élément central de notre méthode. Nous échangeons avec eux (avec votre accord) pour garantir la cohérence des décisions patrimoniales, fiscales et juridiques." },
      { q: "Que se passe-t-il après l'audit ?", a: "Nous vous présentons un rapport de recommandations structuré. Vous décidez ensuite de mettre en œuvre nos préconisations ou non. Si vous nous confiez la mise en œuvre, nous sélectionnons les contrats, ouvrons les comptes et assurons le suivi. Sinon, vous conservez le rapport et êtes libre de l'utiliser avec le professionnel de votre choix." },
    ],
  },
  {
    category: "Fiscalité & placements",
    intro: "Stratégie fiscale, supports d'investissement et sécurité de vos actifs.",
    questions: [
      { q: "Pouvez-vous m'aider à réduire mes impôts ?", a: "Oui, c'est l'un de nos domaines d'expertise. Mais nous ne vendons pas de la défiscalisation — nous construisons une stratégie fiscale cohérente, adaptée à votre situation. Chaque levier est analysé en termes de rapport bénéfice/risque et intégré dans votre stratégie globale." },
      { q: "Quels types de placements proposez-vous ?", a: "En architecture ouverte, nous accédons à l'ensemble des supports du marché : assurance-vie, PER, PEA, compte-titres, SCPI, OPCI, private equity, produits structurés, nue-propriété, etc. La sélection dépend exclusivement de votre profil, de vos objectifs et de votre horizon d'investissement." },
      { q: "Mes placements sont-ils en sécurité ?", a: "Vos actifs sont détenus chez des dépositaires agréés (compagnies d'assurance, banques dépositaires), jamais sur nos comptes. Nous n'avons aucune capacité de détention ou de mouvement sur vos fonds." },
    ],
  },
];

export default function FAQPage() {
  useScrollReveal();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [activeCat, setActiveCat] = useState<string>(faqCategories[0].category);

  const slugify = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const sections = useMemo(
    () => faqCategories.map((c) => ({ ...c, id: slugify(c.category) })),
    []
  );

  const toggle = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveCat(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <>
      <Header />
      <PageHero
        title="Questions fréquentes"
        subtitle="Les réponses aux questions que nos clients nous posent le plus souvent. Si vous ne trouvez pas ce que vous cherchez, contactez-nous."
        breadcrumb="FAQ"
      />

      <section className="section-padding texture-paper relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-40 -right-32 w-[520px] h-[520px] rounded-full pointer-events-none opacity-50"
          style={{
            background: "radial-gradient(circle, hsl(38 35% 60% / 0.18) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          aria-hidden
          className="absolute -bottom-40 -left-32 w-[480px] h-[480px] rounded-full pointer-events-none opacity-40"
          style={{
            background: "radial-gradient(circle, hsl(38 35% 60% / 0.15) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Sticky sidebar — categories nav */}
            <aside className="lg:col-span-4 reveal">
              <div className="lg:sticky lg:top-32">
                <div className="electric-line mb-5" />
                <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-5 font-medium">
                  Sommaire
                </p>
                <h2 className="text-3xl md:text-4xl font-heading font-light text-foreground mb-6 tracking-tight leading-[1.05]">
                  Tout ce que vous<br />
                  <span className="italic text-foreground/70">vouliez savoir</span>
                </h2>
                <p className="text-foreground/60 text-sm lg:text-[15px] font-light leading-relaxed mb-8 max-w-sm">
                  Naviguez par thématique. Chaque réponse est rédigée par nos associés, sans jargon ni langue de bois.
                </p>
                <ul className="space-y-1">
                  {sections.map((cat, i) => {
                    const isActive = activeCat === cat.id;
                    return (
                      <li key={cat.id}>
                        <a
                          href={`#${cat.id}`}
                          data-magnetic
                          className={`group flex items-center gap-4 py-2.5 transition-colors ${
                            isActive ? "text-foreground" : "text-foreground/55 hover:text-foreground/85"
                          }`}
                        >
                          <span
                            className={`h-px transition-all duration-500 ${
                              isActive ? "w-10 bg-foreground/70" : "w-5 bg-foreground/25 group-hover:w-8"
                            }`}
                          />
                          <span className="text-[11px] font-medium tracking-[0.2em] text-foreground/35">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="font-heading text-base font-light tracking-tight">
                            {cat.category}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>

            {/* Categories + questions */}
            <div className="lg:col-span-8 space-y-20 lg:space-y-24">
              {sections.map((cat, catIdx) => (
                <div key={cat.id} id={cat.id} className="scroll-mt-32 reveal">
                  <div className="mb-8 flex items-baseline gap-4">
                    <span className="text-[11px] font-medium tracking-[0.3em] text-foreground/40">
                      {String(catIdx + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-heading text-2xl md:text-3xl font-light text-foreground tracking-tight leading-tight">
                        {cat.category}
                      </h3>
                      <p className="text-foreground/55 text-sm font-light mt-1.5 max-w-md">
                        {cat.intro}
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {cat.questions.map((item, i) => {
                      const key = `${cat.id}-${i}`;
                      const isOpen = !!openItems[key];
                      return (
                        <li
                          key={key}
                          className="rounded-[1.25rem] border border-foreground/[0.08] bg-white/45 backdrop-blur-sm hover:border-foreground/15 transition-colors duration-300"
                        >
                          <button
                            onClick={() => toggle(key)}
                            className="w-full flex items-start justify-between gap-6 text-left p-5 lg:p-6 group"
                            aria-expanded={isOpen}
                          >
                            <span className="flex items-start gap-4 flex-1">
                              <span className="text-[11px] font-medium text-foreground/40 tracking-[0.2em] mt-1">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <span className="font-heading text-base lg:text-lg font-light text-foreground tracking-tight leading-snug">
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
                                <p className="px-5 lg:px-6 pb-5 lg:pb-6 pl-[3.5rem] text-foreground/65 text-[15px] leading-relaxed font-light max-w-2xl">
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
              ))}
            </div>
          </div>
        </div>
      </section>

      <TrustBand />
      <PageCTA
        title="Une question qui n'est pas dans la liste ?"
        subtitle="Contactez-nous directement. Nous vous répondons sous 24 heures ouvrées."
        secondaryText="Voir notre méthode"
        secondaryHref="/notre-methode"
      />
      <Footer />
    </>
  );
}
