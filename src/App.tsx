import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useLenis } from "@/hooks/useLenis";
import PremiumCursor from "@/components/PremiumCursor";
import CookieBanner from "@/components/CookieBanner";
import SkipToContent from "@/components/SkipToContent";
import MobileChrome from "@/components/mobile/MobileChrome";
import Index from "./pages/Index.tsx";
import CabinetPage from "./pages/CabinetPage.tsx";
import GestionPatrimonialePage from "./pages/GestionPatrimonialePage.tsx";
import FiscalitePage from "./pages/FiscalitePage.tsx";
import PatrimoineProPage from "./pages/PatrimoineProPage.tsx";
import FinancementPage from "./pages/FinancementPage.tsx";
import ActualitesPage from "./pages/ActualitesPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import BilanPatrimonialPage from "./pages/BilanPatrimonialPage.tsx";
import ChefEntreprisePage from "./pages/ChefEntreprisePage.tsx";
import OptimisationFiscalePage from "./pages/OptimisationFiscalePage.tsx";
import TransmissionPage from "./pages/TransmissionPage.tsx";
import ImmobilierPage from "./pages/ImmobilierPage.tsx";
import NotreMethodePage from "./pages/NotreMethodePage.tsx";
import CasClientsPage from "./pages/CasClientsPage.tsx";
import FAQPage from "./pages/FAQPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import ProductDetailPage from "./pages/ProductDetailPage.tsx";
import MentionsLegalesPage from "./pages/MentionsLegalesPage.tsx";
import PolitiqueConfidentialitePage from "./pages/PolitiqueConfidentialitePage.tsx";
import ReclamationsPage from "./pages/ReclamationsPage.tsx";
import MerciPage from "./pages/MerciPage.tsx";
import RessourcesPage from "./pages/RessourcesPage.tsx";
import ProfilRisquePage from "./pages/ProfilRisquePage.tsx";

const queryClient = new QueryClient();

const AppShell = () => {
  useLenis();
  return (
    <TooltipProvider>
      <SkipToContent />
      <Toaster />
      <Sonner />
      <PremiumCursor />
      <BrowserRouter>
        <MobileChrome />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cabinet" element={<CabinetPage />} />
          <Route path="/gestion-patrimoniale" element={<GestionPatrimonialePage />} />
          <Route path="/fiscalite" element={<FiscalitePage />} />
          <Route path="/patrimoine-professionnel" element={<PatrimoineProPage />} />
          <Route path="/financement" element={<FinancementPage />} />
          <Route path="/actualites" element={<ActualitesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/bilan-patrimonial-bordeaux" element={<BilanPatrimonialPage />} />
          <Route path="/gestion-patrimoine-chef-entreprise" element={<ChefEntreprisePage />} />
          <Route path="/optimisation-fiscale-bordeaux" element={<OptimisationFiscalePage />} />
          <Route path="/transmission-patrimoine-famille" element={<TransmissionPage />} />
          <Route path="/patrimoine-immobilier-strategie" element={<ImmobilierPage />} />
          <Route path="/notre-methode" element={<NotreMethodePage />} />
          <Route path="/cas-clients" element={<CasClientsPage />} />
          <Route path="/faq-patrimoniale" element={<FAQPage />} />
          <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
          <Route path="/politique-de-confidentialite" element={<PolitiqueConfidentialitePage />} />
          <Route path="/reclamations" element={<ReclamationsPage />} />
          <Route path="/ressources" element={<RessourcesPage />} />
          <Route path="/profil-de-risque" element={<ProfilRisquePage />} />
          <Route path="/merci" element={<MerciPage />} />
          {/* Dynamic product / solution sub-pages */}
          <Route path="/:categorySlug/:productSlug" element={<ProductDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CookieBanner />
      </BrowserRouter>
    </TooltipProvider>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AppShell />
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
