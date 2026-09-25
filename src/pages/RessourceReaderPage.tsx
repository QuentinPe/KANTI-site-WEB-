import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Printer, Lock, FileText, Download } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { getRessourceById, getDownloadUrl } from "@/lib/ressourcesService";

const CAT_COLOR: Record<string, string> = {
  "Fiscalité":     "hsl(218 58% 18%)",
  "Transmission":  "hsl(222 55% 14%)",
  "Dirigeants":    "hsl(252 42% 28%)",
  "Investir":      "hsl(162 44% 20%)",
  "Retraite":      "hsl(28 52% 26%)",
  "Immobilier":    "hsl(192 46% 20%)",
  "International": "hsl(36 50% 24%)",
};

const PROSE_CSS = `
.guide-prose { color: hsl(224 30% 22%); font-size: 15px; line-height: 1.75; font-weight: 300; }
.guide-prose h2 { font-family: var(--font-heading, Georgia, serif); font-size: 1.35rem; font-weight: 400; letter-spacing: -0.01em; color: hsl(224 55% 12%); margin: 2.2em 0 0.75em; padding-bottom: 0.5em; border-bottom: 1px solid hsl(224 20% 90%); line-height: 1.2; }
.guide-prose h3 { font-family: var(--font-heading, Georgia, serif); font-size: 1.05rem; font-weight: 400; color: hsl(224 50% 18%); margin: 1.8em 0 0.5em; line-height: 1.3; }
.guide-prose p { margin: 0 0 1em; }
.guide-prose ul, .guide-prose ol { padding-left: 1.4em; margin: 0.5em 0 1em; }
.guide-prose li { margin-bottom: 0.45em; }
.guide-prose strong { font-weight: 500; color: hsl(224 50% 16%); }
.guide-prose em { color: hsl(224 25% 40%); font-style: italic; }
.guide-prose blockquote { border-left: 3px solid hsl(224 30% 82%); margin: 1.5em 0; padding: 0.5em 1.2em; color: hsl(224 20% 45%); }
.guide-prose a { color: hsl(218 55% 38%); text-decoration: underline; text-underline-offset: 2px; }
@media print {
  .no-print { display: none !important; }
  body { margin: 0; font-size: 10.5pt; color: #1a2038; }
  @page { margin: 22mm 20mm; size: A4; }
  .guide-prose h2 { page-break-before: auto; page-break-after: avoid; }
  .guide-prose h3 { page-break-after: avoid; }
  .guide-prose p, .guide-prose li { orphans: 3; widows: 3; }
  .guide-prose ul, .guide-prose ol { page-break-inside: avoid; }
  .print-header { display: flex !important; border-bottom: 1px solid #dde0ec; padding-bottom: 12pt; margin-bottom: 20pt; }
  .guide-disclaimer { margin-top: 30pt; padding-top: 10pt; border-top: 1px solid #dde0ec; font-size: 8pt; color: #7a8099; }
}
`;

export default function RessourceReaderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isUnlocked] = useState(() => {
    try {
      const ts = localStorage.getItem("kanti_resources_unlocked");
      return !!ts && Date.now() - parseInt(ts) < 30 * 86_400_000;
    } catch { return false; }
  });

  useEffect(() => {
    if (!isUnlocked) navigate("/ressources", { replace: true });
  }, [isUnlocked, navigate]);

  const { data: resource, isLoading } = useQuery({
    queryKey: ["ressource", id],
    queryFn: () => getRessourceById(id!),
    enabled: !!id && isUnlocked,
  });

  const handlePrint = useCallback(() => { window.print(); }, []);

  const handlePdfDownload = useCallback(async () => {
    if (!resource?.storage_path) return;
    const url = await getDownloadUrl(resource.storage_path);
    const a = document.createElement("a");
    a.href = url; a.download = (resource.id ?? "guide") + ".pdf"; a.target = "_blank"; a.rel = "noopener noreferrer";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }, [resource]);

  if (!isUnlocked) return null;

  const catColor = CAT_COLOR[resource?.category ?? ""] ?? "hsl(224 60% 15%)";

  return (
    <>
      <Seo
        title={resource ? `${resource.title} — KANTI` : "Guide patrimonial — KANTI"}
        description={resource?.description ?? "Ressource patrimoniale KANTI"}
        noindex
      />

      {/* Inject prose + print styles */}
      <style dangerouslySetInnerHTML={{ __html: PROSE_CSS }} />

      {/* ── SITE HEADER (hidden in print) ─────────────────────────────────── */}
      <div className="no-print">
        <Header />
      </div>

      {/* ── PRINT-ONLY HEADER ─────────────────────────────────────────────── */}
      <div
        className="print-header hidden items-center justify-between mb-0"
        style={{ fontFamily: "inherit" }}
      >
        <div>
          <p style={{ fontSize: "8pt", letterSpacing: "0.28em", textTransform: "uppercase", color: "#7a8099", marginBottom: 4 }}>
            KANTI · Cabinet de conseil en gestion de patrimoine
          </p>
          <p style={{ fontSize: "8pt", color: "#9aa0b8" }}>kanti-patrimoine.fr · Bordeaux</p>
        </div>
        {resource && (
          <span style={{ fontSize: "8pt", padding: "2pt 8pt", borderRadius: 99, background: catColor + "18", color: catColor, fontWeight: 500 }}>
            {resource.category}
          </span>
        )}
      </div>

      {/* ── TOOLBAR (sticky, hidden in print) ─────────────────────────────── */}
      {!isLoading && (
        <div
          className="no-print sticky z-40 backdrop-blur-xl"
          style={{
            top: 72,
            background: "hsl(0 0% 100% / 0.88)",
            borderBottom: "1px solid hsl(224 20% 12% / 0.08)",
            boxShadow: "0 4px 20px -4px hsl(224 30% 18% / 0.06)",
          }}
        >
          <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-4">
            <Link
              to="/ressources"
              className="flex items-center gap-1.5 text-[12px] font-light transition-colors duration-150"
              style={{ color: "hsl(224 20% 48%)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(224 50% 20%)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(224 20% 48%)"; }}
            >
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
              Retour aux ressources
            </Link>

            {resource && (
              <>
                <span className="text-[10px] font-light" style={{ color: "hsl(224 15% 72%)" }}>·</span>
                <span className="text-[12px] font-light truncate max-w-xs" style={{ color: "hsl(224 30% 35%)" }}>
                  {resource.title}
                </span>
              </>
            )}

            <div className="ml-auto flex items-center gap-2">
              {resource?.storage_path && (
                <button
                  type="button"
                  onClick={handlePdfDownload}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-medium transition-all duration-150"
                  style={{ color: "hsl(224 30% 35%)", border: "1px solid hsl(224 20% 82%)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 20% 96%)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
                  PDF original
                </button>
              )}
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-medium text-white transition-all duration-150"
                style={{ background: "hsl(224 60% 18%)", boxShadow: "0 3px 12px -3px hsl(224 60% 18% / 0.36)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 60% 22%)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 60% 18%)"; }}
              >
                <Printer className="w-3.5 h-3.5" strokeWidth={1.5} />
                Télécharger en PDF
              </button>
            </div>
          </div>
        </div>
      )}

      <main id="main">
        {/* ── LOADING ───────────────────────────────────────────────────────── */}
        {isLoading && (
          <div className="no-print min-h-[60vh] flex items-center justify-center">
            <div className="w-7 h-7 rounded-full border-2 border-foreground/10 border-t-foreground/40 animate-spin" />
          </div>
        )}

        {/* ── NOT FOUND ─────────────────────────────────────────────────────── */}
        {!isLoading && !resource && (
          <section className="no-print min-h-[60vh] flex items-center justify-center px-6">
            <div className="text-center max-w-sm">
              <FileText className="w-10 h-10 mx-auto mb-5" style={{ color: "hsl(224 20% 72%)" }} strokeWidth={1} />
              <h1 className="text-xl font-heading font-light mb-3" style={{ color: "hsl(224 50% 14%)" }}>
                Guide introuvable
              </h1>
              <p className="text-[13px] font-light mb-7" style={{ color: "hsl(224 15% 52%)" }}>
                Ce guide n'existe pas ou n'est plus disponible.
              </p>
              <Link
                to="/ressources"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[12px] font-medium text-white"
                style={{ background: "hsl(224 60% 18%)" }}
              >
                Voir toutes les ressources
              </Link>
            </div>
          </section>
        )}

        {/* ── GUIDE CONTENT ─────────────────────────────────────────────────── */}
        {!isLoading && resource && (
          <article className="max-w-4xl mx-auto px-6 lg:px-12 pt-14 pb-20">
            {/* ── Guide hero ────────────────────────────────────────────────── */}
            <motion.header
              className="mb-12 pb-10 border-b"
              style={{ borderColor: "hsl(224 20% 12% / 0.08)" }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span
                className="inline-block px-3 py-1 rounded-full text-[9px] font-semibold tracking-[0.24em] uppercase mb-6"
                style={{ background: catColor + "18", color: catColor }}
              >
                {resource.category}
              </span>
              <h1
                className="font-heading font-light tracking-tight leading-[1.08] mb-4"
                style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", color: "hsl(224 55% 10%)" }}
              >
                {resource.title}
              </h1>
              <p
                className="text-[15px] font-light leading-relaxed max-w-2xl mb-6"
                style={{ color: "hsl(224 20% 42%)" }}
              >
                {resource.description}
              </p>
              <div className="flex items-center gap-5 flex-wrap">
                {resource.pages != null && resource.pages > 0 && (
                  <span className="flex items-center gap-1.5 text-[11px] font-light" style={{ color: "hsl(224 15% 58%)" }}>
                    <FileText className="w-3.5 h-3.5" strokeWidth={1.5} />
                    {resource.pages} pages
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-[11px] font-light" style={{ color: "hsl(224 15% 58%)" }}>
                  <Lock className="w-3 h-3" strokeWidth={2} style={{ color: "hsl(142 52% 42%)" }} />
                  Accès débloqué
                </span>
                <span className="text-[11px] font-light" style={{ color: "hsl(224 15% 68%)" }}>
                  Cabinet KANTI · Bordeaux
                </span>
              </div>
            </motion.header>

            {/* ── Body content or placeholder ───────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              {resource.body ? (
                <div
                  className="guide-prose"
                  dangerouslySetInnerHTML={{ __html: resource.body }}
                />
              ) : resource.storage_path ? (
                <div className="text-center py-20">
                  <FileText className="w-12 h-12 mx-auto mb-5" style={{ color: "hsl(224 20% 72%)" }} strokeWidth={0.75} />
                  <h2 className="text-lg font-heading font-light mb-3" style={{ color: "hsl(224 45% 18%)" }}>
                    Guide disponible en PDF
                  </h2>
                  <p className="text-[14px] font-light mb-7" style={{ color: "hsl(224 15% 50%)" }}>
                    Ce guide est disponible au format PDF. Cliquez pour le télécharger.
                  </p>
                  <button
                    type="button"
                    onClick={handlePdfDownload}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[13px] font-medium text-white"
                    style={{ background: "hsl(224 60% 18%)", boxShadow: "0 8px 24px -8px hsl(224 60% 18% / 0.38)" }}
                  >
                    <Download className="w-4 h-4" strokeWidth={1.5} />
                    Télécharger le PDF
                  </button>
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-[14px] font-light" style={{ color: "hsl(224 15% 60%)" }}>
                    Le contenu de ce guide est en cours de rédaction. Revenez prochainement.
                  </p>
                </div>
              )}
            </motion.div>

            {/* ── Disclaimer (print + screen) ────────────────────────────────── */}
            {resource.body && (
              <div
                className="guide-disclaimer mt-16 pt-8 border-t"
                style={{ borderColor: "hsl(224 20% 90%)" }}
              >
                <p className="text-[11px] font-light italic leading-relaxed" style={{ color: "hsl(224 15% 60%)" }}>
                  Ce document est fourni à titre informatif par le cabinet KANTI. Il ne constitue pas un conseil en investissement, une recommandation fiscale ou juridique. La réglementation est susceptible d'évoluer. Consultez un professionnel agréé avant toute décision patrimoniale. KANTI — Cabinet de conseil en gestion de patrimoine — Bordeaux.
                </p>
              </div>
            )}

            {/* ── Bottom nav (screen only) ─────────────────────────────────── */}
            <div className="no-print mt-16 pt-8 border-t flex items-center justify-between flex-wrap gap-4" style={{ borderColor: "hsl(224 20% 90%)" }}>
              <Link
                to="/ressources"
                className="flex items-center gap-2 text-[12px] font-light transition-colors"
                style={{ color: "hsl(224 20% 50%)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(224 50% 20%)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(224 20% 50%)"; }}
              >
                <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
                Toutes les ressources
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-medium text-white transition-all"
                style={{ background: "hsl(224 60% 18%)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 60% 22%)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 60% 18%)"; }}
              >
                Prendre rendez-vous
              </Link>
            </div>
          </article>
        )}
      </main>

      <div className="no-print">
        <Footer />
      </div>
    </>
  );
}
