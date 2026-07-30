import {
  GLASS, INNER_BG, INNER_BORDER,
  T_PRIMARY, T_SECONDARY, T_MUTED, T_HEADING,
  C_BLUE, C_CORAL,
} from "@/lib/adminTheme";

const FALLBACK_LABELS: Record<string, string> = {
  cabinet: "Le cabinet",
  "rendez-vous": "Premier rendez-vous",
  accompagnement: "Accompagnement",
  fiscalite: "Fiscalité & placements",
  transmission: "Transmission & succession",
  confidentialite: "Confidentialité & sécurité",
};

export default function AdminFAQList() {
  const qc = useQueryClient();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["faq-admin"],
    queryFn: getAllFaq,
  });

  const { data: dbCategories = [] } = useQuery({
    queryKey: ["categories", "faq"],
    queryFn: () => getCategories("faq"),
  });

  const categoryLabel = (slug: string): string => {
    if (dbCategories.length > 0) {
      const found = dbCategories.find((c) => c.slug === slug);
      if (found) return found.name;
    }
    return FALLBACK_LABELS[slug] ?? slug;
  };

  const deleteMutation = useMutation({
    mutationFn: deleteFaqItem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["faq-admin"] });
      setConfirmId(null);
    },
  });

  const reorderMutation = useMutation({
    mutationFn: reorderFaqItems,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faq-admin"] }),
  });

  // Group by category
  const grouped = items.reduce<Record<string, FaqItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const moveItem = (item: FaqItem, direction: "up" | "down") => {
    const group = grouped[item.category];
    const idx = group.findIndex((i) => i.id === item.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= group.length) return;
    const updates = [
      { id: item.id, sort_order: group[swapIdx].sort_order },
      { id: group[swapIdx].id, sort_order: item.sort_order },
    ];
    reorderMutation.mutate(updates);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: T_PRIMARY }}>
            FAQ
          </h1>
          <p className="text-[13px] font-light mt-1" style={{ color: T_SECONDARY }}>
            {items.length} question{items.length !== 1 ? "s" : ""} au total · {Object.keys(grouped).length} catégorie{Object.keys(grouped).length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          to="/admin/faq/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 hover:opacity-90"
          style={{ background: "hsl(215 42% 65% / 0.18)", color: C_BLUE, border: "1px solid hsl(215 42% 65% / 0.35)" }}
        >
          <Plus className="w-4 h-4" />
          Nouvelle Q&A
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div
            className="w-7 h-7 rounded-full animate-spin"
            style={{ border: `2px solid ${INNER_BORDER}`, borderTopColor: T_SECONDARY }}
          />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-24" style={{ ...GLASS, borderRadius: "1rem" }}>
          <HelpCircle className="w-10 h-10 mx-auto mb-4" style={{ color: T_MUTED }} />
          <p className="text-[15px] font-heading font-light" style={{ color: T_SECONDARY }}>
            Aucune question pour le moment
          </p>
          <Link
            to="/admin/faq/new"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl text-[13px] font-medium"
            style={{ background: "hsl(215 42% 65% / 0.18)", color: C_BLUE, border: "1px solid hsl(215 42% 65% / 0.35)" }}
          >
            <Plus className="w-4 h-4" /> Ajouter une Q&A
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {Object.entries(grouped).map(([cat, catItems]) => {
            const isExpanded = expandedCategories.has(cat);
            const label = categoryLabel(cat);
            return (
              <div key={cat} className="overflow-hidden" style={{ ...GLASS, borderRadius: "1rem" }}>
                {/* Category header */}
                <button
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left transition-all duration-150"
                  style={{ borderBottom: isExpanded ? `1px solid ${INNER_BORDER}` : "none" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[13.5px] font-medium" style={{ color: T_HEADING }}>{label}</span>
                    <span
                      className="px-2 py-0.5 rounded-full text-[11px]"
                      style={{ background: "hsl(215 42% 65% / 0.12)", color: C_BLUE }}
                    >
                      {catItems.length}
                    </span>
                  </div>
                  {isExpanded
                    ? <ChevronUp className="w-4 h-4" style={{ color: T_MUTED }} />
                    : <ChevronDown className="w-4 h-4" style={{ color: T_MUTED }} />
                  }
                </button>

                {/* Items */}
                {isExpanded && catItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="px-5 py-4 flex items-start gap-4"
                    style={{ borderBottom: idx < catItems.length - 1 ? `1px solid ${INNER_BORDER}` : "none" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    {/* Reorder */}
                    <div className="flex flex-col gap-0.5 flex-shrink-0 pt-0.5">
                      <button
                        type="button"
                        onClick={() => moveItem(item, "up")}
                        disabled={idx === 0}
                        className="p-0.5 rounded transition-opacity disabled:opacity-20"
                        style={{ color: T_MUTED }}
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(item, "down")}
                        disabled={idx === catItems.length - 1}
                        className="p-0.5 rounded transition-opacity disabled:opacity-20"
                        style={{ color: T_MUTED }}
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium" style={{ color: T_PRIMARY }}>{item.question}</p>
                      <p className="text-[12px] font-light mt-1 line-clamp-2" style={{ color: T_SECONDARY }}>{item.answer}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link
                        to={`/admin/faq/${item.id}/edit`}
                        className="p-1.5 rounded-lg transition-all duration-150"
                        style={{ color: C_BLUE }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      {confirmId === item.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => deleteMutation.mutate(item.id)}
                            disabled={deleteMutation.isPending}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium disabled:opacity-60"
                            style={{ background: "hsl(5 45% 56% / 0.18)", color: C_CORAL, border: "1px solid hsl(5 45% 56% / 0.35)" }}
                          >
                            {deleteMutation.isPending ? "…" : "Oui"}
                          </button>
                          <button
                            onClick={() => setConfirmId(null)}
                            className="px-2.5 py-1 rounded-lg text-[11px]"
                            style={{ color: T_SECONDARY }}
                          >
                            Non
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmId(item.id)}
                          className="p-1.5 rounded-lg transition-all duration-150"
                          style={{ color: T_MUTED }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = C_CORAL; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = T_MUTED; }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}