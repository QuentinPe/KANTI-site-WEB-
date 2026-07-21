import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, Copy, Trash2, Image as ImageIcon, Check, AlertCircle, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const BUCKET = "article-images";

interface MediaFile {
  name: string;
  id: string | undefined;
  updated_at: string | undefined;
  url: string;
  size?: number;
}

async function listMedia(): Promise<MediaFile[]> {
  const { data, error } = await supabase.storage.from(BUCKET).list("", {
    limit: 200, sortBy: { column: "updated_at", order: "desc" },
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
  const { error } = await supabase.storage.from(BUCKET).remove([name]);
  if (error) throw error;
}

function FileCard({ file, onDelete }: { file: MediaFile; onDelete: () => void }) {
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(file.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
    toast.success("URL copiée");
  };

  const sizeLabel = file.size ? (file.size > 1_000_000 ? `${(file.size / 1_000_000).toFixed(1)} Mo` : `${Math.round(file.size / 1000)} Ko`) : "";

  return (
    <div className="group rounded-xl overflow-hidden flex flex-col transition-all duration-200"
      style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.08)", boxShadow: "0 1px 4px -2px hsl(224 60% 12% / 0.05)" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px -8px hsl(224 60% 12% / 0.12)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px -2px hsl(224 60% 12% / 0.05)"; (e.currentTarget as HTMLElement) && setConfirming(false); }}>
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden" style={{ background: "hsl(220 20% 95%)" }}>
        <img src={file.url} alt={file.name} className="w-full h-full object-cover" loading="lazy"
          onError={(e) => { (e.currentTarget as HTMLElement).style.display = "none"; }} />
        {/* Overlay actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: "hsl(224 40% 8% / 0.45)" }}>
          {confirming ? (
            <>
              <button onClick={() => { setConfirming(false); onDelete(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium backdrop-blur-sm transition-transform duration-150 hover:scale-105"
                style={{ background: "hsl(0 65% 48%)", color: "white" }}
                title="Confirmer la suppression">
                <Check className="w-3.5 h-3.5" /> Supprimer
              </button>
              <button onClick={() => setConfirming(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform duration-150 hover:scale-110"
                style={{ background: "white", color: "hsl(224 40% 30%)" }}
                title="Annuler">
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button onClick={copy}
                className="w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform duration-150 hover:scale-110"
                style={{ background: "white", color: "hsl(224 55% 20%)" }}
                title="Copier l'URL">
                {copied ? <Check className="w-4 h-4" style={{ color: "hsl(142 55% 38%)" }} /> : <Copy className="w-4 h-4" />}
              </button>
              <button onClick={() => setConfirming(true)}
                className="w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform duration-150 hover:scale-110"
                style={{ background: "hsl(0 60% 50%)", color: "white" }}
                title="Supprimer">
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
      {/* Meta */}
      <div className="px-3 py-2.5">
        <p className="text-[11px] font-medium truncate leading-tight" style={{ color: "hsl(224 30% 30%)" }}>{file.name}</p>
        {sizeLabel && <p className="text-[10px] font-light" style={{ color: "hsl(224 12% 60%)" }}>{sizeLabel}</p>}
      </div>
    </div>
  );
}

export default function AdminMediaLibrary() {
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

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
    onError: () => toast.error("Erreur lors de la suppression"),
  });

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    Array.from(fileList).forEach((f) => {
      if (f.type.startsWith("image/")) uploadMutation.mutate(f);
    });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: "hsl(224 55% 12%)" }}>Médiathèque</h1>
          <p className="text-[13px] font-light mt-1" style={{ color: "hsl(224 15% 52%)" }}>
            {files.length} image{files.length !== 1 ? "s" : ""} · bucket <code className="text-[11px] px-1 rounded" style={{ background: "hsl(220 20% 94%)" }}>{BUCKET}</code>
          </p>
        </div>
        <button type="button" onClick={() => inputRef.current?.click()}
          disabled={uploadMutation.isPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-medium transition-opacity disabled:opacity-60"
          style={{ background: "hsl(224 60% 18%)", color: "white" }}>
          <Upload className="w-4 h-4" />
          {uploadMutation.isPending ? "Upload…" : "Uploader"}
        </button>
      </div>

      {/* Drop zone */}
      <div
        className="mb-6 rounded-2xl flex items-center justify-center gap-3 cursor-pointer transition-all duration-200"
        style={{
          padding: "28px 20px",
          background: dragging ? "hsl(218 55% 42% / 0.08)" : "hsl(220 25% 97%)",
          border: `2px dashed ${dragging ? "hsl(218 55% 42%)" : "hsl(224 20% 78%)"}`,
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
      >
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={(e) => handleFiles(e.target.files)} />
        <Upload className="w-5 h-5" style={{ color: "hsl(224 20% 58%)" }} />
        <p className="text-[13px] font-light" style={{ color: "hsl(224 20% 45%)" }}>
          Glissez des images ici ou <span className="font-medium" style={{ color: "hsl(218 55% 38%)" }}>cliquez pour choisir</span>
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 border-foreground/15 border-t-foreground/60 animate-spin" />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl mb-4"
          style={{ background: "hsl(0 60% 96%)", border: "1px solid hsl(0 60% 88%)" }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: "hsl(0 60% 48%)" }} />
          <p className="text-[13px] font-light" style={{ color: "hsl(0 55% 40%)" }}>
            Impossible de charger la médiathèque. Vérifiez que le bucket <code>{BUCKET}</code> est public dans Supabase.
          </p>
        </div>
      )}

      {!isLoading && files.length === 0 && !error && (
        <div className="text-center py-16 rounded-2xl" style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.07)" }}>
          <ImageIcon className="w-10 h-10 mx-auto mb-3" style={{ color: "hsl(224 18% 72%)" }} />
          <p className="text-[14px] font-light" style={{ color: "hsl(224 12% 55%)" }}>Aucune image uploadée</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {files.map((f) => (
          <FileCard key={f.name} file={f} onDelete={() => deleteMutation.mutate(f.name)} />
        ))}
      </div>
    </div>
  );
}
