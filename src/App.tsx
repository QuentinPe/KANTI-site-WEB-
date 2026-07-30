import { lazy, Suspense, useLayoutEffect, Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Analytics } from "@vercel/analytics/react";

// ─── Global error boundary — shows error instead of blank white page ─────────
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info);
  }
  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <div style={{ padding: 32, fontFamily: "monospace", background: "#0b1220", color: "#f87171", minHeight: "100vh" }}>
        <h1 style={{ fontSize: 18, marginBottom: 12 }}>Une erreur est survenue</h1>
        <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, color: "#fca5a5", background: "#1e293b", padding: 16, borderRadius: 8 }}>
          {error.message}
          {"\n\n"}
          {error.stack}
        </pre>
      </div>
    );
  }
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useLenis } from "@/hooks/useLenis";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
// AdminLayout kept eager (small, no Tiptap) to avoid Outlet waterfall
import AdminLayout from "./pages/admin/AdminLayout.tsx";

// ─── Global UI (non-critical, lazy with null fallback) ───────────────────────
const PremiumCursor = lazy(() => import("@/components/PremiumCursor"));
// CookieBanner uses <Link> → must stay inside BrowserRouter
const CookieBanner  = lazy(() => import("@/components/CookieBanner"));
const MobileChrome  = lazy(() => import("@/components/mobile/MobileChrome"));
const SkipToContent = lazy(() => import("@/components/SkipToContent"));

// ─── Public pages ─────────────────────────────────────────────────────────────
const Index                     = lazy(() => import("./pages/Index"));
const CabinetPage               = lazy(() => import("./pages/CabinetPage"));
const GestionPatrimonialePage   = lazy(() => import("./pages/GestionPatrimonialePage"));
const SimulateurPatrimonialPage = lazy(() => import("./pages/SimulateurPatrimonialPage"));
const FiscalitePage             = lazy(() => import("./pages/FiscalitePage"));
const PatrimoineProPage         = lazy(() => import("./pages/PatrimoineProPage"));
const CourtageFinancementPage   = lazy(() => import("./pages/CourtageFinancementPage"));
const SimulateurFinancementPage = lazy(() => import("./pages/SimulateurFinancementPage"));
const ActualitesPage            = lazy(() => import("./pages/ActualitesPage"));
const ArticleDetailPage         = lazy(() => import("./pages/ArticleDetailPage"));
const ContactPage               = lazy(() => import("./pages/ContactPage"));
const BilanPatrimonialPage      = lazy(() => import("./pages/BilanPatrimonialPage"));
const ChefEntreprisePage        = lazy(() => import("./pages/ChefEntreprisePage"));
const OptimisationFiscalePage   = lazy(() => import("./pages/OptimisationFiscalePage"));
const TransmissionPage          = lazy(() => import("./pages/TransmissionPage"));
const ImmobilierPage            = lazy(() => import("./pages/ImmobilierPage"));
const NotreMethodePage          = lazy(() => import("./pages/NotreMethodePage"));
const CasClientsPage            = lazy(() => import("./pages/CasClientsPage"));
const FAQPage                   = lazy(() => import("./pages/FAQPage"));
const MentionsLegalesPage       = lazy(() => import("./pages/MentionsLegalesPage"));
const PolitiqueConfidentialitePage = lazy(() => import("./pages/PolitiqueConfidentialitePage"));
const ReclamationsPage          = lazy(() => import("./pages/ReclamationsPage"));
const RessourcesPage            = lazy(() => import("./pages/RessourcesPage"));
const ProfilRisquePage          = lazy(() => import("./pages/ProfilRisquePage"));
const MerciPage                 = lazy(() => import("./pages/MerciPage"));
const LoginPage                 = lazy(() => import("./pages/LoginPage"));
const NotFound                  = lazy(() => import("./pages/NotFound"));
const ProductDetailPage         = lazy(() => import("./pages/ProductDetailPage"));

// ─── Admin pages (heavy: Tiptap, pdfjs, mammoth only loaded in admin) ─────────
const AdminAnalytics    = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminDashboard    = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminLeadsList    = lazy(() => import("./pages/admin/AdminLeadsList"));
const AdminSiteSettings = lazy(() => import("./pages/admin/AdminSiteSettings"));
const AdminMediaLibrary = lazy(() => import("./pages/admin/AdminMediaLibrary"));
const AdminAccessList   = lazy(() => import("./pages/admin/AdminAccessList"));
const AdminArticlesList = lazy(() => import("./pages/admin/AdminArticlesList"));
const AdminArticleForm  = lazy(() => import("./pages/admin/AdminArticleForm"));
const AdminResourcesList    = lazy(() => import("./pages/admin/AdminResourcesList"));
const AdminResourceForm     = lazy(() => import("./pages/admin/AdminResourceForm"));
const AdminFeaturedResource = lazy(() => import("./pages/admin/AdminFeaturedResource"));
const AdminCasClientsList = lazy(() => import("./pages/admin/AdminCasClientsList"));
const AdminCasClientsForm = lazy(() => import("./pages/admin/AdminCasClientsForm"));
const AdminFAQList      = lazy(() => import("./pages/admin/AdminFAQList"));
const AdminFAQForm      = lazy(() => import("./pages/admin/AdminFAQForm"));
const AdminTeamList     = lazy(() => import("./pages/admin/AdminTeamList"));
const AdminTeamForm     = lazy(() => import("./pages/admin/AdminTeamForm"));
const AdminLegalList    = lazy(() => import("./pages/admin/AdminLegalList"));
const AdminLegalForm    = lazy(() => import("./pages/admin/AdminLegalForm"));
const AdminCategoriesList = lazy(() => import("./pages/admin/AdminCategoriesList"));

// ─── QueryClient · 5 min stale, no refetch on focus ─────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: "hsl(220 30% 97%)" }}>
      <div className="w-7 h-7 rounded-full border-2 border-foreground/10 border-t-foreground/40 animate-spin" />
    </div>
  );
}

const AppShell = () => {
  useLenis();
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Suspense fallback={null}>
        <PremiumCursor />
      </Suspense>
      <BrowserRouter>
        <Analytics />
        <ScrollToTop />
        <AuthProvider>
          <Suspense fallback={null}>
            <SkipToContent />
            <MobileChrome />
            <CookieBanner />
          </Suspense>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/cabinet" element={<CabinetPage />} />
              <Route path="/gestion-patrimoniale" element={<GestionPatrimonialePage />} />
              <Route path="/gestion-patrimoniale/simulateur" element={<SimulateurPatrimonialPage />} />
              <Route path="/fiscalite" element={<FiscalitePage />} />
              <Route path="/patrimoine-professionnel" element={<PatrimoineProPage />} />
              <Route path="/financement" element={<Navigate to="/courtage-patrimonial" replace />} />
              <Route path="/courtage-patrimonial" element={<CourtageFinancementPage />} />
              <Route path="/courtage-patrimonial/simulateur-financement" element={<SimulateurFinancementPage />} />
              <Route path="/actualites" element={<ActualitesPage />} />
              <Route path="/actualites/:id" element={<ArticleDetailPage />} />
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
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="leads" element={<AdminLeadsList />} />
                <Route path="settings" element={<AdminSiteSettings />} />
                <Route path="media" element={<AdminMediaLibrary />} />
                <Route path="acces" element={<AdminAccessList />} />
                <Route path="articles" element={<AdminArticlesList />} />
                <Route path="articles/new" element={<AdminArticleForm />} />
                <Route path="articles/:id/edit" element={<AdminArticleForm />} />
                <Route path="ressources" element={<AdminResourcesList />} />
                <Route path="ressources/mise-en-avant" element={<AdminFeaturedResource />} />
                <Route path="ressources/new" element={<AdminResourceForm />} />
                <Route path="ressources/:id/edit" element={<AdminResourceForm />} />
                <Route path="cas-clients" element={<AdminCasClientsList />} />
                <Route path="cas-clients/new" element={<AdminCasClientsForm />} />
                <Route path="cas-clients/:id/edit" element={<AdminCasClientsForm />} />
                <Route path="faq" element={<AdminFAQList />} />
                <Route path="faq/new" element={<AdminFAQForm />} />
                <Route path="faq/:id/edit" element={<AdminFAQForm />} />
                <Route path="equipe" element={<AdminTeamList />} />
                <Route path="equipe/new" element={<AdminTeamForm />} />
                <Route path="equipe/:id/edit" element={<AdminTeamForm />} />
                <Route path="legal" element={<AdminLegalList />} />
                <Route path="legal/:pageKey/edit" element={<AdminLegalForm />} />
                <Route path="categories" element={<AdminCategoriesList />} />
              </Route>
              <Route path="/:categorySlug/:productSlug" element={<ProductDetailPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  );
};

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AppShell />
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
