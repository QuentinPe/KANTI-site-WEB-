export const config = { runtime: "edge" };

const CORS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN ?? "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

// Proxy vers PostHog Insights API.
// Renvoie { configured: false } si les variables d'env sont absentes.
// Endpoint PostHog: POST https://eu.posthog.com/api/projects/{id}/insights/trend/
export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const apiKey    = process.env.POSTHOG_PERSONAL_API_KEY;
  const projectId = process.env.POSTHOG_PROJECT_ID;
  const host      = "https://eu.posthog.com";

  if (!apiKey || !projectId) {
    return new Response(JSON.stringify({ configured: false }), { status: 200, headers: CORS });
  }

  try {
    const { searchParams } = new URL(req.url);
    const type  = searchParams.get("type") ?? "clicks"; // "clicks" | "cta"
    const from  = searchParams.get("from") ?? "";
    const to    = searchParams.get("to")   ?? "";

    // Event filters by type
    const eventFilters: Record<string, { event: string; name: string }[]> = {
      clicks: [
        { event: "contact_cta_clicked",    name: "CTA Contact"          },
        { event: "contact_form_submitted",  name: "Formulaire soumis"    },
        { event: "risk_profile_quiz_started", name: "Quiz démarré"       },
      ],
      cta: [
        { event: "risk_profile_quiz_completed", name: "Quiz complété"     },
        { event: "risk_profile_sent_to_advisor", name: "Envoyé conseiller" },
        { event: "financing_simulator_email_submitted", name: "Email simulateur" },
        { event: "merci_page_viewed",            name: "Page Merci"        },
      ],
    };

    const events = eventFilters[type] ?? eventFilters.clicks;

    const results = await Promise.all(
      events.map(async ({ event, name }) => {
        const body = {
          events: [{ id: event, type: "events" }],
          date_from: from || "-30d",
          date_to:   to   || undefined,
          interval:  "day",
          insight:   "TRENDS",
        };

        const res = await fetch(
          `${host}/api/projects/${projectId}/insights/trend/`,
          {
            method: "POST",
            headers: {
              "Content-Type":  "application/json",
              "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify(body),
          }
        );

        if (!res.ok) return { event, name, count: 0, error: res.status };

        const data = (await res.json()) as {
          result?: { count?: number; data?: number[] }[];
        };
        const count = data.result?.[0]?.count ?? 0;
        const series = data.result?.[0]?.data  ?? [];
        return { event, name, count, series };
      })
    );

    return new Response(
      JSON.stringify({ configured: true, results }),
      { status: 200, headers: CORS }
    );
  } catch {
    return new Response(
      JSON.stringify({ configured: true, error: "FETCH_ERROR" }),
      { status: 200, headers: CORS }
    );
  }
}
