import { supabase } from "@/lib/supabase";

export interface Article {
  id: string;
  date: string;
  reading_time: string;
  tag: string;
  title: string;
  excerpt: string;
  body?: string;
  image: string;
  featured: boolean;
  slug?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  author_name?: string | null;
  related_article_ids?: string[] | null;
  created_at: string;
  updated_at: string;
}

export type ArticleInput = Omit<Article, "id" | "created_at" | "updated_at">;

export const getArticleById = async (id: string): Promise<Article | null> => {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
};

export const getArticles = async (): Promise<Article[]> => {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
};

export const createArticle = async (input: ArticleInput): Promise<Article> => {
  const { data, error } = await supabase
    .from("articles")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateArticle = async (id: string, input: Partial<ArticleInput>): Promise<Article> => {
  const { data, error } = await supabase
    .from("articles")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteArticle = async (id: string): Promise<void> => {
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw error;
};
