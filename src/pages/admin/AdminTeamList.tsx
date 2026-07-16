import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, CheckCircle2, XCircle, UserSquare2 } from "lucide-react";
import { getAllTeamMembers, deleteTeamMember } from "@/lib/teamService";

export default function AdminTeamList() {
  const qc = useQueryClient();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["admin-team"],
    queryFn: getAllTeamMembers,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTeamMember,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-team"] }); setConfirmId(null); },
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <UserSquare2 className="w-5 h-5" style={{ color: "hsl(224 55% 32%)" }} />
            <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: "hsl(224 55% 14%)" }}>
              Équipe
            </h1>
          </div>
          <p className="text-[13px] font-light" style={{ color: "hsl(224 20% 50%)" }}>
            {members.length} membre{members.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          to="/admin/equipe/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: "hsl(224 60% 18%)" }}
        >
          <Plus className="w-4 h-4" />
          Nouveau membre
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid hsl(224 20% 12% / 0.09)" }}>
        {isLoading ? (
          <div className="py-16 flex justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-foreground/15 border-t-foreground/60 animate-spin" />
          </div>
        ) : members.length === 0 ? (
          <div className="py-16 text-center">
            <UserSquare2 className="w-10 h-10 mx-auto mb-3" style={{ color: "hsl(224 20% 70%)" }} />
            <p className="text-[14px] font-light" style={{ color: "hsl(224 20% 55%)" }}>
              Aucun membre. Ajoutez le premier.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid hsl(224 20% 12% / 0.07)", background: "hsl(220 25% 98%)" }}>
                {["Photo", "Nom", "Rôle", "Actif", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-[11px] font-medium tracking-wide uppercase" style={{ color: "hsl(224 20% 50%)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => (
                <tr
                  key={m.id}
                  style={{ borderBottom: i < members.length - 1 ? "1px solid hsl(224 20% 12% / 0.06)" : "none" }}
                >
                  <td className="px-5 py-4">
                    {m.image ? (
                      <img src={m.image} alt={m.name} className="w-10 h-10 rounded-xl object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "hsl(224 20% 92%)" }}>
                        <UserSquare2 className="w-5 h-5" style={{ color: "hsl(224 20% 60%)" }} />
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-[14px] font-medium" style={{ color: "hsl(224 40% 18%)" }}>
                    {m.name}
                  </td>
                  <td className="px-5 py-4 text-[13px] font-light" style={{ color: "hsl(224 20% 45%)" }}>
                    {m.role}
                  </td>
                  <td className="px-5 py-4">
                    {m.active
                      ? <CheckCircle2 className="w-4 h-4" style={{ color: "hsl(142 60% 40%)" }} />
                      : <XCircle className="w-4 h-4" style={{ color: "hsl(0 60% 55%)" }} />}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/equipe/${m.id}/edit`}
                        className="p-1.5 rounded-lg transition-colors hover:bg-foreground/5"
                        title="Modifier"
                      >
                        <Pencil className="w-4 h-4" style={{ color: "hsl(224 40% 40%)" }} />
                      </Link>
                      {confirmId === m.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => deleteMutation.mutate(m.id)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-white"
                            style={{ background: "hsl(0 65% 48%)" }}
                          >
                            Confirmer
                          </button>
                          <button
                            onClick={() => setConfirmId(null)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium"
                            style={{ color: "hsl(224 20% 50%)", border: "1px solid hsl(224 20% 80%)" }}
                          >
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmId(m.id)}
                          className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" style={{ color: "hsl(0 60% 55%)" }} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
