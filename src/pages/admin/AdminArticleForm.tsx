import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ImageOff, Sparkles, Wand2, ChevronDown, Search, Eye, Link2, X, Maximize2, Minimize2 } from "lucide-react";
import { getArticles, createArticle, updateArticle } from "@/lib/articlesService";
import type { ArticleInput } from "@/lib/articlesService";
import { getCategories } from "@/lib/categoriesService";
import RichEditor from "@/components/admin/RichEditor";

const FALLBACK_CATEGORIES = ["Investissement", "Épargne", "Transmission", "Fiscalité", "Retraite", "Immobilier", "Dirigeants", "Allocation", "Prévoyance"];

function errMsg(e: unknown): string {
  if (!e) return "Erreur inconnue";
  if (typeof e === "string") return e;
  if (e instanceof Error) return e.message;
  const o = e as Record<string, unknown>;
  if (typeof o.message === "string") return o.message;
  if (typeof o.details === "string") return o.details;
  return JSON.stringify(e);
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

const schema = z.object({
  title: z.string().min(5, "Titre trop court"),
  excerpt: z.string().min(20, "Extrait trop court (résumé de 2-3 lignes pour la liste)"),
  body: z.string().optional(),
  tag: z.string().min(1, "Choisissez une catégorie"),
  date: z.string().min(1, "Date requise"),
  reading_time: z.string().min(1, "Temps de lecture requis"),
  image: z.string().url("URL d'image invalide"),
  featured: z.boolean(),
  // SEO
  slug: z.string().max(80).optional(),
  meta_title: z.string().max(60, "60 caractères maximum").optional(),
  meta_description: z.string().max(155, "155 caractères maximum").optional(),
  author_name: z.string().max(80).optional(),
});

type FormData = z.infer<typeof schema>;

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline gap-2">
        <label className="text-[12px] font-medium tracking-wide" style={{ color: "hsl(224 25% 38%)" }}>{label}</label>
        {hint && <span className="text-[11px] font-light" style={{ color: "hsl(224 15% 58%)" }}>{hint}</span>}
      </div>
      {children}
      {error && <p className="text-[11px]" style={{ color: "hsl(0 60% 48%)" }}>{error}</p>}
    </div>
  );
}

const inputClass = "w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all duration-150";
const inputStyle = {
  background: "white",
  border: "1px solid hsl(224 20% 12% / 0.12)",
  color: "hsl(224 55% 12%)",
};
const inputFocus = {
  borderColor: "hsl(224 60% 18% / 0.40)",
  boxShadow: "0 0 0 3px hsl(224 60% 18% / 0.08)",
};
const inputBlur = { boxShadow: "none", borderColor: "hsl(224 20% 12% / 0.12)" };

export default function AdminArticleForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isEdit = Boolean(id);
  const [globalError, setGlobalError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [aiSummarizing, setAiSummarizing] = useState(false);
  const [aiReformatting, setAiReformatting] = useState(false);
  const [aiError, setAiError] = useState("");
  const [fullscreen, setFullscreen] = useState(false);

  const { data: articles = [], isLoading: articlesLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: getArticles,
    enabled: isEdit,
  });

  const { data: dbCategories = [] } = useQuery({
    queryKey: ["categories", "article"],
    queryFn: () => getCategories("article"),
  });

  const categoryNames = dbCategories.length > 0
    ? dbCategories.map((c) => c.name)
    : FALLBACK_CATEGORIES;

  const existing = isEdit ? articles.find((a) => a.id === id) : null;

  const [seoOpen, setSeoOpen] = useState(false);
  const [relatedOpen, setRelatedOpen] = useState(false);
  const [relatedSearch, setRelatedSearch] = useState("");
  const [selectedRelated, setSelectedRelated] = useState<string[]>([]);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      excerpt: "",
      body: "",
      tag: FALLBACK_CATEGORIES[0],
      date: "",
      reading_time: "",
      image: "",
      featured: false,
      slug: "",
      meta_title: "",
      meta_description: "",
      author_name: "",
    },
  });

  useEffect(() => {
    if (existing) {
      reset({
        title: existing.title,
        excerpt: existing.excerpt,
        body: existing.body ?? "",
        tag: existing.tag,
        date: existing.date,
        reading_time: existing.reading_time,
        image: existing.image,
        featured: existing.featured,
        slug: existing.slug ?? "",
        meta_title: existing.meta_title ?? "",
        meta_description: existing.meta_description ?? "",
        author_name: existing.author_name ?? "",
      });
      setImagePreview(existing.image);
      setSelectedRelated(existing.related_article_ids ?? []);
      if (existing.slug) setSlugManuallyEdited(true);
    }
  }, [existing, reset]);

  const imageUrl = watch("image");
  useEffect(() => {
    if (imageUrl && imageUrl.startsWith("http")) setImagePreview(imageUrl);
  }, [imageUrl]);

  const bodyValue = watch("body") ?? "";
  const titleValue = watch("title") ?? "";
  const metaTitleValue = watch("meta_title") ?? "";
  const metaDescValue = watch("meta_description") ?? "";

  /* Auto-generate slug from title unless user has edited it manually */
  useEffect(() => {
    if (!slugManuallyEdited && titleValue) {
      setValue("slug", slugify(titleValue), { shouldValidate: false });
    }
  }, [titleValue, slugManuallyEdited, setValue]);

  const callAI = async (action: "summarize" | "reformat") => {
    setAiError("");
    const content = bodyValue;
    if (!content || content === "<p></p>") {
      setAiError("Rédigez d'abord du contenu dans l'éditeur.");
      return;
    }
    if (action === "summarize") setAiSummarizing(true);
    else setAiReformatting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/ai-article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ action, content, title: titleValue }),
      });
      const rawText = await res.text();
      let data: { result?: string; error?: string } = {};
      try { data = JSON.parse(rawText); } catch { throw new Error(`Serveur indisponible (${res.status})`); }
      if (!res.ok || data.error) throw new Error(data.error ?? "Erreur inconnue");
      if (action === "summarize") {
        setValue("excerpt", data.result, { shouldValidate: true });
      } else {
        setValue("body", data.result, { shouldValidate: false });
      }
    } catch (e) {
      setAiError(String(e));
    } finally {
      setAiSummarizing(false);
      setAiReformatting(false);
    }
  };

  const createMutation = useMutation({
    mutationFn: (data: ArticleInput) => createArticle(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["articles"] });
      navigate("/admin/articles");
    },
    onError: (e) => setGlobalError("Erreur lors de la création : " + errMsg(e)),
  });

  const updateMutation = useMutation({
    mutationFn: (data: ArticleInput) => updateArticle(id!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["articles"] });
      navigate("/admin/articles");
    },
    onError: (e) => setGlobalError("Erreur mise à jour : " + errMsg(e)),
  });

  const onSubmit = (data: FormData) => {
    setGlobalError("");
    const payload: ArticleInput = {
      title: data.title,
      excerpt: data.excerpt,
      tag: data.tag,
      date: data.date,
      reading_time: data.reading_time,
      image: data.image,
      featured: data.featured,
      ...(data.body && data.body !== "<p></p>" ? { body: data.body } : {}),
      ...(data.slug ? { slug: data.slug } : {}),
      ...(data.meta_title ? { meta_title: data.meta_title } : {}),
      ...(data.meta_description ? { meta_description: data.meta_description } : {}),
      ...(data.author_name ? { author_name: data.author_name } : {}),
      related_article_ids: selectedRelated.length > 0 ? selectedRelated : null,
    };
    if (isEdit) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  if (isEdit && articlesLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-7 h-7 rounded-full border-2 border-foreground/15 border-t-foreground/60 animate-spin" />
      </div>
    );
  }

  if (isEdit && !existing && !articlesLoading) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <p className="text-[14px]" style={{ color: "hsl(0 60% 45%)" }}>Article introuvable.</p>
        <Link to="/admin/articles" className="mt-4 block text-[13px] underline" style={{ color: "hsl(224 55% 35%)" }}>← Retour</Link>
      </div>
    );
  }

  return (
    <div
      className={fullscreen ? "fixed inset-0 overflow-y-auto z-[400]" : "p-8 max-w-3xl mx-auto"}
      style={fullscreen ? { background: "hsl(220 25% 97%)" } : undefined}
    >
    <div className={fullscreen ? "p-8 max-w-5xl mx-auto" : ""}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/admin/articles"
          className="p-2 rounded-lg transition-all duration-150"
          style={{ color: "hsl(224 25% 45%)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 60% 18% / 0.07)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: "hsl(224 55% 12%)" }}>
            {isEdit ? "Modifier l'article" : "Nouvel article"}
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setFullscreen(v => !v)}
          title={fullscreen ? "Quitter le plein écran" : "Plein écran"}
          className="p-2 rounded-lg transition-all duration-150"
          style={{ color: "hsl(224 25% 45%)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 60% 18% / 0.07)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          {fullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
        {isEdit && existing && (
          <a
            href={`/actualites/${existing.slug ?? existing.id}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-150"
            style={{ background: "hsl(224 60% 18% / 0.08)", color: "hsl(224 40% 32%)", border: "1px solid hsl(224 60% 18% / 0.12)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 60% 18% / 0.14)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 60% 18% / 0.08)"; }}
          >
            <Eye className="w-4 h-4" />
            Prévisualiser
          </a>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Image preview */}
        <div
          className="w-full aspect-[16/7] rounded-2xl overflow-hidden flex items-center justify-center"
          style={{ background: "hsl(220 25% 96%)", border: "1px solid hsl(224 20% 12% / 0.08)" }}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="" className="w-full h-full object-cover"
              onError={() => setImagePreview("")} />
          ) : (
            <ImageOff className="w-8 h-8" style={{ color: "hsl(224 18% 70%)" }} />
          )}
        </div>

        <Field label="URL de l'image *" error={errors.image?.message}>
          <input
            className={inputClass}
            style={inputStyle}
            placeholder="https://images.unsplash.com/..."
            {...register("image")}
            onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
            onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)}
          />
        </Field>

        <Field label="Titre *" error={errors.title?.message}>
          <input
            className={inputClass}
            style={inputStyle}
            placeholder="Titre de l'article"
            {...register("title")}
            onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
            onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)}
          />
        </Field>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <label className="text-[12px] font-medium tracking-wide" style={{ color: "hsl(224 25% 38%)" }}>
                Extrait *
              </label>
              <span className="text-[11px] font-light" style={{ color: "hsl(224 15% 58%)" }}>
                Court résumé affiché dans la liste des articles
              </span>
            </div>
            <button
              type="button"
              onClick={() => callAI("summarize")}
              disabled={aiSummarizing || aiReformatting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 disabled:opacity-50"
              style={{ background: "hsl(270 60% 55% / 0.10)", color: "hsl(270 55% 40%)", border: "1px solid hsl(270 55% 55% / 0.20)" }}
              title="Générer l'extrait automatiquement depuis le contenu de l'article"
            >
              {aiSummarizing ? (
                <span className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              {aiSummarizing ? "Génération…" : "Générer avec IA"}
            </button>
          </div>
          <textarea
            className={inputClass}
            style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }}
            placeholder="Résumé de l'article (2–3 phrases)"
            {...register("excerpt")}
            onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
            onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)}
          />
          {errors.excerpt?.message && (
            <p className="text-[11px]" style={{ color: "hsl(0 60% 48%)" }}>{errors.excerpt.message}</p>
          )}
        </div>

        {/* Rich text body */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-baseline gap-2">
            <label className="text-[12px] font-medium tracking-wide" style={{ color: "hsl(224 25% 38%)" }}>
              Contenu de l'article
            </label>
            <span className="text-[11px] font-light" style={{ color: "hsl(224 15% 58%)" }}>
              Éditeur riche — import Word ou PDF possible
            </span>
          </div>
          <RichEditor
            value={bodyValue}
            onChange={(html) => setValue("body", html, { shouldValidate: false })}
            fullscreen={fullscreen}
          />
          {/* AI reformat */}
          <div className="flex items-center justify-between mt-1">
            <p className="text-[11px] font-light" style={{ color: "hsl(224 15% 60%)" }}>
              Grok analyse et restructure votre contenu selon les normes rédactionnelles
            </p>
            <button
              type="button"
              onClick={() => callAI("reformat")}
              disabled={aiSummarizing || aiReformatting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 disabled:opacity-50 flex-shrink-0 ml-4"
              style={{ background: "hsl(218 55% 42% / 0.10)", color: "hsl(218 55% 35%)", border: "1px solid hsl(218 55% 50% / 0.20)" }}
              title="Améliorer la structure et le style de l'article avec Grok"
            >
              {aiReformatting ? (
                <span className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin" />
              ) : (
                <Wand2 className="w-3 h-3" />
              )}
              {aiReformatting ? "Amélioration…" : "Améliorer avec Grok"}
            </button>
          </div>
          {aiError && (
            <p className="py-2 px-3 rounded-lg text-[12px]"
              style={{ background: "hsl(0 60% 96%)", color: "hsl(0 60% 40%)", border: "1px solid hsl(0 60% 88%)" }}>
              IA : {aiError}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Catégorie *" error={errors.tag?.message}>
            <select
              className={inputClass}
              style={{ ...inputStyle, cursor: "pointer" }}
              {...register("tag")}
              onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
              onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)}
            >
              {categoryNames.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="Date *" error={errors.date?.message}>
            <input
              className={inputClass}
              style={inputStyle}
              placeholder="ex: Juillet 2026"
              {...register("date")}
              onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
              onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)}
            />
          </Field>
        </div>

        <Field label="Temps de lecture *" error={errors.reading_time?.message}>
          <input
            className={inputClass}
            style={inputStyle}
            placeholder="ex: 5 min"
            {...register("reading_time")}
            onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
            onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)}
          />
        </Field>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input type="checkbox" className="w-4 h-4 rounded" {...register("featured")} />
          <span className="text-[13px] font-medium" style={{ color: "hsl(224 40% 30%)" }}>
            Mettre cet article à la une
          </span>
        </label>

        {/* ── Articles liés ── */}
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid hsl(224 20% 12% / 0.10)" }}>
          <button
            type="button"
            onClick={() => setRelatedOpen((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors duration-150"
            style={{ background: relatedOpen ? "hsl(218 55% 18%)" : "hsl(224 20% 97%)" }}
          >
            <div className="flex items-center gap-2.5">
              <Link2 className="w-4 h-4" style={{ color: relatedOpen ? "hsl(0 0% 100% / 0.70)" : "hsl(218 50% 42%)" }} />
              <span className="text-[13px] font-medium" style={{ color: relatedOpen ? "hsl(0 0% 100% / 0.85)" : "hsl(224 40% 30%)" }}>
                Articles liés
              </span>
              {selectedRelated.length > 0 && (
                <span className="text-[10px] tracking-wide px-2 py-0.5 rounded-full font-medium"
                  style={{ background: relatedOpen ? "hsl(0 0% 100% / 0.16)" : "hsl(218 50% 42% / 0.12)", color: relatedOpen ? "hsl(0 0% 100% / 0.85)" : "hsl(218 50% 38%)" }}>
                  {selectedRelated.length} sélectionné{selectedRelated.length > 1 ? "s" : ""}
                </span>
              )}
              {selectedRelated.length === 0 && (
                <span className="text-[10px] tracking-wide px-2 py-0.5 rounded-full"
                  style={{ background: relatedOpen ? "hsl(0 0% 100% / 0.12)" : "hsl(224 55% 18% / 0.09)", color: relatedOpen ? "hsl(0 0% 100% / 0.55)" : "hsl(224 40% 45%)" }}>
                  Optionnel
                </span>
              )}
            </div>
            <ChevronDown
              className="w-4 h-4 transition-transform duration-300"
              style={{ transform: relatedOpen ? "rotate(180deg)" : "rotate(0deg)", color: relatedOpen ? "hsl(0 0% 100% / 0.50)" : "hsl(224 20% 52%)" }}
            />
          </button>

          {relatedOpen && (
            <div className="px-5 py-5 flex flex-col gap-4" style={{ background: "hsl(220 30% 98%)", borderTop: "1px solid hsl(224 20% 12% / 0.07)" }}>
              <p className="text-[12px] font-light" style={{ color: "hsl(224 15% 52%)" }}>
                Choisissez jusqu'à 3 articles à afficher dans la section "Pour aller plus loin" en bas de cet article. Sans sélection, les articles récents sont affichés automatiquement.
              </p>

              {/* Selected pills */}
              {selectedRelated.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedRelated.map(rid => {
                    const a = articles.find(x => x.id === rid);
                    if (!a) return null;
                    return (
                      <span key={rid}
                        className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1 rounded-full"
                        style={{ background: "hsl(218 45% 42% / 0.10)", color: "hsl(218 45% 36%)", border: "1px solid hsl(218 45% 42% / 0.20)" }}>
                        {a.title.length > 35 ? a.title.slice(0, 35) + "…" : a.title}
                        <button type="button" onClick={() => setSelectedRelated(prev => prev.filter(x => x !== rid))}
                          className="hover:opacity-60 transition-opacity">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "hsl(224 15% 55%)" }} />
                <input
                  value={relatedSearch}
                  onChange={(e) => setRelatedSearch(e.target.value)}
                  placeholder="Rechercher un article…"
                  className={inputClass}
                  style={{ ...inputStyle, paddingLeft: "2.25rem" }}
                  onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
                  onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)}
                />
              </div>

              {/* Article list */}
              <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto pr-1">
                {articles
                  .filter(a => a.id !== id)
                  .filter(a => !relatedSearch || a.title.toLowerCase().includes(relatedSearch.toLowerCase()) || a.tag.toLowerCase().includes(relatedSearch.toLowerCase()))
                  .map(a => {
                    const checked = selectedRelated.includes(a.id);
                    const maxReached = !checked && selectedRelated.length >= 3;
                    return (
                      <label
                        key={a.id}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150"
                        style={{
                          background: checked ? "hsl(218 45% 42% / 0.08)" : "white",
                          border: `1px solid ${checked ? "hsl(218 45% 42% / 0.22)" : "hsl(224 20% 12% / 0.08)"}`,
                          opacity: maxReached ? 0.4 : 1,
                          cursor: maxReached ? "not-allowed" : "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={maxReached}
                          onChange={() => {
                            if (checked) {
                              setSelectedRelated(prev => prev.filter(x => x !== a.id));
                            } else if (!maxReached) {
                              setSelectedRelated(prev => [...prev, a.id]);
                            }
                          }}
                          className="w-3.5 h-3.5 rounded flex-shrink-0"
                          style={{ accentColor: "hsl(218 45% 42%)" }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-medium truncate" style={{ color: "hsl(224 40% 22%)" }}>{a.title}</p>
                          <p className="text-[10px] font-light" style={{ color: "hsl(224 15% 55%)" }}>{a.tag} · {a.date}</p>
                        </div>
                      </label>
                    );
                  })}
              </div>
              {selectedRelated.length >= 3 && (
                <p className="text-[11px]" style={{ color: "hsl(25 70% 45%)" }}>Maximum 3 articles liés atteint.</p>
              )}
            </div>
          )}
        </div>

        {/* ── SEO ── */}
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid hsl(224 20% 12% / 0.10)" }}>
          <button
            type="button"
            onClick={() => setSeoOpen((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors duration-150"
            style={{ background: seoOpen ? "hsl(224 55% 12%)" : "hsl(224 20% 97%)" }}
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4" style={{ color: seoOpen ? "hsl(0 0% 100% / 0.70)" : "hsl(224 40% 42%)" }} />
              <span className="text-[13px] font-medium" style={{ color: seoOpen ? "hsl(0 0% 100% / 0.85)" : "hsl(224 40% 30%)" }}>
                Référencement (SEO)
              </span>
              <span className="text-[10px] tracking-wide px-2 py-0.5 rounded-full"
                style={{ background: seoOpen ? "hsl(0 0% 100% / 0.12)" : "hsl(224 55% 18% / 0.09)", color: seoOpen ? "hsl(0 0% 100% / 0.55)" : "hsl(224 40% 45%)" }}>
                Optionnel
              </span>
            </div>
            <ChevronDown
              className="w-4 h-4 transition-transform duration-300"
              style={{ transform: seoOpen ? "rotate(180deg)" : "rotate(0deg)", color: seoOpen ? "hsl(0 0% 100% / 0.50)" : "hsl(224 20% 52%)" }}
            />
          </button>

          {seoOpen && (
            <div className="px-5 py-5 flex flex-col gap-5" style={{ background: "hsl(220 30% 98%)", borderTop: "1px solid hsl(224 20% 12% / 0.07)" }}>

              {/* Slug */}
              <Field label="Slug (URL)" hint="Généré automatiquement · modifiable" error={errors.slug?.message}>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[12px] select-none pointer-events-none" style={{ color: "hsl(224 15% 58%)" }}>
                    /actualites/
                  </span>
                  <input
                    className={inputClass}
                    style={{ ...inputStyle, paddingLeft: "88px" }}
                    placeholder="mon-article-2026"
                    {...register("slug")}
                    onChange={(e) => {
                      setSlugManuallyEdited(true);
                      setValue("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-"), { shouldValidate: false });
                    }}
                    onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
                    onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)}
                  />
                </div>
              </Field>

              {/* Meta title */}
              <Field label="Titre SEO" hint="Affiché dans les résultats Google (60 car. max)" error={errors.meta_title?.message}>
                <div className="relative">
                  <input
                    className={inputClass}
                    style={{ ...inputStyle, paddingRight: "52px" }}
                    placeholder={titleValue || "Titre de l'article"}
                    {...register("meta_title")}
                    onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
                    onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)}
                  />
                  <span
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] tabular-nums"
                    style={{ color: metaTitleValue.length > 55 ? "hsl(25 80% 48%)" : "hsl(224 15% 60%)" }}
                  >
                    {metaTitleValue.length}/60
                  </span>
                </div>
                {/* Google SERP preview */}
                <div className="mt-2 p-3 rounded-xl" style={{ background: "white", border: "1px solid hsl(224 15% 88%)" }}>
                  <p className="text-[11px] mb-1.5 font-medium" style={{ color: "hsl(224 12% 55%)" }}>Aperçu Google</p>
                  <p className="text-[15px] font-medium leading-snug mb-0.5" style={{ color: "hsl(220 80% 38%)" }}>
                    {metaTitleValue || titleValue || "Titre de l'article"}, KANTI
                  </p>
                  <p className="text-[12px] leading-snug" style={{ color: "hsl(130 30% 28%)" }}>
                    kanti-patrimoine-courtage.lovable.app › actualites › {watch("slug") || "slug"}
                  </p>
                  <p className="text-[13px] leading-snug mt-1" style={{ color: "hsl(224 10% 38%)" }}>
                    {metaDescValue || watch("excerpt") || "Description de l'article..."}
                  </p>
                </div>
              </Field>

              {/* Meta description */}
              <Field label="Meta description" hint="Résumé affiché sous le titre dans Google (155 car. max)" error={errors.meta_description?.message}>
                <div className="relative">
                  <textarea
                    className={inputClass}
                    style={{ ...inputStyle, resize: "vertical", minHeight: "72px", paddingRight: "52px", paddingBottom: "28px" }}
                    placeholder={watch("excerpt") || "Description pour les moteurs de recherche…"}
                    {...register("meta_description")}
                    onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
                    onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)}
                  />
                  <span
                    className="absolute right-3 bottom-3 text-[11px] tabular-nums"
                    style={{ color: metaDescValue.length > 140 ? "hsl(25 80% 48%)" : "hsl(224 15% 60%)" }}
                  >
                    {metaDescValue.length}/155
                  </span>
                </div>
              </Field>

              {/* Author */}
              <Field label="Auteur" hint="Affiché dans les résultats Google et le balisage JSON-LD" error={errors.author_name?.message}>
                <input
                  className={inputClass}
                  style={inputStyle}
                  placeholder="ex: Quentin Perromat"
                  {...register("author_name")}
                  onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
                  onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)}
                />
              </Field>

            </div>
          )}
        </div>

        {globalError && (
          <p className="py-2.5 px-4 rounded-xl text-[13px]"
            style={{ background: "hsl(0 60% 96%)", color: "hsl(0 60% 40%)", border: "1px solid hsl(0 60% 88%)" }}>
            {globalError}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-xl text-[14px] font-medium transition-opacity disabled:opacity-60"
            style={{ background: "hsl(224 60% 18%)", color: "white" }}
          >
            {isSubmitting ? "Enregistrement…" : isEdit ? "Mettre à jour" : "Publier l'article"}
          </button>
          <Link
            to="/admin/articles"
            className="px-5 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-150"
            style={{ background: "hsl(224 20% 12% / 0.07)", color: "hsl(224 40% 35%)" }}
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
    </div>
  );
}
