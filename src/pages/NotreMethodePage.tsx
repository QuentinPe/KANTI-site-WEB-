import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import {
  Scale,
  Layers,
  Eye,
  FileText,
  Users,
  Phone,
  MessageCircle,
  Search,
  Lightbulb,
  Rocket,
  TrendingUp,
  FileSearch,
  FileSignature,
  ClipboardCheck,
  ShieldCheck,
  Lock,
  BadgeCheck,
  ChevronRight,
  Clock,
} from "lucide-react";

const principes = [
  {
    icon: Scale,
    label: "Indépendance",
    text: "Aucun groupe bancaire ou assurantiel derrière nous. Nos conseils ne sont liés à aucun objectif de vente.",
  },
  {
    icon: Layers,
    label: "Architecture ouverte",
    text: "Nous comparons les contrats du marché : assurance-vie, PER, SCPI, private equity. Sans produit maison ni quota.",
  },
  {
    icon: Eye,
    label: "Transparence des frais",
    text: "Chaque frais et chaque rémunération est détaillé par écrit avant toute décision. Pas de coût caché.",
  },
  {
    icon: FileText,
    label: "Documentation",
    text: "Lettre de mission, rapport, recommandations, reporting : chaque étape est écrite, datée et archivée dix ans.",
  },
  {
    icon: Users,
    label: "Coordination",
    text: "Nous travaillons avec votre notaire, avocat fiscaliste et expert-comptable. La cohérence prime sur le produit isolé.",
  },
  {
    icon: Phone,
    label: "Disponibilité",
    text: "Un conseiller référent joignable directement. Pas de plateau, pas de rotation d'interlocuteurs, pas de scripts.",
  },
];

const steps = [
  {
    number: "01",
    phase: "Phase 1",
    duration: "30 min, gratuit",
    title: "Écoute & découverte",
    summary: "Comprendre votre situation avant toute recommandation.",
    description:
      "Nous prenons le temps d'écouter votre situation familiale, professionnelle et patrimoniale. Nous identifions les sujets qui méritent d'être creusés et ceux qui peuvent attendre. Aucune recommandation à ce stade : juste un cadrage clair de la mission.",
    livrables: ["Compte-rendu d'échange", "Documents à transmettre", "Devis et lettre de mission"],
    icon: MessageCircle,
  },
  {
    number: "02",
    phase: "Phase 2",
    duration: "2 à 3 semaines",
    title: "Audit patrimonial à 360°",
    summary: "Un inventaire complet et un diagnostic fiable.",
    description:
      "À partir de vos documents, nous reconstituons la cartographie de votre patrimoine. Fiscalité, prévoyance, succession : nous repérons les forces, les fragilités et les marges de manœuvre. Ce travail est fait en interne, jamais sous-traité.",
    livrables: ["Cartographie patrimoniale", "Analyse fiscale 3 ans", "Bilan prévoyance & succession"],
    icon: Search,
  },
  {
    number: "03",
    phase: "Phase 3",
    duration: "1 rendez-vous",
    title: "Lettre de recommandations",
    summary: "Un plan d'action clair, chiffré et priorisé.",
    description:
      "Nous vous présentons un document écrit : diagnostic, enjeux, recommandations argumentées et scénarios comparés. Le plan d'action est classé par priorité. Ce document vous appartient, vous pouvez le partager avec vos autres conseils.",
    livrables: ["Lettre de recommandations", "Simulations chiffrées", "Plan d'action priorisé"],
    icon: Lightbulb,
  },
  {
    number: "04",
    phase: "Phase 4",
    duration: "Selon votre calendrier",
    title: "Mise en œuvre",
    summary: "Sélection des contrats et coordination des intervenants.",
    description:
      "Si vous nous confiez la mise en œuvre, nous négocions les conditions, ouvrons les contrats et coordonnons les intervenants. Chaque étape est validée par vous par écrit. Aucun ordre n'est passé sans votre accord explicite.",
    livrables: ["Contrats négociés", "Arbitrages exécutés", "Calendrier de mise en place"],
    icon: Rocket,
  },
  {
    number: "05",
    phase: "Phase 5",
    duration: "Annuel + à la demande",
    title: "Suivi & gouvernance",
    summary: "Un rendez-vous annuel et une disponibilité continue.",
    description:
      "Chaque année, nous faisons le point sur l'évolution de votre patrimoine, les changements législatifs et les ajustements nécessaires. Vous recevez un reporting consolidé. Entre deux rendez-vous, votre conseiller reste joignable.",
    livrables: ["Reporting annuel consolidé", "Note de veille fiscale", "Revue de stratégie"],
    icon: TrendingUp,
  },
];

const livrablesCadre = [
  { number: "I", icon: FileSignature, title: "Lettre de mission", text: "Périmètre, livrables, calendrier, honoraires : tout est posé par écrit avant le démarrage." },
  { number: "II", icon: FileSearch, title: "Rapport d'audit", text: "Cartographie complète de votre patrimoine et les zones de vigilance identifiées." },
  { number: "III", icon: FileText, title: "Lettre de recommandations", text: "Recommandations argumentées, simulations chiffrées et plan d'action daté." },
  { number: "IV", icon: TrendingUp, title: "Reporting annuel", text: "Performance, évolution patrimoniale, événements de l'année et revue de stratégie." },
];

const garanties = [
  { icon: BadgeCheck, label: "Statut", value: "CIF, ORIAS", text: "Conseiller en Investissements Financiers, immatriculé à l'ORIAS et adhérent à une association agréée par l'AMF." },
  { icon: ShieldCheck, label: "Assurance", value: "RC Pro", text: "Responsabilité civile professionnelle conforme aux exigences réglementaires." },
  { icon: ClipboardCheck, label: "Conformité", value: "MIF II / DDA", text: "Recueil d'adéquation, profil de risque et information précontractuelle systématiques." },
  { icon: Lock, label: "Confidentialité", value: "RGPD", text: "Données chiffrées, hébergement européen, accès restreint et journalisé." },
];

const faqs = [
  {
    q: "Combien coûte la mission ?",
    a: "Le premier rendez-vous est gratuit. Au-delà, nous facturons soit en honoraires de conseil, soit via les rétrocessions des contrats, toujours détaillées par écrit. Le mode de rémunération est validé avec vous dans la lettre de mission.",
  },
  {
    q: "Travaillez-vous en architecture ouverte ?",
    a: "Oui. Nous n'appartenons à aucun groupe bancaire ou assurantiel. Nous travaillons avec une trentaine de partenaires sélectionnés sur la qualité et les conditions tarifaires.",
  },
  {
    q: "Faut-il un patrimoine minimum ?",
    a: "Non. Notre méthode s'adapte dès qu'il existe un enjeu patrimonial : création d'entreprise, cession, transmission, optimisation fiscale ou structuration immobilière.",
  },
  {
    q: "Que se passe-t-il si je ne suis pas vos recommandations ?",
    a: "Rien. Vous restez libre de ne mettre en œuvre qu'une partie du plan, ou de le confier à un autre intervenant. La lettre de recommandations vous appartient.",
  },
];

export default function NotreMethodePage() {
  useScrollReveal();

  return (
    <>
      <Header />
      <PageHero
        title="Notre méthode"
        highlight="en 5 étapes"
        subtitle="Un diagnostic complet, des recommandations écrites, une mise en œuvre coordonnée et un suivi annuel. Chaque étape est claire, documentée et sans engagement jusqu'à votre accord."
        breadcrumb="Notre méthode"
        eyebrow="Méthodologie"
        stats={[
          { value: "5", label: "Phases formalisées" },
          { value: "4", label: "Livrables écrits" },
          { value: "10 ans", label: "Archivage des dossiers" },
        ]}
      />

      {/* 01, Manifeste */}
      <section className="section-padding bg-background">
        <div className="max-w-5xl mx-auto text-center reveal">
          <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-6 font-medium">
            Notre conviction
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-light tracking-tight leading-[1.1] text-foreground mb-8">
            Le conseil patrimonial mérite mieux qu'une recommandation produit.
          </h2>
          <div className="max-w-3xl mx-auto space-y-5 text-foreground/70 text-base md:text-lg font-light leading-relaxed">
            <p>
              Trop souvent, le conseil se résume à proposer un contrat. Nous croyons l'inverse : un bon conseil commence par un diagnostic complet, se construit autour de votre projet de vie et se mesure dans la durée.
            </p>
            <p>
              Notre méthode impose une discipline simple : écouter, formaliser par écrit, n'engager aucune décision sans un cadre clair. C'est exigeant. C'est ce qui fait la différence entre un courtier et un conseil.
            </p>
          </div>
        </div>
      </section>

      {/* 02, Principes */}
      <section className="section-padding section-ivory">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 reveal">
            <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-4 font-medium">
              Nos engagements
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-light tracking-tight leading-[1.1] text-foreground">
              Six règles qui structurent chaque mission.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {principes.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.label}
                  className={`reveal reveal-delay-${(i % 5) + 1} group p-6 rounded-2xl bg-background/60 border border-foreground/8 hover:border-foreground/15 transition-colors`}
                >
                  <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center mb-5 group-hover:bg-foreground/10 transition-colors">
                    <Icon className="w-5 h-5 text-foreground/60" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-lg text-foreground mb-2 tracking-tight">
                    {p.label}
                  </h3>
                  <p className="text-foreground/65 text-sm leading-relaxed font-light">
                    {p.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 03, Les 5 phases */}
      <section className="section-padding bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal">
            <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-4 font-medium">
              Déroulement
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-light tracking-tight leading-[1.05] text-foreground mb-5">
              De la première écoute au suivi annuel.
            </h2>
            <p className="text-foreground/65 font-light max-w-2xl mx-auto">
              Chaque phase a un objectif clair, des livrables écrits et un interlocuteur identifié. Vous savez à chaque instant où vous en êtes.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line — desktop only */}
            <div className="hidden md:block absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-foreground/10" />

            <div className="space-y-12">
              {steps.map((step, i) => {
                const Icon = step.icon;
                const isEven = i % 2 === 0;
                return (
                  <div
                    key={step.number}
                    className={`reveal relative grid md:grid-cols-2 gap-6 md:gap-16 items-center ${
                      isEven ? "" : "md:[direction:rtl]"
                    }`}
                  >
                    {/* Mobile node + card wrapper */}
                    <div className={`pl-16 md:pl-0 md:px-8 ${isEven ? "md:text-right md:[direction:ltr]" : "md:[direction:ltr]"}`}>
                      {/* Mobile node */}
                      <div className="md:hidden absolute left-0 top-0 z-10">
                        <div className="w-10 h-10 rounded-full bg-background border border-foreground/15 flex items-center justify-center shadow-[0_4px_16px_-6px_hsl(var(--foreground)/0.12)]">
                          <Icon className="w-4 h-4 text-foreground/70" strokeWidth={1.5} />
                        </div>
                      </div>

                      <div className="bg-background rounded-2xl p-6 md:p-8 border border-foreground/10 shadow-[0_4px_24px_-12px_hsl(var(--foreground)/0.08)]">
                        <div className={`flex items-center gap-3 mb-4 ${isEven ? "md:justify-end" : ""}`}>
                          <span className="text-[10px] tracking-[0.3em] uppercase text-foreground/45 font-medium">
                            {step.phase}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-foreground/25" />
                          <span className="text-[10px] tracking-[0.2em] uppercase text-foreground/55 font-medium flex items-center gap-1.5">
                            <Clock className="w-3 h-3" strokeWidth={1.5} />
                            {step.duration}
                          </span>
                        </div>
                        <h3 className="font-heading text-2xl md:text-3xl font-light text-foreground tracking-tight mb-3">
                          {step.title}
                        </h3>
                        <p className="text-foreground/65 text-sm md:text-base italic mb-4">
                          {step.summary}
                        </p>
                        <p className="text-foreground/70 text-sm md:text-[15px] leading-relaxed font-light mb-6">
                          {step.description}
                        </p>
                        <div className={`inline-flex flex-wrap gap-2 ${isEven ? "md:justify-end" : ""}`}>
                          {step.livrables.map((l) => (
                            <span
                              key={l}
                              className="text-[11px] px-3 py-1.5 rounded-full bg-foreground/5 text-foreground/70 font-light border border-foreground/8"
                            >
                              {l}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Desktop center node */}
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10">
                      <div className="w-12 h-12 rounded-full bg-background border border-foreground/15 flex items-center justify-center shadow-[0_4px_16px_-6px_hsl(var(--foreground)/0.12)]">
                        <Icon className="w-5 h-5 text-foreground/70" strokeWidth={1.5} />
                      </div>
                    </div>

                    {/* Empty side for alignment */}
                    <div className="hidden md:block" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 04, Cadre des livrables */}
      <section className="section-padding section-ivory">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-2 reveal lg:sticky lg:top-32 lg:self-start">
              <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-4 font-medium">
                Livrables écrits
              </p>
              <h2 className="text-3xl md:text-4xl font-heading font-light tracking-tight leading-[1.1] text-foreground mb-5">
                Tout est écrit. Tout est conservé.
              </h2>
              <p className="text-foreground/70 font-light leading-relaxed">
                Quatre documents jalonnent chaque mission. Ils vous appartiennent, sont datés, signés et archivés dix ans.
              </p>
            </div>
            <div className="lg:col-span-3">
              <div className="grid sm:grid-cols-2 gap-6">
                {livrablesCadre.map((l, i) => {
                  const Icon = l.icon;
                  return (
                    <div
                      key={l.title}
                      className={`reveal reveal-delay-${(i % 4) + 1} p-6 rounded-2xl bg-background/60 border border-foreground/8`}
                    >
                      <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-foreground/60" strokeWidth={1.5} />
                      </div>
                      <div className="font-heading text-2xl font-extralight text-foreground/25 mb-2 tabular-nums">
                        {l.number}
                      </div>
                      <h3 className="font-heading text-lg font-normal text-foreground mb-2 tracking-tight">
                        {l.title}
                      </h3>
                      <p className="text-foreground/70 text-sm leading-relaxed font-light">
                        {l.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 05, Gouvernance & déontologie */}
      <section className="section-padding bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 reveal">
            <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-4 font-medium">
              Gouvernance
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-light tracking-tight leading-[1.05] text-foreground">
              Un cadre réglementaire strict, des contrôles indépendants.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {garanties.map((g, i) => {
              const Icon = g.icon;
              return (
                <div
                  key={g.label}
                  className={`reveal reveal-delay-${(i % 4) + 1} p-6 rounded-2xl border border-foreground/10 bg-background`}
                >
                  <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-foreground/60" strokeWidth={1.5} />
                  </div>
                  <div className="text-[10px] tracking-[0.28em] uppercase text-foreground/45 mb-2">
                    {g.label}
                  </div>
                  <div className="font-heading text-xl font-light text-foreground tracking-tight mb-3">
                    {g.value}
                  </div>
                  <p className="text-foreground/70 text-sm leading-relaxed font-light">
                    {g.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 06, FAQ courte */}
      <section className="section-padding section-ivory">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-4 reveal lg:sticky lg:top-32 lg:self-start">
              <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-4 font-medium">
                Questions fréquentes
              </p>
              <h2 className="text-3xl md:text-4xl font-heading font-light tracking-tight leading-[1.1] text-foreground">
                Ce que vous nous demandez avant de commencer.
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
                    <h3 className="font-heading text-lg md:text-xl font-normal text-foreground tracking-tight mb-3 flex items-start gap-3">
                      <ChevronRight className="w-4 h-4 mt-1.5 text-foreground/30 shrink-0" />
                      {f.q}
                    </h3>
                    <p className="text-foreground/70 text-sm md:text-[15px] font-light leading-relaxed pl-7">
                      {f.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <PageCTA
        title="Mettons cette méthode au service de votre patrimoine."
        subtitle="30 minutes pour comprendre votre situation, identifier les sujets prioritaires et juger si notre démarche vous convient."
        eyebrow="Notre méthode"
        index="07"
        secondaryText="Voir les cas clients"
        secondaryHref="/cas-clients"
      />
      <Footer />
    </>
  );
}
