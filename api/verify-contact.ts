export const config = { runtime: "edge" };

const CORS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN ?? "*",
};

// Niveau 1 — formats stricts
const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const FR_PHONE = /^(?:(?:\+|00)33[\s.\-]?|0)[1-9](?:[\s.\-]?\d{2}){4}$/;

// Niveau 2 — MX lookup via Cloudflare DoH (gratuit, sans clé)
async function hasMXRecord(domain: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=MX`,
      { headers: { Accept: "application/dns-json" } },
    );
    if (!res.ok) return true; // fail open si réseau indisponible
    const data = await res.json();
    return data.Status === 0 && Array.isArray(data.Answer) && data.Answer.length > 0;
  } catch {
    return true; // fail open
  }
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: CORS });

  const body = await req.json().catch(() => ({})) as { email?: string; phone?: string };
  const result: {
    email?: { valid: boolean; reason?: "format" | "no_mx" };
    phone?: { valid: boolean };
  } = {};

  if (body.email) {
    const email = body.email.trim();
    if (!EMAIL_RE.test(email)) {
      result.email = { valid: false, reason: "format" };
    } else {
      const domain = email.split("@")[1];
      const mx = await hasMXRecord(domain);
      result.email = { valid: mx, reason: mx ? undefined : "no_mx" };
    }
  }

  if (body.phone) {
    const phone = body.phone.trim();
    result.phone = { valid: FR_PHONE.test(phone) };
  }

  return new Response(JSON.stringify(result), { status: 200, headers: CORS });
}
