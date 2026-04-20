import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";

const articles = [
  { date: "Avril 2026", tag: "Investissement", title: "SCPI en 2026 : ce qu'il faut savoir avant d'investir", excerpt: "Après deux années de correction, le marché des SCPI se stabilise. Analyse des rendements, de la liquidité et des critères de sélection." },
  { date: "Mars 2026", tag: "Épargne", title: "Assurance-vie : quand faut-il arbitrer ?", excerpt: "Un contrat d'assurance-vie n'est pas un placement qu'on oublie. Quand et comment réallouer pour rester aligné avec vos objectifs." },
  { date: "Mars 2026", tag: "Transmission", title: "Donation : les règles à connaître pour transmettre sereinement", excerpt: "Abattements, délais de rappel, démembrement : les mécanismes essentiels pour préparer une transmission efficace." },
  { date: "Février 2026", tag: "Fiscalité", title: "Loi de finances 2026 : ce qui change pour votre patrimoine", excerpt: "Décryptage des mesures fiscales de la loi de finances et de leur impact sur votre stratégie patrimoniale." },
  { date: "Février 2026", tag: "Retraite", title: "PER : pour qui, pourquoi, comment ?", excerpt: "Avantages fiscaux, conditions de sortie, arbitrages : le PER expliqué pour ceux qui veulent préparer leur retraite." },
  { date: "Janvier 2026", tag: "Immobilier", title: "Investir en nue-propriété : un mécanisme peu connu", excerpt: "Acquérir un bien à prix réduit, échapper à l'IFI, récupérer la pleine propriété au terme. Décryptage." },
  { date: "Janvier 2026", tag: "Dirigeants", title: "Cession d'entreprise : préparer sa sortie en amont", excerpt: "Les étapes pour maximiser le prix de vente et optimiser la fiscalité de la plus-value de cession." },
  { date: "Décembre 2025", tag: "Allocation", title: "Diversification : au-delà des marchés cotés", excerpt: "Private equity, dette privée, forêts, infrastructures. Panorama des classes d'actifs alternatives accessibles." },
  { date: "Décembre 2025", tag: "Prévoyance", title: "Protéger sa famille : les contrats essentiels", excerpt: "Assurance décès, invalidité, dépendance : identifier les couvertures indispensables et les lacunes fréquentes." },
];

export default function ActualitesPage() {
  useScrollReveal();

  return (
    <>
      <Header />
      <PageHero
        title="Actualités"
        highlight="patrimoniales"
        subtitle="Analyses, décryptages et points de vue pour éclairer vos décisions patrimoniales. Une veille régulière au service de votre stratégie."
        breadcrumb="Actualités"
      />

      <section className="section-padding bg-background texture-paper">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-0">
            {articles.map((a, i) => (
              <article
                key={a.title}
                className={`reveal reveal-delay-${(i % 3) + 1} group cursor-pointer py-8 ${i < articles.length - 1 ? "border-b border-border" : ""}`}
              >
                <div className="flex flex-col md:flex-row md:items-start md:gap-8">
                  <p className="text-xs text-gray-text/50 tracking-wide uppercase md:w-32 flex-shrink-0 mb-2 md:mb-0 md:pt-1">{a.date}</p>
                  <div>
                    <p className="text-xs text-gold tracking-widest uppercase mb-2">{a.tag}</p>
                    <h3 className="font-heading text-xl font-semibold text-primary mb-2 group-hover:text-gold transition-colors duration-300 leading-snug">
                      {a.title}
                    </h3>
                    <p className="text-gray-text text-sm leading-relaxed">{a.excerpt}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PageCTA
        variant="ivory"
        title="Restez informé"
        subtitle="Recevez nos analyses patrimoniales directement par email, une à deux fois par mois."
        buttonText="S'inscrire à la newsletter"
      />
      <Footer />
    </>
  );
}
