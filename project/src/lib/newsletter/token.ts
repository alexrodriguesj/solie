import crypto from "node:crypto";
import { TOKEN_TTL_DAYS } from "./config";

/**
 * Token HMAC stateless para o double opt-in. Sem banco: a prova de que o clique
 * é legítimo está na assinatura + expiração. Formato: `<payload>.<assinatura>`,
 * ambos em base64url.
 */

const TTL_MS = TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;

interface TokenPayload {
  email: string;
  source: string;
  iat: number; // issued-at em ms
}

function getSecret(): string {
  const secret = process.env.NEWSLETTER_SIGNING_SECRET;
  if (!secret) {
    throw new Error("NEWSLETTER_SIGNING_SECRET não configurado.");
  }
  return secret;
}

function sign(body: string): string {
  return crypto.createHmac("sha256", getSecret()).update(body).digest("base64url");
}

export function signToken(input: { email: string; source: string }): string {
  const payload: TokenPayload = {
    email: input.email,
    source: input.source,
    iat: Date.now(),
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export type VerifyResult =
  | { valid: true; payload: TokenPayload }
  | { valid: false; expired?: boolean };

export function verifyToken(token: string): VerifyResult {
  const parts = token.split(".");
  if (parts.length !== 2) return { valid: false };

  const [body, signature] = parts;
  const expected = sign(body);

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  // Comparação em tempo constante; timingSafeEqual exige buffers do mesmo tamanho.
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return { valid: false };
  }

  let payload: TokenPayload;
  try {
    payload = JSON.parse(Buffer.from(body, "base64url").toString("utf-8"));
  } catch {
    return { valid: false };
  }

  if (typeof payload.iat !== "number" || Date.now() - payload.iat > TTL_MS) {
    return { valid: false, expired: true };
  }

  return { valid: true, payload };
}
