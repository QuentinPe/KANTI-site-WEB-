import { supabase } from "./supabase";

export interface PageStatus {
  path: string;
  enabled: boolean;
  updated_at?: string;
}

/**
 * SQL à exécuter dans le Supabase Dashboard → SQL Editor :
 *
 * CREATE TABLE IF NOT EXISTS page_maintenance (
 *   path TEXT PRIMARY KEY,
 *   enabled BOOLEAN NOT NULL DEFAULT TRUE,
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * ALTER TABLE page_maintenance ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "Admin can manage" ON page_maintenance FOR ALL USING (auth.uid() IS NOT NULL);
 * CREATE POLICY "Public read" ON page_maintenance FOR SELECT USING (TRUE);
 */

export const SITE_PAGES = [
  { path: "/cabinet",                              label: "Le Cabinet" },
  { path: "/gestion-patrimoniale",                 label: "Gestion patrimoniale" },
  { path: "/gestion-patrimoniale/simulateur",      label: "Simulateur patrimonial" },
  { path: "/fiscalite",                            label: "Fiscalité du patrimoine" },
  { path: "/patrimoine-professionnel",             label: "Patrimoine professionnel" },
  { path: "/courtage-patrimonial",                 label: "Courtage & Financement" },
  { path: "/courtage-patrimonial/simulateur-financement", label: "Simulateur crédit" },
  { path: "/transmission-patrimoine-famille",      label: "Transmission & Prévoyance" },
  { path: "/patrimoine-immobilier-strategie",      label: "Immobilier" },
  { path: "/notre-methode",                        label: "Notre méthode" },
  { path: "/cas-clients",                          label: "Cas clients" },
  { path: "/actualites",                           label: "Actualités" },
  { path: "/ressources",                           label: "Ressources" },
  { path: "/faq-patrimoniale",                     label: "FAQ" },
  { path: "/bilan-patrimonial-bordeaux",           label: "Bilan patrimonial" },
  { path: "/gestion-patrimoine-chef-entreprise",   label: "Chef d'entreprise" },
  { path: "/optimisation-fiscale-bordeaux",        label: "Optimisation fiscale" },
  { path: "/profil-de-risque",                     label: "Profil de risque" },
  { path: "/contact",                              label: "Contact" },
];

export async function getPageStatuses(): Promise<PageStatus[]> {
  const { data, error } = await supabase
    .from("page_maintenance")
    .select("path, enabled, updated_at");
  if (error) throw error;
  return data ?? [];
}

export async function setPageEnabled(path: string, enabled: boolean): Promise<void> {
  const { error } = await supabase
    .from("page_maintenance")
    .upsert({ path, enabled, updated_at: new Date().toISOString() }, { onConflict: "path" });
  if (error) throw error;
}
