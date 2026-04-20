import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import TrustBand from "@/components/TrustBand";
import CreditSimulator from "@/components/simulators/CreditSimulator";

export default function FinancementPage() {
  useScrollReveal();

  return (
    <>
      <Header />
      <PageHero
        title="Financement & crédit"
        subtitle="Obtenir les meilleures conditions de financement pour vos projets immobiliers et professionnels. Courtage indépendant, conseil intégré."
        breadcrumb="Financement"
      />

      <section className="section-padding bg-background texture-paper">
        <div className="max-w-5xl mx-auto">
          <div className="reveal">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary leading-tight mb-6">
              Le crédit n'est pas qu'une question de taux. C'est un outil patrimonial.
            </h2>
            <p className="text-gray-text leading-relaxed mb-4">
              Un financement bien structuré peut accélérer la constitution de votre patrimoine, optimiser votre fiscalité et préserver votre capacité d'investissement. Mal calibré, il peut au contraire rigidifier votre situation et limiter vos marges de manœuvre.
            </p>
            <p className="text-gray-text leading-relaxed mb-8">
              En tant que courtier indépendant, nous accédons aux offres de nombreux établissements bancaires. Nous négocions pour vous les meilleures conditions — taux, assurance emprunteur, garanties, modularité — en intégrant chaque financement dans votre stratégie patrimoniale globale.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 reveal">
            {[
              { title: "Résidence principale", text: "Acquisition, renégociation, rachat de crédit. Analyse de la capacité d'emprunt et de l'impact fiscal." },
              { title: "Investissement locatif", text: "Financement de projets patrimoniaux, effet de levier, déductibilité des intérêts, montages en SCI." },
              { title: "Crédit professionnel", text: "Financement de l'acquisition, du développement ou de la restructuration de votre activité." },
              { title: "Crédit lombard", text: "Emprunt adossé à vos actifs financiers pour financer un projet sans liquider vos placements." },
              { title: "SCI & montages", text: "Financement structuré via des personnes morales, prêts intra-groupe, refinancement de holding." },
              { title: "Assurance emprunteur", text: "Délégation d'assurance, comparaison des garanties, optimisation du coût total du crédit." },
            ].map((t, i) => (
              <div key={t.title} className={`reveal-delay-${(i % 2) + 1} border-t border-border pt-6`}>
                <h3 className="font-heading text-lg font-semibold text-primary mb-2">{t.title}</h3>
                <p className="text-gray-text text-sm leading-relaxed">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simulator */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto reveal">
          <CreditSimulator />
          <p className="text-[11px] text-foreground/45 mt-6 text-center">
            Simulation indicative hors assurance et frais de dossier. Les conditions réelles dépendent de votre profil emprunteur.
          </p>
        </div>
      </section>

      <TrustBand />
      <PageCTA
        title="Parlons de votre projet de financement"
        subtitle="Nous étudions votre dossier et vous obtenons les meilleures conditions du marché."
      />
      <Footer />
    </>
  );
}
