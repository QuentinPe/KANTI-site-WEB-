import { supabase } from "@/lib/supabase";

export type AdminRole   = "super_admin" | "admin" | "editeur";
export type AdminStatus = "active" | "invited" | "disabled";

export interface AdminUser {
  id: string;
  email: string;
  display_name?: string | null;
  role: AdminRole;
  active: boolean;
  status?: AdminStatus | null;
  last_login_at?: string | null;
  permissions?: string[] | null;
  invited_by?: string | null;
  created_at: string;
}

export const getAdminUsers = async (): Promise<AdminUser[]> => {
  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const updateAdminUser = async (
  id: string,
  input: Partial<Pick<AdminUser, "display_name" | "role" | "active" | "status" | "permissions">>,
): Promise<AdminUser> => {
  const { data, error } = await supabase
    .from("admin_users")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteAdminUser = async (id: string): Promise<void> => {
  const { error } = await supabase.from("admin_users").delete().eq("id", id);
  if (error) throw error;
};

export const updateLastLogin = async (email: string): Promise<void> => {
  await supabase
    .from("admin_users")
    .update({ last_login_at: new Date().toISOString(), status: "active" })
    .eq("email", email)
    .eq("active", true);
};

export const inviteAdminUser = async (
  input: { email: string; display_name?: string; role: AdminRole; permissions: string[] },
  sessionToken: string,
): Promise<void> => {
  const res = await fetch("/api/admin-invite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({ action: "invite", ...input }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) throw new Error(data.error ?? "Erreur lors de l'invitation");
};

export const cancelInvite = async (email: string, sessionToken: string): Promise<void> => {
  const res = await fetch("/api/admin-invite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({ action: "cancel_invite", email }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) throw new Error(data.error ?? "Erreur lors de l'annulation");
};

export const resendInvite = async (email: string, sessionToken: string): Promise<void> => {
  const res = await fetch("/api/admin-invite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({ action: "resend_invite", email }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) throw new Error(data.error ?? "Erreur lors du renvoi");
};
