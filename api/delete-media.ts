export const config = { runtime: "edge" };

const BUCKET = "article-images";

async function verifyAdmin(token: string, supabaseUrl: string, serviceKey: string): Promise<boolean> {
  if (!token) return false;
  try {
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey: serviceKey },
    });
    if (!userRes.ok) return false;
    const user = await userRes.json();
    if (!user?.email) return false;

    const adminRes = await fetch(
      `${supabaseUrl}/rest/v1/admin_users?email=eq.${encodeURIComponent(user.email)}&active=eq.true&select=email&limit=1`,
      { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } },
    );
    if (!adminRes.ok) return false;
    const admins = await adminRes.json();
    return Array.isArray(admins) && admins.length > 0;
  } catch {
    return false;
  }
}

export default async function handler(req: Request): Promise<Response> {
  const cors = {
    "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN ?? "https://kanti.fr",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;

  if (!serviceKey || !supabaseUrl) {
    return new Response(
      JSON.stringify({ error: "SUPABASE_SERVICE_ROLE_KEY ou SUPABASE_URL manquant dans les variables d'environnement Vercel" }),
      { status: 500, headers: cors }
    );
  }

  // Auth check — admins uniquement
  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!(await verifyAdmin(token, supabaseUrl, serviceKey))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: cors });
  }

  let name: string;
  try {
    const body = await req.json();
    name = body.name;
    if (!name || typeof name !== "string") throw new Error("name missing");
  } catch {
    return new Response(JSON.stringify({ error: "Corps invalide — attendu { name: string }" }), { status: 400, headers: cors });
  }

  // Empêcher la traversée de chemin
  const safeName = name.replace(/\.\.\//g, "").replace(/\.\.\\/g, "");

  const storageRes = await fetch(`${supabaseUrl}/storage/v1/object/delete/${BUCKET}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${serviceKey}`,
      "apikey": serviceKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prefixes: [safeName] }),
  });

  if (!storageRes.ok) {
    const text = await storageRes.text();
    return new Response(JSON.stringify({ error: text }), { status: storageRes.status, headers: cors });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: cors });
}
