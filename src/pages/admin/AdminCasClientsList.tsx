import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Users, CheckCircle2, XCircle } from "lucide-react";
import { getAllCasClients, deleteCasClient } from "@/lib/casClientsService";
import {
  GLASS, INNER_BG, INNER_BORDER,
  T_PRIMARY, T_SECONDARY, T_MUTED, T_HEADING, T_LABEL,
  C_BLUE, C_SAGE, C_CORAL,
} from "@/lib/adminTheme";

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
          <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: T_PRIMARY }}>
            Cas clients
          </h1>
          <p className="text-[13px] font-light mt-1" style={{ color: T_SECONDARY }}>
            {cases.length} cas au total
          </p>
        </div>
        <Link
          to="/admin/cas-clients/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 hover:opacity-90"
          style={{ background: "hsla(215, 42%, 65%, 0.18)", color: C_BLUE }}
        >
          <Plus className="w-4 h-4" />
          Nouveau cas
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 rounded-full border-2 border-white/15 border-t-white/60 animate-spin" />
        </div>
      ) : cases.length === 0 ? (
        <div className="text-center py-24" style={{ ...GLASS, borderRadius: "1rem", border: `1px solid ${INNER_BORDER}` }}>
          <Users className="w-10 h-10 mx-auto mb-4" style={{ color: T_MUTED }} />
          <p className="text-[15px] font-heading font-light" style={{ color: T_HEADING }}>
            Aucun cas client pour le moment
          </p>
          <p className="text-[13px] font-light mt-1 mb-6" style={{ color: T_SECONDARY }}>
            Les cas clients s'afficheront sur la page /cas-clients une fois créés.
          </p>
          <Link
            to="/admin/cas-clients/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-medium"
            style={{ background: "hsla(215, 42%, 65%, 0.18)", color: C_BLUE }}
          >
            <Plus className="w-4 h-4" />
            Ajouter un cas
          </Link>
        </div>
      ) : (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ ...GLASS, borderRadius: "1rem" }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${INNER_BORDER}` }}>
                {["Profil", "Catégorie", "Expertise", "Actif", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-[11px] tracking-[0.18em] uppercase font-medium"
                    style={{ color: T_LABEL }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.id} style={{ borderBottom: `1px solid ${INNER_BORDER}` }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                  <td className="px-5 py-4">
                    <span className="text-[13.5px] font-medium" style={{ color: T_PRIMARY }}>{c.profil}</span>
                    {c.age && <span className="block text-[11px] font-light mt-0.5" style={{ color: T_MUTED }}>{c.age} ans</span>}
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                      style={{ background: "hsla(215, 42%, 65%, 0.15)", color: C_BLUE }}>
                      {c.category_label}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[13px] font-light max-w-[200px] truncate" style={{ color: T_SECONDARY }}>
                    {c.expertise}
                  </td>
                  <td className="px-5 py-4">
                    {c.active
                      ? <CheckCircle2 className="w-4 h-4" style={{ color: C_SAGE }} />
                      : <XCircle className="w-4 h-4" style={{ color: T_MUTED }} />
                    }
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/cas-clients/${c.id}/edit`}
                        className="p-1.5 rounded-lg transition-all duration-150" style={{ color: C_BLUE }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                        <Pencil className="w-4 h-4" />
                      </Link>
                      {confirmId === c.id ? (
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => deleteMutation.mutate(c.id)} disabled={deleteMutation.isPending}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-white disabled:opacity-60"
                            style={{ background: C_CORAL }}>
                            {deleteMutation.isPending ? "…" : "Confirmer"}
                          </button>
                          <button onClick={() => setConfirmId(null)} className="px-2.5 py-1 rounded-lg text-[11px] font-medium"
                            style={{ color: T_SECONDARY }}>Annuler</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmId(c.id)} className="p-1.5 rounded-lg transition-all duration-150"
                          style={{ color: T_MUTED }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = C_CORAL; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = T_MUTED; }}>
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
