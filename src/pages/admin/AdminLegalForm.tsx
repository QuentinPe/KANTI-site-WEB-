import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Scale, ExternalLink } from "lucide-react";
import { getLegalContent, updateLegalContent } from "@/lib/legalService";
import RichEditor from "@/components/admin/RichEditor";
import {
  INNER_BORDER,
  T_PRIMARY, T_SECONDARY, T_MUTED, T_LABEL,
  C_BLUE, C_SAGE, C_CORAL,
  INPUT_STYLE,
} from "@/lib/adminTheme";

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
  const labelCls = "block text-[11px] font-medium tracking-wide uppercase mb-1.5";

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/admin/legal")}
        className="flex items-center gap-2 text-[13px] font-medium mb-6 transition-opacity hover:opacity-70"
        style={{ color: T_SECONDARY }}
      >
        <ArrowLeft className="w-4 h-4" />
        Mentions légales
      </button>

      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-2.5">
          <Scale className="w-5 h-5" style={{ color: C_BLUE }} />
          <div>
            <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: T_PRIMARY }}>
              {meta.label}
            </h1>
            {data?.updated_at && (
              <p className="text-[11px] font-light mt-0.5" style={{ color: T_MUTED }}>
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
          style={{ color: T_SECONDARY }}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Voir la page
        </a>
      </div>

      {isLoading ? (
        <div className="py-16 flex justify-center">
          <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: "rgba(255,255,255,0.15)", borderTopColor: "rgba(255,255,255,0.6)" }} />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Info banner */}
          <div
            className="px-4 py-3 rounded-xl text-[13px] font-light"
            style={{ background: "hsla(215,42%,65%,0.12)", color: C_BLUE, border: `1px solid hsla(215,42%,65%,0.25)` }}
          >
            Si le champ ci-dessous est vide, la page affiche son contenu par défaut. Dès qu'un contenu est enregistré ici, il remplace le contenu par défaut sur la page publique.
          </div>

          {/* Subtitle */}
          <div>
            <label className={labelCls} style={{ color: T_LABEL }}>Sous-titre de la page</label>
            <input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className={inputCls}
              style={{ ...INPUT_STYLE }}
              placeholder="Description courte affichée sous le titre…"
            />
          </div>

          {/* Content editor */}
          <div>
            <label className={labelCls} style={{ color: T_LABEL }}>Contenu de la page</label>
            <RichEditor value={contentHtml} onChange={setContentHtml} />
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-xl text-[13px]" style={{ background: "hsla(5,45%,56%,0.12)", color: C_CORAL, border: `1px solid hsla(5,45%,56%,0.25)` }}>
              {error}
            </div>
          )}

          {/* Success */}
          {saved && (
            <div className="px-4 py-3 rounded-xl text-[13px]" style={{ background: "hsla(158,32%,56%,0.12)", color: C_SAGE, border: `1px solid hsla(158,32%,56%,0.25)` }}>
              Contenu enregistré et publié sur {meta.publicPath}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => { setError(null); mutation.mutate(); }}
              disabled={mutation.isPending}
              className="px-6 py-2.5 rounded-xl text-[13px] font-medium transition-opacity disabled:opacity-60"
              style={{ background: "hsla(215,42%,65%,0.18)", color: C_BLUE, border: `1px solid hsla(215,42%,65%,0.30)` }}
            >
              {mutation.isPending ? "Enregistrement…" : "Enregistrer & publier"}
            </button>
            <button
              onClick={() => navigate("/admin/legal")}
              className="px-5 py-2.5 rounded-xl text-[13px] font-medium transition-colors"
              style={{ color: T_SECONDARY, border: `1px solid ${INNER_BORDER}` }}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}