import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";

const articles = [
  {
    date: "Avril 2026",
    readingTime: "8 min",
    tag: "Investissement",
    title: "SCPI en 2026 : ce qu'il faut savoir avant d'investir",
    excerpt:
      "Après deux années de correction, le marché des SCPI se stabilise. Analyse des rendements, de la liquidité et des critères de sélection.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80",
    featured: true,
  },
  {
    date: "Mars 2026",
    readingTime: "5 min",
    tag: "Épargne",
    title: "Assurance-vie : quand faut-il arbitrer ?",
    excerpt: "Un contrat d'assurance-vie n'est pas un placement qu'on oublie. Quand et comment réallouer pour rester aligné avec vos objectifs.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    date: "Mars 2026",
    readingTime: "6 min",
    tag: "Transmission",
    title: "Donation : transmettre sereinement",
    excerpt: "Abattements, délais de rappel, démembrement : les mécanismes essentiels pour préparer une transmission efficace.",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80",
  },
  {
    date: "Février 2026",
    readingTime: "7 min",
    tag: "Fiscalité",
    title: "Loi de finances 2026 : ce qui change pour votre patrimoine",
    excerpt: "Décryptage des mesures fiscales de la loi de finances et de leur impact sur votre stratégie patrimoniale.",
    image: "https://images.unsplash.com/photo-1554224154-26032cdc0c63?auto=format&fit=crop&w=1200&q=80",
  },
  {
    date: "Février 2026",
    readingTime: "4 min",
    tag: "Retraite",
    title: "PER : pour qui, pourquoi, comment ?",
    excerpt: "Avantages fiscaux, conditions de sortie, arbitrages : le PER expliqué pour ceux qui veulent préparer leur retraite.",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    date: "Janvier 2026",
    readingTime: "6 min",
    tag: "Immobilier",
    title: "Investir en nue-propriété : un mécanisme peu connu",
    excerpt: "Acquérir un bien à prix réduit, échapper à l'IFI, récupérer la pleine propriété au terme. Décryptage.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
  },
  {
    date: "Janvier 2026",
    readingTime: "9 min",
    tag: "Dirigeants",
    title: "Cession d'entreprise : préparer sa sortie en amont",
    excerpt: "Les étapes pour maximiser le prix de vente et optimiser la fiscalité de la plus-value de cession.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    date: "Décembre 2025",
    readingTime: "7 min",
    tag: "Allocation",
    title: "Diversification : au-delà des marchés cotés",
    excerpt: "Private equity, dette privée, forêts, infrastructures. Panorama des classes d'actifs alternatives accessibles.",
    image: "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    date: "Décembre 2025",
    readingTime: "5 min",
    tag: "Prévoyance",
    title: "Protéger sa famille : les contrats essentiels",
    excerpt: "Assurance décès, invalidité, dépendance : identifier les couvertures indispensables et les lacunes fréquentes.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  },
];

const categories = ["Toutes", "Investissement", "Épargne", "Transmission", "Fiscalité", "Retraite", "Immobilier", "Dirigeants", "Allocation", "Prévoyance"];

export default function ActualitesPage() {
  useScrollReveal();
  const [activeCategory, setActiveCategory] = useState("Toutes");

  const featured = articles.find((a) => a.featured)!;
  const filtered = useMemo(
    () =>
      articles
        .filter((a) => !a.featured)
        .filter((a) => activeCategory === "Toutes" || a.tag === activeCategory),
    [activeCategory]
  );

  return (
    <>
      <Header />
      <PageHero
        eyebrow="Magazine · Éclairages"
        title="Actualités"
        highlight="patrimoniales"
        subtitle="Analyses, décryptages et points de vue pour éclairer vos décisions patrimoniales. Une veille régulière au service de votre stratégie."
        breadcrumb="Actualités"
      />

      {/* Featured article */}
      <section className="section-dark relative overflow-hidden pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="group relative rounded-[2rem] overflow-hidden glass-dark cursor-pointer"
          >
            <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                style={{ backgroundImage: `url(${featured.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--navy-deep))]/95 via-[hsl(var(--navy-deep))]/40 to-transparent" />
              <span className="absolute top-6 left-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-[10px] tracking-[0.3em] uppercase text-white font-medium">
                À la une · {featured.tag}
              </span>
              <div className="absolute bottom-0 inset-x-0 p-8 md:p-12 lg:p-14">
                <p className="text-[10px] tracking-[0.3em] uppercase text-white/60 mb-4 font-medium">
                  {featured.date} · {featured.readingTime} de lecture
                </p>
                <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-light text-white mb-5 leading-[1.05] tracking-tight max-w-3xl group-hover:text-[hsl(var(--electric-soft))] transition-colors duration-500">
                  {featured.title}
                </h2>
                <p className="text-white/70 text-base leading-relaxed font-light max-w-2xl mb-6">
                  {featured.excerpt}
                </p>
                <span className="inline-flex items-center gap-2 text-sm text-white tracking-wide">
                  Lire l'analyse
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      {/* Filters + grid */}
      <section className="section-dark relative overflow-hidden pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <div
                className="electric-line mb-5"
                style={{ background: "linear-gradient(90deg, hsl(210 100% 70%), hsl(210 100% 70% / 0.2))" }}
              />
              <p className="text-[11px] tracking-[0.3em] uppercase text-white/50 mb-4 font-medium">
                Toutes les analyses
              </p>
              <h2 className="font-heading text-3xl md:text-4xl font-light text-white tracking-tight leading-[1.05]">
                Explorer par <span className="italic text-white/75">thématique</span>
              </h2>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs tracking-wide transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-white text-[hsl(var(--navy-deep))] font-medium"
                    : "glass-dark text-white/65 hover:text-white hover:border-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {filtered.map((a, i) => (
              <motion.article
                key={a.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex flex-col rounded-[1.5rem] glass-dark cursor-pointer hover:border-white/15 transition-all duration-500 overflow-hidden"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                    style={{ backgroundImage: `url(${a.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--navy-deep))]/80 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[10px] tracking-[0.25em] uppercase text-white font-medium">
                    {a.tag}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-[10px] text-white/40 tracking-[0.25em] uppercase mb-3 font-medium">
                    {a.date} · {a.readingTime}
                  </p>
                  <h3 className="font-heading text-lg font-normal text-white mb-3 leading-snug tracking-tight group-hover:text-[hsl(var(--electric-soft))] transition-colors duration-500">
                    {a.title}
                  </h3>
                  <p className="text-white/55 text-[13px] leading-relaxed font-light line-clamp-3 mb-5">
                    {a.excerpt}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 text-[12px] text-white/80 tracking-wide">
                    Lire l'article
                    <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </motion.article>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-white/50 py-16 text-sm">Aucun article dans cette catégorie pour le moment.</p>
          )}
        </div>
      </section>

      <PageCTA
        variant="ivory"
        title="Restez informé"
        eyebrow="Actualités"
        index="08"
        subtitle="Recevez nos analyses patrimoniales directement par email, une à deux fois par mois."
        buttonText="S'inscrire à la newsletter"
      />
      <Footer />
    </>
  );
}
