import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, BookOpen, CheckCircle2, XCircle, Star } from "lucide-react";
import { getAllRessources, deleteRessource } from "@/lib/ressourcesService";
import { getSiteSettingsMap, upsertSetting } from "@/lib/siteSettingsService";

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
          <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: "hsl(224 55% 12%)" }}>
            Ressources PDF
          </h1>
          <p className="text-[13px] font-light mt-1" style={{ color: "hsl(224 20% 50%)" }}>
            {ressources.length} ressource{ressources.length !== 1 ? "s" : ""} au total
          </p>
        </div>
        <Link
          to="/admin/ressources/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium text-white transition-all duration-200 hover:opacity-90"
          style={{ background: "hsl(224 60% 18%)" }}
        >
          <Plus className="w-4 h-4" />
          Nouvelle ressource
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 rounded-full border-2 border-foreground/15 border-t-foreground/60 animate-spin" />
        </div>
      ) : ressources.length === 0 ? (
        <div className="text-center py-24 rounded-2xl" style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.07)" }}>
          <BookOpen className="w-10 h-10 mx-auto mb-4" style={{ color: "hsl(224 20% 72%)" }} />
          <p className="text-[15px] font-heading font-light" style={{ color: "hsl(224 40% 35%)" }}>
            Aucune ressource pour le moment
          </p>
          <p className="text-[13px] font-light mt-1 mb-6" style={{ color: "hsl(224 15% 55%)" }}>
            Importez vos premiers guides PDF depuis le bouton ci-dessus.
          </p>
          <Link
            to="/admin/ressources/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-medium text-white"
            style={{ background: "hsl(224 60% 18%)" }}
          >
            <Plus className="w-4 h-4" />
            Ajouter une ressource
          </Link>
        </div>
      ) : (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.07)", boxShadow: "0 2px 12px -4px hsl(224 60% 12% / 0.05)" }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid hsl(224 20% 12% / 0.07)" }}>
                {["Titre", "Catégorie", "Pages", "Actif", "Mise en avant", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-[11px] tracking-[0.18em] uppercase font-medium"
                    style={{ color: "hsl(224 15% 55%)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ressources.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid hsl(224 20% 12% / 0.05)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 20% 98%)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                  <td className="px-5 py-4">
                    <span className="text-[13.5px] font-medium" style={{ color: "hsl(224 55% 12%)" }}>{r.title}</span>
                    <span className="block text-[11px] font-light mt-0.5 max-w-[280px] truncate" style={{ color: "hsl(224 15% 52%)" }}>
                      {r.description}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                      style={{ background: "hsl(224 60% 18% / 0.08)", color: "hsl(224 55% 28%)" }}>
                      {r.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[13px] font-light" style={{ color: "hsl(224 20% 45%)" }}>
                    {r.pages ?? "—"}
                  </td>
                  <td className="px-5 py-4">
                    {r.active
                      ? <CheckCircle2 className="w-4 h-4" style={{ color: "hsl(142 55% 42%)" }} />
                      : <XCircle className="w-4 h-4" style={{ color: "hsl(224 15% 65%)" }} />
                    }
                  </td>
                  <td className="px-5 py-4">
                    <button
                      title={r.id === featuredId ? "Ressource mise en avant" : "Mettre en avant sur la page Ressources"}
                      disabled={featuredMutation.isPending}
                      onClick={() => { if (r.id !== featuredId) featuredMutation.mutate(r.id); }}
                      className="p-1.5 rounded-lg transition-all duration-150 disabled:opacity-50"
                      style={{
                        color: r.id === featuredId ? "hsl(42 90% 48%)" : "hsl(224 15% 72%)",
                        background: r.id === featuredId ? "hsl(42 90% 48% / 0.10)" : "transparent",
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
                        style={{ color: "hsl(224 40% 45%)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 60% 18% / 0.08)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      {confirmId === r.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => deleteMutation.mutate(r.id)}
                            disabled={deleteMutation.isPending}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-white disabled:opacity-60"
                            style={{ background: "hsl(0 60% 45%)" }}
                          >
                            {deleteMutation.isPending ? "…" : "Confirmer"}
                          </button>
                          <button onClick={() => setConfirmId(null)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium"
                            style={{ color: "hsl(224 25% 50%)" }}>
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmId(r.id)}
                          className="p-1.5 rounded-lg transition-all duration-150"
                          style={{ color: "hsl(224 15% 65%)" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(0 60% 45%)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(224 15% 65%)"; }}
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
