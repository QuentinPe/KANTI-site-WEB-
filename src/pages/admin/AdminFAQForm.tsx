import {
  INNER_BG, INNER_BORDER,
  T_PRIMARY, T_SECONDARY, T_MUTED, T_LABEL,
  C_BLUE, C_CORAL,
  INPUT_STYLE,
} from "@/lib/adminTheme";

const FALLBACK_CATEGORIES = [
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

const inputClass = "w-full text-[13px] transition-all duration-150";
const inputFocus = { border: "1px solid rgba(255,255,255,0.28)", background: "rgba(255,255,255,0.10)", boxShadow: "0 0 0 3px rgba(255,255,255,0.06)" };
const inputBlur = { border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.07)", boxShadow: "none" };

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-medium tracking-wide" style={{ color: T_LABEL }}>{label}</label>
      {children}
      {error && <p className="text-[11px]" style={{ color: C_CORAL }}>{error}</p>}
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

  const { data: dbCategories = [] } = useQuery({
    queryKey: ["categories", "faq"],
    queryFn: () => getCategories("faq"),
  });

  const categoryOptions = dbCategories.length > 0
    ? dbCategories.map((c) => ({ value: c.slug, label: c.name }))
    : FALLBACK_CATEGORIES;

  const existing = isEdit ? items.find((i) => i.id === id) : null;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { category: FALLBACK_CATEGORIES[0].value, question: "", answer: "", sort_order: 0, active: true },
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
        <div className="w-7 h-7 rounded-full border-2 animate-spin"
          style={{ borderColor: T_MUTED, borderTopColor: T_SECONDARY }} />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/faq" className="p-2 rounded-lg transition-all duration-150"
          style={{ color: T_SECONDARY }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: T_PRIMARY }}>
          {isEdit ? "Modifier la Q&A" : "Nouvelle Q&A"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Field label="Catégorie *" error={errors.category?.message}>
          <select className={inputClass} style={{ ...INPUT_STYLE, cursor: "pointer" }}
            {...register("category")}
            onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
            onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)}>
            {categoryOptions.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </Field>

        <Field label="Question *" error={errors.question?.message}>
          <input className={inputClass} style={{ ...INPUT_STYLE }}
            placeholder="ex: Comment se passe le premier rendez-vous ?"
            {...register("question")}
            onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
            onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)} />
        </Field>

        <Field label="Réponse *" error={errors.answer?.message}>
          <textarea className={inputClass}
            style={{ ...INPUT_STYLE, resize: "vertical", minHeight: "140px" }}
            placeholder="Réponse complète à la question"
            {...register("answer")}
            onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
            onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Ordre d'affichage">
            <input type="number" className={inputClass} style={{ ...INPUT_STYLE }} placeholder="0"
              {...register("sort_order")}
              onFocus={(e) => Object.assign((e.target as HTMLElement).style, inputFocus)}
              onBlur={(e) => Object.assign((e.target as HTMLElement).style, inputBlur)} />
          </Field>
          <div className="flex flex-col justify-end pb-1">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" className="w-4 h-4 rounded" {...register("active")} />
              <span className="text-[13px] font-medium" style={{ color: T_LABEL }}>Visible sur le site</span>
            </label>
          </div>
        </div>

        {globalError && (
          <p className="py-2.5 px-4 rounded-xl text-[13px]"
            style={{ background: "hsl(5 45% 56% / 0.12)", color: C_CORAL, border: "1px solid hsl(5 45% 56% / 0.28)" }}>
            {globalError}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button type="submit"
            disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
            className="flex-1 py-2.5 rounded-xl text-[14px] font-medium transition-opacity disabled:opacity-60"
            style={{ background: "hsl(215 42% 65% / 0.18)", color: C_BLUE, border: "1px solid hsl(215 42% 65% / 0.3)" }}>
            {isSubmitting ? "Enregistrement…" : isEdit ? "Mettre à jour" : "Créer la Q&A"}
          </button>
          <Link to="/admin/faq"
            className="px-5 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-150"
            style={{ background: INNER_BG, color: T_SECONDARY, border: `1px solid ${INNER_BORDER}` }}>
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}