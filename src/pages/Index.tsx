import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Identification from "@/components/Identification";
import Promesse from "@/components/Promesse";
import About from "@/components/About";
import ExpertisesPinned from "@/components/ExpertisesPinned";
import MethodePinned from "@/components/MethodePinned";
import HomeCasClients from "@/components/HomeCasClients";
import Equipe from "@/components/Equipe";
import Confiance from "@/components/Confiance";
import Actualites from "@/components/Actualites";
import HomeFAQ from "@/components/HomeFAQ";
import CTAFinal from "@/components/CTAFinal";
import Footer from "@/components/Footer";
import PremiumCursor from "@/components/PremiumCursor";
import ScrollProgressRail from "@/components/ScrollProgressRail";

const Index = () => {
  useScrollReveal();

  return (
    <>
      <PremiumCursor />
      <ScrollProgressRail />
      <Header />
      <Hero />
      <Identification />
      <Promesse />
      <About />
      <ExpertisesPinned />
      <MethodePinned />
      <HomeCasClients />
      <Equipe />
      <Confiance />
      <Actualites />
      <HomeFAQ />
      <CTAFinal />
      <Footer />
    </>
  );
};

export default Index;
