import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ImageOff } from "lucide-react";
import { getArticles, createArticle, updateArticle } from "@/lib/articlesService";
import type { ArticleInput } from "@/lib/articlesService";
import RichEditor from "@/components/admin/RichEditor";

const CATEGORIES = ["Investissement", "Épargne", "Transmission", "Fiscalité", "Retraite", "Immobilier", "Dirigeants", "Allocation", "Prévoyance"];

const schema = z.object({
  title: z.string().min(5, "Titre trop court"),
  excerpt: z.string().min(20, "Extrait trop court (résumé de 2-3 lignes pour la liste)"),
  body: z.string().optional(),
  tag: z.string().min(1, "Choisissez une catégorie"),
  date: z.string().min(1, "Date requise"),
  reading_time: z.string().min(1, "Temps de lecture requis"),
  image: z.string().url("URL d'image invalide"),
  featured: z.boolean(),
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

  const { data: articles = [], isLoading: articlesLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: getArticles,
    enabled: isEdit,
  });

  const existing = isEdit ? articles.find((a) => a.id === id) : null;

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      excerpt: "",
      body: "",
      tag: CATEGORIES[0],
      date: "",
      reading_time: "",
      image: "",
      featured: false,
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
      });
      setImagePreview(existing.image);
    }
  }, [existing, reset]);

  const imageUrl = watch("image");
  useEffect(() => {
    if (imageUrl && imageUrl.startsWith("http")) setImagePreview(imageUrl);
  }, [imageUrl]);

  const bodyValue = watch("body") ?? "";

  const createMutation = useMutation({
    mutationFn: (data: ArticleInput) => createArticle(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["articles"] });
      navigate("/admin");
    },
    onError: () => setGlobalError("Erreur lors de la création. Vérifiez vos permissions Supabase."),
  });

  const updateMutation = useMutation({
    mutationFn: (data: ArticleInput) => updateArticle(id!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["articles"] });
      navigate("/admin");
    },
    onError: () => setGlobalError("Erreur lors de la mise à jour."),
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
      // body uniquement si non vide (nécessite ALTER TABLE articles ADD COLUMN body TEXT)
      ...(data.body && data.body !== "<p></p>" ? { body: data.body } : {}),
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
        <Link to="/admin" className="mt-4 block text-[13px] underline" style={{ color: "hsl(224 55% 35%)" }}>← Retour</Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/admin"
          className="p-2 rounded-lg transition-all duration-150"
          style={{ color: "hsl(224 25% 45%)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 60% 18% / 0.07)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: "hsl(224 55% 12%)" }}>
            {isEdit ? "Modifier l'article" : "Nouvel article"}
          </h1>
        </div>
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

        <Field
          label="Extrait *"
          hint="Court résumé affiché dans la liste des articles"
          error={errors.excerpt?.message}
        >
          <textarea
            className={inputClass}
            style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }}
            placeholder="Résumé de l'article (2–3 phrases)"
            {...register("excerpt")}
            onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
            onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)}
          />
        </Field>

        {/* Rich text body */}
        <Field
          label="Contenu de l'article"
          hint="Éditeur riche — import Word ou PDF possible"
          error={errors.body?.message}
        >
          <RichEditor
            value={bodyValue}
            onChange={(html) => setValue("body", html, { shouldValidate: false })}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Catégorie *" error={errors.tag?.message}>
            <select
              className={inputClass}
              style={{ ...inputStyle, cursor: "pointer" }}
              {...register("tag")}
              onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
              onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)}
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
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
            to="/admin"
            className="px-5 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-150"
            style={{ background: "hsl(224 20% 12% / 0.07)", color: "hsl(224 40% 35%)" }}
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
