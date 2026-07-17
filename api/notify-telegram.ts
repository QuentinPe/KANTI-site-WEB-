import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId || token.startsWith("votre_")) {
    return res.status(200).json({ skipped: true });
  }

  const { message } = (req.body ?? {}) as { message?: string };
  if (!message) return res.status(400).json({ error: "No message" });

  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
    });
    return res.status(200).json(await r.json());
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
