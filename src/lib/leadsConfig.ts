/* Shared config consumed by AdminLeadsList, leadsService (CSV export), and any future lead UI. */

export const ADVISOR_LABELS: Record<string, string> = {
  quentin: "Quentin Perromat",
  thomas: "Thomas Robert",
  any: "Peu importe",
};

export const ADVISOR_INITIALS: Record<string, string> = {
  quentin: "QP",
  thomas: "TR",
  any: "—",
};

export const FORMAT_LABELS: Record<string, string> = {
  cabinet: "En cabinet",
  visio: "Visioconférence",
  telephone: "Téléphone",
};

export const TIMING_LABELS: Record<string, string> = {
  asap: "Dès que possible",
  week: "Cette semaine",
  two_weeks: "Dans 2 semaines",
  month: "Dans le mois",
};
