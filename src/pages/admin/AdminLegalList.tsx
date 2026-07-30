import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Scale, Clock } from "lucide-react";
import { getAllLegalContent } from "@/lib/legalService";
import {
  GLASS, INNER_BG, INNER_BORDER,
  T_PRIMARY, T_SECONDARY, T_MUTED, T_HEADING,
  C_BLUE,
} from "@/lib/adminTheme";

const PAGE_DESCRIPTIONS: Record<string, string> = {
  "mentions-legales": "Éditeur, hébergement, statuts réglementaires, propriété intellectuelle.",
  "confidentialite": "Collecte, traitement et protection des données personnelles (RGPD).",
  "reclamations": "Procédure de traitement des réclamations et voies de médiation.",
};

export default function AdminLegalList() {
  const { data: pages = [], isLoading } = useQuery({
    queryKey: ["admin-legal"],
    queryFn: getAllLegalContent,
  });

  const formatDate = (iso: string) => {
    if (!iso) return "Non modifiée";
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-2.5 mb-2">
        <Scale className="w-5 h-5" style={{ color: C_BLUE }} />
        <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: T_PRIMARY }}>
          Mentions légales
        </h1>
      </div>
      <p className="text-[13px] font-light mb-8" style={{ color: T_SECONDARY }}>
        Les modifications sont appliquées immédiatement sur les pages publiques correspondantes.
      </p>

      {isLoading ? (
        <div className="py-16 flex justify-center">
          <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: "rgba(255,255,255,0.15)", borderTopColor: "rgba(255,255,255,0.6)" }} />
        </div>
      ) : (
        <div className="space-y-3">
          {pages.map((page) => (
            <div
              key={page.id}
              className="p-5 flex items-center justify-between overflow-hidden"
              style={{ ...GLASS, borderRadius: "1rem", border: `1px solid ${INNER_BORDER}` }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-medium mb-0.5" style={{ color: T_HEADING }}>
                  {page.page_label}
                </p>
                <p className="text-[13px] font-light mb-2" style={{ color: T_SECONDARY }}>
                  {PAGE_DESCRIPTIONS[page.page_key] ?? ""}
                </p>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" style={{ color: T_MUTED }} />
                  <span className="text-[11px] font-light" style={{ color: T_MUTED }}>
                    {page.content_html ? `Modifiée le ${formatDate(page.updated_at)}` : "Contenu par défaut (JSX)"}
                  </span>
                </div>
              </div>
              <Link
                to={`/admin/legal/${page.page_key}/edit`}
                className="ml-4 flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-colors"
                style={{ background: INNER_BG, color: C_BLUE, border: `1px solid ${INNER_BORDER}` }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.13)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
              >
                <Pencil className="w-3.5 h-3.5" />
                Éditer
              </Link>
            </div>
          ))}

          {pages.length === 0 && (
            <div
              className="py-12 text-center overflow-hidden"
              style={{ ...GLASS, borderRadius: "1rem", border: `1px solid ${INNER_BORDER}` }}
            >
              <p className="text-[14px] font-light" style={{ color: T_SECONDARY }}>
                Aucune page légale trouvée. Vérifiez le setup Supabase.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}