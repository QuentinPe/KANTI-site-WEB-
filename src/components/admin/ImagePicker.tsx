import { useState, useRef } from "react";
import { Upload, Image as ImageIcon, X, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const BUCKET = "article-images";
const OUTPUT_W = 1200;

const ASPECTS = [
  { label: "16 / 9", ratio: 16 / 9 },
  { label: "3 / 2", ratio: 3 / 2 },
  { label: "4 / 3", ratio: 4 / 3 },
  { label: "1 / 1", ratio: 1 },
];

function SliderRow({
  label, value, min, max, step, onChange, unit,
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; unit: "%" | "×";
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] font-medium w-20 flex-shrink-0" style={{ color: "hsl(224 25% 45%)" }}>
        {label}
      </span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 cursor-pointer"
        style={{ accentColor: "hsl(224 60% 18%)" }}
      />
      <span className="text-[11px] tabular-nums w-10 text-right flex-shrink-0" style={{ color: "hsl(224 15% 55%)" }}>
        {unit === "%" ? `${Math.round(value)}%` : `${value.toFixed(2)}×`}
      </span>
    </div>
  );
}

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  error?: string;
}

export default function ImagePicker({ value, onChange, error }: ImagePickerProps) {
  const [cropSrc, setCropSrc] = useState("");
  const [isLocalFile, setIsLocalFile] = useState(false);
  const [cropAspect, setCropAspect] = useState(16 / 9);
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(50);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openCropForFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Fichier non supporté — choisissez une image.");
      return;
    }
    const url = URL.createObjectURL(file);
    setCropSrc(url);
    setIsLocalFile(true);
    setCropAspect(16 / 9);
    setPosX(50); setPosY(50); setZoom(1);
  };

  const openCropForUrl = (url: string) => {
    setCropSrc(url);
    setIsLocalFile(false);
    setCropAspect(16 / 9);
    setPosX(50); setPosY(50); setZoom(1);
  };

  const cancelCrop = () => {
    if (isLocalFile && cropSrc.startsWith("blob:")) URL.revokeObjectURL(cropSrc);
    setCropSrc("");
    setUploading(false);
  };

  const confirmCrop = async () => {
    setUploading(true);
    try {
      let blobUrl = cropSrc;
      let tempBlob = false;

      if (!cropSrc.startsWith("blob:")) {
        const resp = await fetch(cropSrc, { mode: "cors" });
        if (!resp.ok) throw new Error(`Impossible de charger l'image (HTTP ${resp.status})`);
        const blob = await resp.blob();
        blobUrl = URL.createObjectURL(blob);
        tempBlob = true;
      }

      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error("Image invalide ou inaccessible"));
        el.src = blobUrl;
      });

      if (tempBlob) URL.revokeObjectURL(blobUrl);

      const outputH = Math.round(OUTPUT_W / cropAspect);
      const canvas = document.createElement("canvas");
      canvas.width = OUTPUT_W;
      canvas.height = outputH;
      const ctx = canvas.getContext("2d")!;

      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const imgAspect = iw / ih;

      // Replicate CSS object-fit:cover + object-position + scale transform
      let baseW: number, baseH: number;
      if (imgAspect > cropAspect) {
        baseH = ih;
        baseW = ih * cropAspect;
      } else {
        baseW = iw;
        baseH = iw / cropAspect;
      }

      const visW = baseW / zoom;
      const visH = baseH / zoom;
      const cx = (posX / 100) * iw;
      const cy = (posY / 100) * ih;
      const sx = Math.max(0, Math.min(iw - visW, cx - visW / 2));
      const sy = Math.max(0, Math.min(ih - visH, cy - visH / 2));

      ctx.drawImage(img, sx, sy, visW, visH, 0, 0, OUTPUT_W, outputH);

      const outBlob = await new Promise<Blob>((res, rej) =>
        canvas.toBlob((b) => (b ? res(b) : rej(new Error("Erreur canvas"))), "image/webp", 0.88)
      );

      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
      const { data, error: uploadErr } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, outBlob, { contentType: "image/webp" });
      if (uploadErr) throw uploadErr;

      const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(data.path).data.publicUrl;
      onChange(publicUrl);
      cancelCrop();
      toast.success("Image uploadée · visible dans la médiathèque");
    } catch (e) {
      setUploading(false);
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.toLowerCase().includes("cors") || msg.toLowerCase().includes("failed to fetch")) {
        toast.error("Image inaccessible depuis le serveur. Téléchargez-la d'abord sur votre appareil puis uploadez-la.");
      } else {
        toast.error("Erreur : " + msg);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Drop / preview zone */}
        <div
          role="button"
          tabIndex={0}
          className="relative w-full rounded-2xl overflow-hidden cursor-pointer group"
          style={{
            aspectRatio: "16/7",
            background: "hsl(220 25% 96%)",
            border: `2px dashed ${dragging ? "hsl(218 55% 42%)" : value ? "transparent" : "hsl(224 20% 78%)"}`,
          }}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault(); setDragging(false);
            const f = e.dataTransfer.files[0]; if (f) openCropForFile(f);
          }}
        >
          {value ? (
            <>
              <img src={value} alt="" className="w-full h-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0.3"; }} />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                style={{ background: "hsl(224 40% 8% / 0.52)" }}
              >
                <span
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-medium text-white"
                  style={{ background: "hsl(224 60% 18% / 0.85)" }}
                >
                  <Upload className="w-3.5 h-3.5" /> Changer l'image
                </span>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <ImageIcon className="w-8 h-8" style={{ color: "hsl(224 18% 70%)" }} />
              <p className="text-[13px] font-light" style={{ color: "hsl(224 20% 52%)" }}>
                Glissez une image ou{" "}
                <span className="font-medium" style={{ color: "hsl(218 55% 38%)" }}>cliquez pour choisir</span>
              </p>
              <p className="text-[11px] font-light" style={{ color: "hsl(224 20% 62%)" }}>
                JPG, PNG, WebP · cadrée et uploadée dans la médiathèque
              </p>
            </div>
          )}
        </div>

        {/* URL input + crop button */}
        <div className="flex gap-2">
          <input
            className="flex-1 px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all duration-150"
            style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.12)", color: "hsl(224 55% 12%)" }}
            placeholder="https://… ou uploadez une image ci-dessus"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={(e) => Object.assign(e.target.style, { borderColor: "hsl(224 60% 18% / 0.40)", boxShadow: "0 0 0 3px hsl(224 60% 18% / 0.08)" })}
            onBlur={(e) => Object.assign(e.target.style, { boxShadow: "none", borderColor: "hsl(224 20% 12% / 0.12)" })}
          />
          {value && (
            <button
              type="button"
              onClick={() => openCropForUrl(value)}
              className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-medium transition-all duration-150"
              style={{ background: "hsl(218 55% 42% / 0.10)", color: "hsl(218 55% 35%)", border: "1px solid hsl(218 55% 50% / 0.20)" }}
            >
              {/* Crop icon */}
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 2v14a2 2 0 002 2h14M18 22V8a2 2 0 00-2-2H2" />
              </svg>
              Rogner
            </button>
          )}
        </div>

        {error && <p className="text-[11px]" style={{ color: "hsl(0 60% 48%)" }}>{error}</p>}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) openCropForFile(f); e.target.value = ""; }}
      />

      {/* Crop modal */}
      {cropSrc && (
        <div
          className="fixed inset-0 z-[500] flex items-center justify-center p-6"
          style={{ background: "hsl(224 60% 5% / 0.78)", backdropFilter: "blur(10px)" }}
        >
          <div
            className="w-full max-w-xl flex flex-col rounded-3xl overflow-hidden"
            style={{ background: "hsl(220 25% 98%)", boxShadow: "0 32px 80px -20px hsl(224 60% 5% / 0.45)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "1px solid hsl(224 20% 12% / 0.08)" }}>
              <div>
                <p className="text-[14px] font-medium" style={{ color: "hsl(224 55% 12%)" }}>
                  Cadrer l'image
                </p>
                <p className="text-[11px] font-light mt-0.5" style={{ color: "hsl(224 15% 52%)" }}>
                  {isLocalFile
                    ? "Ajustez le cadrage · l'image sera uploadée dans la médiathèque"
                    : "L'image sera re-uploadée dans votre médiathèque au format WebP"}
                </p>
              </div>
              <button type="button" onClick={cancelCrop} disabled={uploading}
                className="p-2 rounded-full transition-colors" style={{ color: "hsl(224 20% 50%)" }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              {/* Aspect ratio selector */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-medium flex-shrink-0" style={{ color: "hsl(224 25% 45%)" }}>
                  Format :
                </span>
                {ASPECTS.map((a) => (
                  <button key={a.label} type="button" onClick={() => setCropAspect(a.ratio)}
                    className="px-3 py-1 rounded-full text-[12px] font-medium transition-all duration-150"
                    style={cropAspect === a.ratio
                      ? { background: "hsl(224 60% 18%)", color: "white" }
                      : { background: "hsl(224 20% 12% / 0.07)", color: "hsl(224 30% 48%)" }}>
                    {a.label}
                  </button>
                ))}
              </div>

              {/* Live preview */}
              <div
                className="relative rounded-2xl overflow-hidden w-full"
                style={{
                  aspectRatio: `${cropAspect}`,
                  maxHeight: "300px",
                  background: "hsl(224 20% 88%)",
                }}
              >
                <img
                  src={cropSrc}
                  alt=""
                  draggable={false}
                  className="absolute inset-0 w-full h-full pointer-events-none select-none"
                  style={{
                    objectFit: "cover",
                    objectPosition: `${posX}% ${posY}%`,
                    transform: `scale(${zoom})`,
                    transformOrigin: `${posX}% ${posY}%`,
                  }}
                />
                {uploading && (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                    style={{ background: "hsl(224 60% 5% / 0.60)" }}
                  >
                    <div className="w-7 h-7 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <p className="text-[12px] font-light" style={{ color: "hsl(0 0% 100% / 0.70)" }}>
                      Upload en cours…
                    </p>
                  </div>
                )}
              </div>

              {/* Sliders */}
              <div className="flex flex-col gap-3 pt-1">
                <SliderRow label="Horizontal" value={posX} min={0} max={100} step={1} onChange={setPosX} unit="%" />
                <SliderRow label="Vertical" value={posY} min={0} max={100} step={1} onChange={setPosY} unit="%" />
                <SliderRow label="Zoom" value={zoom} min={1} max={3} step={0.05} onChange={setZoom} unit="×" />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4"
              style={{ borderTop: "1px solid hsl(224 20% 12% / 0.08)" }}>
              <button type="button" onClick={cancelCrop} disabled={uploading}
                className="px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 disabled:opacity-40"
                style={{ background: "hsl(224 20% 12% / 0.07)", color: "hsl(224 40% 35%)" }}>
                Annuler
              </button>
              <button type="button" onClick={confirmCrop} disabled={uploading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 disabled:opacity-60"
                style={{ background: "hsl(224 60% 18%)", color: "white" }}>
                <Check className="w-4 h-4" />
                {uploading
                  ? "Upload…"
                  : isLocalFile ? "Cadrer & uploader" : "Appliquer & uploader"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
