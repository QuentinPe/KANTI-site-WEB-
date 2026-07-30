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
import {
  GLASS, INNER_BG, INNER_BORDER,
  T_PRIMARY, T_SECONDARY, T_MUTED, T_HEADING,
  C_BLUE, C_GOLD, C_CORAL, C_TEAL,
  INPUT_STYLE,
} from "@/lib/adminTheme";

const inputClass = "w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all duration-150";

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
      style={{ ...GLASS }}
    >
      {/* Section header */}
      <div
        className="px-6 py-5 flex items-center gap-3"
        style={{ borderBottom: `1px solid ${INNER_BORDER}`, background: INNER_BG }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.1)" }}
        >
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-[13.5px] font-medium" style={{ color: T_HEADING }}>{title}</p>
          <p className="text-[11px] font-light mt-0.5" style={{ color: T_SECONDARY }}>{description}</p>
        </div>
        <span
          className="px-2.5 py-1 rounded-full text-[11px] font-medium tabular-nums"
          style={{ background: "rgba(255,255,255,0.1)", color: accent }}
        >
          {categories.length}
        </span>
      </div>

      {/* Error state */}
      {isError && (
        <div className="px-6 py-4 flex items-center gap-2.5 text-[12px]"
          style={{ background: INNER_BG, borderBottom: `1px solid ${INNER_BORDER}`, color: C_GOLD }}>
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          Table <code className="font-mono text-[11px] px-1 rounded" style={{ background: "rgba(255,255,255,0.1)" }}>content_categories</code> introuvable · exécutez le SQL de migration d'abord.
        </div>
      )}

      {/* Category list */}
      <div className="divide-y" style={{ borderColor: INNER_BORDER }}>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin" style={{ color: T_MUTED }} />
          </div>
        ) : categories.length === 0 && !isError ? (
          <p className="text-center py-8 text-[13px] font-light" style={{ color: T_MUTED }}>
            Aucune catégorie · ajoutez-en une ci-dessous.
          </p>
        ) : (
          categories.map((cat, idx) => (
            <div
              key={cat.id}
              className="flex items-center gap-3 px-5 py-3.5 group"
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              {/* Reorder */}
              <div className="flex flex-col gap-0.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => moveItem(cat, "up")}
                  disabled={idx === 0 || reorderMutation.isPending}
                  className="p-0.5 rounded transition-all disabled:opacity-20"
                  style={{ color: T_MUTED }}
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(cat, "down")}
                  disabled={idx === categories.length - 1 || reorderMutation.isPending}
                  className="p-0.5 rounded transition-all disabled:opacity-20"
                  style={{ color: T_MUTED }}
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Name + slug */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium truncate" style={{ color: T_PRIMARY }}>
                  {cat.name}
                </p>
                <p className="text-[10px] font-mono font-light mt-0.5" style={{ color: T_MUTED }}>
                  {cat.slug}
                </p>
              </div>

              {/* Delete */}
              {confirmId === cat.id ? (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => deleteMutation.mutate(cat.id)}
                    disabled={deleteMutation.isPending}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium disabled:opacity-60"
                    style={{ background: "rgba(255,255,255,0.1)", color: C_CORAL }}
                  >
                    {deleteMutation.isPending ? "…" : "Supprimer"}
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    className="px-2.5 py-1 rounded-lg text-[11px]"
                    style={{ color: T_SECONDARY }}
                  >
                    Annuler
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmId(cat.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all duration-150 flex-shrink-0"
                  style={{ color: T_MUTED }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = C_CORAL; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = T_MUTED; }}
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
        style={{ borderTop: `1px solid ${INNER_BORDER}`, background: INNER_BG }}
      >
        <input
          ref={inputRef}
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdd(); } }}
          placeholder="Nom de la nouvelle catégorie…"
          className={inputClass + " flex-1"}
          style={{ ...INPUT_STYLE, paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
          disabled={createMutation.isPending}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!newName.trim() || createMutation.isPending}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-medium transition-all duration-200 disabled:opacity-40 flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.12)", color: accent }}
          onMouseEnter={(e) => { if (!createMutation.isPending) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.18)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)"; }}
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
          <Tags className="w-6 h-6" style={{ color: C_BLUE }} />
          <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: T_PRIMARY }}>
            Catégories
          </h1>
        </div>
        <p className="text-[13px] font-light" style={{ color: T_SECONDARY }}>
          Créez et organisez les catégories utilisées dans les articles et la FAQ. Ces catégories s'affichent sur le site public.
        </p>
      </div>

      {/* SQL warning */}
      <div
        className="mb-6 px-4 py-3.5 rounded-xl text-[12px] leading-relaxed"
        style={{ background: INNER_BG, border: `1px solid ${INNER_BORDER}`, color: T_SECONDARY }}
      >
        <p className="font-medium mb-1" style={{ color: C_GOLD }}>⚡ Migration Supabase requise (à faire une seule fois)</p>
        <p className="font-light">Si les catégories ne s'affichent pas, exécutez le script SQL dans votre <strong>Supabase SQL Editor</strong>. Contactez votre développeur ou retrouvez le script dans la documentation du projet.</p>
      </div>

      <div className="flex flex-col gap-6">
        <Section
          type="article"
          icon={<FileText className="w-4.5 h-4.5" style={{ color: C_BLUE }} />}
          title="Catégories des articles"
          description="Utilisées dans la page Actualités pour filtrer et classer les articles."
          accent={C_BLUE}
        />
        <Section
          type="faq"
          icon={<HelpCircle className="w-4.5 h-4.5" style={{ color: C_TEAL }} />}
          title="Catégories de la FAQ"
          description="Utilisées pour regrouper les questions dans la page FAQ."
          accent={C_TEAL}
        />
      </div>
    </div>
  );
}
