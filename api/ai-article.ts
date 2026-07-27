export const config = { runtime: "edge" };

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? "https://kanti.fr";

const CORS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: CORS });
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

async function verifySupabaseToken(token: string): Promise<boolean> {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return false;
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey: supabaseKey },
    });
    if (!res.ok) return false;
    const user = await res.json();
    if (!user?.email) return false;

    // Verify the authenticated user has an active row in admin_users
    const adminRes = await fetch(
      `${supabaseUrl}/rest/v1/admin_users?email=eq.${encodeURIComponent(user.email)}&active=eq.true&select=email&limit=1`,
      { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } },
    );
    if (!adminRes.ok) return false;
    const admins = await adminRes.json();
    return Array.isArray(admins) && admins.length > 0;
  } catch {
    return false;
  }
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  // Verify Supabase session — only authenticated admins may use the AI endpoint
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token || !(await verifySupabaseToken(token))) {
    return json({ error: "Unauthorized" }, 401);
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return json({ error: "Service IA non configuré" }, 500);
  }

  let body: { action?: string; content?: string; title?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "JSON invalide" }, 400);
  }

  const { action, content = "", title = "" } = body;
  if (!content) return json({ error: "Contenu manquant" }, 400);

  const plainText = stripHtml(content);

  type PromptMap = Record<string, { system: string; user: string }>;
  const prompts: PromptMap = {
    summarize: {
      system:
        "Tu es expert en communication patrimoniale et financière pour le cabinet KANTI à Bordeaux. " +
        "Tu rédiges des extraits d'articles percutants, professionnels et accessibles, sans jargon inutile.",
      user:
        `Rédige un extrait accrocheur de 2 à 3 phrases pour cet article intitulé "${title || "Sans titre"}".\n\n` +
        `Contenu :\n${plainText.slice(0, 3000)}\n\n` +
        `Renvoie uniquement le texte de l'extrait, sans titre, sans liste, sans formatage markdown, sans guillemets encadrants.`,
    },
    reformat: {
      system:
        "Tu es rédacteur expert en contenu patrimonial et financier pour le cabinet KANTI. " +
        "Tu maîtrises les meilleures pratiques rédactionnelles : hiérarchie claire, paragraphes aérés, " +
        "formulations percutantes, style éditorial professionnel et accessible.",
      user:
        `Reformate et améliore ce contenu HTML d'article. Consignes strictes :\n` +
        `- Utilise des balises h2 et h3 pour structurer\n` +
        `- Aère les paragraphes (pas plus de 3 phrases par paragraphe)\n` +
        `- Reformule les phrases trop longues ou ambiguës\n` +
        `- Conserve fidèlement le sens, les données chiffrées et les exemples\n` +
        `- Ajoute des listes ul/li si pertinent pour les énumérations\n` +
        `- Style : expert, accessible, éditorial (pas de jargon inutile)\n` +
        `- Renvoie UNIQUEMENT du HTML valide (h2, h3, p, ul, ol, li, strong, em). ` +
        `Pas de doctype, pas de html, pas de body, pas de div, pas de markdown.\n\n` +
        `Contenu :\n${content.slice(0, 6000)}`,
    },
  };

  const prompt = prompts[action ?? ""];
  if (!prompt) return json({ error: `Action inconnue : ${action}` }, 400);

  try {
    const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: prompt.system },
          { role: "user", content: prompt.user },
        ],
        max_tokens: 2000,
        temperature: 0.65,
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("[KANTI] Groq error:", errText);
      return json({ error: "Service IA temporairement indisponible" }, 502);
    }

    const data = (await aiRes.json()) as { choices: { message: { content: string } }[] };
    const result = data.choices?.[0]?.message?.content ?? "";
    return json({ result });
  } catch (e) {
    console.error("[KANTI] AI fetch error:", e);
    return json({ error: "Service IA temporairement indisponible" }, 500);
  }
}
