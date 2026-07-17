import { supabase } from "@/lib/supabase";
import { ADVISOR_LABELS, FORMAT_LABELS, TIMING_LABELS } from "@/lib/leadsConfig";

export type LeadStatus = "nouveau" | "appele" | "traite" | "converti" | "archive";

export interface Lead {
  id: string;
  nom: string;
  email: string;
  telephone?: string | null;
  conseiller?: string | null;
  format?: string | null;
  timing?: string | null;
  sujet?: string | null;
  message?: string | null;
  notes?: string | null;
  status: LeadStatus;
  created_at: string;
}

export type LeadInput = Omit<Lead, "id" | "status" | "created_at" | "notes">;

export const createLead = async (input: LeadInput): Promise<void> => {
  const { error } = await supabase.from("leads").insert(input);
  if (error) throw error;
};

export const getLeads = async (): Promise<Lead[]> => {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
};

export const updateLeadStatus = async (id: string, status: LeadStatus): Promise<void> => {
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) throw error;
};

export const updateLeadNotes = async (id: string, notes: string): Promise<void> => {
  const { error } = await supabase.from("leads").update({ notes }).eq("id", id);
  if (error) throw error;
};

export const deleteLead = async (id: string): Promise<void> => {
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw error;
};

export const exportLeadsCSV = (leads: Lead[]): void => {
  const STATUS_LABELS: Record<LeadStatus, string> = {
    nouveau: "Nouveau", appele: "Appelé", traite: "Traité", converti: "Converti", archive: "Archivé",
  };

  const headers = ["Nom", "Email", "Téléphone", "Sujet", "Conseiller", "Format", "Disponibilité", "Statut", "Message", "Notes", "Date"];
  const rows = leads.map((l) => [
    l.nom,
    l.email,
    l.telephone ?? "",
    l.sujet ?? "",
    l.conseiller ? (ADVISOR_LABELS[l.conseiller] ?? l.conseiller) : "",
    l.format ? (FORMAT_LABELS[l.format] ?? l.format) : "",
    l.timing ? (TIMING_LABELS[l.timing] ?? l.timing) : "",
    STATUS_LABELS[l.status],
    (l.message ?? "").replace(/\n/g, " "),
    (l.notes ?? "").replace(/\n/g, " "),
    l.created_at.slice(0, 10),
  ]);

  const csv = [headers, ...rows]
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(";"))
    .join("\n");

  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads-kanti-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
