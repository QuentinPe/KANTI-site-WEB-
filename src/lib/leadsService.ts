import { supabase } from "@/lib/supabase";

export type LeadStatus = "nouveau" | "traite" | "archive";

export interface Lead {
  id: string;
  nom: string;
  email: string;
  telephone?: string | null;
  conseiller?: string | null;
  format?: string | null;
  timing?: string | null;
  sujet?: string | null;
  message?: string | null;
  status: LeadStatus;
  created_at: string;
}

export type LeadInput = Omit<Lead, "id" | "status" | "created_at">;

export const createLead = async (input: LeadInput): Promise<void> => {
  const { error } = await supabase.from("leads").insert(input);
  if (error) throw error;
};

export const getLeads = async (): Promise<Lead[]> => {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
};

export const updateLeadStatus = async (id: string, status: LeadStatus): Promise<void> => {
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) throw error;
};

export const deleteLead = async (id: string): Promise<void> => {
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw error;
};
