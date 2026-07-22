import { NextResponse } from "next/server";
import { z } from "zod";
import { NEWSLETTER_ENABLED } from "@/lib/newsletter/config";
import { verifyToken } from "@/lib/newsletter/token";
import { getProvider } from "@/lib/newsletter/providers";
import { CONSENT_VERSION } from "@/lib/newsletter/consent";

const bodySchema = z.object({ token: z.string().min(1) });

/**
 * POST (não GET) de propósito: só a ação humana na página de confirmação dispara
 * isto. Um GET no link do email (scanner de antivírus, prefetch) não tem efeito,
 * o que preserva a prova de consentimento do double opt-in.
 */
export async function POST(req: Request) {
  if (!NEWSLETTER_ENABLED) {
    return NextResponse.json({ status: "disabled" }, { status: 404 });
  }

  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json({ status: "error" }, { status: 415 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ status: "error" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  const result = verifyToken(parsed.data.token);
  if (!result.valid) {
    // Assinatura inválida ou token expirado: mesmo destino.
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  try {
    const outcome = await getProvider().confirmSubscriber({
      email: result.payload.email,
      source: result.payload.source,
      consentAt: new Date().toISOString(),
      consentVersion: CONSENT_VERSION,
    });
    if (!outcome.ok) {
      return NextResponse.json({ status: "error" }, { status: 502 });
    }
  } catch (err) {
    console.error("[newsletter] falha no confirm:", err);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }

  return NextResponse.json({ status: "confirmed" });
}
