import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Scale, ExternalLink } from "lucide-react";
import { getLegalContent, updateLegalContent } from "@/lib/legalService";
import RichEditor from "@/components/admin/RichEditor";

const PAGE_META: Record<string, { label: string; publicPath: string }> = {
  "mentions-legales": { label: "Mentions légales", publicPath: "/mentions-legales" },
  "confidentialite": { label: "Politique de confidentialité", publicPath: "/politique-de-confidentialite" },
  "reclamations": { label: "Réclamations & médiation", publicPath: "/reclamations" },
};

export default function AdminLegalForm() {
  const { pageKey = "" } = useParams<{ pageKey: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const meta = PAGE_META[pageKey] ?? { label: pageKey, publicPath: "/" };

  const [subtitle, setSubtitle] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-legal", pageKey],
    queryFn: () => getLegalContent(pageKey),
    enabled: Boolean(pageKey),
  });

  useEffect(() => {
    if (data) {
      setSubtitle(data.subtitle ?? "");
      setContentHtml(data.content_html ?? "");
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => updateLegalContent(pageKey, { content_html: contentHtml, subtitle }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-legal"] });
      qc.invalidateQueries({ queryKey: ["legal", pageKey] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
    onError: (e) => {
      const o = e as Record<string, unknown>;
      const msg = e instanceof Error ? e.message : (typeof o?.message === "string" ? o.message : JSON.stringify(e));
      setError("Erreur lors de l'enregistrement : " + msg);
    },
  });

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-[14px] font-light outline-none transition-all";
  const inputStyle = { border: "1px solid hsl(224 20% 12% / 0.15)", color: "hsl(224 40% 18%)" };
  const labelCls = "block text-[11px] font-medium tracking-wide uppercase mb-1.5";
  const labelStyle = { color: "hsl(224 20% 50%)" };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/admin/legal")}
        className="flex items-center gap-2 text-[13px] font-medium mb-6 transition-opacity hover:opacity-70"
        style={{ color: "hsl(224 40% 40%)" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Mentions légales
      </button>

      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-2.5">
          <Scale className="w-5 h-5" style={{ color: "hsl(224 55% 32%)" }} />
          <div>
            <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: "hsl(224 55% 14%)" }}>
              {meta.label}
            </h1>
            {data?.updated_at && (
              <p className="text-[11px] font-light mt-0.5" style={{ color: "hsl(224 20% 55%)" }}>
                Dernière mise à jour : {formatDate(data.updated_at)}
              </p>
            )}
          </div>
        </div>
        <a
          href={meta.publicPath}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[12px] font-medium transition-opacity hover:opacity-70"
          style={{ color: "hsl(224 40% 40%)" }}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Voir la page
        </a>
      </div>

      {isLoading ? (
        <div className="py-16 flex justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-foreground/15 border-t-foreground/60 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Info banner */}
          <div
            className="px-4 py-3 rounded-xl text-[13px] font-light"
            style={{ background: "hsl(218 45% 95%)", color: "hsl(218 45% 30%)", border: "1px solid hsl(218 45% 85%)" }}
          >
            Si le champ ci-dessous est vide, la page affiche son contenu par défaut. Dès qu'un contenu est enregistré ici, il remplace le contenu par défaut sur la page publique.
          </div>

          {/* Subtitle */}
          <div>
            <label className={labelCls} style={labelStyle}>Sous-titre de la page</label>
            <input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className={inputCls}
              style={inputStyle}
              placeholder="Description courte affichée sous le titre…"
            />
          </div>

          {/* Content editor */}
          <div>
            <label className={labelCls} style={labelStyle}>Contenu de la page</label>
            <RichEditor value={contentHtml} onChange={setContentHtml} />
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-xl text-[13px]" style={{ background: "hsl(0 90% 96%)", color: "hsl(0 65% 40%)" }}>
              {error}
            </div>
          )}

          {/* Success */}
          {saved && (
            <div className="px-4 py-3 rounded-xl text-[13px]" style={{ background: "hsl(142 50% 95%)", color: "hsl(142 50% 30%)" }}>
              Contenu enregistré et publié sur {meta.publicPath}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => { setError(null); mutation.mutate(); }}
              disabled={mutation.isPending}
              className="px-6 py-2.5 rounded-xl text-[13px] font-medium text-white transition-opacity disabled:opacity-60"
              style={{ background: "hsl(224 60% 18%)" }}
            >
              {mutation.isPending ? "Enregistrement…" : "Enregistrer & publier"}
            </button>
            <button
              onClick={() => navigate("/admin/legal")}
              className="px-5 py-2.5 rounded-xl text-[13px] font-medium transition-colors"
              style={{ color: "hsl(224 20% 45%)", border: "1px solid hsl(224 20% 80%)" }}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
