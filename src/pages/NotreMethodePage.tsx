import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import TrustBand from "@/components/TrustBand";

const steps = [
  {
    number: "01",
    title: "Écoute & découverte",
    description: "Un premier rendez-vous de 30 minutes, gratuit et sans engagement. Nous vous écoutons, nous posons les bonnes questions, nous comprenons votre contexte : situation familiale, professionnelle, patrimoniale, fiscale. Nous ne faisons aucune recommandation lors de ce rendez-vous.",
  },
  {
    number: "02",
    title: "Audit patrimonial",
    description: "Sur la base des documents que vous nous fournissez, nous réalisons un audit complet : inventaire de vos actifs et passifs, analyse de votre fiscalité sur trois ans, diagnostic de votre couverture prévoyance, simulation successorale. Ce travail prend en général deux à trois semaines.",
  },
  {
    number: "03",
    title: "Lettre de recommandations",
    description: "Nous vous présentons un rapport structuré : diagnostic, enjeux identifiés, recommandations argumentées avec simulations chiffrées, plan d'action priorisé. Ce document est le vôtre — vous pouvez le partager avec votre notaire, votre avocat ou votre expert-comptable.",
  },
  {
    number: "04",
    title: "Mise en œuvre",
    description: "Si vous décidez de nous confier la mise en œuvre, nous sélectionnons les meilleurs contrats et supports du marché, ouvrons les comptes, réalisons les arbitrages et coordonnons les intervenants (notaire, assureur, banquier). Vous validez chaque étape.",
  },
  {
    number: "05",
    title: "Suivi annuel",
    description: "Chaque année, nous faisons le point ensemble : évolution de votre patrimoine, performances de vos placements, impact des changements législatifs, adaptation de la stratégie si nécessaire. Votre interlocuteur reste disponible toute l'année pour répondre à vos questions.",
  },
];

export default function NotreMethodePage() {
  useScrollReveal();

  return (
    <>
      <Header />
      <PageHero
        title="Notre méthode"
        subtitle="Un processus clair, documenté, reproductible. Pas de formule standard, mais une rigueur méthodologique qui garantit la qualité de notre conseil."
        breadcrumb="Notre méthode"
      />

      <section className="section-padding bg-background texture-paper">
        <div className="max-w-4xl mx-auto">
          <div className="reveal mb-14">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary leading-tight mb-6">
              Cinq étapes. De la découverte au suivi.
            </h2>
            <p className="text-gray-text leading-relaxed">
              Notre méthode est le fruit de quinze ans de pratique. Elle est conçue pour que chaque client, quelle que soit la complexité de sa situation, bénéficie du même niveau de rigueur, de transparence et de qualité de conseil.
            </p>
          </div>
          <div className="space-y-0">
            {steps.map((step, i) => (
              <div key={step.number} className={`reveal reveal-delay-${Math.min(i + 1, 5)} py-8 ${i < steps.length - 1 ? "border-b border-border" : ""}`}>
                <div className="flex gap-8">
                  <span className="text-gold/40 font-heading text-3xl font-semibold flex-shrink-0 w-12">{step.number}</span>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-primary mb-3">{step.title}</h3>
                    <p className="text-gray-text leading-relaxed text-sm">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding section-ivory">
        <div className="max-w-4xl mx-auto reveal">
          <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary leading-tight mb-6">
            Ce qui nous distingue
          </h2>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            {[
              { title: "Architecture ouverte", text: "Nous accédons à l'ensemble des produits du marché. Aucun quota, aucun produit maison, aucune pression commerciale." },
              { title: "Coordination pluridisciplinaire", text: "Nous travaillons en lien direct avec votre notaire, votre avocat et votre expert-comptable pour garantir la cohérence des décisions." },
              { title: "Documentation systématique", text: "Lettre de mission, rapport d'audit, lettre de recommandations, reporting de performance. Tout est écrit, daté, archivé." },
              { title: "Un interlocuteur dédié", text: "Vous avez un conseiller référent qui connaît votre situation. Pas de plateau téléphonique, pas de rotation d'interlocuteurs." },
            ].map((d, i) => (
              <div key={d.title} className={`reveal-delay-${(i % 2) + 1} border-t border-border pt-6`}>
                <h3 className="font-heading text-lg font-semibold text-primary mb-2">{d.title}</h3>
                <p className="text-gray-text text-sm leading-relaxed">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TrustBand />
      <PageCTA
        title="Commençons par un premier échange"
        subtitle="30 minutes pour comprendre votre situation et voir si nous pouvons vous aider."
        secondaryText="Voir les cas clients"
        secondaryHref="/cas-clients"
      />
      <Footer />
    </>
  );
}
