import { useMemo, useState } from "react";
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
    intro: "Notre cadre réglementaire, notre indépendance et notre modèle économique.",
    questions: [
      { q: "Qu'est-ce qu'un conseiller en gestion de patrimoine indépendant ?", a: "Un CGP indépendant est un professionnel enregistré à l'ORIAS, habilité à délivrer des conseils en investissements financiers (CIF), en assurance (COA) et en opérations de banque (COBSP). Contrairement à un conseiller bancaire, il n'a aucun produit maison et travaille en architecture ouverte — il compare l'ensemble du marché pour sélectionner ce qui convient le mieux à votre situation." },
      { q: "Comment êtes-vous rémunérés ?", a: "Nous pouvons travailler en honoraires de conseil (facturation directe pour l'audit et les recommandations) ou en commissions sur les produits souscrits (versées par les compagnies d'assurance ou les sociétés de gestion). Dans tous les cas, notre mode de rémunération est communiqué en amont, de façon transparente, avant toute recommandation." },
      { q: "Êtes-vous contrôlés par un organisme ?", a: "Oui. En tant que membre de la CNCGP (Chambre Nationale des Conseils en Gestion de Patrimoine), nous sommes soumis au contrôle de l'Autorité des Marchés Financiers (AMF) et de l'ACPR. Nous disposons également d'une assurance responsabilité civile professionnelle et d'une garantie financière." },
      { q: "Quelle est la différence avec un banquier privé ?", a: "Un banquier privé distribue les produits de son établissement. Nous, nous n'avons aucune obligation de placement auprès d'un partenaire donné. Notre seul engagement est de vous recommander les solutions les plus adaptées, quel que soit l'émetteur." },
      { q: "Combien d'associés et de collaborateurs composent l'équipe ?", a: "Le cabinet réunit une équipe resserrée d'associés et de collaborateurs experts en ingénierie patrimoniale, fiscalité, immobilier et financement. Chaque dossier est suivi par un binôme : un associé référent et un ingénieur patrimonial, garantissant continuité et expertise transverse." },
      { q: "Avec combien de partenaires travaillez-vous ?", a: "Plus de 30 partenaires sélectionnés : compagnies d'assurance de premier plan, banques privées, sociétés de gestion, plateformes immobilières et acteurs du private equity. Cette architecture ouverte nous permet de bâtir des solutions sans biais commercial." },
      { q: "Quelle est votre zone géographique d'intervention ?", a: "Notre cabinet est basé à Bordeaux mais nous accompagnons des clients sur l'ensemble du territoire français ainsi que des expatriés (Europe, Suisse, Émirats, Amérique du Nord). Les rendez-vous se tiennent en présentiel ou en visioconférence selon votre préférence." },
    ],
  },
  {
    category: "Premier rendez-vous",
    intro: "Prise de contact, déroulé du premier échange et documents utiles.",
    questions: [
      { q: "Le premier rendez-vous est-il payant ?", a: "Non. Le premier échange de 30 minutes est gratuit et sans engagement. Il sert à comprendre votre situation et à évaluer ensemble la pertinence d'un accompagnement." },
      { q: "Quels documents apporter ?", a: "Pour le premier échange, rien d'obligatoire. Si nous engageons un audit patrimonial, nous vous demanderons : dernier avis d'imposition, relevés de patrimoine (immobilier, financier), contrats d'assurance-vie ou de prévoyance en cours, régime matrimonial." },
      { q: "Le rendez-vous peut-il se faire à distance ?", a: "Oui. Nous recevons nos clients dans nos locaux au cœur de Bordeaux, mais nous réalisons également des rendez-vous en visioconférence pour les clients éloignés ou les expatriés." },
      { q: "Comment se déroule concrètement ce premier échange ?", a: "Trente minutes structurées : 10 minutes pour présenter votre situation et vos préoccupations, 10 minutes pour un retour à chaud sur les leviers identifiés, 10 minutes pour expliquer notre méthode et déterminer ensemble la suite. Aucune recommandation produit n'est faite à ce stade." },
      { q: "Suis-je engagé après le premier rendez-vous ?", a: "Aucunement. Le premier rendez-vous est sans engagement. Si vous souhaitez aller plus loin, nous vous transmettons une lettre de mission précisant le périmètre, le calendrier et les honoraires. Rien n'est enclenché tant que cette lettre n'est pas signée." },
      { q: "Sous quel délai obtient-on un rendez-vous ?", a: "En général sous 5 à 10 jours ouvrés. Pour les situations urgentes (cession d'entreprise, succession en cours, opportunité d'investissement), nous nous efforçons de proposer un créneau sous 48 heures." },
    ],
  },
  {
    category: "Accompagnement",
    intro: "Méthode, périmètre, suivi dans le temps et coordination avec vos conseils.",
    questions: [
      { q: "À partir de quel montant de patrimoine intervenez-vous ?", a: "Nous ne fixons pas de seuil d'entrée formel. En pratique, notre accompagnement est pertinent à partir d'un patrimoine financier et/ou immobilier de 200 000 € environ, ou lorsque la complexité de la situation le justifie (dirigeant, profession libérale, expatriation)." },
      { q: "Combien de temps dure un audit patrimonial ?", a: "En moyenne deux à trois semaines entre la remise des documents et la présentation du rapport. Ce délai peut varier selon la complexité de votre situation et la complétude des documents fournis." },
      { q: "Travaillez-vous avec notre notaire ou notre expert-comptable ?", a: "Oui, systématiquement. La coordination avec vos autres conseils est un élément central de notre méthode. Nous échangeons avec eux (avec votre accord) pour garantir la cohérence des décisions patrimoniales, fiscales et juridiques." },
      { q: "Que se passe-t-il après l'audit ?", a: "Nous vous présentons un rapport de recommandations structuré. Vous décidez ensuite de mettre en œuvre nos préconisations ou non. Si vous nous confiez la mise en œuvre, nous sélectionnons les contrats, ouvrons les comptes et assurons le suivi. Sinon, vous conservez le rapport et êtes libre de l'utiliser avec le professionnel de votre choix." },
      { q: "À quelle fréquence faites-vous le point avec vos clients ?", a: "Au minimum un rendez-vous annuel de revue patrimoniale, complété par des points trimestriels sur l'allocation financière. Nous restons disponibles entre deux rendez-vous pour toute question, opportunité ou changement de situation (mariage, naissance, cession, héritage)." },
      { q: "Que couvre exactement votre mission ?", a: "Selon la lettre de mission : audit patrimonial 360°, stratégie fiscale, sélection et souscription de placements, accompagnement immobilier, structuration de la transmission, conseil en financement, suivi annuel. Vous choisissez le périmètre — global ou ciblé sur une problématique précise." },
      { q: "Puis-je arrêter l'accompagnement à tout moment ?", a: "Oui. Aucune clause d'engagement de durée. Vous restez libre d'interrompre la relation à tout moment. Vos contrats et placements demeurent évidemment actifs et nous organisons le transfert vers le conseil de votre choix si nécessaire." },
    ],
  },
  {
    category: "Fiscalité & placements",
    intro: "Stratégie fiscale, supports d'investissement, performance et sécurité de vos actifs.",
    questions: [
      { q: "Pouvez-vous m'aider à réduire mes impôts ?", a: "Oui, c'est l'un de nos domaines d'expertise. Mais nous ne vendons pas de la défiscalisation — nous construisons une stratégie fiscale cohérente, adaptée à votre situation. Chaque levier est analysé en termes de rapport bénéfice/risque et intégré dans votre stratégie globale." },
      { q: "Quels types de placements proposez-vous ?", a: "En architecture ouverte, nous accédons à l'ensemble des supports du marché : assurance-vie, PER, PEA, compte-titres, SCPI, OPCI, private equity, produits structurés, nue-propriété, etc. La sélection dépend exclusivement de votre profil, de vos objectifs et de votre horizon d'investissement." },
      { q: "Mes placements sont-ils en sécurité ?", a: "Vos actifs sont détenus chez des dépositaires agréés (compagnies d'assurance, banques dépositaires), jamais sur nos comptes. Nous n'avons aucune capacité de détention ou de mouvement sur vos fonds." },
      { q: "Quelle performance puis-je espérer ?", a: "Aucun rendement ne peut être garanti — c'est une exigence réglementaire et un principe de prudence. Nous construisons des allocations adaptées à votre profil de risque, votre horizon et vos objectifs, et nous documentons les hypothèses retenues. La performance se juge sur le long terme, nette de frais et de fiscalité." },
      { q: "Comment évaluez-vous mon profil de risque ?", a: "Via un questionnaire MIF II structuré (réglementation européenne) couvrant votre expérience financière, votre tolérance aux pertes, votre horizon de placement et vos objectifs. Ce profil est revu à chaque évolution de votre situation et au moins une fois par an." },
      { q: "Investissez-vous dans des supports responsables (ISR/ESG) ?", a: "Oui. Nous proposons systématiquement une lecture extra-financière (ISR, ESG, label Greenfin, article 8/9 SFDR) et pouvons construire une allocation 100 % responsable si vous le souhaitez. Le sujet est abordé dès la phase de profilage." },
    ],
  },
  {
    category: "Transmission & succession",
    intro: "Donation, démembrement, assurance-vie et anticipation successorale.",
    questions: [
      { q: "Quand faut-il commencer à préparer sa transmission ?", a: "Le plus tôt possible. La majorité des leviers (donation en pleine propriété ou démembrée, assurance-vie, pacte Dutreil, SCI) tirent leur efficacité du temps. Idéalement dès 50-55 ans, mais il n'est jamais trop tard pour optimiser." },
      { q: "Quel est l'intérêt de l'assurance-vie pour la transmission ?", a: "L'assurance-vie bénéficie d'un cadre fiscal hors succession très favorable : 152 500 € d'abattement par bénéficiaire pour les versements avant 70 ans, puis taxation forfaitaire avantageuse. C'est l'outil de transmission le plus utilisé en France, à manier avec rigueur (clause bénéficiaire sur mesure)." },
      { q: "Qu'est-ce que le démembrement de propriété ?", a: "C'est la séparation entre l'usufruit (jouissance, revenus) et la nue-propriété (titre de propriété). Couplé à une donation, il permet de transmettre à coût fiscal réduit tout en conservant la maîtrise du bien. Outil clé pour anticiper la succession sur l'immobilier ou les parts sociales." },
      { q: "Faut-il créer une SCI familiale ?", a: "Pas systématiquement. La SCI est pertinente pour : organiser une indivision, faciliter une transmission progressive, dissocier propriété et gestion. Elle ne doit pas être créée pour des raisons fiscales seules — l'intérêt est avant tout patrimonial et organisationnel." },
    ],
  },
  {
    category: "Confidentialité & sécurité",
    intro: "Protection de vos données, secret professionnel et sécurité informatique.",
    questions: [
      { q: "Mes informations restent-elles confidentielles ?", a: "Oui, sans condition. Nous sommes soumis au secret professionnel CIF et au code de déontologie de la CNCGP. Aucune donnée n'est partagée avec un tiers — y compris vos autres conseils — sans votre accord écrit." },
      { q: "Comment sont stockées mes données ?", a: "Sur des serveurs hébergés en Europe, chiffrés et conformes au RGPD. L'accès est limité aux collaborateurs habilités sur votre dossier, avec authentification forte et journalisation des consultations." },
      { q: "Que se passe-t-il en cas de litige ?", a: "Une procédure de réclamation interne est à votre disposition (réponse sous 10 jours ouvrés, traitement sous 2 mois maximum). À défaut de solution, vous pouvez saisir gratuitement le médiateur de l'AMF ou de l'ACPR selon la nature du litige. Le détail figure sur notre page Réclamations." },
    ],
  },
];

export default function FAQPage() {
  useScrollReveal();
  const slugify = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const sections = useMemo(
    () => faqCategories.map((c) => ({ ...c, id: slugify(c.category) })),
    []
  );

  const [activeCatId, setActiveCatId] = useState<string>(sections[0].id);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const activeCat = sections.find((c) => c.id === activeCatId) ?? sections[0];
  const activeIndex = sections.findIndex((c) => c.id === activeCatId);

  const toggle = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectCat = (id: string) => {
    setActiveCatId(id);
    setOpenItems({});
  };

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
                    const isActive = activeCatId === cat.id;
                    return (
                      <li key={cat.id}>
                        <button
                          type="button"
                          onClick={() => selectCat(cat.id)}
                          data-magnetic
                          className={`group flex items-center gap-4 py-2.5 w-full text-left transition-colors ${
                            isActive ? "text-foreground" : "text-foreground/55 hover:text-foreground/85"
                          }`}
                          aria-pressed={isActive}
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
                          <span className="ml-auto text-[10px] tracking-[0.18em] uppercase text-foreground/35 font-medium">
                            {cat.questions.length}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>

            {/* Categories + questions */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCat.id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-[1.75rem] border border-foreground/[0.08] bg-white/55 backdrop-blur-md p-6 lg:p-10 shadow-[0_30px_80px_-40px_hsl(var(--foreground)/0.18)]"
                >
                  <div className="mb-8 flex items-start justify-between gap-6">
                    <div className="flex items-baseline gap-4">
                      <span className="text-[11px] font-medium tracking-[0.3em] text-foreground/40">
                        {String(activeIndex + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-heading text-2xl md:text-3xl font-light text-foreground tracking-tight leading-tight">
                          {activeCat.category}
                        </h3>
                        <p className="text-foreground/55 text-sm font-light mt-1.5 max-w-md">
                          {activeCat.intro}
                        </p>
                      </div>
                    </div>
                    <span className="hidden sm:inline-flex shrink-0 items-center gap-1.5 mt-1 px-3 py-1 rounded-full border border-foreground/10 bg-white/40 backdrop-blur-sm text-[10px] tracking-[0.18em] uppercase text-foreground/55 font-medium">
                      <span className="w-1 h-1 rounded-full bg-foreground/40" />
                      {activeCat.questions.length} questions
                    </span>
                  </div>

                  <ul className="space-y-3">
                    {activeCat.questions.map((item, i) => {
                      const key = `${activeCat.id}-${i}`;
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
                </motion.div>
              </AnimatePresence>
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
