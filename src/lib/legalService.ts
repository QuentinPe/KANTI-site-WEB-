import { supabase } from "@/lib/supabase";

export interface LegalContent {
  id: string;
  page_key: string;
  page_label: string;
  subtitle: string;
  content_html: string;
  updated_at: string;
}

export const getLegalContent = async (pageKey: string): Promise<LegalContent | null> => {
  const { data, error } = await supabase
    .from("legal_content")
    .select("*")
    .eq("page_key", pageKey)
    .single();
  if (error) return null;
  return data;
};

export const getAllLegalContent = async (): Promise<LegalContent[]> => {
  const { data, error } = await supabase
    .from("legal_content")
    .select("*")
    .order("page_label", { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const updateLegalContent = async (
  pageKey: string,
  input: { content_html: string; subtitle?: string }
): Promise<void> => {
  const { error } = await supabase
    .from("legal_content")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("page_key", pageKey);
  if (error) throw error;
};
