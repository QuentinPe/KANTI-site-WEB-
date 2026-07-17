import { supabase } from "@/lib/supabase";

export interface AdminUser {
  id: string;
  email: string;
  display_name?: string | null;
  role: "admin" | "super_admin";
  active: boolean;
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

export const createAdminUser = async (
  input: Pick<AdminUser, "email" | "display_name" | "role"> & { invited_by?: string }
): Promise<AdminUser> => {
  const { data, error } = await supabase
    .from("admin_users")
    .insert({ ...input, active: true })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateAdminUser = async (
  id: string,
  input: Partial<Pick<AdminUser, "display_name" | "role" | "active">>
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
