import { useScrollReveal } from "@/hooks/useScrollReveal";
import { motion, useScroll } from "framer-motion";
import Header from "@/components/Header";
import HeroSticky from "@/components/HeroSticky";
import Seo, { localBusinessJsonLd, organizationJsonLd } from "@/components/Seo";
import Identification from "@/components/Identification";
import Promesse from "@/components/Promesse";
import About from "@/components/About";
import ExpertisesPinned from "@/components/ExpertisesPinned";
import HomeCasClients from "@/components/HomeCasClients";
import HomeProfilRisque from "@/components/HomeProfilRisque";
import Equipe from "@/components/Equipe";
import CTAFinal from "@/components/CTAFinal";
import Actualites from "@/components/Actualites";
import HomeFAQ from "@/components/HomeFAQ";
import Footer from "@/components/Footer";
import PlasterReveal from "@/components/motion/PlasterReveal";
import HomeMobile from "@/components/mobile/HomeMobile";
import { useIsMobile } from "@/hooks/use-mobile";

function PageScrollLine() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden
      className="fixed left-0 top-0 bottom-0 w-[2px] origin-top z-[60] pointer-events-none"
      style={{
        scaleY: scrollYProgress,
        background: "linear-gradient(to bottom, hsl(var(--electric-soft) / 0.7), hsl(var(--electric-soft) / 0.2))",
      }}
    />
  );
}

const Index = () => {
  useScrollReveal();
  const isMobile = useIsMobile();

  return (
    <>
      <Seo
        title="KANTI, Cabinet de gestion de patrimoine à Bordeaux"
        description="KANTI accompagne particuliers, dirigeants et familles dans la structuration, l'optimisation fiscale et la transmission de leur patrimoine. Conseil patrimonial sur-mesure à Bordeaux."
        jsonLd={[organizationJsonLd, localBusinessJsonLd]}
      />
      {isMobile ? (
        <HomeMobile />
      ) : (
        <>
          <PlasterReveal />
          <PageScrollLine />
          <Header />
          <main id="main">
            <HeroSticky />
            <Identification />
            <Promesse />
            <About />
            <ExpertisesPinned />
            <HomeCasClients />
            <HomeProfilRisque />
            <Equipe />
            <Actualites />
            <HomeFAQ />
            <CTAFinal />
          </main>
          <Footer />
        </>
      )}
    </>
  );
};

export default Index;
