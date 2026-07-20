import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GestionHeroSticky from "@/components/gestion/GestionHeroSticky";
import PageCTA from "@/components/PageCTA";
import ExpertiseShowcase from "@/components/ExpertiseShowcase";
import ProductGrid from "@/components/ProductGrid";
import StickyImageBand from "@/components/StickyImageBand";
import { getCategory } from "@/data/productsCatalog";
import heroImg from "@/assets/expertise-gestion.jpg";

// New sections
import AllocationDonutSection from "@/components/gestion/AllocationDonutSection";
import RiskProfileComparison from "@/components/gestion/RiskProfileComparison";
import AssetClassMatrix from "@/components/gestion/AssetClassMatrix";
import MacroFactorTimeline from "@/components/gestion/MacroFactorTimeline";
import SimulationPreviewSection from "@/components/gestion/SimulationPreviewSection";
import MethodologySteps from "@/components/gestion/MethodologySteps";
import IndependenceSection from "@/components/gestion/IndependenceSection";
import UseCasesSection from "@/components/gestion/UseCasesSection";
import GestionFAQSection from "@/components/gestion/GestionFAQSection";
import GestionFinalCTA from "@/components/gestion/GestionFinalCTA";

export default function GestionPatrimonialePage() {
  useScrollReveal();
  const category = getCategory("gestion-patrimoniale")!;

  return (
    <>
      <Header />
      <GestionHeroSticky />

      <ExpertiseShowcase
        eyebrow="Notre approche"
        title="Gérer son épargne, ce n'est pas cocher des cases dans un questionnaire bancaire."
        intro="Une allocation patrimoniale efficace intègre votre fiscalité, votre régime matrimonial, vos projets à 5 ou 20 ans, vos revenus futurs et votre capacité à absorber une baisse des marchés. Architecture ouverte, aucun produit maison, aucun quota, chaque support est sélectionné après une analyse comparative rigoureuse."
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

      <StickyImageBand
        image={heroImg}
        imageAlt="Allocation patrimoniale KANTI"
        eyebrow="Architecture ouverte"
        caption="Aucun produit maison, aucun quota, chaque support sélectionné après analyse comparative."
      />

      <ProductGrid
        eyebrow="Solutions & enveloppes"
        title="Les outils que nous mobilisons"
        intro="Chaque solution est sélectionnée et calibrée selon votre profil. Survolez une carte pour explorer les conditions, la fiscalité et l'horizon recommandé."
        categorySlug={category.slug}
        products={category.products}
        hideLinks
      />

      <PageCTA
        title="Faisons le point sur votre épargne"
        subtitle="Un audit de votre allocation actuelle pour identifier les axes d'amélioration : performance, frais, diversification, fiscalité."
        eyebrow="Allocation & placements"
        index="01"
        secondaryText="Demander un bilan patrimonial"
        secondaryHref="/bilan-patrimonial-bordeaux"
      />

      {/* ── New sections ─────────────────────────────────────────────────────── */}
      <AllocationDonutSection />
      <MethodologySteps />
      <RiskProfileComparison />
      <AssetClassMatrix />
      <MacroFactorTimeline />
      <SimulationPreviewSection />
      <IndependenceSection />
      <UseCasesSection />
      <GestionFAQSection />
      <GestionFinalCTA />

      <Footer />
    </>
  );
}
