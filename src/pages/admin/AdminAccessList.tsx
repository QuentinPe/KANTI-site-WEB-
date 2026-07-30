import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, UserPlus, Trash2, Power, Info, X, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser } from "@/lib/adminUsersService";
import type { AdminUser } from "@/lib/adminUsersService";
import {
  GLASS, GLASS_HOVER_SHADOW, INNER_BG, INNER_BORDER,
  T_PRIMARY, T_SECONDARY, T_MUTED, T_HEADING, T_LABEL,
  C_BLUE, C_SAGE, C_CORAL, INPUT_STYLE,
} from "@/lib/adminTheme";

const inputClass = "w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all duration-150";
const inputFocus = { borderColor: C_BLUE, boxShadow: `0 0 0 3px ${C_BLUE}30` };
const inputBlur  = { boxShadow: "none", borderColor: INNER_BORDER };

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

export default function AdminAccessList() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "super_admin">("admin");
  const [inviteError, setInviteError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { data: admins = [], isLoading, isError } = useQuery({
    queryKey: ["admin-users"],
    queryFn: getAdminUsers,
  });

  const createMutation = useMutation({
    mutationFn: (input: Parameters<typeof createAdminUser>[0]) =>
      createAdminUser({ ...input, invited_by: user?.email ?? undefined }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      setInviteOpen(false);
      setInviteEmail("");
      setInviteName("");
      setInviteRole("admin");
      setInviteError("");
    },
    onError: (e: Error) => setInviteError(e.message ?? "Erreur lors de l'invitation."),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => updateAdminUser(id, { active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAdminUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      setConfirmDelete(null);
    },
  });

  const handleInvite = () => {
    setInviteError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail.trim())) { setInviteError("Email invalide."); return; }
    if (admins.some((a) => a.email === inviteEmail.trim())) {
      setInviteError("Cet email est déjà dans la liste."); return;
    }
    createMutation.mutate({ email: inviteEmail.trim(), display_name: inviteName.trim() || undefined, role: inviteRole });
  };

  const activeCount = admins.filter((a) => a.active).length;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: T_PRIMARY }}>
            Gestion des accès
          </h1>
          <p className="text-[13px] font-light mt-1" style={{ color: T_SECONDARY }}>
            {activeCount} administrateur{activeCount !== 1 ? "s" : ""} actif{activeCount !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setInviteOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150"
          style={{ ...GLASS, color: T_PRIMARY }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = GLASS_HOVER_SHADOW; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = GLASS.boxShadow as string; }}
        >
          <UserPlus className="w-4 h-4" style={{ color: C_BLUE }} />
          Inviter un admin
        </button>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 px-4 py-4 rounded-xl mb-6"
        style={{ background: `${C_BLUE}12`, border: `1px solid ${C_BLUE}28` }}>
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: C_BLUE }} />
        <p className="text-[12px] font-light leading-relaxed" style={{ color: T_SECONDARY }}>
          Ajouter un admin ici lui donne accès au panneau. La personne doit d'abord créer un compte sur{" "}
          <strong className="font-medium" style={{ color: T_HEADING }}>/login</strong> avec cet email. Pour lui donner accès en écriture aux
          données Supabase, mettez également à jour les policies RLS dans l'éditeur SQL.
        </p>
      </div>

      {/* Error state */}
      {isError && (
        <div className="mb-6 px-4 py-3 rounded-xl text-[13px]"
          style={{ background: `${C_CORAL}18`, color: C_CORAL, border: `1px solid ${C_CORAL}35` }}>
          Impossible de charger la liste. Vérifiez que la table <strong>admin_users</strong> existe dans Supabase.
        </div>
      )}

      {/* Admin list */}
      <div className="rounded-2xl overflow-hidden" style={{ ...GLASS }}>
        <div className="px-6 py-4" style={{ borderBottom: `1px solid ${INNER_BORDER}`, background: INNER_BG }}>
          <h2 className="text-[14px] font-medium" style={{ color: T_HEADING }}>
            Administrateurs · {admins.length}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 rounded-full border-2 animate-spin"
              style={{ borderColor: `${INNER_BORDER} ${INNER_BORDER} ${INNER_BORDER} ${T_SECONDARY}` }} />
          </div>
        ) : admins.length === 0 ? (
          <p className="text-center text-[13px] font-light py-10" style={{ color: T_MUTED }}>
            Aucun admin trouvé. Exécutez le SQL de configuration dans Supabase.
          </p>
        ) : (
          <div>
            {admins.map((admin, i) => {
              const isSelf = admin.email === user?.email;
              const isLast = i === admins.length - 1;
              return (
                <div key={admin.id} className="flex items-center gap-4 px-6 py-4"
                  style={{ borderBottom: isLast ? "none" : `1px solid ${INNER_BORDER}`, opacity: admin.active ? 1 : 0.5 }}>
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: isSelf ? `${C_SAGE}20` : `${C_BLUE}15`, border: `1px solid ${INNER_BORDER}` }}>
                    <ShieldCheck className="w-4 h-4"
                      style={{ color: isSelf ? C_SAGE : C_BLUE }}
                      strokeWidth={1.5} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[14px] font-light truncate" style={{ color: T_HEADING }}>
                        {admin.display_name ? (
                          <><span className="font-medium">{admin.display_name}</span>{" · "}<span className="text-[12px]" style={{ color: T_SECONDARY }}>{admin.email}</span></>
                        ) : admin.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      {isSelf && (
                        <span className="text-[10px] font-medium tracking-wide" style={{ color: C_SAGE }}>
                          Session active
                        </span>
                      )}
                      <span className="text-[10px]" style={{ color: T_MUTED }}>
                        {admin.created_at ? `Depuis ${fmtDate(admin.created_at)}` : ""}
                        {admin.invited_by ? ` · Invité par ${admin.invited_by}` : ""}
                      </span>
                    </div>
                  </div>

                  {/* Role badge */}
                  <span className="text-[10px] tracking-[0.18em] uppercase font-medium px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{
                      background: admin.role === "super_admin" ? `${C_BLUE}18` : INNER_BG,
                      color: admin.role === "super_admin" ? C_BLUE : T_LABEL,
                      border: `1px solid ${admin.role === "super_admin" ? C_BLUE + "35" : INNER_BORDER}`,
                    }}>
                    {admin.role === "super_admin" ? "Super Admin" : "Admin"}
                  </span>

                  {/* Actions */}
                  {!isSelf && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => toggleMutation.mutate({ id: admin.id, active: !admin.active })}
                        disabled={toggleMutation.isPending}
                        title={admin.active ? "Désactiver" : "Réactiver"}
                        className="p-1.5 rounded-lg transition-all duration-150"
                        style={{ color: admin.active ? "hsl(38 70% 62%)" : C_SAGE }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(admin.id)}
                        title="Supprimer"
                        className="p-1.5 rounded-lg transition-all duration-150"
                        style={{ color: C_CORAL }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = `${C_CORAL}15`; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SQL hint */}
      <div className="mt-6 rounded-2xl overflow-hidden" style={{ ...GLASS }}>
        <div className="px-5 py-3" style={{ borderBottom: `1px solid ${INNER_BORDER}`, background: INNER_BG }}>
          <p className="text-[11px] tracking-[0.2em] uppercase font-medium" style={{ color: T_MUTED }}>
            Setup Supabase requis · à exécuter une seule fois
          </p>
        </div>
        <pre className="px-5 py-4 text-[11px] leading-relaxed overflow-x-auto" style={{ color: C_SAGE, fontFamily: "monospace" }}>
{`CREATE TABLE admin_users (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email        text NOT NULL UNIQUE,
  display_name text,
  role         text NOT NULL DEFAULT 'admin',
  active       boolean DEFAULT true,
  invited_by   text,
  created_at   timestamptz DEFAULT now()
);
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can read" ON admin_users FOR SELECT TO authenticated
  USING (auth.jwt()->>'email' IN (
    SELECT email FROM admin_users WHERE active = true));
CREATE POLICY "Admin can write" ON admin_users FOR ALL TO authenticated
  USING (auth.jwt()->>'email' IN (
    SELECT email FROM admin_users WHERE active = true))
  WITH CHECK (auth.jwt()->>'email' IN (
    SELECT email FROM admin_users WHERE active = true));
-- Insérez vos administrateurs initiaux via l'interface ci-dessus
-- ou directement dans Supabase Dashboard > Table Editor > admin_users`}
        </pre>
      </div>

      {/* Invite modal */}
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(8,11,22,0.65)", backdropFilter: "blur(12px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setInviteOpen(false); }}>
          <div className="w-full max-w-md rounded-2xl overflow-hidden"
            style={{ ...GLASS, boxShadow: GLASS_HOVER_SHADOW }}>
            <div className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: `1px solid ${INNER_BORDER}`, background: INNER_BG }}>
              <h2 className="text-[16px] font-heading font-light" style={{ color: T_HEADING }}>
                Inviter un administrateur
              </h2>
              <button
                onClick={() => setInviteOpen(false)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: T_MUTED }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium tracking-wide" style={{ color: T_LABEL }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="prenom@exemple.com"
                  className={inputClass}
                  style={{ ...INPUT_STYLE }}
                  onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
                  onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium tracking-wide" style={{ color: T_LABEL }}>
                  Prénom / Nom
                </label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Prénom Nom (optionnel)"
                  className={inputClass}
                  style={{ ...INPUT_STYLE }}
                  onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
                  onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium tracking-wide" style={{ color: T_LABEL }}>
                  Rôle
                </label>
                <div className="relative">
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as "admin" | "super_admin")}
                    className={inputClass}
                    style={{ ...INPUT_STYLE, cursor: "pointer", paddingRight: "2.5rem", appearance: "none" }}
                    onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
                    onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)}
                  >
                    <option value="admin">Admin · accès lecture/écriture standard</option>
                    <option value="super_admin">Super Admin · accès complet</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                    style={{ color: T_MUTED }} />
                </div>
              </div>

              {inviteError && (
                <p className="text-[12px] px-3 py-2 rounded-lg"
                  style={{ background: `${C_CORAL}18`, color: C_CORAL, border: `1px solid ${C_CORAL}35` }}>
                  {inviteError}
                </p>
              )}

              <button
                onClick={handleInvite}
                disabled={createMutation.isPending || !inviteEmail}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[14px] font-medium transition-opacity disabled:opacity-60"
                style={{ background: INNER_BG, border: `1px solid ${INNER_BORDER}`, color: T_PRIMARY }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.11)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
              >
                {createMutation.isPending ? (
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4" style={{ color: C_BLUE }} />
                )}
                {createMutation.isPending ? "Ajout en cours…" : "Ajouter l'administrateur"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(8,11,22,0.65)", backdropFilter: "blur(12px)" }}>
          <div className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-5"
            style={{ ...GLASS, boxShadow: GLASS_HOVER_SHADOW }}>
            <div>
              <p className="text-[15px] font-medium mb-1" style={{ color: T_HEADING }}>
                Supprimer cet administrateur ?
              </p>
              <p className="text-[13px] font-light" style={{ color: T_SECONDARY }}>
                {admins.find((a) => a.id === confirmDelete)?.email} · cette action est irréversible.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => deleteMutation.mutate(confirmDelete)}
                disabled={deleteMutation.isPending}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-medium transition-opacity disabled:opacity-60"
                style={{ background: `${C_CORAL}28`, border: `1px solid ${C_CORAL}45`, color: C_CORAL }}>
                {deleteMutation.isPending ? "Suppression…" : "Supprimer"}
              </button>
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-medium"
                style={{ background: INNER_BG, border: `1px solid ${INNER_BORDER}`, color: T_SECONDARY }}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
