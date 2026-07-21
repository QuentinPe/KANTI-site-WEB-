import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Globe, Phone, BarChart3, Search, Scale, FileUp } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getSiteSettings, upsertSettings } from "@/lib/siteSettingsService";
import { toast } from "sonner";

const inputClass = "w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all duration-150";
const inputStyle = { background: "white", border: "1px solid hsl(224 20% 12% / 0.12)", color: "hsl(224 55% 12%)" };
const inputFocus = { borderColor: "hsl(224 60% 18% / 0.40)", boxShadow: "0 0 0 3px hsl(224 60% 18% / 0.08)" };
const inputBlur  = { boxShadow: "none", borderColor: "hsl(224 20% 12% / 0.12)" };

const SEO_PAGES = [
  { key: "home",             label: "Accueil",                    path: "/" },
  { key: "cabinet",          label: "Le Cabinet",                 path: "/cabinet" },
  { key: "methode",          label: "Notre Méthode",              path: "/notre-methode" },
  { key: "contact",          label: "Contact",                    path: "/contact" },
  { key: "actualites",       label: "Actualités",                 path: "/actualites" },
  { key: "ressources",       label: "Ressources",                 path: "/ressources" },
  { key: "cas_clients",      label: "Cas clients",                path: "/cas-clients" },
  { key: "faq",              label: "FAQ",                        path: "/faq" },
  { key: "bilan",            label: "Bilan patrimonial",          path: "/bilan-patrimonial-bordeaux" },
  { key: "gestion",          label: "Gestion patrimoniale",       path: "/gestion-patrimoniale" },
  { key: "fiscalite",        label: "Fiscalité",                  path: "/fiscalite" },
  { key: "patrimoine_pro",   label: "Patrimoine professionnel",   path: "/patrimoine-professionnel" },
  { key: "financement",      label: "Financement & crédit",       path: "/financement" },
  { key: "transmission",     label: "Transmission & prévoyance",  path: "/transmission-patrimoine-famille" },
  { key: "immobilier",       label: "Immobilier patrimonial",     path: "/patrimoine-immobilier-strategie" },
];

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline gap-2">
        <label className="text-[12px] font-medium tracking-wide" style={{ color: "hsl(224 25% 38%)" }}>{label}</label>
        {hint && <span className="text-[11px] font-light" style={{ color: "hsl(224 15% 58%)" }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: typeof Globe; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid hsl(224 20% 12% / 0.08)" }}>
      <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid hsl(224 20% 12% / 0.07)", background: "hsl(220 25% 98%)" }}>
        <Icon className="w-4 h-4" style={{ color: "hsl(224 40% 42%)" }} strokeWidth={1.5} />
        <h2 className="text-[14px] font-medium tracking-wide" style={{ color: "hsl(224 40% 28%)" }}>{title}</h2>
      </div>
      <div className="px-6 py-6 flex flex-col gap-5">{children}</div>
    </div>
  );
}

export default function AdminSiteSettings() {
  const qc = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);
  const [derUploading, setDerUploading] = useState(false);

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ["site-settings"], queryFn: getSiteSettings,
  });

  useEffect(() => {
    if (settings.length > 0) {
      setValues(Object.fromEntries(settings.map((s) => [s.key, s.value])));
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: () => upsertSettings(values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site-settings"] });
      setDirty(false);
      toast.success("Paramètres enregistrés");
    },
    onError: () => toast.error("Erreur lors de la sauvegarde"),
  });

  const set = (key: string, val: string) => {
    setValues((p) => ({ ...p, [key]: val }));
    setDirty(true);
  };

  const handleDerUpload = async (file: File) => {
    setDerUploading(true);
    try {
      const { data, error } = await supabase.storage
        .from("ressources")
        .upload("der/der-kanti.pdf", file, { contentType: "application/pdf", upsert: true });
      if (error) throw error;
      await upsertSettings({ der_url: data.path });
      qc.invalidateQueries({ queryKey: ["site-settings"] });
      set("der_url", data.path);
      setDirty(false);
      toast.success("DER mis à jour");
    } catch {
      toast.error("Erreur lors de l'envoi du DER");
    } finally {
      setDerUploading(false);
    }
  };

  const textInput = (key: string, placeholder?: string, textarea?: boolean) => {
    const props = {
      value: values[key] ?? "",
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(key, e.target.value),
      onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => Object.assign((e.target as HTMLElement).style, inputFocus),
      onBlur:  (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => Object.assign((e.target as HTMLElement).style, inputBlur),
      placeholder,
    };
    return textarea
      ? <textarea className={inputClass} style={{ ...inputStyle, resize: "vertical", minHeight: "72px" }} {...props} />
      : <input className={inputClass} style={inputStyle} {...props} />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 rounded-full border-2 border-foreground/15 border-t-foreground/60 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-light tracking-tight" style={{ color: "hsl(224 55% 12%)" }}>
            Paramètres & SEO
          </h1>
          <p className="text-[13px] font-light mt-1" style={{ color: "hsl(224 15% 52%)" }}>
            Informations globales et référencement des pages fixes
          </p>
        </div>
        <button
          type="button"
          onClick={() => mutation.mutate()}
          disabled={!dirty || mutation.isPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 disabled:opacity-40"
          style={{ background: "hsl(224 60% 18%)", color: "white" }}
        >
          <Save className="w-4 h-4" />
          {mutation.isPending ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>

      <div className="flex flex-col gap-6">

        {/* Contact */}
        <SectionCard title="Coordonnées & Domaine" icon={Phone}>
          <Field label="Domaine du site" hint="Utilisé dans l'aperçu Google des articles (sans https://)">
            <div>{textInput("site_domain", "kanti-patrimoine.fr")}</div>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Téléphone"><div>{textInput("phone", "+33 6 63 32 48 09")}</div></Field>
            <Field label="Email"><div>{textInput("email", "kanti@adnfamily.com")}</div></Field>
          </div>
          <Field label="Adresse"><div>{textInput("address", "12 rue Ferrere, 33000 Bordeaux")}</div></Field>
        </SectionCard>

        {/* Chiffres clés */}
        <SectionCard title="Chiffres clés (page d'accueil)" icon={BarChart3}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Familles accompagnées"><div>{textInput("stat_clients", "180+")}</div></Field>
            <Field label="Expérience moyenne"><div>{textInput("stat_experience", "12 ans")}</div></Field>
            <Field label="Taux de fidélisation"><div>{textInput("stat_fidelisation", "97 %")}</div></Field>
            <Field label="Partenaires"><div>{textInput("stat_partenaires", "30+")}</div></Field>
          </div>
        </SectionCard>

        {/* Informations réglementaires */}
        <SectionCard title="Informations réglementaires" icon={Scale}>
          <p className="text-[12px] font-light -mt-2" style={{ color: "hsl(224 15% 55%)" }}>
            Ces valeurs sont utilisées dans les mentions légales publiées sur le site. Toute modification est répercutée automatiquement.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Numéro ORIAS" hint="ex : 20 000 855">
              <div>{textInput("legal_orias", "20 000 855")}</div>
            </Field>
            <Field label="RCS (numéro et ville)" hint="ex : 878 821 818 Bayonne">
              <div>{textInput("legal_rcs", "878 821 818 Bayonne")}</div>
            </Field>
            <Field label="Numéro de TVA intracommunautaire">
              <div>{textInput("legal_tva", "FR34878821818")}</div>
            </Field>
            <Field label="Siège social">
              <div>{textInput("legal_siege", "9 Rue de la Négresse, 64200 Biarritz")}</div>
            </Field>
            <Field label="Numéro La Compagnie CIF / IOBSP" hint="ex : F002635">
              <div>{textInput("legal_compagnie_num", "F002635")}</div>
            </Field>
            <Field label="Numéro CNCEF Assurance" hint="ex : 25/860422">
              <div>{textInput("legal_cncef_num", "25/860422")}</div>
            </Field>
            <Field label="Carte pro transaction immobilière" hint="Numéro CPI">
              <div>{textInput("legal_carte_pro", "CPI33012020000045313")}</div>
            </Field>
            <Field label="Tribunal compétent">
              <div>{textInput("legal_tribunal", "Bayonne")}</div>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4" style={{ paddingTop: "0.5rem", borderTop: "1px solid hsl(224 20% 12% / 0.07)", marginTop: "0.25rem" }}>
            <Field label="Assureur RC Pro">
              <div>{textInput("legal_rc_assureur", "MMA IARD Assurances Mutuelles / MMA IARD")}</div>
            </Field>
            <Field label="Police d'assurance RC Pro" hint="Numéro de police">
              <div>{textInput("legal_rc_police", "112 786 342")}</div>
            </Field>
            <Field label="Numéro d'adhérent RC Pro">
              <div>{textInput("legal_rc_adherent", "231 972")}</div>
            </Field>
            <Field label="Date de mise à jour des mentions légales">
              <div>{textInput("legal_updated_at", "Avril 2026")}</div>
            </Field>
          </div>
        </SectionCard>

        {/* Document DER */}
        <SectionCard title="Document d'Entrée en Relation (DER)" icon={FileUp}>
          <p className="text-[12px] font-light -mt-2" style={{ color: "hsl(224 15% 55%)" }}>
            Ce document est affiché sur la page d'accueil. L'envoi d'un nouveau fichier remplace immédiatement le précédent.
          </p>
          {values["der_url"] ? (
            <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: "hsl(150 40% 96%)", border: "1px solid hsl(150 30% 82%)" }}>
              <svg className="w-4 h-4 flex-shrink-0" style={{ color: "hsl(150 40% 38%)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[12px] font-medium flex-1 truncate" style={{ color: "hsl(150 40% 28%)" }}>
                DER enregistré · <span className="font-light opacity-70">{values["der_url"]}</span>
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: "hsl(220 25% 97%)", border: "1px solid hsl(224 20% 12% / 0.07)" }}>
              <p className="text-[12px] font-light" style={{ color: "hsl(224 15% 55%)" }}>Aucun DER uploadé — le document par défaut est utilisé.</p>
            </div>
          )}
          <label className="inline-flex items-center gap-2 cursor-pointer self-start">
            <input
              type="file"
              accept="application/pdf"
              className="sr-only"
              disabled={derUploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleDerUpload(file);
                e.target.value = "";
              }}
            />
            <span
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150"
              style={{ background: derUploading ? "hsl(224 60% 18% / 0.5)" : "hsl(224 60% 18%)", color: "white", cursor: derUploading ? "wait" : "pointer" }}
            >
              <FileUp className="w-4 h-4" />
              {derUploading ? "Envoi en cours…" : "Choisir un fichier PDF"}
            </span>
          </label>
        </SectionCard>

        {/* SEO pages fixes */}
        <SectionCard title="SEO · Pages fixes" icon={Search}>
          <p className="text-[12px] font-light -mt-2" style={{ color: "hsl(224 15% 55%)" }}>
            Titre SEO (60 car. max) et meta description (155 car. max) pour chaque page fixe.
            Si laissé vide, le titre/description par défaut codé en dur est utilisé.
          </p>
          {SEO_PAGES.map((page) => (
            <div key={page.key} className="rounded-xl p-4 flex flex-col gap-3"
              style={{ background: "hsl(220 25% 97%)", border: "1px solid hsl(224 20% 12% / 0.07)" }}>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5" style={{ color: "hsl(224 35% 50%)" }} />
                <p className="text-[12px] font-medium" style={{ color: "hsl(224 35% 32%)" }}>
                  {page.label} <span className="font-light" style={{ color: "hsl(224 15% 58%)" }}>· {page.path}</span>
                </p>
              </div>
              <Field label="Titre SEO" hint={`${(values[`seo_${page.key}_title`] ?? "").length}/60`}>
                <div>{textInput(`seo_${page.key}_title`, `Titre pour ${page.label}`)}</div>
              </Field>
              <Field label="Meta description" hint={`${(values[`seo_${page.key}_description`] ?? "").length}/155`}>
                <div>{textInput(`seo_${page.key}_description`, `Description pour ${page.label}`, true)}</div>
              </Field>
            </div>
          ))}
        </SectionCard>

      </div>
    </div>
  );
}
