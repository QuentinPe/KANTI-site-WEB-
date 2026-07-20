import React, { useRef, useCallback, useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { useQuery } from "@tanstack/react-query";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading2, Heading3, Pilcrow, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link as LinkIcon, ImagePlus, FileUp, FileText,
  Highlighter, Palette, BookOpen, Search, X,
  Maximize2, Minimize2,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { getArticles } from "@/lib/articlesService";

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  fullscreen?: boolean;
}

/* ── Toolbar button ── */
function Btn({ onClick, active = false, title, children, disabled = false }: {
  onClick: () => void; active?: boolean; title: string; children: React.ReactNode; disabled?: boolean;
}) {
  return (
    <button type="button" title={title} onClick={onClick} disabled={disabled}
      className="p-1.5 rounded-lg transition-all duration-150 disabled:opacity-40"
      style={{ background: active ? "hsl(224 60% 18%)" : "transparent", color: active ? "white" : "hsl(224 50% 32%)" }}
      onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "hsl(224 60% 12% / 0.07)"; }}
      onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
      {children}
    </button>
  );
}

function Divider() {
  return <span className="w-px h-5 mx-1 flex-shrink-0" style={{ background: "hsl(224 20% 12% / 0.10)" }} />;
}

/* ── Internal article picker modal ── */
function ArticlePicker({ onSelect, onClose }: {
  onSelect: (id: string, title: string) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const { data: articles = [], isLoading } = useQuery({ queryKey: ["articles"], queryFn: getArticles });

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(q.toLowerCase()) ||
    (a.tag ?? "").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "hsl(224 60% 6% / 0.50)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: "white", boxShadow: "0 24px 60px -16px hsl(224 60% 12% / 0.22)", border: "1px solid hsl(224 20% 12% / 0.08)" }}>

        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid hsl(224 20% 12% / 0.08)" }}>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" style={{ color: "hsl(218 45% 42%)" }} />
            <span className="text-[14px] font-medium" style={{ color: "hsl(224 55% 12%)" }}>
              Lien vers un article
            </span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[hsl(224_20%_12%/0.06)] transition-colors">
            <X className="w-4 h-4" style={{ color: "hsl(224 20% 50%)" }} />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pt-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
              style={{ color: "hsl(224 20% 55%)" }} />
            <input type="text" value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un article…"
              autoFocus
              className="w-full pl-9 pr-3 py-2 text-[13px] rounded-xl outline-none"
              style={{ background: "hsl(220 25% 97%)", border: "1px solid hsl(224 20% 12% / 0.10)", color: "hsl(224 30% 20%)" }} />
          </div>
        </div>

        {/* Article list */}
        <div className="px-3 pb-4 max-h-72 overflow-y-auto space-y-1">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-5 h-5 rounded-full border-2 border-foreground/15 border-t-foreground/60 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center py-8 text-[13px] font-light" style={{ color: "hsl(224 12% 55%)" }}>
              Aucun article trouvé
            </p>
          ) : (
            filtered.map(a => (
              <button key={a.id} type="button"
                onClick={() => onSelect(a.id, a.title)}
                className="w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors group"
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(218 45% 42% / 0.06)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                <span className="mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium tracking-wide uppercase flex-shrink-0"
                  style={{ background: "hsl(218 45% 42% / 0.09)", color: "hsl(218 45% 38%)" }}>
                  {a.tag}
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium truncate" style={{ color: "hsl(224 45% 18%)" }}>
                    {a.title}
                  </p>
                  <p className="text-[11px] font-light mt-0.5" style={{ color: "hsl(224 15% 52%)" }}>
                    {a.date} · {a.reading_time}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="px-5 py-3" style={{ borderTop: "1px solid hsl(224 20% 12% / 0.07)", background: "hsl(220 25% 99%)" }}>
          <p className="text-[10px] font-light" style={{ color: "hsl(224 15% 58%)" }}>
            Le texte sélectionné dans l'éditeur sera transformé en lien. Sans sélection, le titre de l'article est inséré.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function RichEditor({ value, onChange, fullscreen = false }: RichEditorProps) {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const docxInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [showArticlePicker, setShowArticlePicker] = useState(false);
  const [isImageSelected, setIsImageSelected] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Image.configure({ inline: false, allowBase64: false }).extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            width: {
              default: null,
              parseHTML: el => (el as HTMLImageElement).style.width || null,
              renderHTML: () => ({}),
            },
            align: {
              default: 'center',
              parseHTML: el => el.getAttribute('data-align') || 'center',
              renderHTML: attrs => ({ 'data-align': attrs.align }),
            },
          };
        },
        renderHTML({ HTMLAttributes }) {
          const { width, align, src, alt, title, 'data-align': _da, ...rest } = HTMLAttributes;
          const w = width || '100%';
          let style = 'max-width:100%;height:auto;';
          if (align === 'left') {
            style += `width:${w};float:left;margin:0 1.5rem 0.75rem 0;clear:left;`;
          } else if (align === 'right') {
            style += `width:${w};float:right;margin:0 0 0.75rem 1.5rem;clear:right;`;
          } else {
            style += `width:${w};display:block;margin-left:auto;margin-right:auto;`;
          }
          return ['img', { ...rest, src, alt, title, style, 'data-align': align }];
        },
      }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => { onChange(editor.getHTML()); setIsImageSelected(editor.isActive('image')); },
    onSelectionUpdate: ({ editor }) => setIsImageSelected(editor.isActive('image')),
    editorProps: {
      attributes: {
        class: "outline-none px-6 py-5 prose prose-slate max-w-none",
      },
    },
  });

  // Sync editor content when value prop changes async (e.g. on article edit load)
  useEffect(() => {
    if (!editor || !value) return;
    if (editor.getHTML() === value) return;
    editor.commands.setContent(value);
  }, [value, editor]);

  const handleImageUpload = useCallback(async (file: File) => {
    if (!editor) return;
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("article-images").upload(path, file, { contentType: file.type, upsert: false });
    if (error) { toast.error("Erreur upload : " + error.message); return; }
    const { data: { publicUrl } } = supabase.storage.from("article-images").getPublicUrl(path);
    editor.chain().focus().setImage({ src: publicUrl, alt: file.name }).run();
  }, [editor]);

  const handleDocxImport = useCallback(async (file: File) => {
    if (!editor) return;
    try {
      const mammoth = await import("mammoth");
      const arrayBuffer = await file.arrayBuffer();
      const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
      editor.chain().focus().setContent(DOMPurify.sanitize(html)).run();
      onChange(editor.getHTML());
    } catch (err) { alert("Erreur import Word : " + String(err)); }
  }, [editor, onChange]);

  const handlePdfImport = useCallback(async (file: File) => {
    if (!editor) return;
    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).href;
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        fullText += content.items.map((item: unknown) => (item as { str?: string }).str ?? "").join(" ") + "\n\n";
      }
      const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const paragraphs = fullText.split(/\n{2,}/).filter(p => p.trim()).map(p => `<p>${esc(p.trim())}</p>`).join("");
      editor.chain().focus().setContent(paragraphs || "<p>Contenu extrait vide.</p>").run();
      onChange(editor.getHTML());
    } catch (err) { alert("Erreur import PDF : " + String(err)); }
  }, [editor, onChange]);

  const SAFE_PROTOCOLS = /^(https?|mailto|tel):/i;

  const handleLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href ?? "";
    const url = window.prompt("URL du lien :", prev);
    if (url === null) return;
    if (url === "") { editor.chain().focus().unsetLink().run(); return; }
    if (!SAFE_PROTOCOLS.test(url)) { toast.error("Protocole non autorisé (utiliser http, https, mailto ou tel)"); return; }
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const handleInternalArticle = useCallback((articleId: string, articleTitle: string) => {
    if (!editor) return;
    const href = `/actualites/${articleId}`;
    const hasSelection = !editor.state.selection.empty;
    if (hasSelection) {
      editor.chain().focus().setLink({ href, target: "_self" }).run();
    } else {
      editor.chain().focus().insertContent(`<a href="${href}" target="_self">${articleTitle}</a>`).run();
    }
    setShowArticlePicker(false);
  }, [editor]);

  if (!editor) return null;

  return (
    <>
      <div className="rounded-2xl overflow-hidden flex flex-col"
        style={{ border: "1px solid hsl(224 20% 12% / 0.12)", background: "white" }}>

        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center gap-0.5 px-3 py-2.5"
          style={{ borderBottom: "1px solid hsl(224 20% 12% / 0.09)", background: "hsl(220 25% 98%)" }}>

          {/* Text format */}
          <Btn title="Gras (Ctrl+B)" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
            <Bold className="w-4 h-4" />
          </Btn>
          <Btn title="Italique (Ctrl+I)" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
            <Italic className="w-4 h-4" />
          </Btn>
          <Btn title="Souligné (Ctrl+U)" onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")}>
            <UnderlineIcon className="w-4 h-4" />
          </Btn>
          <Btn title="Barré" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")}>
            <Strikethrough className="w-4 h-4" />
          </Btn>

          <Divider />

          {/* Color */}
          <div className="relative">
            <Btn title="Couleur du texte" onClick={() => colorInputRef.current?.click()}>
              <Palette className="w-4 h-4" />
            </Btn>
            <input ref={colorInputRef} type="color" className="absolute opacity-0 w-0 h-0 pointer-events-none"
              onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} />
          </div>
          <Btn title="Surligner" onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive("highlight")}>
            <Highlighter className="w-4 h-4" />
          </Btn>

          <Divider />

          {/* Structure */}
          <Btn title="Titre H2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
            <Heading2 className="w-4 h-4" />
          </Btn>
          <Btn title="Titre H3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>
            <Heading3 className="w-4 h-4" />
          </Btn>
          <Btn title="Paragraphe" onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive("paragraph")}>
            <Pilcrow className="w-4 h-4" />
          </Btn>
          <Btn title="Liste à puces" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
            <List className="w-4 h-4" />
          </Btn>
          <Btn title="Liste numérotée" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
            <ListOrdered className="w-4 h-4" />
          </Btn>

          <Divider />

          {/* Align */}
          <Btn title="Aligner à gauche" onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })}>
            <AlignLeft className="w-4 h-4" />
          </Btn>
          <Btn title="Centrer" onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })}>
            <AlignCenter className="w-4 h-4" />
          </Btn>
          <Btn title="Aligner à droite" onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })}>
            <AlignRight className="w-4 h-4" />
          </Btn>
          <Btn title="Justifier" onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })}>
            <AlignJustify className="w-4 h-4" />
          </Btn>

          <Divider />

          {/* Links */}
          <Btn title="Insérer un lien externe" onClick={handleLink} active={editor.isActive("link")}>
            <LinkIcon className="w-4 h-4" />
          </Btn>

          {/* Internal article link — new */}
          <div className="relative">
            <button
              type="button"
              title="Lier un article KANTI (Ctrl+Shift+A)"
              onClick={() => setShowArticlePicker(true)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150"
              style={{ background: "hsl(218 45% 42% / 0.09)", color: "hsl(218 45% 36%)", border: "1px solid hsl(218 45% 42% / 0.18)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(218 45% 42% / 0.15)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "hsl(218 45% 42% / 0.09)"; }}>
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lien interne</span>
            </button>
          </div>

          {/* Image */}
          <div className="relative">
            <Btn title="Insérer une image" onClick={() => imgInputRef.current?.click()}>
              <ImagePlus className="w-4 h-4" />
            </Btn>
            <input ref={imgInputRef} type="file" accept="image/*"
              className="absolute opacity-0 w-0 h-0 pointer-events-none"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.target.value = ""; }} />
          </div>

          <Divider />

          {/* Import */}
          <div className="relative">
            <Btn title="Importer Word (.docx)" onClick={() => docxInputRef.current?.click()}>
              <FileUp className="w-4 h-4" />
            </Btn>
            <input ref={docxInputRef} type="file"
              accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="absolute opacity-0 w-0 h-0 pointer-events-none"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleDocxImport(f); e.target.value = ""; }} />
          </div>
          <div className="relative">
            <Btn title="Importer PDF (texte)" onClick={() => pdfInputRef.current?.click()}>
              <FileText className="w-4 h-4" />
            </Btn>
            <input ref={pdfInputRef} type="file" accept=".pdf,application/pdf"
              className="absolute opacity-0 w-0 h-0 pointer-events-none"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePdfImport(f); e.target.value = ""; }} />
          </div>

          <span className="ml-2 text-[10px] tracking-wide font-light hidden sm:inline" style={{ color: "hsl(224 20% 60%)" }}>
            Word · PDF
          </span>
        </div>

        {/* ── Image controls row (shown when image is selected) ── */}
        {isImageSelected && (
          <div className="flex flex-wrap items-center gap-1 px-3 py-2"
            style={{ borderTop: "1px solid hsl(218 45% 42% / 0.15)", background: "hsl(218 45% 42% / 0.05)" }}>
            <span className="text-[10px] font-medium tracking-wide mr-1" style={{ color: "hsl(218 45% 38%)" }}>Taille :</span>
            {([['25%', '¼'], ['50%', '½'], ['75%', '¾'], ['100%', 'Plein']] as [string, string][]).map(([w, label]) => (
              <button key={w} type="button"
                onClick={() => editor.chain().focus().updateAttributes('image', { width: w }).run()}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors"
                style={{ background: "hsl(218 45% 42% / 0.10)", color: "hsl(218 45% 36%)", border: "1px solid hsl(218 45% 42% / 0.18)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "hsl(218 45% 42% / 0.20)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "hsl(218 45% 42% / 0.10)"; }}>
                {label}
              </button>
            ))}
            <span className="w-px h-4 mx-1 flex-shrink-0" style={{ background: "hsl(218 45% 42% / 0.20)" }} />
            <span className="text-[10px] font-medium tracking-wide mr-1" style={{ color: "hsl(218 45% 38%)" }}>Alignement :</span>
            {([['left', <AlignLeft className="w-3.5 h-3.5" />], ['center', <AlignCenter className="w-3.5 h-3.5" />], ['right', <AlignRight className="w-3.5 h-3.5" />]] as [string, React.ReactNode][]).map(([a, icon]) => (
              <button key={a as string} type="button"
                onClick={() => editor.chain().focus().updateAttributes('image', { align: a }).run()}
                className="p-1.5 rounded-lg transition-colors"
                style={{ background: "hsl(218 45% 42% / 0.10)", color: "hsl(218 45% 36%)", border: "1px solid hsl(218 45% 42% / 0.18)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "hsl(218 45% 42% / 0.20)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "hsl(218 45% 42% / 0.10)"; }}>
                {icon}
              </button>
            ))}
            <span className="w-px h-4 mx-1 flex-shrink-0" style={{ background: "hsl(218 45% 42% / 0.20)" }} />
            <button type="button"
              onClick={() => editor.chain().focus().deleteSelection().run()}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ml-auto"
              style={{ background: "hsl(0 60% 55% / 0.08)", color: "hsl(0 60% 48%)", border: "1px solid hsl(0 60% 55% / 0.18)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "hsl(0 60% 55% / 0.15)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "hsl(0 60% 55% / 0.08)"; }}>
              <X className="w-3 h-3" /> Supprimer
            </button>
          </div>
        )}

        {/* ── Editor area ── */}
        <EditorContent editor={editor} className="flex-1"
          style={{ minHeight: fullscreen ? "calc(100vh - 280px)" : "320px" }} />
      </div>

      {/* Internal article picker */}
      {showArticlePicker && (
        <ArticlePicker
          onSelect={handleInternalArticle}
          onClose={() => setShowArticlePicker(false)}
        />
      )}
    </>
  );
}
