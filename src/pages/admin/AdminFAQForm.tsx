import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { getAllFaq, createFaqItem, updateFaqItem } from "@/lib/faqService";
import type { FaqInput } from "@/lib/faqService";

const CATEGORIES = [
  { value: "cabinet", label: "Le cabinet" },
  { value: "rendez-vous", label: "Premier rendez-vous" },
  { value: "accompagnement", label: "Accompagnement" },
  { value: "fiscalite", label: "Fiscalité & placements" },
  { value: "transmission", label: "Transmission & succession" },
  { value: "confidentialite", label: "Confidentialité & sécurité" },
];

const schema = z.object({
  category: z.string().min(1, "Choisissez une catégorie"),
  question: z.string().min(5, "Question trop courte"),
  answer: z.string().min(10, "Réponse trop courte"),
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

export default function AdminFAQForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isEdit = Boolean(id);
  const [globalError, setGlobalError] = useState("");

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["faq-admin"],
    queryFn: getAllFaq,
    enabled: isEdit,
  });

  const existing = isEdit ? items.find((i) => i.id === id) : null;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { category: CATEGORIES[0].value, question: "", answer: "", sort_order: 0, active: true },
  });

  useEffect(() => {
    if (existing) {
      reset({
        category: existing.category,
        question: existing.question,
        answer: existing.answer,
        sort_order: existing.sort_order,
        active: existing.active,
      });
    }
  }, [existing, reset]);

  const createMutation = useMutation({
    mutationFn: createFaqItem,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["faq-admin"] }); navigate("/admin/faq"); },
    onError: (e: Error) => setGlobalError("Erreur : " + e.message),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<FaqInput>) => updateFaqItem(id!, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["faq-admin"] }); navigate("/admin/faq"); },
    onError: (e: Error) => setGlobalError("Erreur : " + e.message),
  });

  const onSubmit = (data: FormData) => {
    setGlobalError("");
    const payload: FaqInput = {
      category: data.category,
      question: data.question,
      answer: data.answer,
      sort_order: data.sort_order,
      active: data.active,
    };
    isEdit ? updateMutation.mutate(payload) : createMutation.mutate(payload);
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
        <Link to="/admin/faq" className="p-2 rounded-lg transition-all duration-150"
          style={{ color: "hsl(224 25% 45%)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 60% 18% / 0.07)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: "hsl(224 55% 12%)" }}>
          {isEdit ? "Modifier la Q&A" : "Nouvelle Q&A"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Field label="Catégorie *" error={errors.category?.message}>
          <select className={inputClass} style={{ ...inputStyle, cursor: "pointer" }}
            {...register("category")}
            onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
            onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)}>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </Field>

        <Field label="Question *" error={errors.question?.message}>
          <input className={inputClass} style={inputStyle}
            placeholder="ex: Comment se passe le premier rendez-vous ?"
            {...register("question")}
            onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
            onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)} />
        </Field>

        <Field label="Réponse *" error={errors.answer?.message}>
          <textarea className={inputClass}
            style={{ ...inputStyle, resize: "vertical", minHeight: "140px" }}
            placeholder="Réponse complète à la question"
            {...register("answer")}
            onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
            onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)} />
        </Field>

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
          <button type="submit"
            disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
            className="flex-1 py-2.5 rounded-xl text-[14px] font-medium transition-opacity disabled:opacity-60"
            style={{ background: "hsl(224 60% 18%)", color: "white" }}>
            {isSubmitting ? "Enregistrement…" : isEdit ? "Mettre à jour" : "Créer la Q&A"}
          </button>
          <Link to="/admin/faq"
            className="px-5 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-150"
            style={{ background: "hsl(224 20% 12% / 0.07)", color: "hsl(224 40% 35%)" }}>
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
