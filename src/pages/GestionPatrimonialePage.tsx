import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import TrustBand from "@/components/TrustBand";
import EpargneSimulator from "@/components/simulators/EpargneSimulator";

export default function GestionPatrimonialePage() {
  useScrollReveal();

  return (
    <>
      <Header />
      <PageHero
        title="Gestion patrimoniale"
        highlight="& placements"
        subtitle="Construire une allocation d'actifs cohérente avec vos objectifs, votre horizon et votre tolérance au risque. En toute indépendance."
        breadcrumb="Gestion patrimoniale"
      />

      <section className="section-padding bg-background texture-paper">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-14 items-start">
            <div className="lg:col-span-3 reveal">
              <h2 className="text-2xl md:text-3xl font-heading font-semibold text-primary leading-tight mb-6">
                Gérer son épargne, ce n'est pas cocher des cases dans un questionnaire bancaire
              </h2>
              <p className="text-gray-text leading-relaxed mb-4">
                Une allocation patrimoniale efficace ne se limite pas au choix entre fonds en euros et unités de compte. Elle intègre votre fiscalité, votre régime matrimonial, vos projets à cinq ou vingt ans, vos revenus futurs et votre capacité à absorber une baisse des marchés.
              </p>
              <p className="text-gray-text leading-relaxed mb-4">
                Nous travaillons en architecture ouverte : aucun produit maison, aucun quota de placement. Chaque support est sélectionné après une analyse comparative rigoureuse des performances, des frais et de la qualité de gestion.
              </p>
              <p className="text-gray-text leading-relaxed">
                Le résultat : une allocation construite sur mesure, documentée, expliquée et suivie dans le temps. Pas un portefeuille modèle, mais votre stratégie.
              </p>
            </div>
            <div className="lg:col-span-2 reveal reveal-delay-2">
              <div className="border-l-2 border-gold/40 pl-8 space-y-6">
                <div>
                  <p className="font-heading text-lg font-semibold text-primary mb-1">Assurance-vie</p>
                  <p className="text-sm text-gray-text">Contrats haut de gamme, fonds en euros, UC sélectionnées, gestion profilée ou libre.</p>
                </div>
                <div>
                  <p className="font-heading text-lg font-semibold text-primary mb-1">PER</p>
                  <p className="text-sm text-gray-text">Plan Épargne Retraite individuel, versements déductibles, sorties flexibles.</p>
                </div>
                <div>
                  <p className="font-heading text-lg font-semibold text-primary mb-1">Compte-titres & PEA</p>
                  <p className="text-sm text-gray-text">Titres vifs, ETF, fonds thématiques, allocation dynamique.</p>
                </div>
                <div>
                  <p className="font-heading text-lg font-semibold text-primary mb-1">SCPI & immobilier papier</p>
                  <p className="text-sm text-gray-text">Diversification immobilière, revenus réguliers, mutualisation du risque.</p>
                </div>
                <div>
                  <p className="font-heading text-lg font-semibold text-primary mb-1">Private equity</p>
                  <p className="text-sm text-gray-text">Accès sélectif à des fonds de capital-investissement pour les profils éligibles.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simulator section */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto reveal">
          <EpargneSimulator />
          <p className="text-[11px] text-foreground/45 mt-6 text-center">
            Simulation indicative à 4 % annuels, hors fiscalité et frais. Elle ne constitue pas un conseil en investissement.
          </p>
        </div>
      </section>

      <TrustBand />
      <PageCTA
        title="Faisons le point sur votre épargne"
        subtitle="Un audit de votre allocation actuelle pour identifier les axes d'amélioration : performance, frais, diversification, fiscalité."
        secondaryText="Demander un bilan patrimonial"
        secondaryHref="/bilan-patrimonial-bordeaux"
      />
      <Footer />
    </>
  );
}
