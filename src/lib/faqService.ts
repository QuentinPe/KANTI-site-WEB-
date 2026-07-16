import { supabase } from "@/lib/supabase";

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  sort_order: number;
  active: boolean;
}

export type FaqInput = Omit<FaqItem, "id">;

export const getFaq = async (): Promise<FaqItem[]> => {
  const { data, error } = await supabase
    .from("faq")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const getAllFaq = async (): Promise<FaqItem[]> => {
  const { data, error } = await supabase
    .from("faq")
    .select("*")
    .order("category, sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const createFaqItem = async (input: FaqInput): Promise<FaqItem> => {
  const { data, error } = await supabase
    .from("faq")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateFaqItem = async (id: string, input: Partial<FaqInput>): Promise<FaqItem> => {
  const { data, error } = await supabase
    .from("faq")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteFaqItem = async (id: string): Promise<void> => {
  const { error } = await supabase.from("faq").delete().eq("id", id);
  if (error) throw error;
};

export const reorderFaqItems = async (updates: { id: string; sort_order: number }[]): Promise<void> => {
  const promises = updates.map(({ id, sort_order }) =>
    supabase.from("faq").update({ sort_order }).eq("id", id)
  );
  await Promise.all(promises);
};
