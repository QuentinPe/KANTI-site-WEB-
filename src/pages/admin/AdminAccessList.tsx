import { useState, useRef, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Search, UserPlus, MoreHorizontal, X, ChevronDown,
  Pencil, Trash2, Power, Send, Ban, RefreshCw, Check,
  Users, Clock, Activity,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getAdminUsers, updateAdminUser, deleteAdminUser,
  inviteAdminUser, cancelInvite, resendInvite,
} from "@/lib/adminUsersService";
import type { AdminUser, AdminRole, AdminStatus } from "@/lib/adminUsersService";
import {
  GLASS, INNER_BG, INNER_BORDER,
  T_PRIMARY, T_SECONDARY, T_MUTED, T_HEADING, T_LABEL,
  C_BLUE, C_GOLD, C_SAGE, C_CORAL, INPUT_STYLE, cA,
} from "@/lib/adminTheme";

// ─── Constants ─────────────────────────────────────────────────────────────

const ROLES: Record<AdminRole, { label: string; color: string; bg: string; border: string }> = {
  super_admin: { label: "Super Admin", color: C_BLUE, bg: cA(C_BLUE, 0.14), border: cA(C_BLUE, 0.26) },
  admin:       { label: "Admin",       color: C_GOLD, bg: cA(C_GOLD, 0.12), border: cA(C_GOLD, 0.22) },
  editeur:     { label: "Éditeur",     color: T_LABEL, bg: INNER_BG,         border: INNER_BORDER      },
};

const STATUS_META: Record<AdminStatus, { label: string; color: string }> = {
  active:   { label: "Actif",              color: C_SAGE  },
  invited:  { label: "Invitation envoyée", color: C_GOLD  },
  disabled: { label: "Désactivé",          color: T_MUTED },
};

const PERMISSIONS = [
  { id: "dashboard",   label: "Tableau de bord" },
  { id: "leads",       label: "Leads"           },
  { id: "analytics",   label: "Analytics"       },
  { id: "articles",    label: "Articles"         },
  { id: "categories",  label: "Catégories"      },
  { id: "ressources",  label: "Ressources PDF"   },
  { id: "cas_clients", label: "Cas clients"      },
  { id: "faq",         label: "FAQ"              },
  { id: "equipe",      label: "Équipe"           },
  { id: "legal",       label: "Mentions légales" },
  { id: "media",       label: "Médiathèque"      },
  { id: "settings",    label: "Paramètres & SEO" },
  { id: "acces",       label: "Gestion des accès"},
];

const DEFAULT_PERMS: Record<AdminRole, string[]> = {
  super_admin: PERMISSIONS.map((p) => p.id),
  admin:       PERMISSIONS.filter((p) => p.id !== "acces").map((p) => p.id),
  editeur:     ["articles", "categories", "ressources", "cas_clients", "faq", "equipe", "legal", "media"],
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function initials(name?: string | null, email?: string): string {
  if (name) return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (email ?? "?")[0].toUpperCase();
}

function avatarBg(seed: string) {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) % 360;
  return { bg: `hsl(${h} 38% 22%)`, fg: `hsl(${h} 52% 70%)` };
}

function relativeDate(iso?: string | null): string {
  if (!iso) return "Jamais";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(diff / 86_400_000);
  if (m < 2) return "À l'instant";
  if (m < 60) return `Il y a ${m} min`;
  if (h < 24) {
    const t = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
    return `Aujourd'hui à ${t}`;
  }
  if (d === 1) return "Hier";
  if (d < 7) return `Il y a ${d} jours`;
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

function deriveStatus(admin: AdminUser): AdminStatus {
  if (admin.status) return admin.status;
  return admin.active ? "active" : "disabled";
}

// ─── ActionsMenu ───────────────────────────────────────────────────────────

function ActionsMenu({
  admin, isSelf, currentUserRole, onEdit, onToggle, onDelete, onResend, onCancel,
}: {
  admin: AdminUser;
  isSelf: boolean;
  currentUserRole: AdminRole | null;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
  onResend: () => void;
  onCancel: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const status = deriveStatus(admin);
  const isSuperAdmin = currentUserRole === "super_admin";

  useEffect(() => {
    if (!open) return;
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [open]);

  const menuItem = (label: string, icon: React.ReactNode, action: () => void, danger = false) => (
    <button
      onClick={() => { action(); setOpen(false); }}
      className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[12px] transition-colors hover:bg-white/8"
      style={{ color: danger ? C_CORAL : "rgba(255,255,255,0.78)", textAlign: "left" }}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="p-1.5 rounded-lg transition-colors"
        style={{ color: T_MUTED }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-8 z-[200] rounded-xl p-1.5 min-w-[180px]"
            style={{
              background: "hsl(224 58% 8% / 0.97)",
              backdropFilter: "blur(24px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.13)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
            }}
          >
            {!isSelf && isSuperAdmin && menuItem("Modifier le rôle", <Pencil className="w-3.5 h-3.5" />, onEdit)}
            {status === "invited" && menuItem("Renvoyer l'invitation", <Send className="w-3.5 h-3.5" />, onResend)}
            {status === "invited" && menuItem("Annuler l'invitation", <Ban className="w-3.5 h-3.5" />, onCancel, true)}
            {status === "active" && !isSelf && menuItem("Désactiver", <Power className="w-3.5 h-3.5" />, onToggle, true)}
            {status === "disabled" && !isSelf && menuItem("Réactiver", <RefreshCw className="w-3.5 h-3.5" />, onToggle)}
            {!isSelf && isSuperAdmin && (
              <>
                <div className="my-1 mx-1" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />
                {menuItem("Supprimer l'accès", <Trash2 className="w-3.5 h-3.5" />, onDelete, true)}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── InviteDrawer ──────────────────────────────────────────────────────────

const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all duration-150";

function InviteDrawer({
  onClose, onSuccess, sessionToken,
}: {
  onClose: () => void;
  onSuccess: () => void;
  sessionToken: string;
}) {
  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [role, setRole]     = useState<AdminRole>("admin");
  const [perms, setPerms]   = useState<string[]>(DEFAULT_PERMS.admin);
  const [error, setError]   = useState("");
  const [saving, setSaving] = useState(false);

  const focusStyle  = { borderColor: C_BLUE, boxShadow: `0 0 0 3px ${cA(C_BLUE, 0.18)}` };
  const blurStyle   = { boxShadow: "none" };

  const handleRoleChange = (r: AdminRole) => { setRole(r); setPerms(DEFAULT_PERMS[r]); };
  const togglePerm = (id: string) =>
    setPerms((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  const allChecked = perms.length === PERMISSIONS.length;
  const toggleAll  = () => setPerms(allChecked ? [] : PERMISSIONS.map((p) => p.id));

  const handleSubmit = async () => {
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError("Adresse email invalide."); return; }
    setSaving(true);
    try {
      await inviteAdminUser({ email: email.trim(), display_name: name.trim() || undefined, role, permissions: perms }, sessionToken);
      toast.success(`Invitation envoyée à ${email.trim()}`);
      onSuccess();
      onClose();
    } catch (e) {
      setError((e as Error).message ?? "Erreur lors de l'invitation.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 flex-shrink-0"
        style={{ borderBottom: `1px solid ${INNER_BORDER}` }}>
        <div>
          <p className="text-[16px] font-medium" style={{ color: T_HEADING }}>Inviter un membre</p>
          <p className="text-[12px] mt-0.5 font-light" style={{ color: T_MUTED }}>
            Un email d'invitation leur sera envoyé automatiquement.
          </p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg transition-colors"
          style={{ color: T_MUTED }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 px-6 py-5 flex flex-col gap-5">
        {/* Identity */}
        <section>
          <p className="text-[10px] font-medium uppercase tracking-widest mb-3" style={{ color: T_MUTED }}>
            Identité
          </p>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[12px] font-medium block mb-1.5" style={{ color: T_LABEL }}>
                Nom complet
              </label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Ex. : Jean Dupont"
                className={inputCls} style={{ ...INPUT_STYLE }}
                onFocus={(e) => Object.assign((e.target as HTMLElement).style, focusStyle)}
                onBlur={(e) => Object.assign((e.target as HTMLElement).style, blurStyle)} />
            </div>
            <div>
              <label className="text-[12px] font-medium block mb-1.5" style={{ color: T_LABEL }}>
                Email <span style={{ color: C_CORAL }}>*</span>
              </label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex. : jean@exemple.com"
                className={inputCls} style={{ ...INPUT_STYLE }}
                onFocus={(e) => Object.assign((e.target as HTMLElement).style, focusStyle)}
                onBlur={(e) => Object.assign((e.target as HTMLElement).style, blurStyle)} />
            </div>
          </div>
        </section>

        {/* Role */}
        <section>
          <p className="text-[10px] font-medium uppercase tracking-widest mb-3" style={{ color: T_MUTED }}>
            Rôle
          </p>
          <div className="flex flex-col gap-2">
            {(Object.keys(ROLES) as AdminRole[]).map((r) => (
              <label key={r}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors"
                style={{
                  background: role === r ? ROLES[r].bg : "transparent",
                  border: `1px solid ${role === r ? ROLES[r].border : INNER_BORDER}`,
                }}>
                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{ borderColor: role === r ? ROLES[r].color : INNER_BORDER }}>
                  {role === r && (
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: ROLES[r].color }} />
                  )}
                </div>
                <input type="radio" name="role" value={r} checked={role === r}
                  onChange={() => handleRoleChange(r)} className="sr-only" />
                <div>
                  <p className="text-[13px] font-medium" style={{ color: role === r ? ROLES[r].color : T_PRIMARY }}>
                    {ROLES[r].label}
                  </p>
                  <p className="text-[11px] font-light" style={{ color: T_MUTED }}>
                    {r === "super_admin" ? "Accès complet à toutes les fonctionnalités"
                     : r === "admin" ? "Gestion du contenu et des utilisateurs"
                     : "Création et modification du contenu uniquement"}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* Permissions */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-medium uppercase tracking-widest" style={{ color: T_MUTED }}>
              Permissions
            </p>
            <button onClick={toggleAll}
              className="text-[11px] font-medium transition-opacity hover:opacity-70"
              style={{ color: C_BLUE }}>
              {allChecked ? "Tout désélectionner" : "Tout sélectionner"}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {PERMISSIONS.map((p) => {
              const checked = perms.includes(p.id);
              return (
                <label key={p.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors"
                  style={{ background: checked ? cA(C_BLUE, 0.08) : "transparent" }}>
                  <div className="w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{
                      background: checked ? C_BLUE : "transparent",
                      border: `1px solid ${checked ? C_BLUE : INNER_BORDER}`,
                    }}>
                    {checked && <Check className="w-2 h-2 text-white" strokeWidth={3} />}
                  </div>
                  <input type="checkbox" checked={checked} onChange={() => togglePerm(p.id)} className="sr-only" />
                  <span className="text-[11px]" style={{ color: checked ? T_PRIMARY : T_SECONDARY }}>
                    {p.label}
                  </span>
                </label>
              );
            })}
          </div>
        </section>

        {/* Error */}
        {error && (
          <p className="text-[12px] px-3 py-2.5 rounded-xl"
            style={{ background: cA(C_CORAL, 0.12), color: C_CORAL, border: `1px solid ${cA(C_CORAL, 0.25)}` }}>
            {error}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-5 flex-shrink-0" style={{ borderTop: `1px solid ${INNER_BORDER}` }}>
        <button
          onClick={handleSubmit}
          disabled={saving || !email}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-medium transition-all duration-150 disabled:opacity-50"
          style={{ background: cA(C_BLUE, 0.22), color: C_BLUE, border: `1px solid ${cA(C_BLUE, 0.35)}` }}
          onMouseEnter={(e) => { if (!saving) (e.currentTarget as HTMLElement).style.background = cA(C_BLUE, 0.30); }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = cA(C_BLUE, 0.22); }}
        >
          {saving
            ? <><span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />Envoi en cours…</>
            : <><Send className="w-4 h-4" />Envoyer l'invitation</>}
        </button>
      </div>
    </div>
  );
}

// ─── RoleEditModal ─────────────────────────────────────────────────────────

function RoleEditModal({
  admin, onClose, onConfirm, isPending,
}: {
  admin: AdminUser;
  onClose: () => void;
  onConfirm: (role: AdminRole) => void;
  isPending: boolean;
}) {
  const [role, setRole] = useState<AdminRole>(admin.role);
  return (
    <motion.div
      className="fixed inset-0 z-[400] flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ background: "rgba(4,6,14,0.72)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{ background: "hsl(224 62% 9%)", border: "1px solid rgba(255,255,255,0.13)", boxShadow: "0 32px 80px rgba(0,0,0,0.70)" }}
      >
        <div className="px-6 py-5" style={{ borderBottom: `1px solid ${INNER_BORDER}` }}>
          <p className="text-[15px] font-medium" style={{ color: T_HEADING }}>Modifier le rôle</p>
          <p className="text-[12px] mt-0.5 font-light" style={{ color: T_MUTED }}>
            {admin.display_name ?? admin.email}
          </p>
        </div>
        <div className="px-6 py-4 flex flex-col gap-2">
          {(Object.keys(ROLES) as AdminRole[]).map((r) => (
            <label key={r}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer"
              style={{
                background: role === r ? ROLES[r].bg : "transparent",
                border: `1px solid ${role === r ? ROLES[r].border : INNER_BORDER}`,
              }}>
              <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                style={{ borderColor: role === r ? ROLES[r].color : INNER_BORDER }}>
                {role === r && <div className="w-1.5 h-1.5 rounded-full" style={{ background: ROLES[r].color }} />}
              </div>
              <input type="radio" name="edit-role" value={r} checked={role === r}
                onChange={() => setRole(r)} className="sr-only" />
              <span className="text-[13px] font-medium" style={{ color: role === r ? ROLES[r].color : T_SECONDARY }}>
                {ROLES[r].label}
              </span>
            </label>
          ))}
        </div>
        <div className="px-6 pb-5 flex gap-3">
          <button onClick={() => onConfirm(role)} disabled={isPending}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-medium transition-opacity disabled:opacity-60"
            style={{ background: cA(C_BLUE, 0.22), color: C_BLUE, border: `1px solid ${cA(C_BLUE, 0.35)}` }}>
            {isPending ? "Enregistrement…" : "Confirmer"}
          </button>
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-medium"
            style={{ background: INNER_BG, color: T_SECONDARY, border: `1px solid ${INNER_BORDER}` }}>
            Annuler
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr style={{ borderBottom: `1px solid ${INNER_BORDER}` }}>
      <td className="pl-5 pr-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full animate-pulse" style={{ background: INNER_BG }} />
          <div>
            <div className="w-28 h-3 rounded animate-pulse mb-1.5" style={{ background: INNER_BG }} />
            <div className="w-40 h-2.5 rounded animate-pulse" style={{ background: INNER_BG }} />
          </div>
        </div>
      </td>
      <td className="py-4 pr-4"><div className="w-20 h-5 rounded-full animate-pulse" style={{ background: INNER_BG }} /></td>
      <td className="py-4 pr-4"><div className="w-16 h-5 rounded-full animate-pulse" style={{ background: INNER_BG }} /></td>
      <td className="py-4 pr-4"><div className="w-24 h-3 rounded animate-pulse" style={{ background: INNER_BG }} /></td>
      <td className="py-4 pr-5"><div className="w-6 h-6 rounded-lg animate-pulse ml-auto" style={{ background: INNER_BG }} /></td>
    </tr>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────

export default function AdminAccessList() {
  const { user, session } = useAuth();
  const qc = useQueryClient();

  const [search, setSearch]               = useState("");
  const [roleFilter, setRoleFilter]       = useState<AdminRole | "all">("all");
  const [statusFilter, setStatusFilter]   = useState<AdminStatus | "all">("all");
  const [drawerOpen, setDrawerOpen]       = useState(false);
  const [editRoleTarget, setEditRoleTarget] = useState<AdminUser | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const { data: admins = [], isLoading, isError } = useQuery({
    queryKey: ["admin-users"],
    queryFn: getAdminUsers,
  });

  const currentAdmin = admins.find((a) => a.email === user?.email);
  const currentUserRole: AdminRole | null = currentAdmin?.role ?? null;

  // ── Mutations ──────────────────────────────────────────────────────────────
  const toggleMut = useMutation({
    mutationFn: ({ id, admin }: { id: string; admin: AdminUser }) => {
      const status = deriveStatus(admin);
      if (status === "active") return updateAdminUser(id, { active: false, status: "disabled" });
      return updateAdminUser(id, { active: true, status: "active" });
    },
    onSuccess: (_, { admin }) => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      const s = deriveStatus(admin);
      toast.success(s === "active" ? "Compte désactivé" : "Compte réactivé");
    },
    onError: () => toast.error("Impossible de modifier le statut"),
  });

  const editRoleMut = useMutation({
    mutationFn: ({ id, role }: { id: string; role: AdminRole }) => updateAdminUser(id, { role }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      setEditRoleTarget(null);
      toast.success("Rôle mis à jour");
    },
    onError: () => toast.error("Impossible de modifier le rôle"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteAdminUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      setConfirmDeleteId(null);
      toast.success("Accès supprimé");
    },
    onError: () => toast.error("Impossible de supprimer l'accès"),
  });

  const resendMut = useMutation({
    mutationFn: (email: string) => resendInvite(email, session?.access_token ?? ""),
    onSuccess: () => toast.success("Invitation renvoyée"),
    onError: () => toast.error("Impossible de renvoyer l'invitation"),
  });

  const cancelMut = useMutation({
    mutationFn: (email: string) => cancelInvite(email, session?.access_token ?? ""),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-users"] }); toast.success("Invitation annulée"); },
    onError: () => toast.error("Impossible d'annuler l'invitation"),
  });

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return admins.filter((a) => {
      const matchSearch = !search || a.email.toLowerCase().includes(search.toLowerCase())
        || (a.display_name ?? "").toLowerCase().includes(search.toLowerCase());
      const matchRole   = roleFilter === "all" || a.role === roleFilter;
      const matchStatus = statusFilter === "all" || deriveStatus(a) === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [admins, search, roleFilter, statusFilter]);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const activeCount  = admins.filter((a) => deriveStatus(a) === "active").length;
  const invitedCount = admins.filter((a) => deriveStatus(a) === "invited").length;
  const lastActivity = admins
    .filter((a) => a.last_login_at)
    .sort((a, b) => new Date(b.last_login_at!).getTime() - new Date(a.last_login_at!).getTime())[0];

  const sessionToken = session?.access_token ?? "";

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 lg:p-8 max-w-5xl">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[26px] font-heading font-light tracking-tight" style={{ color: T_PRIMARY }}>
            Accès & équipe
          </h1>
          <p className="text-[13px] font-light mt-1" style={{ color: T_SECONDARY }}>
            Gérez les personnes autorisées à administrer Kanti.
          </p>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 flex-shrink-0"
          style={{ background: cA(C_BLUE, 0.18), color: C_BLUE, border: `1px solid ${cA(C_BLUE, 0.32)}` }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = cA(C_BLUE, 0.26); }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = cA(C_BLUE, 0.18); }}
        >
          <UserPlus className="w-4 h-4" />
          Inviter un membre
        </button>
      </div>

      {/* Stats strip */}
      <div className="rounded-2xl mb-6 overflow-hidden" style={{ ...GLASS }}>
        <div className="grid grid-cols-3 divide-x" style={{ borderColor: INNER_BORDER }}>
          {[
            {
              icon: <Users className="w-4 h-4" />,
              label: "Membres actifs",
              value: isLoading ? "—" : String(activeCount),
              color: C_SAGE,
            },
            {
              icon: <Send className="w-4 h-4" />,
              label: "Invitations en attente",
              value: isLoading ? "—" : String(invitedCount),
              color: invitedCount > 0 ? C_GOLD : T_MUTED,
            },
            {
              icon: <Activity className="w-4 h-4" />,
              label: "Dernière activité",
              value: isLoading ? "—" : relativeDate(lastActivity?.last_login_at),
              color: T_PRIMARY,
              small: true,
            },
          ].map((stat, i) => (
            <div key={i} className="px-5 py-4 flex items-center gap-3"
              style={{ borderColor: INNER_BORDER }}>
              <div className="p-2 rounded-lg flex-shrink-0"
                style={{ background: INNER_BG, color: stat.color }}>
                {stat.icon}
              </div>
              <div className="min-w-0">
                <p className={stat.small ? "text-[14px] font-medium truncate" : "text-2xl font-light tabular-nums"}
                  style={{ color: stat.color }}>
                  {stat.value}
                </p>
                <p className="text-[11px] font-light mt-0.5" style={{ color: T_MUTED }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error state */}
      {isError && (
        <div className="mb-5 px-4 py-3 rounded-xl text-[13px]"
          style={{ background: cA(C_CORAL, 0.12), color: C_CORAL, border: `1px solid ${cA(C_CORAL, 0.25)}` }}>
          Impossible de charger la liste. Vérifiez que la table <strong>admin_users</strong> existe dans Supabase.
        </div>
      )}

      {/* Main panel */}
      <div className="rounded-2xl overflow-hidden" style={{ ...GLASS }}>
        {/* Toolbar */}
        <div className="px-5 py-3.5 flex items-center gap-3 flex-wrap"
          style={{ borderBottom: `1px solid ${INNER_BORDER}`, background: INNER_BG }}>
          {/* Search */}
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: T_MUTED }} />
            <input
              type="text"
              placeholder="Rechercher un utilisateur…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-[12px] rounded-xl outline-none"
              style={{ ...INPUT_STYLE, padding: "0.45rem 0.75rem 0.45rem 2.2rem" }}
            />
          </div>
          {/* Role filter */}
          <FilterSelect
            value={roleFilter}
            onChange={(v) => setRoleFilter(v as AdminRole | "all")}
            options={[
              { value: "all", label: "Tous les rôles" },
              ...Object.entries(ROLES).map(([k, v]) => ({ value: k, label: v.label })),
            ]}
          />
          {/* Status filter */}
          <FilterSelect
            value={statusFilter}
            onChange={(v) => setStatusFilter(v as AdminStatus | "all")}
            options={[
              { value: "all", label: "Tous les statuts" },
              ...Object.entries(STATUS_META).map(([k, v]) => ({ value: k, label: v.label })),
            ]}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${INNER_BORDER}`, background: INNER_BG }}>
                {["UTILISATEUR", "RÔLE", "STATUT", "DERNIÈRE CONNEXION", ""].map((h, i) => (
                  <th key={i}
                    className={`py-2.5 text-[10px] font-medium uppercase tracking-widest ${i === 0 ? "pl-5 pr-4" : i === 4 ? "pr-5 w-10" : "pr-4"}`}
                    style={{ color: T_MUTED, textAlign: "left" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
                : filtered.length === 0
                  ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center">
                        {admins.length === 0 ? (
                          <div>
                            <p className="text-[15px] font-light mb-1" style={{ color: T_SECONDARY }}>
                              Aucun autre administrateur
                            </p>
                            <p className="text-[13px] font-light mb-4" style={{ color: T_MUTED }}>
                              Invitez un membre de votre équipe pour lui donner accès.
                            </p>
                            <button
                              onClick={() => setDrawerOpen(true)}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium"
                              style={{ background: cA(C_BLUE, 0.16), color: C_BLUE, border: `1px solid ${cA(C_BLUE, 0.28)}` }}
                            >
                              <UserPlus className="w-3.5 h-3.5" />Inviter un membre
                            </button>
                          </div>
                        ) : (
                          <p className="text-[13px] font-light" style={{ color: T_MUTED }}>
                            Aucun résultat pour cette recherche
                          </p>
                        )}
                      </td>
                    </tr>
                  )
                  : filtered.map((admin, i) => {
                    const isSelf   = admin.email === user?.email;
                    const status   = deriveStatus(admin);
                    const av       = avatarBg(admin.email);
                    const roleMeta = ROLES[admin.role] ?? ROLES.admin;
                    const stMeta   = STATUS_META[status] ?? STATUS_META.active;
                    const isLast   = i === filtered.length - 1;

                    return (
                      <motion.tr key={admin.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="group transition-colors"
                        style={{
                          borderBottom: isLast ? "none" : `1px solid ${INNER_BORDER}`,
                          opacity: status === "disabled" ? 0.45 : 1,
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                      >
                        {/* Utilisateur */}
                        <td className="pl-5 pr-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold flex-shrink-0"
                              style={{ background: av.bg, color: av.fg }}>
                              {initials(admin.display_name, admin.email)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-[13px] font-medium truncate" style={{ color: T_HEADING }}>
                                  {admin.display_name ?? admin.email}
                                </p>
                                {isSelf && (
                                  <span className="text-[9px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded"
                                    style={{ background: cA(C_SAGE, 0.14), color: C_SAGE }}>
                                    Vous
                                  </span>
                                )}
                              </div>
                              {admin.display_name && (
                                <p className="text-[11px] font-light truncate" style={{ color: T_MUTED }}>
                                  {admin.email}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Rôle */}
                        <td className="py-4 pr-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide"
                            style={{ background: roleMeta.bg, color: roleMeta.color, border: `1px solid ${roleMeta.border}` }}>
                            {roleMeta.label}
                          </span>
                        </td>

                        {/* Statut */}
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ background: stMeta.color }} />
                            <span className="text-[12px] font-light" style={{ color: stMeta.color }}>
                              {stMeta.label}
                            </span>
                          </div>
                        </td>

                        {/* Dernière connexion */}
                        <td className="py-4 pr-4">
                          <span className="text-[12px] font-light" style={{ color: T_MUTED }}>
                            {status === "invited"
                              ? `Invité ${relativeDate(admin.created_at)}`
                              : relativeDate(admin.last_login_at)}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 pr-5 text-right">
                          {!isSelf && (
                            <ActionsMenu
                              admin={admin}
                              isSelf={isSelf}
                              currentUserRole={currentUserRole}
                              onEdit={() => setEditRoleTarget(admin)}
                              onToggle={() => toggleMut.mutate({ id: admin.id, admin })}
                              onDelete={() => setConfirmDeleteId(admin.id)}
                              onResend={() => resendMut.mutate(admin.email)}
                              onCancel={() => cancelMut.mutate(admin.email)}
                            />
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
            </tbody>
          </table>
        </div>

        {/* Footer row count */}
        {!isLoading && filtered.length > 0 && (
          <div className="px-5 py-3" style={{ borderTop: `1px solid ${INNER_BORDER}`, background: INNER_BG }}>
            <p className="text-[11px] font-light" style={{ color: T_MUTED }}>
              {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
              {admins.length !== filtered.length ? ` sur ${admins.length}` : ""}
            </p>
          </div>
        )}
      </div>

      {/* ── Invite drawer ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[299]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ background: "rgba(4,6,14,0.55)", backdropFilter: "blur(4px)" }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              className="fixed right-0 top-0 h-full z-[300]"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 280 }}
              style={{
                width: 440,
                background: "hsl(224 62% 9%)",
                borderLeft: `1px solid ${INNER_BORDER}`,
                boxShadow: "-24px 0 60px rgba(0,0,0,0.45)",
              }}
            >
              <InviteDrawer
                onClose={() => setDrawerOpen(false)}
                onSuccess={() => qc.invalidateQueries({ queryKey: ["admin-users"] })}
                sessionToken={sessionToken}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Role edit modal ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {editRoleTarget && (
          <RoleEditModal
            admin={editRoleTarget}
            onClose={() => setEditRoleTarget(null)}
            onConfirm={(role) => editRoleMut.mutate({ id: editRoleTarget.id, role })}
            isPending={editRoleMut.isPending}
          />
        )}
      </AnimatePresence>

      {/* ── Confirm delete modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {confirmDeleteId && (
          <motion.div
            className="fixed inset-0 z-[400] flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ background: "rgba(4,6,14,0.72)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setConfirmDeleteId(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-sm rounded-2xl p-6"
              style={{ background: "hsl(224 62% 9%)", border: "1px solid rgba(255,255,255,0.13)", boxShadow: "0 32px 80px rgba(0,0,0,0.70)" }}
            >
              <p className="text-[15px] font-medium mb-1" style={{ color: T_HEADING }}>
                Supprimer l'accès ?
              </p>
              <p className="text-[13px] font-light mb-5" style={{ color: T_SECONDARY }}>
                {admins.find((a) => a.id === confirmDeleteId)?.email} · Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => deleteMut.mutate(confirmDeleteId)}
                  disabled={deleteMut.isPending}
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-medium transition-opacity disabled:opacity-60"
                  style={{ background: cA(C_CORAL, 0.20), color: C_CORAL, border: `1px solid ${cA(C_CORAL, 0.35)}` }}>
                  {deleteMut.isPending ? "Suppression…" : "Supprimer"}
                </button>
                <button onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-medium"
                  style={{ background: INNER_BG, color: T_SECONDARY, border: `1px solid ${INNER_BORDER}` }}>
                  Annuler
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── FilterSelect ─────────────────────────────────────────────────────────

function FilterSelect({
  value, onChange, options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative flex-shrink-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-3 pr-8 py-2 rounded-xl text-[12px] outline-none cursor-pointer appearance-none"
        style={{ ...INPUT_STYLE, padding: "0.45rem 2rem 0.45rem 0.75rem" }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none"
        style={{ color: T_MUTED }} />
    </div>
  );
}
