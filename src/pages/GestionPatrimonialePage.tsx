import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GestionHeroSticky from "@/components/gestion/GestionHeroSticky";
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

  return (
    <>
      <Header />
      <GestionHeroSticky />
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
