import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, Star, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { getAllRessources } from "@/lib/ressourcesService";
import { getSiteSettingsMap, upsertSettings } from "@/lib/siteSettingsService";
import {
  GLASS, INNER_BG, INNER_BORDER,
  T_PRIMARY, T_SECONDARY, T_MUTED, T_HEADING, T_LABEL,
  C_BLUE, C_GOLD, C_SAGE,
  INPUT_STYLE,
} from "@/lib/adminTheme";

const DEFAULT_BULLETS = [
  "Comprendre les règles clés de la transmission",
  "Optimiser la fiscalité et réduire les droits",
  "Protéger vos proches et sécuriser l'avenir",
  "Anticiper les changements législatifs",
];
const DEFAULT_CHECKLIST = [
  "28 pages d'expertise",
  "Exemples concrets",
  "Checklists & schémas",
  "À jour des dernières lois",
];

function Card({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-7" style={{ ...GLASS, borderRadius: "1rem", overflow: "hidden" }}>
      <h2 className="text-[14px] font-medium mb-1" style={{ color: T_HEADING }}>{title}</h2>
      <p className="text-[12px] font-light mb-5" style={{ color: T_SECONDARY }}>{sub}</p>
      {children}
    </div>
  );
}

export default function AdminFeaturedResource() {
  const qc = useQueryClient();
  const [featuredId, setFeaturedId] = useState("");
  const [bullets, setBullets] = useState<string[]>(DEFAULT_BULLETS);
  const [checklist, setChecklist] = useState<string[]>(DEFAULT_CHECKLIST);

  const { data: ressources = [] } = useQuery({
    queryKey: ["ressources-admin"],
    queryFn: getAllRessources,
  });

  const { data: settings = {}, isLoading: settingsLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: getSiteSettingsMap,
    staleTime: 10_000,
  });

  useEffect(() => {
    if (settingsLoading) return;
    if (settings["featured_resource_id"]) setFeaturedId(settings["featured_resource_id"]);
    if (settings["featured_bullets"]) {
      try { setBullets(JSON.parse(settings["featured_bullets"])); } catch {}
    }
    if (settings["featured_checklist"]) {
      try { setChecklist(JSON.parse(settings["featured_checklist"])); } catch {}
    }
  }, [settings, settingsLoading]);

  const saveMutation = useMutation({
    mutationFn: () =>
      upsertSettings({
        featured_resource_id: featuredId,
        featured_bullets: JSON.stringify(bullets),
        featured_checklist: JSON.stringify(checklist),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site-settings"] });
      toast.success("Mise en avant sauvegardée !");
    },
    onError: () => toast.error("Erreur lors de la sauvegarde."),
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/admin/ressources"
          className="p-2 rounded-lg transition-colors"
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: T_LABEL }} />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4" fill="currentColor" style={{ color: C_GOLD }} />
            <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: T_PRIMARY }}>
              Ressource mise en avant
            </h1>
          </div>
          <p className="text-[13px] font-light mt-1" style={{ color: T_SECONDARY }}>
            Choisissez la ressource et personnalisez le texte de l'encart de mise en avant.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Resource selector */}
        <Card
          title="Ressource sélectionnée"
          sub="Cette ressource sera mise en avant sur la page Ressources."
        >
          <select
            value={featuredId}
            onChange={(e) => setFeaturedId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-[13px] outline-none"
            style={{ ...INPUT_STYLE, appearance: "none", cursor: "pointer" }}
          >
            <option value="">Sélectionnez une ressource…</option>
            {ressources.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}{r.pages ? ` · ${r.pages}p` : ""}
              </option>
            ))}
          </select>
        </Card>

        {/* Bullets */}
        <Card
          title="Points clés (colonne gauche)"
          sub="Affichés avec des coches bleues dans l'encart de mise en avant."
        >
          <div className="space-y-3">
            {bullets.map((b, i) => (
              <div key={i} className="flex items-center gap-3">
                <span
                  className="text-[11px] font-semibold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `rgba(100,140,210,0.18)`, color: C_BLUE }}
                >
                  {i + 1}
                </span>
                <input
                  type="text"
                  value={b}
                  onChange={(e) => setBullets((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))}
                  placeholder={`Point clé ${i + 1}`}
                  className="flex-1 px-3.5 py-2.5 rounded-xl text-[13px] outline-none"
                  style={INPUT_STYLE}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Checklist */}
        <Card
          title="Caractéristiques (colonne droite)"
          sub="Affichées avec des cercles verts dans l'encart de mise en avant."
        >
          <div className="space-y-3">
            {checklist.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2
                  className="w-4 h-4 flex-shrink-0"
                  strokeWidth={1.5}
                  style={{ color: C_SAGE }}
                />
                <input
                  type="text"
                  value={item}
                  onChange={(e) => setChecklist((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))}
                  placeholder={`Caractéristique ${i + 1}`}
                  className="flex-1 px-3.5 py-2.5 rounded-xl text-[13px] outline-none"
                  style={INPUT_STYLE}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Save */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-[12px] font-light" style={{ color: T_MUTED }}>
            Les modifications sont appliquées immédiatement sur la page publique.
          </p>
          <button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending || !featuredId}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[13px] font-medium transition-all duration-200 disabled:opacity-50"
            style={{ background: "rgba(100,140,210,0.18)", color: C_BLUE, border: `1px solid rgba(100,140,210,0.25)` }}
          >
            <Save className="w-4 h-4" />
            {saveMutation.isPending ? "Sauvegarde…" : "Sauvegarder"}
          </button>
        </div>
      </div>
    </div>
  );
}