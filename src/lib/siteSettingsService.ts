import { supabase } from "@/lib/supabase";

export interface SiteSetting {
  key: string;
  value: string;
  label?: string | null;
  group_name?: string | null;
  updated_at: string;
}

export const getSiteSettings = async (): Promise<SiteSetting[]> => {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .order("group_name", { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const getSiteSettingsMap = async (): Promise<Record<string, string>> => {
  const rows = await getSiteSettings();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
};

export const upsertSetting = async (key: string, value: string): Promise<void> => {
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw error;
};

export const upsertSettings = async (entries: Record<string, string>): Promise<void> => {
  const rows = Object.entries(entries).map(([key, value]) => ({
    key, value, updated_at: new Date().toISOString(),
  }));
  const { error } = await supabase
    .from("site_settings")
    .upsert(rows, { onConflict: "key" });
  if (error) throw error;
};
