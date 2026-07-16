import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Users, CheckCircle2, XCircle } from "lucide-react";
import { getAllCasClients, deleteCasClient } from "@/lib/casClientsService";

export default function AdminCasClientsList() {
  const qc = useQueryClient();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const { data: cases = [], isLoading } = useQuery({
    queryKey: ["cas-clients-admin"],
    queryFn: getAllCasClients,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCasClient,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cas-clients-admin"] });
      setConfirmId(null);
    },
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: "hsl(224 55% 12%)" }}>
            Cas clients
          </h1>
          <p className="text-[13px] font-light mt-1" style={{ color: "hsl(224 20% 50%)" }}>
            {cases.length} cas au total
          </p>
        </div>
        <Link
          to="/admin/cas-clients/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium text-white transition-all duration-200 hover:opacity-90"
          style={{ background: "hsl(224 60% 18%)" }}
        >
          <Plus className="w-4 h-4" />
          Nouveau cas
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 rounded-full border-2 border-foreground/15 border-t-foreground/60 animate-spin" />
        </div>
      ) : cases.length === 0 ? (
        <div className="text-center py-24 rounded-2xl" style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.07)" }}>
          <Users className="w-10 h-10 mx-auto mb-4" style={{ color: "hsl(224 20% 72%)" }} />
          <p className="text-[15px] font-heading font-light" style={{ color: "hsl(224 40% 35%)" }}>
            Aucun cas client pour le moment
          </p>
          <p className="text-[13px] font-light mt-1 mb-6" style={{ color: "hsl(224 15% 55%)" }}>
            Les cas clients s'afficheront sur la page /cas-clients une fois créés.
          </p>
          <Link
            to="/admin/cas-clients/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-medium text-white"
            style={{ background: "hsl(224 60% 18%)" }}
          >
            <Plus className="w-4 h-4" />
            Ajouter un cas
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
                {["Profil", "Catégorie", "Expertise", "Actif", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-[11px] tracking-[0.18em] uppercase font-medium"
                    style={{ color: "hsl(224 15% 55%)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid hsl(224 20% 12% / 0.05)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 20% 98%)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                  <td className="px-5 py-4">
                    <span className="text-[13.5px] font-medium" style={{ color: "hsl(224 55% 12%)" }}>{c.profil}</span>
                    {c.age && <span className="block text-[11px] font-light mt-0.5" style={{ color: "hsl(224 15% 52%)" }}>{c.age} ans</span>}
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                      style={{ background: "hsl(224 60% 18% / 0.08)", color: "hsl(224 55% 28%)" }}>
                      {c.category_label}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[13px] font-light max-w-[200px] truncate" style={{ color: "hsl(224 20% 45%)" }}>
                    {c.expertise}
                  </td>
                  <td className="px-5 py-4">
                    {c.active
                      ? <CheckCircle2 className="w-4 h-4" style={{ color: "hsl(142 55% 42%)" }} />
                      : <XCircle className="w-4 h-4" style={{ color: "hsl(224 15% 65%)" }} />
                    }
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/cas-clients/${c.id}/edit`}
                        className="p-1.5 rounded-lg transition-all duration-150" style={{ color: "hsl(224 40% 45%)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 60% 18% / 0.08)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                        <Pencil className="w-4 h-4" />
                      </Link>
                      {confirmId === c.id ? (
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => deleteMutation.mutate(c.id)} disabled={deleteMutation.isPending}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-white disabled:opacity-60"
                            style={{ background: "hsl(0 60% 45%)" }}>
                            {deleteMutation.isPending ? "…" : "Confirmer"}
                          </button>
                          <button onClick={() => setConfirmId(null)} className="px-2.5 py-1 rounded-lg text-[11px] font-medium"
                            style={{ color: "hsl(224 25% 50%)" }}>Annuler</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmId(c.id)} className="p-1.5 rounded-lg transition-all duration-150"
                          style={{ color: "hsl(224 15% 65%)" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(0 60% 45%)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(224 15% 65%)"; }}>
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
