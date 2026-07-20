export const config = { runtime: "edge" };

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? "https://kanti.fr";

export default async function handler(req: Request): Promise<Response> {
  const cors = {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: cors });

  // Internal-only endpoint — require shared secret
  const secret = req.headers.get("x-internal-secret");
  if (!secret || secret !== process.env.INTERNAL_API_SECRET) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: cors });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return new Response(JSON.stringify({ skipped: true }), { status: 200, headers: cors });
  }

  let body: { message?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "JSON invalide" }), { status: 400, headers: cors });
  }

  const { message } = body;
  if (!message) return new Response(JSON.stringify({ error: "No message" }), { status: 400, headers: cors });

  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
    });
    const result = await r.json();
    return new Response(JSON.stringify(result), { status: 200, headers: cors });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Telegram unavailable" }), { status: 500, headers: cors });
  }
}
