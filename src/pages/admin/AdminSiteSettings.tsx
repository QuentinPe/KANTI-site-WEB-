import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Globe, Phone, BarChart3, Search } from "lucide-react";
import { getSiteSettings, upsertSettings } from "@/lib/siteSettingsService";
import { toast } from "sonner";

const inputClass = "w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all duration-150";
const inputStyle = { background: "white", border: "1px solid hsl(224 20% 12% / 0.12)", color: "hsl(224 55% 12%)" };
const inputFocus = { borderColor: "hsl(224 60% 18% / 0.40)", boxShadow: "0 0 0 3px hsl(224 60% 18% / 0.08)" };
const inputBlur  = { boxShadow: "none", borderColor: "hsl(224 20% 12% / 0.12)" };

const SEO_PAGES = [
  { key: "home",      label: "Accueil",          path: "/" },
  { key: "cabinet",   label: "Le Cabinet",        path: "/cabinet" },
  { key: "methode",   label: "Notre Méthode",     path: "/notre-methode" },
  { key: "contact",   label: "Contact",           path: "/contact" },
  { key: "actualites",label: "Actualités",        path: "/actualites" },
  { key: "ressources",label: "Ressources",        path: "/ressources" },
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
        <SectionCard title="Coordonnées" icon={Phone}>
          <Field label="Téléphone"><div>{textInput("phone", "+33 6 63 32 48 09")}</div></Field>
          <Field label="Email"><div>{textInput("email", "kanti@adnfamily.com")}</div></Field>
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

        {/* SEO pages fixes */}
        <SectionCard title="SEO — Pages fixes" icon={Search}>
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
                  {page.label} <span className="font-light" style={{ color: "hsl(224 15% 58%)" }}>— {page.path}</span>
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
