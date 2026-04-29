import MobileHeader from "./MobileHeader";
import MobileStickyCTA from "./MobileStickyCTA";
import HeroMobile from "./HeroMobile";
import IdentificationMobile from "./IdentificationMobile";
import PromesseMobile from "./PromesseMobile";
import ExpertisesMobile from "./ExpertisesMobile";
import MethodeMobile from "./MethodeMobile";
import ConfianceMobile from "./ConfianceMobile";
import HomeCasClientsMobile from "./HomeCasClientsMobile";
import EquipeMobile from "./EquipeMobile";
import ActualitesMobile from "./ActualitesMobile";
import HomeFAQMobile from "./HomeFAQMobile";
import CTAFinalMobile from "./CTAFinalMobile";
import Footer from "@/components/Footer";

export default function HomeMobile() {
  return (
    <>
      <MobileHeader />
      <main id="main">
        <HeroMobile />
        <IdentificationMobile />
        <PromesseMobile />
        <ExpertisesMobile />
        <MethodeMobile />
        <ConfianceMobile />
        <HomeCasClientsMobile />
        <EquipeMobile />
        <ActualitesMobile />
        <HomeFAQMobile />
        <CTAFinalMobile />
      </main>
      <Footer />
      <MobileStickyCTA />
    </>
  );
}