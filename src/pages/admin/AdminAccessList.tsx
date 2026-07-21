import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, UserPlus, Trash2, Power, Info, X, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser } from "@/lib/adminUsersService";
import type { AdminUser } from "@/lib/adminUsersService";

const inputClass = "w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all duration-150";
const inputStyle = {
  background: "white",
  border: "1px solid hsl(224 20% 12% / 0.12)",
  color: "hsl(224 55% 12%)",
};
const inputFocus = { borderColor: "hsl(224 60% 18% / 0.40)", boxShadow: "0 0 0 3px hsl(224 60% 18% / 0.08)" };
const inputBlur  = { boxShadow: "none", borderColor: "hsl(224 20% 12% / 0.12)" };

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
    if (!inviteEmail.includes("@")) { setInviteError("Email invalide."); return; }
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
          <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: "hsl(224 55% 12%)" }}>
            Gestion des accès
          </h1>
          <p className="text-[13px] font-light mt-1" style={{ color: "hsl(224 15% 52%)" }}>
            {activeCount} administrateur{activeCount !== 1 ? "s" : ""} actif{activeCount !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setInviteOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150"
          style={{ background: "hsl(224 60% 18%)", color: "white" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.88"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
        >
          <UserPlus className="w-4 h-4" />
          Inviter un admin
        </button>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 px-4 py-4 rounded-xl mb-6"
        style={{ background: "hsl(218 55% 42% / 0.07)", border: "1px solid hsl(218 55% 42% / 0.15)" }}>
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "hsl(218 50% 42%)" }} />
        <p className="text-[12px] font-light leading-relaxed" style={{ color: "hsl(218 35% 32%)" }}>
          Ajouter un admin ici lui donne accès au panneau. La personne doit d'abord créer un compte sur{" "}
          <strong className="font-medium">/login</strong> avec cet email. Pour lui donner accès en écriture aux
          données Supabase, mettez également à jour les policies RLS dans l'éditeur SQL.
        </p>
      </div>

      {/* Error state */}
      {isError && (
        <div className="mb-6 px-4 py-3 rounded-xl text-[13px]"
          style={{ background: "hsl(0 60% 96%)", color: "hsl(0 60% 40%)", border: "1px solid hsl(0 60% 88%)" }}>
          Impossible de charger la liste. Vérifiez que la table <strong>admin_users</strong> existe dans Supabase.
        </div>
      )}

      {/* Admin list */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.08)" }}>
        <div className="px-6 py-4" style={{ borderBottom: "1px solid hsl(224 20% 12% / 0.07)", background: "hsl(220 25% 98%)" }}>
          <h2 className="text-[14px] font-medium" style={{ color: "hsl(224 40% 28%)" }}>
            Administrateurs · {admins.length}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 rounded-full border-2 border-foreground/15 border-t-foreground/60 animate-spin" />
          </div>
        ) : admins.length === 0 ? (
          <p className="text-center text-[13px] font-light py-10" style={{ color: "hsl(224 15% 55%)" }}>
            Aucun admin trouvé. Exécutez le SQL de configuration dans Supabase.
          </p>
        ) : (
          <div>
            {admins.map((admin, i) => {
              const isSelf = admin.email === user?.email;
              const isLast = i === admins.length - 1;
              return (
                <div key={admin.id} className="flex items-center gap-4 px-6 py-4"
                  style={{ borderBottom: isLast ? "none" : "1px solid hsl(224 20% 12% / 0.06)", opacity: admin.active ? 1 : 0.5 }}>
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: isSelf ? "hsl(142 55% 38% / 0.12)" : admin.active ? "hsl(224 55% 18% / 0.08)" : "hsl(224 12% 90%)" }}>
                    <ShieldCheck className="w-4 h-4"
                      style={{ color: isSelf ? "hsl(142 50% 35%)" : admin.active ? "hsl(224 40% 45%)" : "hsl(224 12% 55%)" }}
                      strokeWidth={1.5} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[14px] font-light truncate" style={{ color: "hsl(224 35% 22%)" }}>
                        {admin.display_name ? (
                          <><span className="font-medium">{admin.display_name}</span>{" · "}<span className="text-[12px]">{admin.email}</span></>
                        ) : admin.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      {isSelf && (
                        <span className="text-[10px] font-medium tracking-wide" style={{ color: "hsl(142 50% 38%)" }}>
                          Session active
                        </span>
                      )}
                      <span className="text-[10px]" style={{ color: "hsl(224 12% 60%)" }}>
                        {admin.created_at ? `Depuis ${fmtDate(admin.created_at)}` : ""}
                        {admin.invited_by ? ` · Invité par ${admin.invited_by}` : ""}
                      </span>
                    </div>
                  </div>

                  {/* Role badge */}
                  <span className="text-[10px] tracking-[0.18em] uppercase font-medium px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{
                      background: admin.role === "super_admin" ? "hsl(218 55% 42% / 0.10)" : "hsl(224 20% 12% / 0.07)",
                      color: admin.role === "super_admin" ? "hsl(218 45% 38%)" : "hsl(224 35% 45%)",
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
                        style={{ color: admin.active ? "hsl(38 70% 40%)" : "hsl(142 50% 38%)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 20% 12% / 0.06)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(admin.id)}
                        title="Supprimer"
                        className="p-1.5 rounded-lg transition-all duration-150"
                        style={{ color: "hsl(0 60% 48%)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(0 60% 96%)"; }}
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
      <div className="mt-6 rounded-2xl overflow-hidden" style={{ background: "hsl(224 55% 8%)" }}>
        <div className="px-5 py-3" style={{ borderBottom: "1px solid hsl(0 0% 100% / 0.08)" }}>
          <p className="text-[11px] tracking-[0.2em] uppercase font-medium" style={{ color: "hsl(0 0% 100% / 0.35)" }}>
            Setup Supabase requis · à exécuter une seule fois
          </p>
        </div>
        <pre className="px-5 py-4 text-[11px] leading-relaxed overflow-x-auto" style={{ color: "hsl(142 60% 70%)", fontFamily: "monospace" }}>
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
INSERT INTO admin_users (email, display_name, role) VALUES
  ('quentin@adnfamily.com', 'Quentin', 'super_admin'),
  ('m.delorme@adnfamily.com', 'Matthieu', 'super_admin'),
  ('t.robert@adnfamily.com', 'Thomas', 'admin')
ON CONFLICT (email) DO NOTHING;`}
        </pre>
      </div>

      {/* Invite modal */}
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "hsl(224 60% 6% / 0.50)", backdropFilter: "blur(6px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setInviteOpen(false); }}>
          <div className="w-full max-w-md rounded-2xl"
            style={{ background: "white", boxShadow: "0 32px 80px -20px hsl(224 60% 12% / 0.22)" }}>
            <div className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: "1px solid hsl(224 20% 12% / 0.08)" }}>
              <h2 className="text-[16px] font-heading font-light" style={{ color: "hsl(224 55% 12%)" }}>
                Inviter un administrateur
              </h2>
              <button onClick={() => setInviteOpen(false)} className="p-1.5 rounded-lg hover:bg-[hsl(224_20%_12%/0.06)]">
                <X className="w-4 h-4" style={{ color: "hsl(224 20% 45%)" }} />
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium tracking-wide" style={{ color: "hsl(224 25% 38%)" }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="prenom@exemple.com"
                  className={inputClass}
                  style={inputStyle}
                  onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
                  onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium tracking-wide" style={{ color: "hsl(224 25% 38%)" }}>
                  Prénom / Nom
                </label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Prénom Nom (optionnel)"
                  className={inputClass}
                  style={inputStyle}
                  onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
                  onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium tracking-wide" style={{ color: "hsl(224 25% 38%)" }}>
                  Rôle
                </label>
                <div className="relative">
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as "admin" | "super_admin")}
                    className={inputClass}
                    style={{ ...inputStyle, cursor: "pointer", paddingRight: "2.5rem", appearance: "none" }}
                    onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
                    onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)}
                  >
                    <option value="admin">Admin · accès lecture/écriture standard</option>
                    <option value="super_admin">Super Admin · accès complet</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                    style={{ color: "hsl(224 20% 52%)" }} />
                </div>
              </div>

              {inviteError && (
                <p className="text-[12px] px-3 py-2 rounded-lg"
                  style={{ background: "hsl(0 60% 96%)", color: "hsl(0 60% 40%)", border: "1px solid hsl(0 60% 88%)" }}>
                  {inviteError}
                </p>
              )}

              <button
                onClick={handleInvite}
                disabled={createMutation.isPending || !inviteEmail}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[14px] font-medium transition-opacity disabled:opacity-60"
                style={{ background: "hsl(224 60% 18%)", color: "white" }}
              >
                {createMutation.isPending ? (
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4" />
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
          style={{ background: "hsl(224 60% 6% / 0.50)", backdropFilter: "blur(6px)" }}>
          <div className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-5"
            style={{ background: "white", boxShadow: "0 24px 60px -16px hsl(224 60% 12% / 0.22)" }}>
            <div>
              <p className="text-[15px] font-medium mb-1" style={{ color: "hsl(224 55% 12%)" }}>
                Supprimer cet administrateur ?
              </p>
              <p className="text-[13px] font-light" style={{ color: "hsl(224 15% 50%)" }}>
                {admins.find((a) => a.id === confirmDelete)?.email} · cette action est irréversible.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => deleteMutation.mutate(confirmDelete)}
                disabled={deleteMutation.isPending}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-medium transition-opacity disabled:opacity-60"
                style={{ background: "hsl(0 60% 48%)", color: "white" }}>
                {deleteMutation.isPending ? "Suppression…" : "Supprimer"}
              </button>
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-medium"
                style={{ background: "hsl(224 20% 12% / 0.08)", color: "hsl(224 40% 35%)" }}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
