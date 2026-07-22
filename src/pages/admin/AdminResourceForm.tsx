import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Upload, FileText, X } from "lucide-react";
import { getAllRessources, createRessource, updateRessource, uploadPDF } from "@/lib/ressourcesService";
import type { RessourceInput } from "@/lib/ressourcesService";

const CATEGORIES = ["Fiscalité", "Transmission", "Dirigeants", "Investir", "International", "Retraite", "Immobilier"];

const schema = z.object({
  title: z.string().min(3, "Titre trop court"),
  description: z.string().min(10, "Description trop courte"),
  category: z.string().min(1, "Choisissez une catégorie"),
  pages: z.coerce.number().int().positive().optional().nullable(),
  active: z.boolean(),
  sort_order: z.coerce.number().int().default(0),
});

type FormData = z.infer<typeof schema>;

const inputClass = "w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all duration-150";
const inputStyle = { background: "white", border: "1px solid hsl(224 20% 12% / 0.12)", color: "hsl(224 55% 12%)" };
const inputFocus = { borderColor: "hsl(224 60% 18% / 0.40)", boxShadow: "0 0 0 3px hsl(224 60% 18% / 0.08)" };
const inputBlur = { boxShadow: "none", borderColor: "hsl(224 20% 12% / 0.12)" };

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

export default function AdminResourceForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isEdit = Boolean(id);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [globalError, setGlobalError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: ressources = [], isLoading } = useQuery({
    queryKey: ["ressources-admin"],
    queryFn: getAllRessources,
    enabled: isEdit,
  });

  const existing = isEdit ? ressources.find((r) => r.id === id) : null;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", description: "", category: CATEGORIES[0], pages: null, active: true, sort_order: 0 },
  });

  useEffect(() => {
    if (existing) {
      reset({
        title: existing.title,
        description: existing.description,
        category: existing.category,
        pages: existing.pages,
        active: existing.active,
        sort_order: existing.sort_order,
      });
    }
  }, [existing, reset]);

  const createMutation = useMutation({
    mutationFn: async (data: RessourceInput) => createRessource(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ressources-admin"] });
      qc.invalidateQueries({ queryKey: ["ressources"] });
      navigate("/admin/ressources");
    },
    onError: (e: Error) => setGlobalError("Erreur création : " + e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<RessourceInput>) => updateRessource(id!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ressources-admin"] });
      qc.invalidateQueries({ queryKey: ["ressources"] });
      navigate("/admin/ressources");
    },
    onError: (e: Error) => setGlobalError("Erreur mise à jour : " + e.message),
  });

  const onSubmit = async (data: FormData) => {
    setGlobalError("");
    setUploadProgress(0);

    if (!isEdit && !pdfFile) {
      setGlobalError("Veuillez sélectionner un fichier PDF.");
      return;
    }

    try {
      let storagePath = existing?.storage_path ?? "";

      if (pdfFile) {
        setUploadProgress(30);
        storagePath = await uploadPDF(pdfFile);
        setUploadProgress(80);
      }

      const payload: RessourceInput = {
        title: data.title,
        description: data.description,
        category: data.category,
        pages: data.pages ?? null,
        active: data.active,
        sort_order: data.sort_order,
        storage_path: storagePath,
      };

      if (isEdit) {
        updateMutation.mutate(payload);
      } else {
        createMutation.mutate(payload);
      }
      setUploadProgress(100);
    } catch (e) {
      setGlobalError("Erreur upload PDF : " + String(e));
      setUploadProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") setPdfFile(file);
  };

  if (isEdit && isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-7 h-7 rounded-full border-2 border-foreground/15 border-t-foreground/60 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/ressources" className="p-2 rounded-lg transition-all duration-150"
          style={{ color: "hsl(224 25% 45%)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 60% 18% / 0.07)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: "hsl(224 55% 12%)" }}>
          {isEdit ? "Modifier la ressource" : "Nouvelle ressource"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* PDF upload zone */}
        <Field
          label="Fichier PDF *"
          hint={isEdit ? "Laisser vide pour conserver le fichier actuel" : ""}
          error={!pdfFile && !isEdit ? "Fichier requis" : undefined}
        >
          <div
            onDragEnter={() => setIsDragging(true)}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer rounded-2xl p-8 flex flex-col items-center gap-3 transition-all duration-200"
            style={{
              border: `2px dashed ${isDragging ? "hsl(224 60% 35%)" : "hsl(224 20% 12% / 0.15)"}`,
              background: isDragging ? "hsl(224 60% 18% / 0.04)" : "hsl(220 25% 98%)",
            }}
          >
            {pdfFile ? (
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6" style={{ color: "hsl(224 55% 32%)" }} />
                <div>
                  <p className="text-[13px] font-medium" style={{ color: "hsl(224 55% 18%)" }}>{pdfFile.name}</p>
                  <p className="text-[11px] font-light" style={{ color: "hsl(224 20% 55%)" }}>
                    {(pdfFile.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
                <button type="button" onClick={(e) => { e.stopPropagation(); setPdfFile(null); }}
                  className="ml-auto p-1 rounded-full" style={{ color: "hsl(224 20% 55%)" }}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8" style={{ color: "hsl(224 30% 62%)" }} />
                <p className="text-[13px] font-light text-center" style={{ color: "hsl(224 20% 48%)" }}>
                  {isEdit
                    ? "Glissez un PDF ou cliquez pour remplacer le fichier actuel"
                    : "Glissez votre PDF ici ou cliquez pour parcourir"
                  }
                </p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) setPdfFile(f); }}
            />
          </div>

          {/* Upload progress */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: "hsl(224 20% 88%)" }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%`, background: "hsl(224 60% 35%)" }}
              />
            </div>
          )}
        </Field>

        <Field label="Titre *" error={errors.title?.message}>
          <input className={inputClass} style={inputStyle} placeholder="Ex : Guide de défiscalisation 2026"
            {...register("title")}
            onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
            onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)} />
        </Field>

        <Field label="Description *" error={errors.description?.message}>
          <textarea className={inputClass} style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }}
            placeholder="Résumé du contenu de la ressource"
            {...register("description")}
            onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
            onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Catégorie *" error={errors.category?.message}>
            <select className={inputClass} style={{ ...inputStyle, cursor: "pointer" }}
              {...register("category")}
              onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
              onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="Nombre de pages" error={errors.pages?.message}>
            <input type="number" min="1" className={inputClass} style={inputStyle} placeholder="ex: 24"
              {...register("pages")}
              onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
              onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Ordre d'affichage" error={errors.sort_order?.message}>
            <input type="number" className={inputClass} style={inputStyle} placeholder="0"
              {...register("sort_order")}
              onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
              onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)} />
          </Field>

          <div className="flex flex-col justify-end pb-1">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" className="w-4 h-4 rounded" {...register("active")} />
              <span className="text-[13px] font-medium" style={{ color: "hsl(224 40% 30%)" }}>Visible sur le site</span>
            </label>
          </div>
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
            disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
            className="flex-1 py-2.5 rounded-xl text-[14px] font-medium transition-opacity disabled:opacity-60"
            style={{ background: "hsl(224 60% 18%)", color: "white" }}
          >
            {(isSubmitting || createMutation.isPending || updateMutation.isPending)
              ? "Enregistrement…"
              : isEdit ? "Mettre à jour" : "Publier la ressource"
            }
          </button>
          <Link to="/admin/ressources"
            className="px-5 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-150"
            style={{ background: "hsl(224 20% 12% / 0.07)", color: "hsl(224 40% 35%)" }}>
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
