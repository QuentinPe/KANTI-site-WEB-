import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, X, Trash2 } from "lucide-react";
import { getAllCasClients, createCasClient, updateCasClient } from "@/lib/casClientsService";
import type { CasClientInput } from "@/lib/casClientsService";
import { supabase } from "@/lib/supabase";

const CATEGORIES = [
  { value: "particulier", label: "Particulier" },
  { value: "dirigeant", label: "Dirigeant" },
  { value: "liberal", label: "Profession libérale" },
  { value: "investisseur", label: "Investisseur" },
  { value: "expatrie", label: "Expatrié" },
];

const schema = z.object({
  category: z.string().min(1),
  category_label: z.string().min(1, "Label de catégorie requis"),
  expertise: z.string().min(1, "Expertise requise"),
  profil: z.string().min(2, "Profil requis"),
  age: z.coerce.number().int().positive().optional().nullable(),
  duration: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  contexte: z.string().optional().nullable(),
  diagnostic: z.array(z.object({ value: z.string() })),
  strategie: z.array(z.object({ value: z.string() })),
  resultat: z.string().optional().nullable(),
  kpis: z.array(z.object({ label: z.string(), value: z.string() })),
  vigilance: z.string().optional().nullable(),
  verbatim: z.string().optional().nullable(),
  verbatim_author: z.string().optional().nullable(),
  sort_order: z.coerce.number().int().default(0),
  active: z.boolean(),
});

type FormData = z.infer<typeof schema>;

const inputClass = "w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all duration-150";
const inputStyle = { background: "white", border: "1px solid hsl(224 20% 12% / 0.12)", color: "hsl(224 55% 12%)" };
const inputFocus = { borderColor: "hsl(224 60% 18% / 0.40)", boxShadow: "0 0 0 3px hsl(224 60% 18% / 0.08)" };
const inputBlur = { boxShadow: "none", borderColor: "hsl(224 20% 12% / 0.12)" };

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-medium tracking-wide" style={{ color: "hsl(224 25% 38%)" }}>{label}</label>
      {children}
      {error && <p className="text-[11px]" style={{ color: "hsl(0 60% 48%)" }}>{error}</p>}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-2">
      <p className="text-[11px] tracking-[0.22em] uppercase font-medium mb-3" style={{ color: "hsl(224 40% 45%)" }}>
        {children}
      </p>
      <div style={{ height: 1, background: "hsl(224 20% 12% / 0.08)" }} />
    </div>
  );
}

export default function AdminCasClientsForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isEdit = Boolean(id);
  const [globalError, setGlobalError] = useState("");
  const [uploading, setUploading] = useState(false);

  const { data: cases = [], isLoading } = useQuery({
    queryKey: ["cas-clients-admin"],
    queryFn: getAllCasClients,
    enabled: isEdit,
  });

  const existing = isEdit ? cases.find((c) => c.id === id) : null;

  const { register, handleSubmit, reset, watch, setValue, control, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: "particulier", category_label: "Particulier", expertise: "", profil: "",
      age: null, duration: "", image: "", contexte: "", resultat: "", vigilance: "",
      verbatim: "", verbatim_author: "", sort_order: 0, active: true,
      diagnostic: [{ value: "" }], strategie: [{ value: "" }], kpis: [{ label: "", value: "" }],
    },
  });

  const {
    fields: diagFields, append: appendDiag, remove: removeDiag,
  } = useFieldArray({ control, name: "diagnostic" });
  const {
    fields: stratFields, append: appendStrat, remove: removeStrat,
  } = useFieldArray({ control, name: "strategie" });
  const {
    fields: kpiFields, append: appendKpi, remove: removeKpi,
  } = useFieldArray({ control, name: "kpis" });

  useEffect(() => {
    if (existing) {
      reset({
        category: existing.category,
        category_label: existing.category_label,
        expertise: existing.expertise,
        profil: existing.profil,
        age: existing.age,
        duration: existing.duration ?? "",
        image: existing.image ?? "",
        contexte: existing.contexte ?? "",
        resultat: existing.resultat ?? "",
        vigilance: existing.vigilance ?? "",
        verbatim: existing.verbatim ?? "",
        verbatim_author: existing.verbatim_author ?? "",
        sort_order: existing.sort_order,
        active: existing.active,
        diagnostic: (existing.diagnostic ?? [""]).map((v) => ({ value: v })),
        strategie: (existing.strategie ?? [""]).map((v) => ({ value: v })),
        kpis: (existing.kpis ?? [{ label: "", value: "" }]),
      });
    }
  }, [existing, reset]);

  // Auto-populate category_label from category
  const catValue = watch("category");
  useEffect(() => {
    const found = CATEGORIES.find((c) => c.value === catValue);
    if (found) setValue("category_label", found.label);
  }, [catValue, setValue]);

  const handleImageUpload = useCallback(async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `cas-clients/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("article-images").upload(path, file, { contentType: file.type });
    if (error) { alert("Erreur upload : " + error.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("article-images").getPublicUrl(path);
    setValue("image", publicUrl);
    setUploading(false);
  }, [setValue]);

  const createMutation = useMutation({
    mutationFn: createCasClient,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["cas-clients-admin"] }); navigate("/admin/cas-clients"); },
    onError: (e: Error) => setGlobalError("Erreur : " + e.message),
  });
  const updateMutation = useMutation({
    mutationFn: (data: Partial<CasClientInput>) => updateCasClient(id!, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["cas-clients-admin"] }); navigate("/admin/cas-clients"); },
    onError: (e: Error) => setGlobalError("Erreur : " + e.message),
  });

  const onSubmit = (data: FormData) => {
    setGlobalError("");
    const payload: CasClientInput = {
      category: data.category,
      category_label: data.category_label,
      expertise: data.expertise,
      profil: data.profil,
      age: data.age ?? null,
      duration: data.duration ?? null,
      image: data.image ?? null,
      contexte: data.contexte ?? null,
      diagnostic: data.diagnostic.map((d) => d.value).filter(Boolean),
      strategie: data.strategie.map((s) => s.value).filter(Boolean),
      resultat: data.resultat ?? null,
      kpis: data.kpis.filter((k) => k.label || k.value),
      vigilance: data.vigilance ?? null,
      verbatim: data.verbatim ?? null,
      verbatim_author: data.verbatim_author ?? null,
      sort_order: data.sort_order,
      active: data.active,
    };
    isEdit ? updateMutation.mutate(payload) : createMutation.mutate(payload);
  };

  if (isEdit && isLoading) {
    return <div className="flex items-center justify-center py-20"><div className="w-7 h-7 rounded-full border-2 border-foreground/15 border-t-foreground/60 animate-spin" /></div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/cas-clients" className="p-2 rounded-lg transition-all duration-150" style={{ color: "hsl(224 25% 45%)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 60% 18% / 0.07)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: "hsl(224 55% 12%)" }}>
          {isEdit ? "Modifier le cas client" : "Nouveau cas client"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <SectionTitle>Identité</SectionTitle>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Catégorie *" error={errors.category?.message}>
            <select className={inputClass} style={{ ...inputStyle, cursor: "pointer" }}
              {...register("category")}
              onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
              onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)}>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </Field>
          <Field label="Profil *" error={errors.profil?.message}>
            <input className={inputClass} style={inputStyle} placeholder="ex: Cadre dirigeant 48 ans"
              {...register("profil")}
              onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
              onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)} />
          </Field>
        </div>

        <Field label="Expertise (thème principal) *" error={errors.expertise?.message}>
          <input className={inputClass} style={inputStyle} placeholder="ex: Optimisation fiscale & retraite"
            {...register("expertise")}
            onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
            onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Âge">
            <input type="number" className={inputClass} style={inputStyle} placeholder="48"
              {...register("age")}
              onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
              onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)} />
          </Field>
          <Field label="Durée accompagnement">
            <input className={inputClass} style={inputStyle} placeholder="ex: 8 mois"
              {...register("duration")}
              onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
              onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)} />
          </Field>
        </div>

        {/* Image */}
        <Field label="Image (URL ou upload)">
          <div className="flex gap-2">
            <input className={inputClass} style={inputStyle} placeholder="https://… ou uploader ci-dessous"
              {...register("image")}
              onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
              onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)} />
            <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl cursor-pointer text-[12px] font-medium flex-shrink-0 transition-all"
              style={{ background: "hsl(224 20% 12% / 0.07)", color: "hsl(224 40% 35%)" }}>
              {uploading ? "…" : "Upload"}
              <input type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
            </label>
          </div>
        </Field>

        <SectionTitle>Contenu</SectionTitle>

        <Field label="Contexte">
          <textarea className={inputClass} style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }}
            placeholder="Situation initiale du client"
            {...register("contexte")}
            onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
            onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)} />
        </Field>

        {/* Diagnostic - array */}
        <Field label="Points de diagnostic" error={errors.diagnostic?.message}>
          <div className="flex flex-col gap-2">
            {diagFields.map((field, i) => (
              <div key={field.id} className="flex gap-2">
                <input className={inputClass} style={inputStyle} placeholder={`Point ${i + 1}`}
                  {...register(`diagnostic.${i}.value`)}
                  onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
                  onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)} />
                <button type="button" onClick={() => removeDiag(i)}
                  className="p-2 rounded-lg transition-all flex-shrink-0" style={{ color: "hsl(224 15% 60%)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(0 60% 45%)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(224 15% 60%)"; }}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => appendDiag({ value: "" })}
              className="flex items-center gap-1.5 text-[12px] font-medium mt-1 transition-opacity hover:opacity-70"
              style={{ color: "hsl(224 55% 32%)" }}>
              <Plus className="w-3.5 h-3.5" /> Ajouter un point
            </button>
          </div>
        </Field>

        {/* Stratégie - array */}
        <Field label="Points de stratégie" error={errors.strategie?.message}>
          <div className="flex flex-col gap-2">
            {stratFields.map((field, i) => (
              <div key={field.id} className="flex gap-2">
                <input className={inputClass} style={inputStyle} placeholder={`Action ${i + 1}`}
                  {...register(`strategie.${i}.value`)}
                  onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
                  onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)} />
                <button type="button" onClick={() => removeStrat(i)}
                  className="p-2 rounded-lg transition-all flex-shrink-0" style={{ color: "hsl(224 15% 60%)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(0 60% 45%)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(224 15% 60%)"; }}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => appendStrat({ value: "" })}
              className="flex items-center gap-1.5 text-[12px] font-medium mt-1 transition-opacity hover:opacity-70"
              style={{ color: "hsl(224 55% 32%)" }}>
              <Plus className="w-3.5 h-3.5" /> Ajouter une action
            </button>
          </div>
        </Field>

        <Field label="Résultat">
          <textarea className={inputClass} style={{ ...inputStyle, resize: "vertical", minHeight: "60px" }}
            placeholder="Ce qui a été accompli"
            {...register("resultat")}
            onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
            onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)} />
        </Field>

        {/* KPIs - array of {label, value} */}
        <Field label="KPIs / Indicateurs">
          <div className="flex flex-col gap-2">
            {kpiFields.map((field, i) => (
              <div key={field.id} className="flex gap-2">
                <input className={inputClass} style={inputStyle} placeholder="Label (ex: Économie fiscale)"
                  {...register(`kpis.${i}.label`)}
                  onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
                  onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)} />
                <input className={`${inputClass} w-28 flex-shrink-0`} style={inputStyle} placeholder="Valeur"
                  {...register(`kpis.${i}.value`)}
                  onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
                  onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)} />
                <button type="button" onClick={() => removeKpi(i)}
                  className="p-2 rounded-lg transition-all flex-shrink-0" style={{ color: "hsl(224 15% 60%)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(0 60% 45%)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(224 15% 60%)"; }}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => appendKpi({ label: "", value: "" })}
              className="flex items-center gap-1.5 text-[12px] font-medium mt-1 transition-opacity hover:opacity-70"
              style={{ color: "hsl(224 55% 32%)" }}>
              <Plus className="w-3.5 h-3.5" /> Ajouter un KPI
            </button>
          </div>
        </Field>

        <Field label="Point de vigilance">
          <input className={inputClass} style={inputStyle} placeholder="ex: Attention à la requalification LMNP"
            {...register("vigilance")}
            onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
            onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)} />
        </Field>

        <SectionTitle>Témoignage (optionnel)</SectionTitle>

        <Field label="Citation du client">
          <textarea className={inputClass} style={{ ...inputStyle, resize: "vertical", minHeight: "60px" }}
            placeholder="Ce que dit le client de l'accompagnement"
            {...register("verbatim")}
            onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
            onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)} />
        </Field>

        <Field label="Auteur (anonymisé)">
          <input className={inputClass} style={inputStyle} placeholder="ex: M. D., 48 ans, Bordeaux"
            {...register("verbatim_author")}
            onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
            onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)} />
        </Field>

        <SectionTitle>Paramètres</SectionTitle>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Ordre d'affichage">
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
          <button type="submit" disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
            className="flex-1 py-2.5 rounded-xl text-[14px] font-medium transition-opacity disabled:opacity-60"
            style={{ background: "hsl(224 60% 18%)", color: "white" }}>
            {isSubmitting ? "Enregistrement…" : isEdit ? "Mettre à jour" : "Créer le cas"}
          </button>
          <Link to="/admin/cas-clients"
            className="px-5 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-150"
            style={{ background: "hsl(224 20% 12% / 0.07)", color: "hsl(224 40% 35%)" }}>
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
