export const config = { runtime: "edge" };

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? "https://kanti.fr";
const CORS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: CORS });
}

async function verifyAdmin(token: string): Promise<string | null> {
  const url = process.env.VITE_SUPABASE_URL ?? "https://zoqpsjodmlazmottqshl.supabase.co";
  const anon = process.env.VITE_SUPABASE_ANON_KEY ?? "sb_publishable_GLFFA7Uvvu7ZxM1pqWO4lQ_4XIQ2Sdy";
  const svc  = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!svc) return null;
  try {
    // 1. Resolve the user from their JWT
    const r = await fetch(`${url}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey: anon },
    });
    if (!r.ok) return null;
    const u = await r.json();
    if (!u?.email) return null;
    // 2. Confirm they are an active admin (query with service_role to bypass RLS)
    const ar = await fetch(
      `${url}/rest/v1/admin_users?email=eq.${encodeURIComponent(u.email)}&active=eq.true&select=email,role&limit=1`,
      { headers: { apikey: svc, Authorization: `Bearer ${svc}` } },
    );
    if (!ar.ok) return null;
    const admins = await ar.json();
    return Array.isArray(admins) && admins.length > 0 ? u.email : null;
  } catch { return null; }
}

async function log(
  supabaseUrl: string, svc: string,
  actor_id: string, action: string, target_email: string, metadata: object = {},
) {
  await fetch(`${supabaseUrl}/rest/v1/admin_activity_logs`, {
    method: "POST",
    headers: {
      apikey: svc, Authorization: `Bearer ${svc}`, "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ actor_id, action, target_email, metadata }),
  }).catch(() => {});
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const actorEmail = token ? await verifyAdmin(token) : null;
  if (!actorEmail) return json({ error: "Unauthorized" }, 401);

  const svc = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!svc) return json({ error: "Service non configuré (SUPABASE_SERVICE_ROLE_KEY manquant)" }, 500);
  const supabaseUrl = process.env.VITE_SUPABASE_URL ?? "https://zoqpsjodmlazmottqshl.supabase.co";

  let body: {
    action?: string;
    email?: string;
    display_name?: string;
    role?: string;
    permissions?: string[];
  };
  try { body = await req.json(); } catch { return json({ error: "JSON invalide" }, 400); }

  // ── invite ───────────────────────────────────────────────────────────────────
  if (body.action === "invite") {
    const { email, display_name, role = "admin", permissions = [] } = body;
    if (!email) return json({ error: "Email requis" }, 400);

    // Send invite via Supabase Auth admin API
    const inviteRes = await fetch(`${supabaseUrl}/auth/v1/invite`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${svc}`, apikey: svc,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, data: { display_name, role } }),
    });

    if (!inviteRes.ok) {
      const err = await inviteRes.json().catch(() => ({}));
      // "User already registered" is not fatal — we still add them to admin_users
      const alreadyExists = err.code === "email_exists" || err.msg?.includes("already") || err.message?.includes("already");
      if (!alreadyExists) {
        return json({ error: err.msg ?? err.message ?? "Erreur lors de l'invitation Supabase" }, 502);
      }
    }

    // Upsert avec uniquement les colonnes de base (email, role, active)
    // Les colonnes étendues (status, display_name…) sont ajoutées via ALTER TABLE séparé
    const upsertRes = await fetch(`${supabaseUrl}/rest/v1/admin_users`, {
      method: "POST",
      headers: {
        apikey: svc, Authorization: `Bearer ${svc}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({ email, role, active: true }),
    });

    if (!upsertRes.ok) {
      const err = await upsertRes.json().catch(() => ({}));
      return json({ error: "Erreur d'enregistrement : " + JSON.stringify(err) }, 500);
    }

    // Mise à jour des champs étendus si les colonnes existent (best-effort, pas bloquant)
    await fetch(
      `${supabaseUrl}/rest/v1/admin_users?email=eq.${encodeURIComponent(email)}`,
      {
        method: "PATCH",
        headers: {
          apikey: svc, Authorization: `Bearer ${svc}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          ...(display_name ? { display_name } : {}),
          status: "invited",
          invited_by: actorEmail,
        }),
      },
    ).catch(() => {});

    await log(supabaseUrl, svc, actorEmail, "invite_sent", email, { role });
    return json({ ok: true });
  }

  // ── cancel_invite ────────────────────────────────────────────────────────────
  if (body.action === "cancel_invite") {
    const { email } = body;
    if (!email) return json({ error: "Email requis" }, 400);

    const delRes = await fetch(
      `${supabaseUrl}/rest/v1/admin_users?email=eq.${encodeURIComponent(email)}&status=eq.invited`,
      {
        method: "DELETE",
        headers: { apikey: svc, Authorization: `Bearer ${svc}`, Prefer: "return=minimal" },
      },
    );
    if (!delRes.ok) return json({ error: "Erreur lors de l'annulation" }, 500);

    await log(supabaseUrl, svc, actorEmail, "invite_cancelled", email, {});
    return json({ ok: true });
  }

  // ── resend_invite ─────────────────────────────────────────────────────────────
  if (body.action === "resend_invite") {
    const { email } = body;
    if (!email) return json({ error: "Email requis" }, 400);

    const resendRes = await fetch(`${supabaseUrl}/auth/v1/invite`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${svc}`, apikey: svc,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    if (!resendRes.ok && !(await resendRes.json().catch(() => ({}))).code?.includes("exists")) {
      return json({ error: "Erreur lors du renvoi" }, 502);
    }

    await log(supabaseUrl, svc, actorEmail, "invite_resent", email, {});
    return json({ ok: true });
  }

  return json({ error: `Action inconnue : ${body.action}` }, 400);
}
