import { useScrollReveal } from "@/hooks/useScrollReveal";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Seo, { localBusinessJsonLd, organizationJsonLd } from "@/components/Seo";
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
import ScrollProgressRail from "@/components/ScrollProgressRail";

const Index = () => {
  useScrollReveal();

  return (
    <>
      <Seo
        title="KANTI — Cabinet de gestion de patrimoine indépendant à Bordeaux"
        description="KANTI accompagne particuliers, dirigeants et familles dans la structuration, l'optimisation fiscale et la transmission de leur patrimoine. Conseil patrimonial indépendant à Bordeaux."
        jsonLd={[organizationJsonLd, localBusinessJsonLd]}
      />
      <ScrollProgressRail />
      <Header />
      <main id="main">
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
      </main>
      <Footer />
    </>
  );
};

export default Index;
