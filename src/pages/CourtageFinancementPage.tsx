import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FinancingHero from "@/components/financement/FinancingHero";
import OfferComparisonSection from "@/components/financement/OfferComparisonSection";
import ScenarioComparatorSection from "@/components/financement/ScenarioComparatorSection";
import LoanTypesSection from "@/components/financement/LoanTypesSection";
import RateSensitivitySection from "@/components/financement/RateSensitivitySection";
import SimulatorTeaserSection from "@/components/financement/SimulatorTeaserSection";
import FinancingMethodSection from "@/components/financement/FinancingMethodSection";
import DocumentChecklistSection from "@/components/financement/DocumentChecklistSection";
import CasClientFinancementSection from "@/components/financement/CasClientFinancementSection";
import FinancingFAQSection from "@/components/financement/FinancingFAQSection";
import PartnerApporteurSection from "@/components/financement/PartnerApporteurSection";
import MarketComparisonSection from "@/components/financement/MarketComparisonSection";
import FinancingFinalCTA from "@/components/financement/FinancingFinalCTA";
import ApporteurToastPopup from "@/components/financement/ApporteurToastPopup";

export default function CourtageFinancementPage() {
  useScrollReveal();
  return (
    <>
      <Header />
      <main id="main-content">
        <FinancingHero />
        <OfferComparisonSection />
        <ScenarioComparatorSection />
        <LoanTypesSection />
        <RateSensitivitySection />
        <SimulatorTeaserSection />
        <FinancingMethodSection />
        <DocumentChecklistSection />
        <CasClientFinancementSection />
        <FinancingFAQSection />
        <PartnerApporteurSection />
        <MarketComparisonSection />
        <FinancingFinalCTA />
      </main>
      <Footer />
      <ApporteurToastPopup />
    </>
  );
}
