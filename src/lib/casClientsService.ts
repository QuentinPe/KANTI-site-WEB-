import { supabase } from "@/lib/supabase";

export interface CasClient {
  id: string;
  category: string;
  category_label: string;
  expertise: string;
  profil: string;
  age: number | null;
  duration: string | null;
  image: string | null;
  contexte: string | null;
  diagnostic: string[] | null;
  strategie: string[] | null;
  resultat: string | null;
  kpis: { label: string; value: string }[] | null;
  vigilance: string | null;
  verbatim: string | null;
  verbatim_author: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export type CasClientInput = Omit<CasClient, "id" | "created_at">;

export const getCasClients = async (): Promise<CasClient[]> => {
  const { data, error } = await supabase
    .from("cas_clients")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const getAllCasClients = async (): Promise<CasClient[]> => {
  const { data, error } = await supabase
    .from("cas_clients")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const createCasClient = async (input: CasClientInput): Promise<CasClient> => {
  const { data, error } = await supabase
    .from("cas_clients")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateCasClient = async (id: string, input: Partial<CasClientInput>): Promise<CasClient> => {
  const { data, error } = await supabase
    .from("cas_clients")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteCasClient = async (id: string): Promise<void> => {
  const { error } = await supabase.from("cas_clients").delete().eq("id", id);
  if (error) throw error;
};
