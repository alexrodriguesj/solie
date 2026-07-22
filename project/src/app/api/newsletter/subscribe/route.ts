import { NextResponse } from "next/server";
import { z } from "zod";
import {
  NEWSLETTER_ENABLED,
  getSiteUrl,
  normalizeSource,
} from "@/lib/newsletter/config";
import { signToken } from "@/lib/newsletter/token";
import { getProvider } from "@/lib/newsletter/providers";
import { verifyTurnstile } from "@/lib/newsletter/turnstile";

// Corpo legítimo é só email, consent, source, honeypot e token: cabe folgado.
const MAX_BODY_BYTES = 4 * 1024;

const bodySchema = z.object({
  email: z.email(),
  consent: z.literal(true),
  source: z.string().min(1).default("desconhecido"),
  turnstileToken: z.string().min(1),
  // Honeypot: campo que humano nunca preenche.
  website: z.string().optional(),
});

function getClientIp(req: Request): string | undefined {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || undefined;
  return req.headers.get("x-real-ip") ?? undefined;
}

export async function POST(req: Request) {
  if (!NEWSLETTER_ENABLED) {
    return NextResponse.json({ status: "disabled" }, { status: 404 });
  }

  // Só JSON.
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json({ status: "error" }, { status: 415 });
  }

  // Cap defensivo pelo content-length (barato; req.json também limita na prática).
  const contentLength = Number(req.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ status: "error" }, { status: 413 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ status: "error" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { status: "error", message: "Dados inválidos." },
      { status: 400 }
    );
  }

  const { email, website, turnstileToken } = parsed.data;
  const source = normalizeSource(parsed.data.source);

  // Bot detectado pelo honeypot: descarta em silêncio, fingindo sucesso.
  if (website && website.trim() !== "") {
    return NextResponse.json({ status: "pending" });
  }

  // Turnstile antes de enviar, para não gastar cota do Resend com bot.
  const humano = await verifyTurnstile({
    token: turnstileToken,
    remoteIp: getClientIp(req),
  });
  if (!humano) {
    return NextResponse.json(
      { status: "error", message: "Verificação falhou." },
      { status: 400 }
    );
  }

  const token = signToken({ email, source });
  const confirmUrl = `${getSiteUrl()}/newsletter/confirmar?token=${encodeURIComponent(token)}`;

  try {
    await getProvider().sendConfirmationEmail({ email, confirmUrl });
  } catch (err) {
    // Falha interna não vaza para a resposta: mensagem sempre neutra.
    console.error("[newsletter] falha no subscribe:", err);
  }

  // Resposta SEMPRE neutra: nunca revela se o email já existia (anti-enumeração).
  return NextResponse.json({ status: "pending" });
}
