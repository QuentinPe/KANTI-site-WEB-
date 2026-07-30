import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Star, ChevronUp, ChevronDown } from "lucide-react";
import { getArticles, deleteArticle, reorderArticles } from "@/lib/articlesService";
import type { Article } from "@/lib/articlesService";
import {
  GLASS, INNER_BG, INNER_BORDER,
  T_PRIMARY, T_SECONDARY, T_MUTED, T_HEADING, T_LABEL,
  C_BLUE, C_GOLD, C_CORAL,
} from "@/lib/adminTheme";

export default function AdminArticlesList() {
  const qc = useQueryClient();
  const { data: articles = [], isLoading, isError } = useQuery({
    queryKey: ["articles"],
    queryFn: getArticles,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["articles"] }),
  });

  const reorderMutation = useMutation({
    mutationFn: reorderArticles,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["articles"] }),
  });

  const handleDelete = (article: Article) => {
    if (!window.confirm(`Supprimer "${article.title}" ? Cette action est irréversible.`)) return;
    deleteMutation.mutate(article.id);
  };

  const moveArticle = (article: Article, direction: "up" | "down") => {
    const idx = articles.findIndex((a) => a.id === article.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= articles.length) return;

    const a = articles[idx];
    const b = articles[swapIdx];
    const aOrder = a.sort_order ?? 0;
    const bOrder = b.sort_order ?? 0;

    if (aOrder === bOrder) {
      // First-time ordering: assign sequential values to all, then swap
      const updates = articles.map((art, i) => ({ id: art.id, sort_order: (i + 1) * 10 }));
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

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: T_PRIMARY }}>
            Articles
          </h1>
          <p className="text-[13px] font-light mt-1" style={{ color: T_SECONDARY }}>
            {articles.length} article{articles.length !== 1 ? "s" : ""} · utilisez ↑↓ pour modifier l'ordre d'affichage
          </p>
        </div>
        <Link
          to="/admin/articles/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200"
          style={{ background: `hsl(215 42% 65% / 0.18)`, color: C_BLUE }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(215 42% 65% / 0.28)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(215 42% 65% / 0.18)"; }}
        >
          <Plus className="w-4 h-4" />
          Nouvel article
        </Link>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div
            className="w-7 h-7 rounded-full border-2 animate-spin"
            style={{ borderColor: T_MUTED, borderTopColor: T_SECONDARY }}
          />
        </div>
      )}

      {isError && (
        <div
          className="py-8 px-6 rounded-2xl text-[14px]"
          style={{ background: "hsl(5 45% 56% / 0.12)", color: C_CORAL }}
        >
          Impossible de charger les articles. Vérifiez votre connexion Supabase.
        </div>
      )}

      {!isLoading && !isError && articles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-[15px] font-light mb-2" style={{ color: T_SECONDARY }}>Aucun article pour l'instant.</p>
          <Link to="/admin/articles/new" className="text-[13px] underline underline-offset-3" style={{ color: C_BLUE }}>
            Créer le premier article
          </Link>
        </div>
      )}

      {articles.length > 0 && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ ...GLASS, borderRadius: "1rem", overflow: "hidden" }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${INNER_BORDER}`, background: INNER_BG }}>
                <th className="w-12 px-3 py-3" />
                <th className="text-left px-4 py-3 text-[11px] tracking-[0.22em] uppercase font-medium" style={{ color: T_LABEL }}>
                  Titre
                </th>
                <th className="text-left px-4 py-3 text-[11px] tracking-[0.22em] uppercase font-medium hidden md:table-cell" style={{ color: T_LABEL }}>
                  Catégorie
                </th>
                <th className="text-left px-4 py-3 text-[11px] tracking-[0.22em] uppercase font-medium hidden lg:table-cell" style={{ color: T_LABEL }}>
                  Date
                </th>
                <th className="text-center px-4 py-3 text-[11px] tracking-[0.22em] uppercase font-medium hidden md:table-cell" style={{ color: T_LABEL }}>
                  Une
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: INNER_BORDER }}>
              {articles.map((a, idx) => (
                <tr
                  key={a.id}
                  className="transition-colors duration-150 group"
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  {/* Reorder */}
                  <td className="px-3 py-2">
                    <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => moveArticle(a, "up")}
                        disabled={idx === 0 || reorderMutation.isPending}
                        className="p-0.5 rounded transition-all disabled:opacity-20"
                        style={{ color: T_SECONDARY }}
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveArticle(a, "down")}
                        disabled={idx === articles.length - 1 || reorderMutation.isPending}
                        className="p-0.5 rounded transition-all disabled:opacity-20"
                        style={{ color: T_SECONDARY }}
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-[13px] font-medium line-clamp-1" style={{ color: T_HEADING }}>
                      {a.title}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span
                      className="inline-block px-2.5 py-1 rounded-full text-[10px] tracking-[0.18em] uppercase font-medium"
                      style={{ background: "hsl(215 42% 65% / 0.15)", color: C_BLUE }}
                    >
                      {a.tag}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <span className="text-[12px] font-light" style={{ color: T_MUTED }}>{a.date}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center hidden md:table-cell">
                    {a.featured && <Star className="w-3.5 h-3.5 mx-auto" style={{ color: C_GOLD, fill: C_GOLD }} />}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        to={`/admin/articles/${a.id}/edit`}
                        className="p-2 rounded-lg transition-all duration-150"
                        style={{ color: C_BLUE }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(215 42% 65% / 0.15)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(a)}
                        disabled={deleteMutation.isPending}
                        className="p-2 rounded-lg transition-all duration-150"
                        style={{ color: C_CORAL }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(5 45% 56% / 0.12)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}