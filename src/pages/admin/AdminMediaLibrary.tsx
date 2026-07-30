import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Upload, Copy, Trash2, Image as ImageIcon, Check, AlertCircle,
  X, Download, FileText, Users, User, Search, ArrowRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { getArticles, updateArticle } from "@/lib/articlesService";
import { getAllTeamMembers, updateTeamMember } from "@/lib/teamService";
import { getAllCasClients, updateCasClient } from "@/lib/casClientsService";
import {
  GLASS, INNER_BG, INNER_BORDER,
  T_PRIMARY, T_SECONDARY, T_MUTED, T_HEADING, T_LABEL,
  C_BLUE, C_GOLD, C_SAGE, C_CORAL, cA,
} from "@/lib/adminTheme";

const BUCKET = "article-images";

// ── Types ──────────────────────────────────────────────────────────────────────

interface MediaFile {
  name: string;
  id: string | undefined;
  updated_at: string | undefined;
  url: string;
  size?: number;
}

type PickTarget = "article" | "team" | "cas-client";

// ── Service helpers ────────────────────────────────────────────────────────────

async function listMedia(): Promise<MediaFile[]> {
  const { data, error } = await supabase.storage.from(BUCKET).list("", {
    limit: 200,
    sortBy: { column: "updated_at", order: "desc" },
  });
  if (error) throw error;
  return (data ?? [])
    .filter((f) => !f.name.startsWith(".") && f.name !== ".emptyFolderPlaceholder")
    .map((f) => ({
      name: f.name,
      id: f.id,
      updated_at: f.updated_at,
      size: f.metadata?.size,
      url: supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
    }));
}

async function uploadMedia(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(name, file, { contentType: file.type });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(name).data.publicUrl;
}

async function deleteMedia(name: string): Promise<void> {
  // Try direct SDK first (requires a Supabase Storage DELETE RLS policy)
  const { error: sdkErr } = await supabase.storage.from(BUCKET).remove([name]);
  if (!sdkErr) return;

  // Fallback: Edge Function with service_role key (requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in Vercel)
  const res = await fetch("/api/delete-media", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    // Surface the original SDK error if the API also fails
    throw new Error(err.error ?? sdkErr.message ?? "Erreur de suppression");
  }
}

async function downloadFile(url: string, name: string): Promise<void> {
  const res = await fetch(url);
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
}

// ── SQL setup hint ─────────────────────────────────────────────────────────────

const SQL_LS_KEY = "kanti-media-sql-hint-dismissed";

const SQL_POLICY = `-- Run once in Supabase SQL Editor to enable delete
CREATE POLICY "Admins can delete from article-images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'article-images');`;

function SqlHint() {
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(SQL_LS_KEY) === "1"; }
    catch { return false; }
  });
  const [copied, setCopied] = useState(false);

  if (dismissed) return null;

  const copy = () => {
    navigator.clipboard.writeText(SQL_POLICY).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const dismiss = () => {
    try { localStorage.setItem(SQL_LS_KEY, "1"); } catch { /* noop */ }
    setDismissed(true);
  };

  return (
    <div className="rounded-xl p-4 mb-5 flex gap-3 items-start"
      style={{ background: cA(C_BLUE, 0.08), border: `1px solid ${cA(C_BLUE, 0.20)}` }}>
      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: C_BLUE }} />
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium mb-1" style={{ color: T_HEADING }}>
          Autoriser la suppression de fichiers
        </p>
        <p className="text-[11px] font-light mb-3 leading-relaxed" style={{ color: T_SECONDARY }}>
          Exécutez cette requête <strong className="font-medium" style={{ color: T_HEADING }}>une seule fois</strong> dans l'éditeur SQL Supabase pour activer la suppression.
        </p>
        <div className="rounded-lg px-3 py-2 font-mono text-[10px] leading-relaxed mb-3 overflow-x-auto"
          style={{ background: INNER_BG, border: `1px solid ${INNER_BORDER}`, color: T_LABEL, whiteSpace: "pre" }}>
          {SQL_POLICY}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={copy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors"
            style={{ background: cA(C_BLUE, 0.18), color: C_BLUE, border: `1px solid ${cA(C_BLUE, 0.30)}` }}>
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copié !" : "Copier le SQL"}
          </button>
          <button onClick={dismiss}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-medium"
            style={{ color: T_MUTED }}>
            <X className="w-3 h-3" />
            Masquer
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Picker modal ───────────────────────────────────────────────────────────────

function PickerModal({
  imageUrl,
  target,
  onClose,
}: {
  imageUrl: string;
  target: PickTarget;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: articles = [] } = useQuery({
    queryKey: ["articles"], queryFn: getArticles, enabled: target === "article",
  });
  const { data: teamMembers = [] } = useQuery({
    queryKey: ["team-all"], queryFn: getAllTeamMembers, enabled: target === "team",
  });
  const { data: casClients = [] } = useQuery({
    queryKey: ["cas-clients-all"], queryFn: getAllCasClients, enabled: target === "cas-client",
  });

  const articleMutation = useMutation({
    mutationFn: (id: string) => updateArticle(id, { image: imageUrl }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["articles"] }); toast.success("Couverture d'article mise à jour"); onClose(); },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });
  const teamMutation = useMutation({
    mutationFn: (id: string) => updateTeamMember(id, { image: imageUrl }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["team-all"] }); toast.success("Photo de membre mise à jour"); onClose(); },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });
  const casMutation = useMutation({
    mutationFn: (id: string) => updateCasClient(id, { image: imageUrl }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["cas-clients-all"] }); toast.success("Photo de cas client mise à jour"); onClose(); },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });

  const isPending = articleMutation.isPending || teamMutation.isPending || casMutation.isPending;

  const TITLES: Record<PickTarget, string> = {
    "article":    "Couverture · Article",
    "team":       "Photo · Membre d'équipe",
    "cas-client": "Photo · Cas client",
  };

  type Item = { id: string; label: string; image: string | null };
  const items: Item[] = (() => {
    if (target === "article")
      return articles.map((a) => ({ id: a.id, label: a.title, image: a.image }));
    if (target === "team")
      return teamMembers.map((m) => ({ id: m.id, label: `${m.name} · ${m.role}`, image: m.image }));
    return casClients.map((c) => ({ id: c.id, label: `${c.profil} · ${c.category_label}`, image: c.image ?? null }));
  })();

  const filtered = items.filter((i) => i.label.toLowerCase().includes(search.toLowerCase()));

  const handlePick = (id: string) => {
    if (target === "article") articleMutation.mutate(id);
    else if (target === "team") teamMutation.mutate(id);
    else casMutation.mutate(id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(8,11,22,0.72)", backdropFilter: "blur(12px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden flex flex-col"
        style={{ ...GLASS, maxHeight: "80vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${INNER_BORDER}` }}>
          <p className="text-[14px] font-medium" style={{ color: T_HEADING }}>{TITLES[target]}</p>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: T_MUTED }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preview */}
        <div className="px-6 pt-4 pb-3 flex items-center gap-3" style={{ borderBottom: `1px solid ${INNER_BORDER}` }}>
          <img
            src={imageUrl}
            alt="preview"
            className="w-16 h-11 rounded-lg object-cover flex-shrink-0"
            style={{ border: `1px solid ${INNER_BORDER}` }}
          />
          <div>
            <p className="text-[11px] font-medium" style={{ color: T_LABEL }}>Image à assigner</p>
            <p className="text-[10px] mt-0.5" style={{ color: T_MUTED }}>
              Sélectionnez un élément ci-dessous pour lui affecter cette image
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="px-6 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: T_MUTED }} />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-[12px] rounded-xl"
              style={{ background: INNER_BG, border: `1px solid ${INNER_BORDER}`, color: T_PRIMARY, outline: "none" }}
            />
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 px-6 pb-5" style={{ scrollbarWidth: "thin" }}>
          {filtered.length === 0 ? (
            <p className="text-center py-8 text-[12px]" style={{ color: T_MUTED }}>Aucun résultat</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handlePick(item.id)}
                  disabled={isPending}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-all duration-150 disabled:opacity-50"
                  style={{ background: INNER_BG, border: `1px solid ${INNER_BORDER}` }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.11)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt=""
                      className="w-10 h-8 rounded-lg object-cover flex-shrink-0"
                      style={{ border: `1px solid ${INNER_BORDER}` }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = "hidden"; }}
                    />
                  ) : (
                    <div
                      className="w-10 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${INNER_BORDER}` }}
                    >
                      <ImageIcon className="w-3.5 h-3.5" style={{ color: T_MUTED }} />
                    </div>
                  )}
                  <span className="flex-1 text-[12px] font-light truncate" style={{ color: T_HEADING }}>
                    {item.label}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-35 flex-shrink-0" style={{ color: T_SECONDARY }} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── File card ──────────────────────────────────────────────────────────────────

function FileCard({
  file,
  onDelete,
  onUseAs,
}: {
  file: MediaFile;
  onDelete: () => void;
  onUseAs: (target: PickTarget) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [hovering, setHovering] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(file.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
    toast.success("URL copiée");
  };

  const download = async () => {
    try {
      await downloadFile(file.url, file.name);
    } catch {
      toast.error("Erreur lors du téléchargement");
    }
  };

  const sizeLabel = file.size
    ? file.size > 1_000_000
      ? `${(file.size / 1_000_000).toFixed(1)} Mo`
      : `${Math.round(file.size / 1000)} Ko`
    : "";

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col"
      style={{ ...GLASS, transition: "box-shadow 0.2s ease" }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => { setHovering(false); setConfirming(false); }}
    >
      {/* Image preview */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: "16/9", background: "rgba(255,255,255,0.04)" }}
      >
        <img
          src={file.url}
          alt={file.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0"; }}
        />

        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center gap-2 transition-opacity duration-200"
          style={{ background: "rgba(8,11,22,0.52)", opacity: hovering ? 1 : 0, pointerEvents: hovering ? "auto" : "none" }}
        >
          {confirming ? (
            <>
              <button
                onClick={() => { setConfirming(false); onDelete(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition-transform hover:scale-105"
                style={{ background: C_CORAL, color: "white" }}
              >
                <Check className="w-3.5 h-3.5" /> Supprimer
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: INNER_BG, border: `1px solid ${INNER_BORDER}`, color: T_SECONDARY }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={copy}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                style={{ background: "rgba(255,255,255,0.16)", color: "white" }}
                title="Copier l'URL"
              >
                {copied
                  ? <Check className="w-4 h-4" style={{ color: C_SAGE }} />
                  : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setConfirming(true)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                style={{ background: cA(C_CORAL, 0.20), border: `1px solid ${cA(C_CORAL, 0.35)}`, color: C_CORAL }}
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Meta + actions */}
      <div className="px-3 pt-2.5 pb-3" style={{ borderTop: `1px solid ${INNER_BORDER}` }}>
        <p className="text-[11px] font-medium truncate leading-tight mb-0.5" style={{ color: T_HEADING }}>
          {file.name}
        </p>
        {sizeLabel && (
          <p className="text-[10px] font-light mb-2.5" style={{ color: T_MUTED }}>{sizeLabel}</p>
        )}

        <div className="flex items-center gap-1.5">
          <button
            onClick={download}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
            style={{ background: INNER_BG, border: `1px solid ${INNER_BORDER}`, color: T_LABEL }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.10)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = INNER_BG; }}
            title="Télécharger"
          >
            <Download className="w-3 h-3" />
          </button>

          <button
            onClick={() => onUseAs("article")}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium flex-1 justify-center transition-colors"
            style={{ background: cA(C_BLUE, 0.18), border: `1px solid ${cA(C_BLUE, 0.30)}`, color: C_BLUE }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = cA(C_BLUE, 0.28); }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = cA(C_BLUE, 0.18); }}
            title="Couverture d'article"
          >
            <FileText className="w-3 h-3" />
          </button>

          <button
            onClick={() => onUseAs("team")}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium flex-1 justify-center transition-colors"
            style={{ background: cA(C_GOLD, 0.18), border: `1px solid ${cA(C_GOLD, 0.30)}`, color: C_GOLD }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = cA(C_GOLD, 0.28); }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = cA(C_GOLD, 0.18); }}
            title="Photo de membre d'équipe"
          >
            <User className="w-3 h-3" />
          </button>

          <button
            onClick={() => onUseAs("cas-client")}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium flex-1 justify-center transition-colors"
            style={{ background: cA(C_SAGE, 0.18), border: `1px solid ${cA(C_SAGE, 0.30)}`, color: C_SAGE }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = cA(C_SAGE, 0.28); }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = cA(C_SAGE, 0.18); }}
            title="Photo de cas client"
          >
            <Users className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function AdminMediaLibrary() {
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [search, setSearch] = useState("");
  const [picker, setPicker] = useState<{ file: MediaFile; target: PickTarget } | null>(null);

  const { data: files = [], isLoading, error } = useQuery({
    queryKey: ["media"], queryFn: listMedia,
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadMedia(file),
    onSuccess: (url) => {
      qc.invalidateQueries({ queryKey: ["media"] });
      navigator.clipboard.writeText(url).catch(() => null);
      toast.success("Image uploadée · URL copiée dans le presse-papier");
    },
    onError: () => toast.error("Erreur lors de l'upload"),
  });

  const deleteMutation = useMutation({
    mutationFn: (name: string) => deleteMedia(name),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["media"] }); toast.success("Image supprimée"); },
    onError: (err: Error) => toast.error(err.message ?? "Erreur lors de la suppression"),
  });

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    Array.from(fileList).forEach((f) => {
      if (f.type.startsWith("image/")) uploadMutation.mutate(f);
    });
  };

  const filtered = files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between mb-7 gap-4">
        <div>
          <h1 className="text-[26px] font-heading font-light tracking-tight mb-1" style={{ color: T_PRIMARY }}>
            Médiathèque
          </h1>
          <p className="text-[12px] font-light" style={{ color: T_SECONDARY }}>
            {files.length} image{files.length !== 1 ? "s" : ""} · bucket{" "}
            <code
              className="px-1.5 py-0.5 rounded-md text-[10px]"
              style={{ background: INNER_BG, border: `1px solid ${INNER_BORDER}`, color: T_LABEL }}
            >
              {BUCKET}
            </code>
          </p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploadMutation.isPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-medium transition-opacity disabled:opacity-60 flex-shrink-0"
          style={{ ...GLASS, color: T_PRIMARY }}
        >
          <Upload className="w-4 h-4" style={{ color: C_BLUE }} />
          {uploadMutation.isPending ? "Upload en cours…" : "Uploader"}
        </button>
      </div>

      {/* SQL setup hint — shown until dismissed */}
      <SqlHint />

      {/* Search + drop zone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 pointer-events-none" style={{ color: T_MUTED }} />
          <input
            type="text"
            placeholder="Filtrer les images..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[12px]"
            style={{ background: INNER_BG, border: `1px solid ${INNER_BORDER}`, color: T_PRIMARY, outline: "none" }}
          />
        </div>

        <div
          className="rounded-xl flex items-center justify-center gap-3 cursor-pointer transition-all duration-200"
          style={{
            padding: "14px 20px",
            background: dragging ? cA(C_BLUE, 0.12) : INNER_BG,
            border: `2px dashed ${dragging ? C_BLUE : INNER_BORDER}`,
          }}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Upload className="w-4 h-4 flex-shrink-0" style={{ color: dragging ? C_BLUE : T_MUTED }} />
          <p className="text-[12px] font-light" style={{ color: dragging ? C_BLUE : T_SECONDARY }}>
            Glissez-déposez ou <span className="font-medium">cliquez pour choisir</span>
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-4"
          style={{ background: cA(C_CORAL, 0.12), border: `1px solid ${cA(C_CORAL, 0.22)}` }}
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: C_CORAL }} />
          <p className="text-[12px] font-light" style={{ color: T_SECONDARY }}>
            Impossible de charger la médiathèque. Vérifiez que le bucket{" "}
            <code>{BUCKET}</code> est public dans Supabase.
          </p>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <div
            className="w-6 h-6 rounded-full border-2 animate-spin"
            style={{ borderColor: `${INNER_BORDER} ${INNER_BORDER} ${INNER_BORDER} ${T_SECONDARY}` }}
          />
        </div>
      )}

      {/* Empty */}
      {!isLoading && files.length === 0 && !error && (
        <div className="text-center py-16 rounded-2xl" style={{ ...GLASS }}>
          <ImageIcon className="w-10 h-10 mx-auto mb-3" style={{ color: T_MUTED }} />
          <p className="text-[13px] font-light" style={{ color: T_MUTED }}>Aucune image uploadée</p>
        </div>
      )}

      {/* Legend */}
      {!isLoading && filtered.length > 0 && (
        <div className="flex items-center gap-5 mb-4">
          <p className="text-[10px] font-medium tracking-wide uppercase" style={{ color: T_MUTED }}>
            Utiliser comme :
          </p>
          <span className="flex items-center gap-1 text-[11px]" style={{ color: C_BLUE }}>
            <FileText className="w-3 h-3" /> Article
          </span>
          <span className="flex items-center gap-1 text-[11px]" style={{ color: C_GOLD }}>
            <User className="w-3 h-3" /> Équipe
          </span>
          <span className="flex items-center gap-1 text-[11px]" style={{ color: C_SAGE }}>
            <Users className="w-3 h-3" /> Cas client
          </span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((f) => (
          <FileCard
            key={f.name}
            file={f}
            onDelete={() => deleteMutation.mutate(f.name)}
            onUseAs={(target) => setPicker({ file: f, target })}
          />
        ))}
      </div>

      {picker && (
        <PickerModal
          imageUrl={picker.file.url}
          target={picker.target}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
}
