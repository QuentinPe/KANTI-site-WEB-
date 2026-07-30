export const config = { runtime: "edge" };

const CORS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN ?? "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

// Proxy vers Vercel Analytics REST API.
// Renvoie { configured: false } si les variables d'env sont absentes
// plutôt qu'une erreur réseau, ce qui permet un dégradé propre côté UI.
export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const token     = process.env.VERCEL_ACCESS_TOKEN;
  const teamId    = process.env.VERCEL_TEAM_ID;
  const projectId = process.env.VERCEL_PROJECT_ID;

  if (!token || !teamId || !projectId) {
    return new Response(JSON.stringify({ configured: false }), { status: 200, headers: CORS });
  }

  try {
    const { searchParams } = new URL(req.url);
    const metric = searchParams.get("metric") ?? "visitor-counts";
    const from   = searchParams.get("from")   ?? "";
    const to     = searchParams.get("to")     ?? "";

    const url = new URL(`https://vercel.com/api/v1/web/insights/stats/${metric}`);
    url.searchParams.set("teamId",    teamId);
    url.searchParams.set("projectId", projectId);
    url.searchParams.set("filter",    "{}");
    url.searchParams.set("env",       "production");
    if (from) url.searchParams.set("from", from);
    if (to)   url.searchParams.set("to",   to);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return new Response(
        JSON.stringify({ configured: true, error: res.status }),
        { status: 200, headers: CORS }
      );
    }

    const data = await res.json();
    return new Response(
      JSON.stringify({ configured: true, data }),
      { status: 200, headers: CORS }
    );
  } catch {
    return new Response(
      JSON.stringify({ configured: true, error: "FETCH_ERROR" }),
      { status: 200, headers: CORS }
    );
  }
}
