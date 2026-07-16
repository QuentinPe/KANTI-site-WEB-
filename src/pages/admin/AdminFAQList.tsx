import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { getAllFaq, deleteFaqItem, reorderFaqItems } from "@/lib/faqService";
import type { FaqItem } from "@/lib/faqService";

const CATEGORY_LABELS: Record<string, string> = {
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
          <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: "hsl(224 55% 12%)" }}>
            FAQ
          </h1>
          <p className="text-[13px] font-light mt-1" style={{ color: "hsl(224 20% 50%)" }}>
            {items.length} question{items.length !== 1 ? "s" : ""} au total · {Object.keys(grouped).length} catégorie{Object.keys(grouped).length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          to="/admin/faq/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium text-white transition-all duration-200 hover:opacity-90"
          style={{ background: "hsl(224 60% 18%)" }}
        >
          <Plus className="w-4 h-4" />
          Nouvelle Q&A
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 rounded-full border-2 border-foreground/15 border-t-foreground/60 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-24 rounded-2xl" style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.07)" }}>
          <HelpCircle className="w-10 h-10 mx-auto mb-4" style={{ color: "hsl(224 20% 72%)" }} />
          <p className="text-[15px] font-heading font-light" style={{ color: "hsl(224 40% 35%)" }}>
            Aucune question pour le moment
          </p>
          <Link
            to="/admin/faq/new"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl text-[13px] font-medium text-white"
            style={{ background: "hsl(224 60% 18%)" }}
          >
            <Plus className="w-4 h-4" /> Ajouter une Q&A
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {Object.entries(grouped).map(([cat, catItems]) => {
            const isExpanded = expandedCategories.has(cat);
            const label = CATEGORY_LABELS[cat] ?? cat;
            return (
              <div key={cat} className="rounded-2xl overflow-hidden"
                style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.07)", boxShadow: "0 2px 8px -4px hsl(224 60% 12% / 0.05)" }}>
                {/* Category header */}
                <button
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left transition-all duration-150"
                  style={{ borderBottom: isExpanded ? "1px solid hsl(224 20% 12% / 0.07)" : "none" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[13.5px] font-medium" style={{ color: "hsl(224 55% 12%)" }}>{label}</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px]"
                      style={{ background: "hsl(224 60% 18% / 0.08)", color: "hsl(224 55% 32%)" }}>
                      {catItems.length}
                    </span>
                  </div>
                  {isExpanded
                    ? <ChevronUp className="w-4 h-4" style={{ color: "hsl(224 20% 55%)" }} />
                    : <ChevronDown className="w-4 h-4" style={{ color: "hsl(224 20% 55%)" }} />
                  }
                </button>

                {/* Items */}
                {isExpanded && catItems.map((item, idx) => (
                  <div key={item.id} className="px-5 py-4 flex items-start gap-4"
                    style={{ borderBottom: idx < catItems.length - 1 ? "1px solid hsl(224 20% 12% / 0.04)" : "none" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 20% 99%)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                    {/* Reorder */}
                    <div className="flex flex-col gap-0.5 flex-shrink-0 pt-0.5">
                      <button type="button" onClick={() => moveItem(item, "up")} disabled={idx === 0}
                        className="p-0.5 rounded transition-opacity disabled:opacity-20"
                        style={{ color: "hsl(224 20% 60%)" }}>
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => moveItem(item, "down")} disabled={idx === catItems.length - 1}
                        className="p-0.5 rounded transition-opacity disabled:opacity-20"
                        style={{ color: "hsl(224 20% 60%)" }}>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium" style={{ color: "hsl(224 50% 18%)" }}>{item.question}</p>
                      <p className="text-[12px] font-light mt-1 line-clamp-2" style={{ color: "hsl(224 15% 50%)" }}>{item.answer}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link to={`/admin/faq/${item.id}/edit`}
                        className="p-1.5 rounded-lg transition-all duration-150" style={{ color: "hsl(224 40% 45%)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 60% 18% / 0.08)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                        <Pencil className="w-4 h-4" />
                      </Link>
                      {confirmId === item.id ? (
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => deleteMutation.mutate(item.id)} disabled={deleteMutation.isPending}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-white disabled:opacity-60"
                            style={{ background: "hsl(0 60% 45%)" }}>
                            {deleteMutation.isPending ? "…" : "Oui"}
                          </button>
                          <button onClick={() => setConfirmId(null)} className="px-2.5 py-1 rounded-lg text-[11px]"
                            style={{ color: "hsl(224 25% 50%)" }}>Non</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmId(item.id)} className="p-1.5 rounded-lg transition-all duration-150"
                          style={{ color: "hsl(224 15% 65%)" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(0 60% 45%)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(224 15% 65%)"; }}>
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
