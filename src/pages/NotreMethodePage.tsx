import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import TrustBand from "@/components/TrustBand";

const principes = [
  {
    label: "Indépendance",
    text:
      "Statut de Conseiller en Investissements Financiers — aucune appartenance à un groupe bancaire ou assurantiel. Nos recommandations ne dépendent d'aucun objectif commercial.",
  },
  {
    label: "Architecture ouverte",
    text:
      "Nous comparons l'ensemble des contrats du marché — assurance-vie, PER, SCPI, contrats luxembourgeois, private equity — sans quota ni produit maison.",
  },
  {
    label: "Transparence des frais",
    text:
      "Chaque rétrocession, chaque ligne de frais, chaque honoraire est détaillé par écrit avant toute décision. Aucun coût caché, aucun frais d'entrée non négocié.",
  },
  {
    label: "Documentation",
    text:
      "Lettre de mission, rapport d'audit, lettre de recommandations, reporting annuel : chaque acte de conseil est écrit, daté, archivé pendant dix ans.",
  },
  {
    label: "Coordination",
    text:
      "Nous travaillons main dans la main avec votre notaire, votre avocat fiscaliste et votre expert-comptable. La cohérence prime sur la performance isolée d'un produit.",
  },
  {
    label: "Disponibilité",
    text:
      "Un conseiller référent, joignable directement. Pas de plateau téléphonique, pas de rotation d'interlocuteurs, pas de scripts.",
  },
];

const steps = [
  {
    number: "01",
    eyebrow: "Phase 1",
    duration: "30 min — gratuit",
    title: "Écoute & découverte",
    summary:
      "Un premier rendez-vous pour comprendre votre contexte avant toute recommandation.",
    description:
      "Nous vous écoutons. Nous posons les bonnes questions sur votre situation familiale, professionnelle, patrimoniale et fiscale. Nous identifions les sujets qui méritent un travail approfondi et ceux qui n'en méritent pas. Aucune recommandation n'est formulée à ce stade — uniquement un cadrage clair de la mission qui pourrait suivre.",
    livrables: ["Compte-rendu d'échange", "Liste des documents à transmettre", "Devis et lettre de mission"],
    intervenants: "Conseiller référent",
  },
  {
    number: "02",
    eyebrow: "Phase 2",
    duration: "2 à 3 semaines",
    title: "Audit patrimonial à 360°",
    summary:
      "Inventaire complet, analyse fiscale, diagnostic prévoyance et simulation successorale.",
    description:
      "À partir des documents que vous nous transmettez, nous reconstruisons une cartographie complète de votre patrimoine. Nous analysons trois années de fiscalité, modélisons votre exposition successorale, vérifions votre couverture prévoyance et identifions les zones de fragilité. Ce travail est réalisé en interne, jamais sous-traité.",
    livrables: ["Cartographie patrimoniale", "Analyse fiscale 3 ans", "Bilan prévoyance & succession"],
    intervenants: "Conseiller référent + ingénierie patrimoniale",
  },
  {
    number: "03",
    eyebrow: "Phase 3",
    duration: "1 rendez-vous de présentation",
    title: "Lettre de recommandations",
    summary:
      "Un rapport structuré, des scénarios chiffrés, un plan d'action priorisé.",
    description:
      "Nous vous présentons un document écrit : diagnostic, enjeux identifiés, recommandations argumentées, simulations chiffrées et scénarios comparés. Le plan d'action est priorisé par impact et par horizon. Ce document vous appartient — vous pouvez le partager avec vos autres conseils pour challenger nos arbitrages.",
    livrables: ["Lettre de recommandations", "Simulations chiffrées", "Plan d'action priorisé"],
    intervenants: "Conseiller référent",
  },
  {
    number: "04",
    eyebrow: "Phase 4",
    duration: "Selon le calendrier choisi",
    title: "Mise en œuvre",
    summary:
      "Sélection des supports, ouverture des contrats, coordination des intervenants.",
    description:
      "Si vous décidez de nous confier la mise en œuvre, nous négocions les conditions, ouvrons les contrats, réalisons les arbitrages et coordonnons les intervenants : notaire, assureur, banquier, expert-comptable. Vous validez chaque étape par écrit. Aucun ordre n'est passé sans votre accord explicite.",
    livrables: ["Contrats négociés", "Arbitrages exécutés", "Calendrier de mise en place"],
    intervenants: "Conseiller + back-office + partenaires",
  },
  {
    number: "05",
    eyebrow: "Phase 5",
    duration: "Annuel + à la demande",
    title: "Suivi & gouvernance",
    summary:
      "Un rendez-vous annuel, une veille législative, une disponibilité toute l'année.",
    description:
      "Chaque année, nous faisons un point complet : évolution du patrimoine, performance des placements, impact des changements législatifs, ajustement de la stratégie. Vous recevez un reporting consolidé. Entre deux rendez-vous, votre conseiller reste joignable pour toute question, projet ou changement de situation.",
    livrables: ["Reporting annuel consolidé", "Note de veille fiscale", "Revue de stratégie"],
    intervenants: "Conseiller référent",
  },
];

const garanties = [
  { label: "Statut", value: "CIF — ORIAS", text: "Conseiller en Investissements Financiers, immatriculé à l'ORIAS et adhérent à une association agréée par l'AMF." },
  { label: "Assurance", value: "RC Pro", text: "Couverture en responsabilité civile professionnelle conforme aux exigences réglementaires." },
  { label: "Conformité", value: "MIF II / DDA", text: "Recueil d'adéquation, profil de risque, information précontractuelle systématique." },
  { label: "Confidentialité", value: "RGPD", text: "Données chiffrées, hébergement européen, accès restreint et journalisé." },
];

const livrablesCadre = [
  { number: "I", title: "Lettre de mission", text: "Périmètre, livrables, calendrier, honoraires : tout est posé par écrit avant le démarrage." },
  { number: "II", title: "Rapport d'audit", text: "Document de 30 à 60 pages présentant la cartographie complète et les zones de vigilance." },
  { number: "III", title: "Lettre de recommandations", text: "Recommandations argumentées, simulations chiffrées, plan d'action priorisé et daté." },
  { number: "IV", title: "Reporting annuel", text: "Performance, évolution patrimoniale, événements de l'année, revue de stratégie." },
];

const faqs = [
  {
    q: "Combien coûte la mission ?",
    a: "Le premier rendez-vous est gratuit. Au-delà, nous facturons soit en honoraires de conseil, soit via les rétrocessions des contrats mis en place — toujours détaillés par écrit. Le mode de rémunération est choisi avec vous lors de la lettre de mission.",
  },
  {
    q: "Êtes-vous indépendants ?",
    a: "Oui. Nous n'appartenons à aucun groupe bancaire ou assurantiel. Nous travaillons avec une trentaine de partenaires (assureurs, sociétés de gestion, banques) sélectionnés sur leur qualité et leurs conditions tarifaires.",
  },
  {
    q: "Faut-il un patrimoine minimum ?",
    a: "Non. Notre méthode s'adapte à toutes les situations dès lors qu'il existe un enjeu patrimonial — création d'entreprise, cession, transmission, optimisation fiscale, structuration immobilière.",
  },
  {
    q: "Que se passe-t-il si je ne suis pas vos recommandations ?",
    a: "Rien. Vous restez libre de ne mettre en œuvre que tout ou partie du plan, ou de le confier à un autre intervenant. La lettre de recommandations vous appartient.",
  },
];

export default function NotreMethodePage() {
  useScrollReveal();

  return (
    <>
      <Header />
      <PageHero
        title="Notre méthode"
        highlight="rigueur & transparence"
        subtitle="Cinq phases documentées, des livrables écrits à chaque étape, une gouvernance claire. Pas de formule standard — un cadre éprouvé qui garantit le même niveau d'exigence pour chaque client."
        breadcrumb="Notre méthode"
        eyebrow="Méthodologie"
        stats={[
          { value: "5", label: "Phases formalisées" },
          { value: "4", label: "Livrables écrits" },
          { value: "10 ans", label: "Archivage des dossiers" },
        ]}
      />

      {/* 01 — Manifeste */}
      <section className="section-padding bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 border-t border-foreground/10 pt-12 md:pt-16">
            <div className="lg:col-span-5 reveal">
              <div className="flex items-center gap-4 mb-8">
                <span className="font-heading font-extralight text-5xl md:text-6xl tabular-nums leading-none text-foreground/15">
                  01
                </span>
                <span className="text-[10px] tracking-[0.32em] uppercase font-medium text-foreground/55">
                  Manifeste
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-[44px] font-heading font-light tracking-tight leading-[1.1] text-foreground">
                Le conseil patrimonial mérite mieux qu'une recommandation produit.
              </h2>
            </div>
            <div className="lg:col-span-7 lg:pl-10 lg:border-l border-foreground/10">
              <p className="text-base md:text-lg font-light leading-relaxed text-foreground/70 mb-6">
                Trop souvent, le conseil patrimonial se résume à proposer un contrat. Nous croyons l'inverse :
                un bon conseil commence par un diagnostic complet, se construit autour de votre projet de vie, et
                se mesure dans la durée — pas dans la performance d'un trimestre.
              </p>
              <p className="text-base md:text-lg font-light leading-relaxed text-foreground/70">
                Notre méthode est née de cette conviction. Elle impose une discipline : prendre le temps
                d'écouter, formaliser chaque étape par écrit, n'engager aucune décision sans un cadre clair.
                C'est exigeant. C'est ce qui fait la différence entre un courtier et un conseil.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — Principes */}
      <section className="section-padding section-ivory">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 border-t border-foreground/10 pt-12 md:pt-16">
            <div className="lg:col-span-4 reveal">
              <div className="flex items-center gap-4 mb-8">
                <span className="font-heading font-extralight text-5xl md:text-6xl tabular-nums leading-none text-foreground/15">
                  02
                </span>
                <span className="text-[10px] tracking-[0.32em] uppercase font-medium text-foreground/55">
                  Principes
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-light tracking-tight leading-[1.1] text-foreground">
                Six engagements qui structurent chaque mission.
              </h2>
            </div>
            <div className="lg:col-span-8">
              <div className="grid md:grid-cols-2 gap-x-10 gap-y-10">
                {principes.map((p, i) => (
                  <div key={p.label} className={`reveal reveal-delay-${(i % 5) + 1} border-t border-foreground/12 pt-5`}>
                    <div className="text-[10px] tracking-[0.28em] uppercase text-foreground/45 mb-3">
                      {String(i + 1).padStart(2, "0")} — {p.label}
                    </div>
                    <p className="text-foreground/75 text-sm leading-relaxed font-light">{p.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — Les 5 phases */}
      <section className="section-padding bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="border-t border-foreground/10 pt-12 md:pt-16 mb-14 reveal">
            <div className="flex items-center gap-4 mb-8">
              <span className="font-heading font-extralight text-5xl md:text-6xl tabular-nums leading-none text-foreground/15">
                03
              </span>
              <span className="text-[10px] tracking-[0.32em] uppercase font-medium text-foreground/55">
                Les cinq phases
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-[44px] font-heading font-light tracking-tight leading-[1.05] text-foreground max-w-3xl">
              De la première écoute au suivi annuel — un fil conducteur sans angles morts.
            </h2>
          </div>

          <div className="space-y-0">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className={`reveal grid lg:grid-cols-12 gap-8 lg:gap-12 py-12 ${
                  i < steps.length - 1 ? "border-b border-foreground/10" : ""
                }`}
              >
                {/* Index + meta */}
                <div className="lg:col-span-3">
                  <div className="font-heading font-extralight text-7xl md:text-8xl tabular-nums leading-none text-foreground/12">
                    {step.number}
                  </div>
                  <div className="mt-6 space-y-2">
                    <div className="text-[10px] tracking-[0.3em] uppercase text-foreground/45">
                      {step.eyebrow}
                    </div>
                    <div className="text-xs text-foreground/65 font-light">{step.duration}</div>
                  </div>
                </div>

                {/* Description */}
                <div className="lg:col-span-6">
                  <h3 className="font-heading text-2xl md:text-3xl font-light text-foreground tracking-tight mb-3">
                    {step.title}
                  </h3>
                  <p className="text-foreground/65 text-sm md:text-base font-light italic mb-5">
                    {step.summary}
                  </p>
                  <p className="text-foreground/75 leading-relaxed text-sm md:text-[15px] font-light">
                    {step.description}
                  </p>
                </div>

                {/* Livrables */}
                <div className="lg:col-span-3 lg:border-l border-foreground/10 lg:pl-8">
                  <div className="text-[10px] tracking-[0.28em] uppercase text-foreground/45 mb-4">
                    Livrables
                  </div>
                  <ul className="space-y-2 mb-6">
                    {step.livrables.map((l) => (
                      <li key={l} className="text-xs text-foreground/75 font-light leading-relaxed flex gap-2">
                        <span className="text-foreground/30">—</span>
                        <span>{l}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-[10px] tracking-[0.28em] uppercase text-foreground/45 mb-2">
                    Intervenants
                  </div>
                  <p className="text-xs text-foreground/65 font-light leading-relaxed">
                    {step.intervenants}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 — Cadre des livrables */}
      <section className="section-padding section-ivory">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 border-t border-foreground/10 pt-12 md:pt-16">
            <div className="lg:col-span-5 reveal">
              <div className="flex items-center gap-4 mb-8">
                <span className="font-heading font-extralight text-5xl md:text-6xl tabular-nums leading-none text-foreground/15">
                  04
                </span>
                <span className="text-[10px] tracking-[0.32em] uppercase font-medium text-foreground/55">
                  Livrables écrits
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-light tracking-tight leading-[1.1] text-foreground mb-6">
                Tout est écrit. Tout est conservé.
              </h2>
              <p className="text-foreground/70 font-light leading-relaxed">
                Quatre documents jalonnent chaque mission. Ils vous appartiennent, sont datés, signés et archivés
                pendant dix ans conformément à nos obligations réglementaires.
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="grid sm:grid-cols-2 gap-x-10 gap-y-10">
                {livrablesCadre.map((l, i) => (
                  <div key={l.title} className={`reveal reveal-delay-${(i % 4) + 1}`}>
                    <div className="font-heading text-3xl font-extralight text-foreground/25 mb-3 tabular-nums">
                      {l.number}
                    </div>
                    <h3 className="font-heading text-lg font-normal text-foreground mb-2 tracking-tight">
                      {l.title}
                    </h3>
                    <p className="text-foreground/70 text-sm leading-relaxed font-light">{l.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 05 — Gouvernance & déontologie */}
      <section className="section-padding bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="border-t border-foreground/10 pt-12 md:pt-16 mb-14 reveal">
            <div className="flex items-center gap-4 mb-8">
              <span className="font-heading font-extralight text-5xl md:text-6xl tabular-nums leading-none text-foreground/15">
                05
              </span>
              <span className="text-[10px] tracking-[0.32em] uppercase font-medium text-foreground/55">
                Gouvernance & déontologie
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-[44px] font-heading font-light tracking-tight leading-[1.05] text-foreground max-w-3xl">
              Un cadre réglementaire strict, des contrôles indépendants.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {garanties.map((g, i) => (
              <div
                key={g.label}
                className={`reveal reveal-delay-${(i % 4) + 1} border-t border-foreground/12 pt-5`}
              >
                <div className="text-[10px] tracking-[0.28em] uppercase text-foreground/45 mb-3">
                  {g.label}
                </div>
                <div className="font-heading text-xl font-light text-foreground tracking-tight mb-3">
                  {g.value}
                </div>
                <p className="text-foreground/70 text-sm leading-relaxed font-light">{g.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 06 — FAQ courte */}
      <section className="section-padding section-ivory">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 border-t border-foreground/10 pt-12 md:pt-16">
            <div className="lg:col-span-4 reveal">
              <div className="flex items-center gap-4 mb-8">
                <span className="font-heading font-extralight text-5xl md:text-6xl tabular-nums leading-none text-foreground/15">
                  06
                </span>
                <span className="text-[10px] tracking-[0.32em] uppercase font-medium text-foreground/55">
                  Questions fréquentes
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-light tracking-tight leading-[1.1] text-foreground">
                Les questions que vous nous posez avant de nous confier votre dossier.
              </h2>
            </div>
            <div className="lg:col-span-8">
              <div className="space-y-0">
                {faqs.map((f, i) => (
                  <div
                    key={f.q}
                    className={`reveal reveal-delay-${(i % 4) + 1} py-7 ${
                      i < faqs.length - 1 ? "border-b border-foreground/10" : ""
                    }`}
                  >
                    <h3 className="font-heading text-lg md:text-xl font-normal text-foreground tracking-tight mb-3">
                      {f.q}
                    </h3>
                    <p className="text-foreground/70 text-sm md:text-[15px] font-light leading-relaxed">
                      {f.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustBand />
      <PageCTA
        title="Mettons cette méthode au service de votre patrimoine."
        subtitle="30 minutes pour comprendre votre situation, identifier les sujets prioritaires et juger si notre méthode est adaptée à vos enjeux."
        eyebrow="Notre méthode"
        index="07"
        secondaryText="Voir les cas clients"
        secondaryHref="/cas-clients"
      />
      <Footer />
    </>
  );
}
