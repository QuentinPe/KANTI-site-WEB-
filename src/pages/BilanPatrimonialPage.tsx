import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BilanHeroSticky from "@/components/bilan/BilanHeroSticky";
import VisionGlobaleSection from "@/components/bilan/VisionGlobaleSection";
import CartographieSection from "@/components/bilan/CartographieSection";
import SixDimensionsSection from "@/components/bilan/SixDimensionsSection";
import FriseProjetsSection from "@/components/bilan/FriseProjetsSection";
import IndicateursSoliditeSection from "@/components/bilan/IndicateursSoliditeSection";
import AnalyseFluxSection from "@/components/bilan/AnalyseFluxSection";
import MethodeBilanSection from "@/components/bilan/MethodeBilanSection";
import ApercuRapportSection from "@/components/bilan/ApercuRapportSection";
import PreDiagnosticSection from "@/components/bilan/PreDiagnosticSection";
import CasUsageBilanSection from "@/components/bilan/CasUsageBilanSection";
import ConfidentialiteBilanSection from "@/components/bilan/ConfidentialiteBilanSection";
import BilanFAQSection from "@/components/bilan/BilanFAQSection";
import BilanFinalCTA from "@/components/bilan/BilanFinalCTA";

export default function BilanPatrimonialPage() {
  useScrollReveal();
  return (
    <>
      <Header />
      <BilanHeroSticky />
      <VisionGlobaleSection />
      <CartographieSection />
      <SixDimensionsSection />
      <FriseProjetsSection />
      <IndicateursSoliditeSection />
      <AnalyseFluxSection />
      <MethodeBilanSection />
      <ApercuRapportSection />
      <PreDiagnosticSection />
      <CasUsageBilanSection />
      <ConfidentialiteBilanSection />
      <BilanFAQSection />
      <BilanFinalCTA />
      <Footer />
    </>
  );
}
