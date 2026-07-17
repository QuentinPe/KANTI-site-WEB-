import { supabase } from "@/lib/supabase";

export interface ContentCategory {
  id: string;
  name: string;
  slug: string;
  type: "article" | "faq" | "both";
  sort_order: number;
  created_at: string;
}

export type CategoryInput = Omit<ContentCategory, "id" | "created_at">;

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export const getCategories = async (
  type?: "article" | "faq"
): Promise<ContentCategory[]> => {
  let query = supabase
    .from("content_categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (type) {
    query = query.or(`type.eq.${type},type.eq.both`);
  }
  const { data, error } = await query;
  if (error) return []; // graceful: table may not exist yet
  return data ?? [];
};

export const createCategory = async (
  name: string,
  type: "article" | "faq" | "both",
  sortOrder: number
): Promise<ContentCategory> => {
  const baseSlug = slugify(name);
  // Ensure slug uniqueness with a suffix
  const slug = type === "article" ? baseSlug + "-a" : type === "faq" ? baseSlug + "-f" : baseSlug;
  const { data, error } = await supabase
    .from("content_categories")
    .insert({ name, slug, type, sort_order: sortOrder })
    .select()
    .single();
  if (error) {
    // Try without suffix if slug collision
    const { data: d2, error: e2 } = await supabase
      .from("content_categories")
      .insert({ name, slug: baseSlug + "-" + Date.now(), type, sort_order: sortOrder })
      .select()
      .single();
    if (e2) throw e2;
    return d2;
  }
  return data;
};

export const updateCategory = async (
  id: string,
  data: Partial<CategoryInput>
): Promise<ContentCategory> => {
  const { data: updated, error } = await supabase
    .from("content_categories")
    .update(data)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return updated;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("content_categories")
    .delete()
    .eq("id", id);
  if (error) throw error;
};

export const reorderCategories = async (
  updates: { id: string; sort_order: number }[]
): Promise<void> => {
  await Promise.all(
    updates.map(({ id, sort_order }) =>
      supabase.from("content_categories").update({ sort_order }).eq("id", id)
    )
  );
};
