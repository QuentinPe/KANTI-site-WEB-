import { supabase } from "@/lib/supabase";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  short: string;
  bio: string;
  image: string;
  credentials: string[];
  linkedin: string;
  sort_order: number;
  active: boolean;
}

export type TeamMemberInput = Omit<TeamMember, "id">;

export const getTeamMembers = async (): Promise<TeamMember[]> => {
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const getAllTeamMembers = async (): Promise<TeamMember[]> => {
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const getTeamMemberById = async (id: string): Promise<TeamMember | null> => {
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
};

export const createTeamMember = async (input: TeamMemberInput): Promise<TeamMember> => {
  const { data, error } = await supabase
    .from("team_members")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateTeamMember = async (id: string, input: Partial<TeamMemberInput>): Promise<TeamMember> => {
  const { data, error } = await supabase
    .from("team_members")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteTeamMember = async (id: string): Promise<void> => {
  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) throw error;
};

export const uploadTeamImage = async (file: File): Promise<string> => {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `team/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("article-images").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from("article-images").getPublicUrl(path);
  return publicUrl;
};
