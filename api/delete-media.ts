export const config = { runtime: "edge" };

const BUCKET = "article-images";

export default async function handler(req: Request): Promise<Response> {
  const cors = {
    "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN ?? "*",
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

  let name: string;
  try {
    const body = await req.json();
    name = body.name;
    if (!name || typeof name !== "string") throw new Error("name missing");
  } catch {
    return new Response(JSON.stringify({ error: "Corps invalide — attendu { name: string }" }), { status: 400, headers: cors });
  }

  // Supabase Storage REST API bulk delete: POST /storage/v1/object/delete/{bucket}
  const storageRes = await fetch(`${supabaseUrl}/storage/v1/object/delete/${BUCKET}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${serviceKey}`,
      "apikey": serviceKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prefixes: [name] }),
  });

  if (!storageRes.ok) {
    const text = await storageRes.text();
    return new Response(JSON.stringify({ error: text }), { status: storageRes.status, headers: cors });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: cors });
}
