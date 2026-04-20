import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ExpertisesStacked from "@/components/ExpertisesStacked";
import MethodePinned from "@/components/MethodePinned";
import HomeCasClients from "@/components/HomeCasClients";
import Equipe from "@/components/Equipe";
import Confiance from "@/components/Confiance";
import Actualites from "@/components/Actualites";
import Contact from "@/components/Contact";
import TrustBand from "@/components/TrustBand";
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
      <About />
      <ExpertisesStacked />
      <MethodePinned />
      <HomeCasClients />
      <Equipe />
      <Confiance />
      <Actualites />
      <Contact />
      <TrustBand />
      <Footer />
    </>
  );
};

export default Index;
