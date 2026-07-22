/**
 * Verificação server-side do Cloudflare Turnstile. Lê o segredo apenas aqui, no
 * servidor (nunca com prefixo NEXT_PUBLIC_). O token é de uso único e curta
 * duração: valide uma vez só.
 */
const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

function getSecret(): string {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) throw new Error("TURNSTILE_SECRET_KEY não configurado.");
  return secret;
}

export async function verifyTurnstile(input: {
  token: string;
  remoteIp?: string;
}): Promise<boolean> {
  const body = new URLSearchParams();
  body.set("secret", getSecret());
  body.set("response", input.token);
  if (input.remoteIp) body.set("remoteip", input.remoteIp);

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) {
      console.error("[newsletter] Turnstile siteverify HTTP", res.status);
      return false;
    }
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("[newsletter] Turnstile siteverify erro:", err);
    return false;
  }
}
