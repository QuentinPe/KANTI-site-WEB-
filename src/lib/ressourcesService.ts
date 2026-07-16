import { supabase } from "@/lib/supabase";

export interface Ressource {
  id: string;
  title: string;
  description: string;
  category: string;
  pages: number | null;
  storage_path: string;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export type RessourceInput = Omit<Ressource, "id" | "created_at">;

export const getRessources = async (): Promise<Ressource[]> => {
  const { data, error } = await supabase
    .from("ressources")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const getAllRessources = async (): Promise<Ressource[]> => {
  const { data, error } = await supabase
    .from("ressources")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const createRessource = async (input: RessourceInput): Promise<Ressource> => {
  const { data, error } = await supabase
    .from("ressources")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateRessource = async (id: string, input: Partial<RessourceInput>): Promise<Ressource> => {
  const { data, error } = await supabase
    .from("ressources")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteRessource = async (id: string): Promise<void> => {
  const { error } = await supabase.from("ressources").delete().eq("id", id);
  if (error) throw error;
};

export const uploadPDF = async (file: File): Promise<string> => {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { data, error } = await supabase.storage
    .from("ressources")
    .upload(fileName, file, { contentType: "application/pdf", upsert: false });
  if (error) throw error;
  return data.path;
};

export const getDownloadUrl = async (storagePath: string): Promise<string> => {
  if (storagePath.startsWith("/") || storagePath.startsWith("http")) {
    return storagePath;
  }
  const { data, error } = await supabase.storage
    .from("ressources")
    .createSignedUrl(storagePath, 3600);
  if (error) throw error;
  return data.signedUrl;
};
