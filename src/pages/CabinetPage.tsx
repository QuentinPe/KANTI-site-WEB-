import { useScrollReveal } from "@/hooks/useScrollReveal";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Clock, Network } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageCTA from "@/components/PageCTA";
import VirtualTourFAB from "@/components/VirtualTourFAB";
import CabinetHeroSequence from "@/components/cabinet/CabinetHeroSequence";
import CabinetAdresse from "@/components/cabinet/CabinetAdresse";

const ADN = [
  {
    icon: Shield,
    title: "Indépendance totale",
    text: "Architecture ouverte, aucun produit maison, aucune pression commerciale. Nous sélectionnons les meilleures solutions parmi plus de 30 partenaires en fonction de votre seul intérêt.",
  },
  {
    icon: Clock,
    title: "Proximité & durée",
    text: "Un interlocuteur dédié, une relation qui s'inscrit dans le temps. Vos dossiers sont archivés 10 ans, chaque recommandation est écrite, discutée et signée.",
  },
  {
    icon: Network,
    title: "Expertise pluridisciplinaire",
    text: "Fiscalité, immobilier, transmission, financement. Une vision 360° coordonnée en étroite collaboration avec vos notaires, avocats fiscalistes et experts-comptables.",
  },
];

const EQUIPE = [
  {
    name: "Quentin Perromat",
    role: "Associé Fondateur",
    short: "Vision · stratégie · clientèle",
    bio: "Fondateur de KANTI, Quentin accompagne ses clients avec une approche globale et indépendante de la gestion de patrimoine. Passionné par la transmission et l'optimisation fiscale, il construit avec chaque famille une stratégie patrimoniale sur mesure, fondée sur la confiance et la durée.",
    image: "/quentin-perromat.png",
    credentials: ["Associé Fondateur · KANTI", "Gestion de patrimoine indépendante", "ORIAS n° 20 000 855"],
  },
  {
    name: "Thomas Robert",
    role: "Courtier & Assistant en gestion de patrimoine",
    short: "Financement · suivi client",
    bio: "Thomas intervient aux côtés des clients sur les problématiques de financement et d'investissement. Rigoureux et à l'écoute, il assure le suivi opérationnel des dossiers et veille à ce que chaque solution retenue soit parfaitement adaptée à la situation de chaque client.",
    image: "/thomas-robert.png",
    credentials: ["Courtier en financement", "Assistant gestion de patrimoine", "Cabinet KANTI · Biarritz"],
  },
];

const AGREMENTS = [
  {
    title: "CIF",
    label: "Conseiller en Investissements Financiers",
    numero: "ORIAS n° 20 000 855",
    href: "https://www.orias.fr",
  },
  {
    title: "COA",
    label: "Courtier d'assurance",
    numero: "CNCEF Assurance n° 25/860422",
    href: "https://www.orias.fr",
  },
  {
    title: "IOBSP",
    label: "Courtier en opérations de banque",
    numero: "La Compagnie IOBSP n° F002635",
    href: "https://www.orias.fr",
  },
  {
    title: "Carte T",
    label: "Transaction immobilière",
    numero: "CPI33012020000045313 · CCI Bordeaux",
    href: "https://www.orias.fr",
  },
];

export default function CabinetPage() {
  useScrollReveal();
  const reduce = useReducedMotion();

  return (
    <>
      <Header />
      <CabinetHeroSequence />

      {/* Notre ADN */}
      <section id="adn" className="section-padding section-ivory">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 reveal max-w-2xl">
            <div className="electric-line mb-5" />
            <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-4 font-medium">
              Notre ADN
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-light text-foreground mb-5 tracking-tight leading-[1.05]">
              Un cabinet bâti sur<br />
              <span className="italic text-foreground/70">trois convictions.</span>
            </h2>
            <p className="text-foreground/60 text-lg font-light leading-relaxed">
              Indépendants par choix, rigoureux par conviction. Chez KANTI, chaque recommandation ne répond qu'à une seule exigence : votre intérêt.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {ADN.map((item, i) => (
              <motion.div
                key={item.title}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group p-7 rounded-2xl bg-background/60 border border-foreground/[0.08] hover:border-foreground/15 transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center mb-5">
                  <item.icon className="w-5 h-5 text-foreground/60" strokeWidth={1.5} />
                </div>
                <h3 className="font-heading text-xl font-normal text-foreground mb-3 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-foreground/60 text-[14px] leading-relaxed font-light">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* L'équipe */}
      <section id="equipe" className="section-padding bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 reveal max-w-2xl">
            <div className="electric-line mb-5" />
            <p className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-4 font-medium">
              L'équipe
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-light text-foreground mb-5 tracking-tight leading-[1.05]">
              À votre écoute,<br />
              <span className="italic text-foreground/70">à chaque étape.</span>
            </h2>
            <p className="text-foreground/60 text-lg font-light leading-relaxed">
              Un interlocuteur dédié par client. Plusieurs expertises mobilisées ensemble quand le dossier le demande.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl">
            {EQUIPE.map((member, i) => (
              <motion.article
                key={member.name}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative rounded-[2rem] overflow-hidden bg-white/40 backdrop-blur-sm border border-foreground/[0.06] hover:border-foreground/15 transition-all duration-500"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center grayscale-[0.35] transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:grayscale-0"
                    style={{ backgroundImage: `url(${member.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/10 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-6">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-white/70 mb-2 font-medium">{member.short}</p>
                    <h3 className="font-heading text-2xl font-light text-white tracking-tight leading-tight">
                      {member.name}
                    </h3>
                  </div>
                </div>
                <div className="p-6 lg:p-7">
                  <p className="text-[hsl(var(--electric))] text-[11px] font-medium mb-4 tracking-[0.15em] uppercase">
                    {member.role}
                  </p>
                  <p className="text-foreground/65 text-[14px] leading-relaxed font-light mb-5">
                    {member.bio}
                  </p>
                  <ul className="space-y-1.5 border-t border-foreground/10 pt-4 mb-5">
                    {member.credentials.map((c) => (
                      <li key={c} className="flex items-center gap-2 text-[12px] text-foreground/55 font-light">
                        <span className="w-1 h-1 rounded-full bg-[hsl(var(--electric))]" />
                        {c}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 text-[12px] font-medium text-foreground/60 hover:text-foreground transition-colors duration-300"
                  >
                    Prendre rendez-vous avec {member.name.split(" ")[0]} →
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Agréments */}
      <section id="agrements" className="section-padding section-dark">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 reveal max-w-2xl">
            <p className="text-[11px] tracking-[0.3em] uppercase text-white/50 mb-4 font-medium">
              Transparence & réglementation
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-light text-white mb-5 tracking-tight leading-[1.05]">
              Un cabinet réglementé,<br />
              <span className="italic text-white/65">auditable.</span>
            </h2>
            <p className="text-white/60 text-lg font-light leading-relaxed">
              Nos habilitations sont publiques et vérifiables sur orias.fr.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {AGREMENTS.map((a, i) => (
              <motion.div
                key={a.title}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="glass-dark rounded-2xl p-5 flex flex-col gap-3"
              >
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/40 font-medium">
                  Habilitation
                </span>
                <p className="font-heading text-2xl font-light text-white tracking-tight">
                  {a.title}
                </p>
                <p className="text-white/65 text-[13px] font-light leading-snug flex-1">
                  {a.label}
                </p>
                <p className="font-mono text-[11px] text-white/40 leading-snug">
                  {a.numero}
                </p>
                <a
                  href={a.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-white/40 hover:text-white/70 transition-colors duration-300 underline underline-offset-2"
                >
                  Vérifier sur orias.fr →
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CabinetAdresse />

      <PageCTA
        title="Rencontrons-nous à Biarritz"
        subtitle="Un premier échange de 30 minutes pour parler de votre situation patrimoniale, sans engagement."
        eyebrow="Le cabinet"
        index="05"
        secondaryText="Découvrir notre méthode"
        secondaryHref="/notre-methode"
      />
      <Footer />

      <VirtualTourFAB href="https://adnfamily.com/studio/mind/adn/bureaux.html" />
    </>
  );
}
