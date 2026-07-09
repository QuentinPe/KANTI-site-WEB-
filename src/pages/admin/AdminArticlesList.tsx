import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { getArticles, deleteArticle } from "@/lib/articlesService";
import type { Article } from "@/lib/articlesService";

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

  const handleDelete = (article: Article) => {
    if (!window.confirm(`Supprimer "${article.title}" ? Cette action est irréversible.`)) return;
    deleteMutation.mutate(article.id);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: "hsl(224 55% 12%)" }}>
            Articles
          </h1>
          <p className="text-[13px] font-light mt-1" style={{ color: "hsl(224 18% 50%)" }}>
            {articles.length} article{articles.length !== 1 ? "s" : ""} publié{articles.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          to="/admin/articles/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200"
          style={{ background: "hsl(224 60% 18%)", color: "white" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 60% 14%)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 60% 18%)"; }}
        >
          <Plus className="w-4 h-4" />
          Nouvel article
        </Link>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 rounded-full border-2 border-foreground/15 border-t-foreground/60 animate-spin" />
        </div>
      )}

      {isError && (
        <div className="py-8 px-6 rounded-2xl text-[14px]" style={{ background: "hsl(0 60% 96%)", color: "hsl(0 60% 40%)" }}>
          Impossible de charger les articles. Vérifiez votre connexion Supabase.
        </div>
      )}

      {!isLoading && !isError && articles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-[15px] font-light mb-2" style={{ color: "hsl(224 18% 50%)" }}>Aucun article pour l'instant.</p>
          <Link to="/admin/articles/new" className="text-[13px] underline underline-offset-3" style={{ color: "hsl(224 55% 35%)" }}>
            Créer le premier article
          </Link>
        </div>
      )}

      {articles.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid hsl(224 20% 12% / 0.08)" }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid hsl(224 20% 12% / 0.07)", background: "hsl(220 25% 98%)" }}>
                <th className="text-left px-5 py-3 text-[11px] tracking-[0.22em] uppercase font-medium" style={{ color: "hsl(224 18% 50%)" }}>
                  Titre
                </th>
                <th className="text-left px-4 py-3 text-[11px] tracking-[0.22em] uppercase font-medium hidden md:table-cell" style={{ color: "hsl(224 18% 50%)" }}>
                  Tag
                </th>
                <th className="text-left px-4 py-3 text-[11px] tracking-[0.22em] uppercase font-medium hidden lg:table-cell" style={{ color: "hsl(224 18% 50%)" }}>
                  Date
                </th>
                <th className="text-center px-4 py-3 text-[11px] tracking-[0.22em] uppercase font-medium hidden md:table-cell" style={{ color: "hsl(224 18% 50%)" }}>
                  Une
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y" style={{ borderColor: "hsl(224 20% 12% / 0.05)" }}>
              {articles.map((a) => (
                <tr
                  key={a.id}
                  className="transition-colors duration-150"
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(220 30% 99%)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "white"; }}
                >
                  <td className="px-5 py-3.5">
                    <p className="text-[13px] font-medium line-clamp-1" style={{ color: "hsl(224 55% 12%)" }}>
                      {a.title}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span
                      className="inline-block px-2.5 py-1 rounded-full text-[10px] tracking-[0.18em] uppercase font-medium"
                      style={{ background: "hsl(224 60% 18% / 0.08)", color: "hsl(224 55% 28%)" }}
                    >
                      {a.tag}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <span className="text-[12px] font-light" style={{ color: "hsl(224 18% 52%)" }}>{a.date}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center hidden md:table-cell">
                    {a.featured && <Star className="w-3.5 h-3.5 mx-auto" style={{ color: "hsl(38 90% 50%)", fill: "hsl(38 90% 50%)" }} />}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        to={`/admin/articles/${a.id}/edit`}
                        className="p-2 rounded-lg transition-all duration-150"
                        style={{ color: "hsl(224 40% 45%)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(224 60% 18% / 0.08)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(a)}
                        disabled={deleteMutation.isPending}
                        className="p-2 rounded-lg transition-all duration-150"
                        style={{ color: "hsl(0 60% 50%)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(0 60% 50% / 0.08)"; }}
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
