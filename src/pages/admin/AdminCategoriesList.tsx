import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, ChevronUp, ChevronDown, Trash2, Tags, FileText, HelpCircle, Loader2, AlertCircle } from "lucide-react";
import {
  getCategories,
  createCategory,
  deleteCategory,
  reorderCategories,
} from "@/lib/categoriesService";
import type { ContentCategory } from "@/lib/categoriesService";

const inputClass = "w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all duration-150";
const inputStyle = { background: "white", border: "1px solid hsl(224 20% 12% / 0.12)", color: "hsl(224 55% 12%)" };

function Section({
  type,
  icon,
  title,
  description,
  accent,
}: {
  type: "article" | "faq";
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: string;
}) {
  const qc = useQueryClient();
  const [newName, setNewName] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: categories = [], isLoading, isError } = useQuery({
    queryKey: ["categories", type],
    queryFn: () => getCategories(type),
  });

  const createMutation = useMutation({
    mutationFn: () => createCategory(newName.trim(), type, categories.length + 1),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories", type] });
      qc.invalidateQueries({ queryKey: ["categories"] });
      setNewName("");
      inputRef.current?.focus();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories", type] });
      qc.invalidateQueries({ queryKey: ["categories"] });
      setConfirmId(null);
    },
  });

  const reorderMutation = useMutation({
    mutationFn: reorderCategories,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories", type] }),
  });

  const moveItem = (item: ContentCategory, direction: "up" | "down") => {
    const idx = categories.findIndex((c) => c.id === item.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= categories.length) return;

    const a = categories[idx];
    const b = categories[swapIdx];
    const aOrder = a.sort_order;
    const bOrder = b.sort_order;

    if (aOrder === bOrder) {
      // Assign sequential values then swap
      const updates = categories.map((c, i) => ({ id: c.id, sort_order: (i + 1) * 10 }));
      const aUpd = updates.find((u) => u.id === a.id)!;
      const bUpd = updates.find((u) => u.id === b.id)!;
      [aUpd.sort_order, bUpd.sort_order] = [bUpd.sort_order, aUpd.sort_order];
      reorderMutation.mutate(updates);
    } else {
      reorderMutation.mutate([
        { id: a.id, sort_order: bOrder },
        { id: b.id, sort_order: aOrder },
      ]);
    }
  };

  const handleAdd = () => {
    if (!newName.trim() || createMutation.isPending) return;
    createMutation.mutate();
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.07)", boxShadow: "0 2px 12px -4px hsl(224 60% 12% / 0.06)" }}
    >
      {/* Section header */}
      <div
        className="px-6 py-5 flex items-center gap-3"
        style={{ borderBottom: "1px solid hsl(224 20% 12% / 0.07)", background: "hsl(220 25% 98%)" }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: accent + "14" }}
        >
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-[13.5px] font-medium" style={{ color: "hsl(224 55% 12%)" }}>{title}</p>
          <p className="text-[11px] font-light mt-0.5" style={{ color: "hsl(224 18% 52%)" }}>{description}</p>
        </div>
        <span
          className="px-2.5 py-1 rounded-full text-[11px] font-medium tabular-nums"
          style={{ background: accent + "12", color: accent }}
        >
          {categories.length}
        </span>
      </div>

      {/* Error state */}
      {isError && (
        <div className="px-6 py-4 flex items-center gap-2.5 text-[12px]"
          style={{ background: "hsl(38 80% 96%)", borderBottom: "1px solid hsl(38 70% 88%)", color: "hsl(30 70% 35%)" }}>
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          Table <code className="font-mono text-[11px] bg-white/60 px-1 rounded">content_categories</code> introuvable — exécutez le SQL de migration d'abord.
        </div>
      )}

      {/* Category list */}
      <div className="divide-y" style={{ borderColor: "hsl(224 20% 12% / 0.04)" }}>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin" style={{ color: "hsl(224 18% 65%)" }} />
          </div>
        ) : categories.length === 0 && !isError ? (
          <p className="text-center py-8 text-[13px] font-light" style={{ color: "hsl(224 18% 60%)" }}>
            Aucune catégorie — ajoutez-en une ci-dessous.
          </p>
        ) : (
          categories.map((cat, idx) => (
            <div
              key={cat.id}
              className="flex items-center gap-3 px-5 py-3.5 group"
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(220 30% 99%)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              {/* Reorder */}
              <div className="flex flex-col gap-0.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => moveItem(cat, "up")}
                  disabled={idx === 0 || reorderMutation.isPending}
                  className="p-0.5 rounded transition-all disabled:opacity-20"
                  style={{ color: "hsl(224 20% 60%)" }}
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(cat, "down")}
                  disabled={idx === categories.length - 1 || reorderMutation.isPending}
                  className="p-0.5 rounded transition-all disabled:opacity-20"
                  style={{ color: "hsl(224 20% 60%)" }}
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Name + slug */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium truncate" style={{ color: "hsl(224 50% 18%)" }}>
                  {cat.name}
                </p>
                <p className="text-[10px] font-mono font-light mt-0.5" style={{ color: "hsl(224 15% 58%)" }}>
                  {cat.slug}
                </p>
              </div>

              {/* Delete */}
              {confirmId === cat.id ? (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => deleteMutation.mutate(cat.id)}
                    disabled={deleteMutation.isPending}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-white disabled:opacity-60"
                    style={{ background: "hsl(0 60% 45%)" }}
                  >
                    {deleteMutation.isPending ? "…" : "Supprimer"}
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    className="px-2.5 py-1 rounded-lg text-[11px]"
                    style={{ color: "hsl(224 25% 52%)" }}
                  >
                    Annuler
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmId(cat.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all duration-150 flex-shrink-0"
                  style={{ color: "hsl(224 15% 65%)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(0 60% 45%)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "hsl(224 15% 65%)"; }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add new */}
      <div
        className="px-5 py-4 flex items-center gap-2"
        style={{ borderTop: "1px solid hsl(224 20% 12% / 0.07)", background: "hsl(220 25% 99%)" }}
      >
        <input
          ref={inputRef}
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdd(); } }}
          placeholder="Nom de la nouvelle catégorie…"
          className={inputClass + " flex-1"}
          style={{ ...inputStyle, paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
          disabled={createMutation.isPending}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!newName.trim() || createMutation.isPending}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-medium transition-all duration-200 disabled:opacity-40 flex-shrink-0"
          style={{ background: accent, color: "white" }}
          onMouseEnter={(e) => { if (!createMutation.isPending) (e.currentTarget as HTMLElement).style.opacity = "0.88"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
        >
          {createMutation.isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Plus className="w-3.5 h-3.5" />
          )}
          Ajouter
        </button>
      </div>
    </div>
  );
}

export default function AdminCategoriesList() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Tags className="w-6 h-6" style={{ color: "hsl(224 55% 28%)" }} />
          <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: "hsl(224 55% 12%)" }}>
            Catégories
          </h1>
        </div>
        <p className="text-[13px] font-light" style={{ color: "hsl(224 18% 50%)" }}>
          Créez et organisez les catégories utilisées dans les articles et la FAQ. Ces catégories s'affichent sur le site public.
        </p>
      </div>

      {/* SQL warning */}
      <div
        className="mb-6 px-4 py-3.5 rounded-xl text-[12px] leading-relaxed"
        style={{ background: "hsl(220 60% 97%)", border: "1px solid hsl(220 50% 88%)", color: "hsl(220 50% 35%)" }}
      >
        <p className="font-medium mb-1">⚡ Migration Supabase requise (à faire une seule fois)</p>
        <p className="font-light">Si les catégories ne s'affichent pas, exécutez le script SQL dans votre <strong>Supabase SQL Editor</strong>. Contactez votre développeur ou retrouvez le script dans la documentation du projet.</p>
      </div>

      <div className="flex flex-col gap-6">
        <Section
          type="article"
          icon={<FileText className="w-4.5 h-4.5" style={{ color: "hsl(224 55% 32%)" }} />}
          title="Catégories des articles"
          description="Utilisées dans la page Actualités pour filtrer et classer les articles."
          accent="hsl(224 55% 30%)"
        />
        <Section
          type="faq"
          icon={<HelpCircle className="w-4.5 h-4.5" style={{ color: "hsl(218 50% 38%)" }} />}
          title="Catégories de la FAQ"
          description="Utilisées pour regrouper les questions dans la page FAQ."
          accent="hsl(218 50% 38%)"
        />
      </div>
    </div>
  );
}
