import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, BookOpen, CheckCircle2, XCircle, Star, Settings2 } from "lucide-react";
import { getAllRessources, deleteRessource } from "@/lib/ressourcesService";
import { getSiteSettingsMap, upsertSetting } from "@/lib/siteSettingsService";
import {
  GLASS, INNER_BG, INNER_BORDER,
  T_PRIMARY, T_SECONDARY, T_MUTED, T_HEADING,
  C_BLUE, C_GOLD, C_SAGE, C_CORAL,
} from "@/lib/adminTheme";

export default function AdminResourcesList() {
  const qc = useQueryClient();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const { data: ressources = [], isLoading } = useQuery({
    queryKey: ["ressources-admin"],
    queryFn: getAllRessources,
  });

  const { data: settingsMap = {} } = useQuery({
    queryKey: ["site-settings"],
    queryFn: getSiteSettingsMap,
    staleTime: 30_000,
  });

  const featuredId = settingsMap["featured_resource_id"] ?? null;

  const featuredMutation = useMutation({
    mutationFn: (id: string) => upsertSetting("featured_resource_id", id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site-settings"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRessource,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ressources-admin"] });
      qc.invalidateQueries({ queryKey: ["ressources"] });
      setConfirmId(null);
    },
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: T_PRIMARY }}>
            Ressources PDF
          </h1>
          <p className="text-[13px] font-light mt-1" style={{ color: T_SECONDARY }}>
            {ressources.length} ressource{ressources.length !== 1 ? "s" : ""} au total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/ressources/mise-en-avant"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200"
            style={{ background: "hsl(40 50% 62% / 0.18)", color: C_GOLD, border: `1px solid hsl(40 50% 62% / 0.30)` }}
          >
            <Settings2 className="w-4 h-4" />
            Mise en avant
          </Link>
          <Link
            to="/admin/ressources/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 hover:opacity-90"
            style={{ background: "hsl(215 42% 65% / 0.18)", color: C_BLUE, border: `1px solid hsl(215 42% 65% / 0.30)` }}
          >
            <Plus className="w-4 h-4" />
            Nouvelle ressource
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div
            className="w-7 h-7 rounded-full animate-spin"
            style={{ border: "2px solid rgba(255,255,255,0.15)", borderTopColor: "rgba(255,255,255,0.60)" }}
          />
        </div>
      ) : ressources.length === 0 ? (
        <div
          className="text-center py-24 overflow-hidden"
          style={{ ...GLASS, borderRadius: "1rem" }}
        >
          <BookOpen className="w-10 h-10 mx-auto mb-4" style={{ color: T_MUTED }} />
          <p className="text-[15px] font-heading font-light" style={{ color: T_HEADING }}>
            Aucune ressource pour le moment
          </p>
          <p className="text-[13px] font-light mt-1 mb-6" style={{ color: T_SECONDARY }}>
            Importez vos premiers guides PDF depuis le bouton ci-dessus.
          </p>
          <Link
            to="/admin/ressources/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-medium"
            style={{ background: "hsl(215 42% 65% / 0.18)", color: C_BLUE, border: `1px solid hsl(215 42% 65% / 0.30)` }}
          >
            <Plus className="w-4 h-4" />
            Ajouter une ressource
          </Link>
        </div>
      ) : (
        <div
          className="overflow-hidden"
          style={{ ...GLASS, borderRadius: "1rem" }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${INNER_BORDER}` }}>
                {["Titre", "Catégorie", "Pages", "Actif", "Mise en avant", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-[11px] tracking-[0.18em] uppercase font-medium"
                    style={{ color: T_MUTED }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ressources.map((r) => (
                <tr key={r.id} style={{ borderBottom: `1px solid ${INNER_BORDER}` }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                  <td className="px-5 py-4">
                    <span className="text-[13.5px] font-medium" style={{ color: T_PRIMARY }}>{r.title}</span>
                    <span className="block text-[11px] font-light mt-0.5 max-w-[280px] truncate" style={{ color: T_MUTED }}>
                      {r.description}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                      style={{ background: "hsl(215 42% 65% / 0.18)", color: C_BLUE }}>
                      {r.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[13px] font-light" style={{ color: T_SECONDARY }}>
                    {r.pages ?? "—"}
                  </td>
                  <td className="px-5 py-4">
                    {r.active
                      ? <CheckCircle2 className="w-4 h-4" style={{ color: C_SAGE }} />
                      : <XCircle className="w-4 h-4" style={{ color: T_MUTED }} />
                    }
                  </td>
                  <td className="px-5 py-4">
                    <button
                      title={r.id === featuredId ? "Ressource mise en avant" : "Mettre en avant sur la page Ressources"}
                      disabled={featuredMutation.isPending}
                      onClick={() => { if (r.id !== featuredId) featuredMutation.mutate(r.id); }}
                      className="p-1.5 rounded-lg transition-all duration-150 disabled:opacity-50"
                      style={{
                        color: r.id === featuredId ? C_GOLD : T_MUTED,
                        background: r.id === featuredId ? "hsl(40 50% 62% / 0.18)" : "transparent",
                        cursor: r.id === featuredId ? "default" : "pointer",
                      }}
                    >
                      <Star className="w-4 h-4" fill={r.id === featuredId ? "currentColor" : "none"} />
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/ressources/${r.id}/edit`}
                        className="p-1.5 rounded-lg transition-all duration-150"
                        style={{ color: T_SECONDARY }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      {confirmId === r.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => deleteMutation.mutate(r.id)}
                            disabled={deleteMutation.isPending}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium disabled:opacity-60"
                            style={{ background: "hsl(5 45% 56% / 0.20)", color: C_CORAL, border: `1px solid hsl(5 45% 56% / 0.35)` }}
                          >
                            {deleteMutation.isPending ? "…" : "Confirmer"}
                          </button>
                          <button onClick={() => setConfirmId(null)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium"
                            style={{ color: T_SECONDARY }}>
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmId(r.id)}
                          className="p-1.5 rounded-lg transition-all duration-150"
                          style={{ color: T_MUTED }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = C_CORAL; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = T_MUTED; }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}