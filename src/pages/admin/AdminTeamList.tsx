import {
  GLASS, INNER_BG, INNER_BORDER,
  T_PRIMARY, T_SECONDARY, T_MUTED, T_HEADING, T_LABEL,
  C_BLUE, C_SAGE, C_CORAL,
} from "@/lib/adminTheme";

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
            <UserSquare2 className="w-5 h-5" style={{ color: C_BLUE }} />
            <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: T_PRIMARY }}>
              Équipe
            </h1>
          </div>
          <p className="text-[13px] font-light" style={{ color: T_SECONDARY }}>
            {members.length} membre{members.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          to="/admin/equipe/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-opacity hover:opacity-90"
          style={{ background: "hsl(215 42% 65% / 0.18)", color: C_BLUE, border: `1px solid hsl(215 42% 65% / 0.30)` }}
        >
          <Plus className="w-4 h-4" />
          Nouveau membre
        </Link>
      </div>

      {/* Table */}
      <div style={{ ...GLASS, borderRadius: "1rem", overflow: "hidden", border: `1px solid ${INNER_BORDER}` }}>
        {isLoading ? (
          <div className="py-16 flex justify-center">
            <div
              className="w-6 h-6 rounded-full animate-spin"
              style={{ border: "2px solid rgba(255,255,255,0.15)", borderTopColor: "rgba(255,255,255,0.60)" }}
            />
          </div>
        ) : members.length === 0 ? (
          <div className="py-16 text-center">
            <UserSquare2 className="w-10 h-10 mx-auto mb-3" style={{ color: T_MUTED }} />
            <p className="text-[14px] font-light" style={{ color: T_SECONDARY }}>
              Aucun membre. Ajoutez le premier.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${INNER_BORDER}`, background: INNER_BG }}>
                {["Photo", "Nom", "Rôle", "Actif", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-[11px] font-medium tracking-wide uppercase" style={{ color: T_LABEL }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => (
                <tr
                  key={m.id}
                  style={{ borderBottom: i < members.length - 1 ? `1px solid ${INNER_BORDER}` : "none" }}
                >
                  <td className="px-5 py-4">
                    {m.image ? (
                      <img src={m.image} alt={m.name} className="w-10 h-10 rounded-xl object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: INNER_BG }}>
                        <UserSquare2 className="w-5 h-5" style={{ color: T_MUTED }} />
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-[14px] font-medium" style={{ color: T_HEADING }}>
                    {m.name}
                  </td>
                  <td className="px-5 py-4 text-[13px] font-light" style={{ color: T_SECONDARY }}>
                    {m.role}
                  </td>
                  <td className="px-5 py-4">
                    {m.active
                      ? <CheckCircle2 className="w-4 h-4" style={{ color: C_SAGE }} />
                      : <XCircle className="w-4 h-4" style={{ color: C_CORAL }} />}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/equipe/${m.id}/edit`}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: C_BLUE }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        title="Modifier"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      {confirmId === m.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => deleteMutation.mutate(m.id)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium"
                            style={{ background: "hsl(5 45% 56% / 0.22)", color: C_CORAL, border: `1px solid hsl(5 45% 56% / 0.35)` }}
                          >
                            Confirmer
                          </button>
                          <button
                            onClick={() => setConfirmId(null)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium"
                            style={{ color: T_SECONDARY, border: `1px solid ${INNER_BORDER}` }}
                          >
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmId(m.id)}
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ color: C_CORAL }}
                          onMouseEnter={e => (e.currentTarget.style.background = "hsl(5 45% 56% / 0.12)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                          title="Supprimer"
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
        )}
      </div>
    </div>
  );
}