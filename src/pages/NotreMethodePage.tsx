import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageCTA from "@/components/PageCTA";
import heroBg from "@/assets/notre-methode-hero.png";
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
  ShieldCheck,
  Lock,
  BadgeCheck,
  ChevronRight,
  Clock,
} from "lucide-react";

const principes = [
  { icon: Scale, label: "Objectivité", text: "Aucun groupe bancaire ou assurantiel derrière nous. Nos conseils ne sont liés à aucun objectif de vente." },
  { icon: Layers, label: "Architecture ouverte", text: "Nous comparons les contrats du marché : assurance-vie, PER, SCPI, private equity. Sans produit maison ni quota." },
  { icon: Eye, label: "Transparence des frais", text: "Chaque frais et chaque rémunération est détaillé par écrit avant toute décision. Pas de coût caché." },
  { icon: FileText, label: "Une information claire", text: "Les éléments utiles à la mission et les recommandations formulées sont présentés au client selon la nature de son accompagnement." },
  { icon: Users, label: "Coordination", text: "Nous travaillons avec votre notaire, avocat fiscaliste et expert-comptable. La cohérence prime sur le produit isolé." },
  { icon: Phone, label: "Disponibilité", text: "Un conseiller référent joignable directement. Pas de plateau, pas de rotation d'interlocuteurs, pas de scripts." },
];

const steps = [
  {
    number: "01", phase: "Phase 1", duration: "Premier échange",
    title: "Échange de découverte",
    summary: "Un premier échange nous permet de comprendre votre situation, vos objectifs et les sujets sur lesquels vous souhaitez être accompagné.",
    description: "Nous prenons le temps d'écouter votre situation familiale, professionnelle et patrimoniale. Nous identifions les sujets qui méritent d'être creusés et ceux qui peuvent attendre. Aucune recommandation à ce stade : juste un cadrage clair de la mission.",
    livrables: [] as string[],
    icon: MessageCircle,
  },
  {
    number: "02", phase: "Phase 2", duration: "Cadrage",
    title: "Définition de la mission",
    summary: "Lorsque votre besoin est identifié, une lettre de mission précise le périmètre de notre intervention et les modalités de l'accompagnement proposé.",
    description: "À partir de vos documents, nous reconstituons la cartographie de votre patrimoine. Fiscalité, prévoyance, succession : nous repérons les forces, les fragilités et les marges de manœuvre. Ce travail est fait en interne, jamais sous-traité.",
    livrables: [] as string[],
    icon: Search,
  },
  {
    number: "03", phase: "Phase 3", duration: "Analyse",
    title: "Recommandations",
    summary: "Après analyse des éléments utiles, nous vous présentons un rapport de conseil détaillant les solutions envisagées au regard de votre situation, de vos objectifs et de votre patrimoine.",
    description: "Nous vous présentons un document écrit : diagnostic, enjeux, recommandations argumentées et scénarios comparés. Le plan d'action est classé par priorité. Ce document vous appartient, vous pouvez le partager avec vos autres conseils.",
    livrables: [] as string[],
    icon: Lightbulb,
  },
  {
    number: "04", phase: "Phase 4", duration: "Selon votre calendrier",
    title: "Mise en œuvre",
    summary: "Lorsque vous souhaitez donner suite aux recommandations, nous vous accompagnons dans la mise en place des solutions retenues et dans les démarches associées.",
    description: "Si vous nous confiez la mise en œuvre, nous négocions les conditions, ouvrons les contrats et coordonnons les intervenants. Chaque étape est validée par vous par écrit. Aucun ordre n'est passé sans votre accord explicite.",
    livrables: [] as string[],
    icon: Rocket,
  },
  {
    number: "05", phase: "Phase 5", duration: "Continu",
    title: "Suivi",
    summary: "L'accompagnement se poursuit par un suivi réglementaire et des échanges adaptés à l'évolution de votre situation, de vos projets et des solutions mises en place.",
    description: "Chaque année, nous faisons le point sur l'évolution de votre patrimoine, les changements législatifs et les ajustements nécessaires. Entre deux rendez-vous, votre conseiller reste joignable.",
    livrables: [] as string[],
    icon: TrendingUp,
  },
];


const garanties = [
  { icon: BadgeCheck, label: "Statut", value: "CIF, ORIAS", text: "Conseiller en Investissements Financiers, immatriculé à l'ORIAS et adhérent à une association agréée par les autorités compétentes." },
  { icon: ShieldCheck, label: "Assurance", value: "RC Pro", text: "Responsabilité civile professionnelle conforme aux exigences réglementaires." },
  { icon: ClipboardCheck, label: "Conformité", value: "MIF II / DDA", text: "Recueil d'adéquation, profil de risque et information précontractuelle systématiques." },
  { icon: Lock, label: "Confidentialité", value: "RGPD", text: "Données chiffrées, hébergement européen, accès restreint et journalisé." },
];

const faqs = [
  { q: "Combien coûte la mission ?", a: "Le premier rendez-vous est gratuit. Au-delà, nous facturons soit en honoraires de conseil, soit via les rétrocessions des contrats, toujours détaillées par écrit. Le mode de rémunération est validé avec vous dans la lettre de mission." },
  { q: "Travaillez-vous en architecture ouverte ?", a: "Oui. Nous n'appartenons à aucun groupe bancaire ou assurantiel. Nous travaillons avec une trentaine de partenaires sélectionnés sur la qualité et les conditions tarifaires." },
  { q: "Faut-il un patrimoine minimum ?", a: "Non. Notre méthode s'adapte dès qu'il existe un enjeu patrimonial : création d'entreprise, cession, transmission, optimisation fiscale ou structuration immobilière." },
  { q: "Que se passe-t-il si je ne suis pas vos recommandations ?", a: "Rien. Vous restez libre de ne mettre en œuvre qu'une partie du plan, ou de le confier à un autre intervenant. La lettre de recommandations vous appartient." },
];

export default function NotreMethodePage() {
  useScrollReveal();

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);

  return (
    <>
      <Header />

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative overflow-hidden" style={{ minHeight: "68vh" }}>
        <motion.div className="absolute inset-0 will-change-transform" style={{ y: imageY, scale: 1.14 }}>
          <img src={heroBg} alt="" aria-hidden className="w-full h-full object-cover object-center" fetchPriority="high" />
        </motion.div>

        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
          background: "linear-gradient(105deg, hsl(0 0% 100% / 0.98) 0%, hsl(0 0% 100% / 0.92) 28%, hsl(0 0% 100% / 0.60) 52%, hsl(0 0% 100% / 0.08) 70%, transparent 82%)"
        }} />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-36 pointer-events-none" style={{ background: "linear-gradient(to top, hsl(0 0% 100%) 0%, transparent 100%)" }} />

        <div className="relative z-10 flex items-center min-h-[68vh] py-28 lg:py-36">
          <div className="max-w-6xl mx-auto px-8 md:px-14 w-full">
            <div className="max-w-[540px]">

              <motion.div className="flex items-center gap-2 mb-7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }}>
                <span className="w-5 h-[2px]" style={{ background: "hsl(224 60% 22%)" }} />
                <p className="text-[11px] tracking-[0.32em] uppercase font-medium" style={{ color: "hsl(224 60% 22%)" }}>
                  Méthodologie · KANTI
                </p>
              </motion.div>

              <motion.h1 className="font-heading font-light leading-[1.04] tracking-tight mb-6"
                style={{ fontSize: "clamp(2.6rem, 5.5vw, 4rem)", color: "hsl(224 60% 12%)" }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
                Notre méthode<br />
                <span className="italic" style={{ color: "hsl(224 55% 30%)" }}>en 5 étapes.</span>
              </motion.h1>

              <motion.p className="text-[15px] font-light leading-relaxed mb-10"
                style={{ color: "hsl(224 25% 32%)" }}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                Un diagnostic complet, des recommandations écrites, une mise en œuvre coordonnée et un suivi annuel. Chaque étape est claire, documentée et sans engagement jusqu'à votre accord.
              </motion.p>


            </div>
          </div>
        </div>
      </section>

      {/* ── Manifeste ── */}
      <section className="section-padding bg-white">
        <div className="max-w-5xl mx-auto text-center reveal">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-light tracking-tight leading-[1.1] mb-8" style={{ color: "hsl(224 60% 10%)" }}>
            Le conseil patrimonial mérite mieux qu'une recommandation produit.
          </h2>
          <div className="max-w-3xl mx-auto space-y-5 text-base md:text-lg font-light leading-relaxed" style={{ color: "hsl(224 18% 40%)" }}>
            <p>Trop souvent, le conseil se résume à proposer un contrat. Nous croyons l'inverse : un bon conseil commence par un diagnostic complet, se construit autour de votre projet de vie et se mesure dans la durée.</p>
            <p>Notre méthode impose une discipline simple : écouter, formaliser par écrit, n'engager aucune décision sans un cadre clair. C'est exigeant. C'est ce qui fait la différence entre un courtier et un conseil.</p>
          </div>
        </div>
      </section>

      {/* ── Principes ── */}
      <section className="section-padding section-ivory">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 reveal">
            <h2 className="text-3xl md:text-4xl font-heading font-light tracking-tight leading-[1.1]" style={{ color: "hsl(224 60% 10%)" }}>
              Six règles qui structurent chaque mission.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {principes.map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={p.label}
                  className={`reveal reveal-delay-${(i % 5) + 1} group p-6 rounded-2xl bg-white border transition-all duration-300 hover:-translate-y-0.5`}
                  style={{ borderColor: "hsl(224 20% 12% / 0.07)", boxShadow: "0 2px 12px -4px hsl(224 60% 12% / 0.06)" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mb-5 transition-colors" style={{ background: "hsl(224 30% 12% / 0.05)" }}>
                    <Icon className="w-5 h-5" strokeWidth={1.5} style={{ color: "hsl(224 45% 35%)" }} />
                  </div>
                  <h3 className="font-heading text-lg mb-2 tracking-tight" style={{ color: "hsl(224 55% 12%)" }}>{p.label}</h3>
                  <p className="text-sm leading-relaxed font-light" style={{ color: "hsl(224 15% 42%)" }}>{p.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Les 5 phases ── */}
      <section className="section-padding bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-light tracking-tight leading-[1.05] mb-5" style={{ color: "hsl(224 60% 10%)" }}>
              De la première écoute au suivi annuel.
            </h2>
            <p className="font-light max-w-2xl mx-auto" style={{ color: "hsl(224 15% 45%)" }}>
              Chaque phase a un objectif clair, des livrables écrits et un interlocuteur identifié. Vous savez à chaque instant où vous en êtes.
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute left-1/2 -translate-x-px top-0 bottom-0 w-px" style={{ background: "hsl(224 20% 12% / 0.10)" }} />
            <div className="space-y-12">
              {steps.map((step, i) => {
                const Icon = step.icon;
                const isEven = i % 2 === 0;
                return (
                  <div key={step.number}
                    className={`reveal relative grid md:grid-cols-2 gap-6 md:gap-16 items-center ${isEven ? "" : "md:[direction:rtl]"}`}>
                    <div className={`pl-16 md:pl-0 md:px-8 ${isEven ? "md:text-right md:[direction:ltr]" : "md:[direction:ltr]"}`}>
                      <div className="md:hidden absolute left-0 top-0 z-10">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm" style={{ border: "1px solid hsl(224 20% 12% / 0.12)" }}>
                          <Icon className="w-4 h-4" strokeWidth={1.5} style={{ color: "hsl(224 40% 40%)" }} />
                        </div>
                      </div>
                      <div className="bg-white rounded-2xl p-6 md:p-8" style={{ border: "1px solid hsl(224 20% 12% / 0.08)", boxShadow: "0 4px 24px -12px hsl(224 60% 12% / 0.09)" }}>
                        <div className={`flex items-center gap-3 mb-4 ${isEven ? "md:justify-end" : ""}`}>
                          <span className="text-[10px] tracking-[0.3em] uppercase font-medium" style={{ color: "hsl(224 25% 50%)" }}>{step.phase}</span>
                          <span className="w-1 h-1 rounded-full" style={{ background: "hsl(224 20% 60%)" }} />
                          <span className="text-[10px] tracking-[0.2em] uppercase font-medium flex items-center gap-1.5" style={{ color: "hsl(224 20% 55%)" }}>
                            <Clock className="w-3 h-3" strokeWidth={1.5} />
                            {step.duration}
                          </span>
                        </div>
                        <h3 className="font-heading text-2xl md:text-3xl font-light tracking-tight mb-3" style={{ color: "hsl(224 55% 12%)" }}>{step.title}</h3>
                        <p className="text-sm md:text-base italic mb-4" style={{ color: "hsl(224 25% 45%)" }}>{step.summary}</p>
                        <p className="text-sm md:text-[15px] leading-relaxed font-light mb-6" style={{ color: "hsl(224 15% 40%)" }}>{step.description}</p>
                        {step.livrables.length > 0 && (
                          <div className={`inline-flex flex-wrap gap-2 ${isEven ? "md:justify-end" : ""}`}>
                            {step.livrables.map((l) => (
                              <span key={l} className="text-[11px] px-3 py-1.5 rounded-full font-light" style={{ background: "hsl(224 30% 12% / 0.04)", color: "hsl(224 30% 40%)", border: "1px solid hsl(224 20% 12% / 0.08)" }}>
                                {l}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center" style={{ border: "1px solid hsl(224 20% 12% / 0.12)", boxShadow: "0 4px 16px -6px hsl(224 60% 12% / 0.10)" }}>
                        <Icon className="w-5 h-5" strokeWidth={1.5} style={{ color: "hsl(224 40% 40%)" }} />
                      </div>
                    </div>
                    <div className="hidden md:block" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section-padding section-ivory">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-4 reveal lg:sticky lg:top-32 lg:self-start">
              <h2 className="text-3xl md:text-4xl font-heading font-light tracking-tight leading-[1.1]" style={{ color: "hsl(224 55% 12%)" }}>
                Ce que vous nous demandez avant de commencer.
              </h2>
            </div>
            <div className="lg:col-span-8">
              <div className="space-y-0">
                {faqs.map((f, i) => (
                  <div key={f.q}
                    className={`reveal reveal-delay-${(i % 4) + 1} py-7 ${i < faqs.length - 1 ? "border-b" : ""}`}
                    style={{ borderColor: "hsl(224 20% 12% / 0.10)" }}>
                    <h3 className="font-heading text-lg md:text-xl font-normal tracking-tight mb-3 flex items-start gap-3" style={{ color: "hsl(224 55% 12%)" }}>
                      <ChevronRight className="w-4 h-4 mt-1.5 shrink-0" strokeWidth={1.5} style={{ color: "hsl(224 20% 55%)" }} />
                      {f.q}
                    </h3>
                    <p className="text-sm md:text-[15px] font-light leading-relaxed pl-7" style={{ color: "hsl(224 15% 42%)" }}>{f.a}</p>
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
      />
      <Footer />
    </>
  );
}
