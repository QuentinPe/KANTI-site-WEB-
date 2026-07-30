import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Trash2, UserSquare2, ImagePlus } from "lucide-react";
import {
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  uploadTeamImage,
  TeamMemberInput,
} from "@/lib/teamService";
import {
  INNER_BG, INNER_BORDER,
  T_PRIMARY, T_SECONDARY, T_MUTED, T_LABEL,
  C_BLUE, C_CORAL,
  INPUT_STYLE,
} from "@/lib/adminTheme";

const schema = z.object({
  name: z.string().min(1, "Nom requis"),
  role: z.string().min(1, "Rôle requis"),
  short: z.string().optional().default(""),
  bio: z.string().optional().default(""),
  image: z.string().optional().default(""),
  linkedin: z.string().optional().default(""),
  credentials: z.array(z.object({ value: z.string() })),
  sort_order: z.coerce.number().default(0),
  active: z.boolean().default(true),
});

type FormValues = z.infer<typeof schema>;

export default function AdminTeamForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const imgInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: existing } = useQuery({
    queryKey: ["admin-team-member", id],
    queryFn: () => getTeamMemberById(id!),
    enabled: isEdit,
  });

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { credentials: [{ value: "" }], active: true, sort_order: 0 },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "credentials" });

  useEffect(() => {
    if (existing) {
      setValue("name", existing.name);
      setValue("role", existing.role);
      setValue("short", existing.short ?? "");
      setValue("bio", existing.bio ?? "");
      setValue("image", existing.image ?? "");
      setValue("linkedin", existing.linkedin ?? "");
      setValue("sort_order", existing.sort_order ?? 0);
      setValue("active", existing.active);
      setValue("credentials", existing.credentials?.length
        ? existing.credentials.map((c) => ({ value: c }))
        : [{ value: "" }]);
      setImagePreview(existing.image ?? "");
    }
  }, [existing, setValue]);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadTeamImage(file);
      setValue("image", url);
      setImagePreview(url);
    } catch {
      setError("Erreur lors de l'upload de l'image.");
    } finally {
      setUploading(false);
    }
  };

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload: TeamMemberInput = {
        name: values.name,
        role: values.role,
        short: values.short ?? "",
        bio: values.bio ?? "",
        image: values.image ?? "",
        linkedin: values.linkedin ?? "",
        credentials: values.credentials.map((c) => c.value).filter(Boolean),
        sort_order: values.sort_order,
        active: values.active,
      };
      if (isEdit && id) return updateTeamMember(id, payload);
      return createTeamMember(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-team"] });
      navigate("/admin/equipe");
    },
    onError: (e) => {
      const o = e as Record<string, unknown>;
      const msg = e instanceof Error ? e.message : (typeof o?.message === "string" ? o.message : JSON.stringify(e));
      setError("Erreur lors de l'enregistrement : " + msg);
    },
  });

  const onSubmit = (values: FormValues) => {
    setError(null);
    mutation.mutate(values);
  };

  const imageValue = watch("image");

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-[14px] font-light outline-none transition-all";
  const labelCls = "block text-[11px] font-medium tracking-wide uppercase mb-1.5";

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <button
        onClick={() => navigate("/admin/equipe")}
        className="flex items-center gap-2 text-[13px] font-medium mb-6 transition-opacity hover:opacity-70"
        style={{ color: T_SECONDARY }}
      >
        <ArrowLeft className="w-4 h-4" />
        Équipe
      </button>

      <div className="flex items-center gap-2.5 mb-8">
        <UserSquare2 className="w-5 h-5" style={{ color: C_BLUE }} />
        <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: T_PRIMARY }}>
          {isEdit ? "Modifier le membre" : "Nouveau membre"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Photo */}
        <div>
          <label className={labelCls} style={{ color: T_LABEL }}>Photo</label>
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0"
              style={{ background: INNER_BG, border: `1px solid ${INNER_BORDER}` }}
            >
              {imagePreview || imageValue ? (
                <img src={imagePreview || imageValue} alt="" className="w-full h-full object-cover" />
              ) : (
                <UserSquare2 className="w-8 h-8" style={{ color: T_MUTED }} />
              )}
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => imgInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-opacity disabled:opacity-50"
                style={{ background: INNER_BG, color: T_LABEL, border: `1px solid ${INNER_BORDER}` }}
              >
                <ImagePlus className="w-4 h-4" />
                {uploading ? "Upload en cours…" : "Choisir une photo"}
              </button>
              <input
                {...register("image")}
                placeholder="ou coller une URL directement"
                className={inputCls}
                style={{ ...INPUT_STYLE, fontSize: "12px" }}
                onChange={(e) => { setValue("image", e.target.value); setImagePreview(e.target.value); }}
              />
            </div>
          </div>
          <input
            ref={imgInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.target.value = ""; }}
          />
        </div>

        {/* Name + Role */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls} style={{ color: T_LABEL }}>Nom *</label>
            <input {...register("name")} className={inputCls} style={{ ...INPUT_STYLE }} placeholder="Jean Dupont" />
            {errors.name && <p className="mt-1 text-[11px]" style={{ color: C_CORAL }}>{errors.name.message}</p>}
          </div>
          <div>
            <label className={labelCls} style={{ color: T_LABEL }}>Rôle *</label>
            <input {...register("role")} className={inputCls} style={{ ...INPUT_STYLE }} placeholder="Associé Fondateur" />
            {errors.role && <p className="mt-1 text-[11px]" style={{ color: C_CORAL }}>{errors.role.message}</p>}
          </div>
        </div>

        {/* Short tagline */}
        <div>
          <label className={labelCls} style={{ color: T_LABEL }}>Tagline court</label>
          <input {...register("short")} className={inputCls} style={{ ...INPUT_STYLE }} placeholder="Vision · stratégie · clientèle" />
        </div>

        {/* Bio */}
        <div>
          <label className={labelCls} style={{ color: T_LABEL }}>Biographie</label>
          <textarea
            {...register("bio")}
            rows={4}
            className={inputCls}
            style={{ ...INPUT_STYLE, resize: "vertical" }}
            placeholder="Description du parcours et de l'expertise…"
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label className={labelCls} style={{ color: T_LABEL }}>LinkedIn (URL)</label>
          <input {...register("linkedin")} className={inputCls} style={{ ...INPUT_STYLE }} placeholder="https://linkedin.com/in/…" />
        </div>

        {/* Credentials */}
        <div>
          <label className={labelCls} style={{ color: T_LABEL }}>Accréditations / Titres</label>
          <div className="space-y-2">
            {fields.map((field, i) => (
              <div key={field.id} className="flex items-center gap-2">
                <input
                  {...register(`credentials.${i}.value`)}
                  className={inputCls}
                  style={{ ...INPUT_STYLE }}
                  placeholder={`Accréditation ${i + 1}`}
                />
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="p-2 rounded-lg"
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200,80,70,0.15)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <Trash2 className="w-4 h-4" style={{ color: C_CORAL }} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ value: "" })}
              className="flex items-center gap-1.5 text-[12px] font-medium transition-opacity hover:opacity-70"
              style={{ color: C_BLUE }}
            >
              <Plus className="w-3.5 h-3.5" />
              Ajouter une accréditation
            </button>
          </div>
        </div>

        {/* Sort order + Active */}
        <div className="flex items-center gap-6">
          <div>
            <label className={labelCls} style={{ color: T_LABEL }}>Ordre d'affichage</label>
            <input
              {...register("sort_order")}
              type="number"
              className={inputCls}
              style={{ ...INPUT_STYLE, width: "80px" }}
            />
          </div>
          <div className="flex items-center gap-2 mt-4">
            <input {...register("active")} id="active" type="checkbox" className="w-4 h-4 rounded accent-[hsl(224_55%_32%)]" />
            <label htmlFor="active" className="text-[13px] font-light cursor-pointer" style={{ color: T_LABEL }}>
              Membre actif (visible sur le site)
            </label>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="px-4 py-3 rounded-xl text-[13px]"
            style={{ background: "rgba(200,60,50,0.12)", color: C_CORAL, border: "1px solid rgba(200,60,50,0.25)" }}
          >
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-6 py-2.5 rounded-xl text-[13px] font-medium transition-opacity disabled:opacity-60"
            style={{ background: "rgba(100,130,200,0.18)", color: C_BLUE, border: "1px solid rgba(100,130,200,0.30)" }}
          >
            {mutation.isPending ? "Enregistrement…" : isEdit ? "Mettre à jour" : "Créer le membre"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/equipe")}
            className="px-5 py-2.5 rounded-xl text-[13px] font-medium transition-colors"
            style={{ color: T_SECONDARY, border: `1px solid ${INNER_BORDER}` }}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}