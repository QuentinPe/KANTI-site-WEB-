import { useRef, useCallback } from "react";
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
  AlignLeft, AlignCenter, AlignRight,
  Link as LinkIcon, ImagePlus, FileUp, FileText,
  Highlighter, Palette,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
}

// ── Toolbar button ──────────────────────────────────────────────────────────
function Btn({
  onClick, active = false, title, children, disabled = false,
}: {
  onClick: () => void; active?: boolean; title: string;
  children: React.ReactNode; disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className="p-1.5 rounded-lg transition-all duration-150 disabled:opacity-40"
      style={{
        background: active ? "hsl(224 60% 18%)" : "transparent",
        color: active ? "white" : "hsl(224 50% 32%)",
      }}
      onMouseEnter={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.background = "hsl(224 60% 12% / 0.07)";
      }}
      onMouseLeave={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="w-px h-5 mx-1 flex-shrink-0" style={{ background: "hsl(224 20% 12% / 0.10)" }} />;
}

// ── Main component ──────────────────────────────────────────────────────────
export default function RichEditor({ value, onChange }: RichEditorProps) {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const docxInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "outline-none min-h-[320px] px-6 py-5 prose prose-slate max-w-none",
      },
    },
  });

  // Image upload to Supabase Storage
  const handleImageUpload = useCallback(async (file: File) => {
    if (!editor) return;
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("article-images").upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (error) { alert("Erreur upload image : " + error.message); return; }
    const { data: { publicUrl } } = supabase.storage.from("article-images").getPublicUrl(path);
    editor.chain().focus().setImage({ src: publicUrl, alt: file.name }).run();
  }, [editor]);

  // DOCX import via mammoth
  const handleDocxImport = useCallback(async (file: File) => {
    if (!editor) return;
    try {
      const mammoth = await import("mammoth");
      const arrayBuffer = await file.arrayBuffer();
      const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
      editor.chain().focus().setContent(html).run();
      onChange(editor.getHTML());
    } catch (err) {
      alert("Erreur lors de l'import Word : " + String(err));
    }
  }, [editor, onChange]);

  // PDF text extraction via pdfjs-dist
  const handlePdfImport = useCallback(async (file: File) => {
    if (!editor) return;
    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).href;
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item: unknown) => (item as { str?: string }).str ?? "")
          .join(" ");
        fullText += pageText + "\n\n";
      }
      // Inject as plain paragraphs
      const paragraphs = fullText
        .split(/\n{2,}/)
        .filter((p) => p.trim().length > 0)
        .map((p) => `<p>${p.trim()}</p>`)
        .join("");
      editor.chain().focus().setContent(paragraphs || "<p>Contenu extrait vide.</p>").run();
      onChange(editor.getHTML());
    } catch (err) {
      alert("Erreur lors de l'import PDF : " + String(err));
    }
  }, [editor, onChange]);

  // Link insertion
  const handleLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href ?? "";
    const url = window.prompt("URL du lien :", prev);
    if (url === null) return;
    if (url === "") { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ border: "1px solid hsl(224 20% 12% / 0.12)", background: "white" }}
    >
      {/* ── Toolbar ── */}
      <div
        className="flex flex-wrap items-center gap-0.5 px-3 py-2.5"
        style={{ borderBottom: "1px solid hsl(224 20% 12% / 0.09)", background: "hsl(220 25% 98%)" }}
      >
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
          <input
            ref={colorInputRef}
            type="color"
            className="absolute opacity-0 w-0 h-0 pointer-events-none"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          />
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

        <Divider />

        {/* Link + Image */}
        <Btn title="Insérer un lien" onClick={handleLink} active={editor.isActive("link")}>
          <LinkIcon className="w-4 h-4" />
        </Btn>

        <div className="relative">
          <Btn title="Insérer une image" onClick={() => imgInputRef.current?.click()}>
            <ImagePlus className="w-4 h-4" />
          </Btn>
          <input
            ref={imgInputRef}
            type="file"
            accept="image/*"
            className="absolute opacity-0 w-0 h-0 pointer-events-none"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
              e.target.value = "";
            }}
          />
        </div>

        <Divider />

        {/* Import */}
        <div className="relative">
          <Btn title="Importer Word (.docx)" onClick={() => docxInputRef.current?.click()}>
            <FileUp className="w-4 h-4" />
          </Btn>
          <input
            ref={docxInputRef}
            type="file"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="absolute opacity-0 w-0 h-0 pointer-events-none"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleDocxImport(file);
              e.target.value = "";
            }}
          />
        </div>

        <div className="relative">
          <Btn title="Importer PDF (texte)" onClick={() => pdfInputRef.current?.click()}>
            <FileText className="w-4 h-4" />
          </Btn>
          <input
            ref={pdfInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="absolute opacity-0 w-0 h-0 pointer-events-none"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handlePdfImport(file);
              e.target.value = "";
            }}
          />
        </div>

        <span
          className="ml-2 text-[10px] tracking-wide font-light hidden sm:inline"
          style={{ color: "hsl(224 20% 60%)" }}
        >
          Word · PDF
        </span>
      </div>

      {/* ── Editor area ── */}
      <EditorContent editor={editor} className="flex-1" />
    </div>
  );
}
