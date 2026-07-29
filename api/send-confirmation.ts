export const config = { runtime: "edge" };

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? "https://kanti.fr";

const CORS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: CORS });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[KANTI] RESEND_API_KEY non configuré — confirmation email ignoré");
    return json({ ok: true });
  }

  let body: { nom?: string; email?: string; sujet?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "JSON invalide" }, 400);
  }

  const { nom = "", email = "", sujet = "" } = body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Email invalide" }, 400);
  }

  const prenom = nom.split(" ")[0] || "vous";
  const calendlyUrl = process.env.CALENDLY_URL;

  const contextLine = sujet
    ? `<p style="margin:0 0 16px;color:#64748b;font-size:14px;">Motif de votre demande : <strong style="color:#1e293b">${sujet}</strong></p>`
    : "";

  const calendlyBlock = calendlyUrl
    ? `
      <div style="margin:28px 0;padding:20px 24px;background:#f0f4ff;border-radius:12px;border:1px solid #c7d7f4;">
        <p style="margin:0 0 10px;font-size:13px;color:#334155;font-weight:500;">Bloquer votre créneau dès maintenant</p>
        <a href="${calendlyUrl}" style="display:inline-block;padding:10px 22px;background:#0c1c3e;color:white;border-radius:100px;font-size:13px;font-weight:500;text-decoration:none;">
          Choisir un horaire →
        </a>
      </div>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:white;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">

        <!-- Header -->
        <tr>
          <td style="padding:28px 32px;background:#0c1c3e;">
            <img src="https://kanti.fr/logo-white.png" alt="KANTI" height="22" style="display:block;" />
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 32px 28px;">
            <p style="margin:0 0 20px;font-size:24px;font-weight:300;color:#0c1c3e;line-height:1.3;">
              Bonjour ${prenom},
            </p>
            <p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.6;font-weight:300;">
              Nous avons bien reçu votre demande. Un conseiller KANTI vous recontactera <strong>dans les 24 heures ouvrées</strong>.
            </p>
            ${contextLine}
            ${calendlyBlock}
            <div style="margin:28px 0 0;padding-top:24px;border-top:1px solid #e2e8f0;">
              <p style="margin:0 0 4px;font-size:13px;color:#94a3b8;">En cas de question urgente :</p>
              <p style="margin:0;font-size:13px;color:#334155;">
                📞 <a href="tel:+33663324809" style="color:#1e40af;text-decoration:none;">+33 6 63 32 48 09</a>
                &nbsp;·&nbsp;
                ✉️ <a href="mailto:kanti@adnfamily.com" style="color:#1e40af;text-decoration:none;">kanti@adnfamily.com</a>
              </p>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.6;">
              KANTI Patrimoine · 12 rue Ferrere, 33000 Bordeaux · Cabinet indépendant, immatriculé ORIAS<br>
              Vous recevez cet email car vous avez soumis un formulaire sur kanti.fr.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "KANTI Patrimoine <noreply@kanti.fr>",
        to: [email],
        subject: "Votre demande a bien été reçue — KANTI Patrimoine",
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[KANTI] Resend error:", err);
    }
  } catch (err) {
    console.error("[KANTI] send-confirmation fetch failed:", err);
  }

  return json({ ok: true });
}
