export const config = { runtime: "edge" };

const ADVISORS: Record<string, string> = {
  quentin: "Quentin Perromat (Associé Fondateur)",
  thomas: "Thomas Robert (Courtier & Assistant)",
  any: "Peu importe",
};
const FORMATS: Record<string, string> = {
  cabinet: "En cabinet — 12 rue Ferrere, Bordeaux",
  visio: "Visioconférence",
  telephone: "Par téléphone",
};
const TIMING: Record<string, string> = {
  asap: "Dès que possible",
  week: "Cette semaine",
  two_weeks: "Dans 2 semaines",
  month: "Dans le mois",
};

function escHtml(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default async function handler(req: Request): Promise<Response> {
  const cors = {
    "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN ?? "https://kanti.fr",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  let data: Record<string, string>;
  try {
    data = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "JSON invalide" }), { status: 400, headers: cors });
  }

  // Honeypot silencieux — on redirige quand même vers /merci
  if (data.website) {
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: cors });
  }

  // Validation minimale côté serveur
  if (!data.nom?.trim() || !data.email?.trim()) {
    return new Response(JSON.stringify({ error: "Nom et email requis" }), { status: 400, headers: cors });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    return new Response(JSON.stringify({ error: "Adresse email invalide" }), { status: 400, headers: cors });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("[KANTI] Telegram env vars manquantes");
    return new Response(JSON.stringify({ error: "Configuration serveur incomplète" }), { status: 500, headers: cors });
  }

  const now = new Date().toLocaleString("fr-FR", {
    timeZone: "Europe/Paris",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const lines: string[] = [
    "🔔 <b>Nouveau lead — Cabinet KANTI</b>",
    "",
    `👤 <b>Conseiller :</b> ${ADVISORS[data.conseiller] ?? "—"}`,
    `📍 <b>Format :</b> ${FORMATS[data.format] ?? "—"}`,
    `📅 <b>Disponibilité :</b> ${TIMING[data.timing] ?? "—"}`,
    `🏷️ <b>Sujet :</b> ${escHtml(data.sujet || "—")}`,
    "",
    "━━━━━━━━━━━━━━━━━",
    `<b>Nom :</b> ${escHtml(data.nom)}`,
    `<b>Email :</b> ${escHtml(data.email)}`,
    `<b>Tél :</b> ${data.telephone ? escHtml(data.telephone) : "—"}`,
  ];

  if (data.message?.trim()) {
    lines.push("");
    lines.push(`💬 <b>Message :</b>`);
    lines.push(`<i>${escHtml(data.message.trim())}</i>`);
  }

  lines.push("━━━━━━━━━━━━━━━━━");
  lines.push(`🕐 <i>Reçu le ${now}</i>`);

  const message = lines.join("\n");

  try {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    if (!tgRes.ok) {
      const err = await tgRes.text();
      console.error("[KANTI] Telegram error:", err);
      // On ne bloque pas l'utilisateur pour une erreur Telegram
    }
  } catch (err) {
    console.error("[KANTI] Fetch Telegram failed:", err);
  }

  // Also insert lead into Supabase
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseKey) {
    try {
      await fetch(`${supabaseUrl}/rest/v1/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({
          nom: data.nom,
          email: data.email,
          telephone: data.telephone || null,
          conseiller: data.conseiller || null,
          format: data.format || null,
          timing: data.timing || null,
          sujet: data.sujet || null,
          message: data.message || null,
          status: "nouveau",
        }),
      });
    } catch (err) {
      console.error("[KANTI] Supabase lead insert failed:", err);
    }
  }

  // Send confirmation email to the prospect (fire-and-forget)
  const baseUrl = process.env.ALLOWED_ORIGIN ?? "https://kanti.fr";
  fetch(`${baseUrl}/api/send-confirmation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nom: data.nom, email: data.email, sujet: data.sujet }),
  }).catch(() => {});

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: cors });
}
