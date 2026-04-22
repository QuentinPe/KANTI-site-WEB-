import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import PageCTA from "@/components/PageCTA";
import TrustBand from "@/components/TrustBand";
import EpargneSimulator from "@/components/simulators/EpargneSimulator";
import ExpertiseShowcase from "@/components/ExpertiseShowcase";
import ProductGrid from "@/components/ProductGrid";
import { getCategory } from "@/data/productsCatalog";
import heroImg from "@/assets/expertise-gestion.jpg";

export default function GestionPatrimonialePage() {
  useScrollReveal();
  const category = getCategory("gestion-patrimoniale")!;

  return (
    <>
      <Header />
      <PageHero
        title="Gestion patrimoniale"
        highlight="& placements"
        subtitle="Construire une allocation d'actifs cohérente avec vos objectifs, votre horizon et votre tolérance au risque. En toute indépendance."
        breadcrumb="Gestion patrimoniale"
        eyebrow="Allocation & placements"
        image={heroImg}
        imageAlt="Bureau de gestion patrimoniale KANTI à Bordeaux"
        stats={[
          { value: "100%", label: "Architecture ouverte" },
          { value: "0", label: "Produit maison" },
          { value: "12+", label: "Partenaires" },
        ]}
      />

      <ExpertiseShowcase
        eyebrow="Notre approche"
        title="Gérer son épargne, ce n'est pas cocher des cases dans un questionnaire bancaire."
        intro="Une allocation patrimoniale efficace intègre votre fiscalité, votre régime matrimonial, vos projets à 5 ou 20 ans, vos revenus futurs et votre capacité à absorber une baisse des marchés. Architecture ouverte, aucun produit maison, aucun quota — chaque support est sélectionné après une analyse comparative rigoureuse."
        image={heroImg}
        imageAlt="Allocation patrimoniale KANTI"
        pillars={[
          { title: "Assurance-vie haut de gamme", text: "Contrats sélectionnés en architecture ouverte, fonds en euros, UC actives ou indicielles, gestion profilée ou libre." },
          { title: "PER individuel", text: "Plan Épargne Retraite avec versements déductibles, sortie en capital ou en rente, optimisation TMI." },
          { title: "Compte-titres & PEA", text: "Titres vifs, ETF, fonds thématiques, mandats, allocation dynamique adaptée à votre horizon." },
          { title: "SCPI & immobilier papier", text: "Diversification immobilière, revenus réguliers, mutualisation du risque, intégration en assurance-vie." },
          { title: "Private equity & dette privée", text: "Accès sélectif à des fonds de capital-investissement pour les profils éligibles, lock-up assumé." },
        ]}
      />

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
      <ProductGrid
        eyebrow="Solutions & enveloppes"
        title="Les outils que nous mobilisons"
        intro="Chaque solution est sélectionnée et calibrée selon votre profil. Survolez une carte pour explorer les conditions, la fiscalité et l'horizon recommandé."
        categorySlug={category.slug}
        products={category.products}
      />
      <PageCTA
        title="Faisons le point sur votre épargne"
        subtitle="Un audit de votre allocation actuelle pour identifier les axes d'amélioration : performance, frais, diversification, fiscalité."
        eyebrow="Gestion patrimoniale"
        index="03"
        secondaryText="Demander un bilan patrimonial"
        secondaryHref="/bilan-patrimonial-bordeaux"
      />
      <Footer />
    </>
  );
}
