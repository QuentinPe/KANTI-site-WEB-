import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FinancingHero from "@/components/financement/FinancingHero";
import FundingPlanSection from "@/components/financement/FundingPlanSection";
import OfferComparisonSection from "@/components/financement/OfferComparisonSection";
import ScenarioComparatorSection from "@/components/financement/ScenarioComparatorSection";
import LoanTypesSection from "@/components/financement/LoanTypesSection";
import RateSensitivitySection from "@/components/financement/RateSensitivitySection";
import AmortizationSection from "@/components/financement/AmortizationSection";
import SimulatorTeaserSection from "@/components/financement/SimulatorTeaserSection";
import FinancingMethodSection from "@/components/financement/FinancingMethodSection";
import DocumentChecklistSection from "@/components/financement/DocumentChecklistSection";
import StressTestSection from "@/components/financement/StressTestSection";
import CasClientFinancementSection from "@/components/financement/CasClientFinancementSection";
import FinancingFAQSection from "@/components/financement/FinancingFAQSection";
import FinancingFinalCTA from "@/components/financement/FinancingFinalCTA";

export default function CourtageFinancementPage() {
  useScrollReveal();
  return (
    <>
      <Header />
      <main id="main-content">
        <FinancingHero />
        <FundingPlanSection />
        <OfferComparisonSection />
        <ScenarioComparatorSection />
        <LoanTypesSection />
        <RateSensitivitySection />
        <AmortizationSection />
        <SimulatorTeaserSection />
        <FinancingMethodSection />
        <DocumentChecklistSection />
        <StressTestSection />
        <CasClientFinancementSection />
        <FinancingFAQSection />
        <FinancingFinalCTA />
      </main>
      <Footer />
    </>
  );
}
