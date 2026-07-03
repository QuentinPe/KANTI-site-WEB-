import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import HeroSticky from "@/components/HeroSticky";
import Seo, { localBusinessJsonLd, organizationJsonLd } from "@/components/Seo";
import Identification from "@/components/Identification";
import Promesse from "@/components/Promesse";
import About from "@/components/About";
import ExpertisesPinned from "@/components/ExpertisesPinned";
import MethodePinned from "@/components/MethodePinned";
import HomeCasClients from "@/components/HomeCasClients";
import HomeProfilRisque from "@/components/HomeProfilRisque";
import Equipe from "@/components/Equipe";
import Confiance from "@/components/Confiance";
import Actualites from "@/components/Actualites";
import HomeFAQ from "@/components/HomeFAQ";
import CTAFinal from "@/components/CTAFinal";
import Footer from "@/components/Footer";
import PlasterReveal from "@/components/motion/PlasterReveal";
import HomeMobile from "@/components/mobile/HomeMobile";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  useScrollReveal();
  const isMobile = useIsMobile();

  return (
    <>
      <Seo
        title="KANTI, Cabinet de gestion de patrimoine indépendant à Bordeaux"
        description="KANTI accompagne particuliers, dirigeants et familles dans la structuration, l'optimisation fiscale et la transmission de leur patrimoine. Conseil patrimonial indépendant à Bordeaux."
        jsonLd={[organizationJsonLd, localBusinessJsonLd]}
      />
      {isMobile ? (
        <HomeMobile />
      ) : (
        <>
          <PlasterReveal />
          <Header />
          <main id="main">
            <HeroSticky />
            <Identification />
            <Promesse />
            <About />
            <ExpertisesPinned />
            <MethodePinned />
            <HomeCasClients />
            <HomeProfilRisque />
            <Equipe />
            <Actualites />
            <HomeFAQ />
            <Confiance />
            <CTAFinal />
          </main>
          <Footer />
        </>
      )}
    </>
  );
};

export default Index;
