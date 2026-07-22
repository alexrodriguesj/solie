/**
 * Configuração central da newsletter.
 *
 * IMPORTANTE: este módulo é importado pelo componente client (NewsletterSignup),
 * então NÃO pode conter nenhum segredo. Chaves de API ficam apenas no adapter
 * (providers/resend.ts) e nas rotas, lidas de process.env no servidor.
 */

/** Liga/desliga a newsletter inteira. Constante (não env) porque o componente
 * é client e precisa ler o toggle sem expor variável de ambiente. */
export const NEWSLETTER_ENABLED = true;

/** Provedor ativo. Trocar aqui para migrar de adapter (ex: "listmonk"). */
export const NEWSLETTER_PROVIDER = "resend" as const;

export type NewsletterProviderName = typeof NEWSLETTER_PROVIDER;

/** Validade do token de double opt-in, em dias. */
export const TOKEN_TTL_DAYS = 7;

/**
 * Origens conhecidas do componente. O `source` vem do nosso próprio código, então
 * é restrito a este conjunto. Valor fora dele é normalizado para "desconhecido".
 */
export const NEWSLETTER_SOURCES = [
  "blog",
  "home",
  "rodape",
  "newsletter",
  "confirmar",
  "teste",
] as const;

export type NewsletterSource = (typeof NEWSLETTER_SOURCES)[number];

const SOURCE_SET = new Set<string>(NEWSLETTER_SOURCES);
const SOURCE_MAX_LEN = 32;

/** Normaliza o source: fora do allowlist (ou grande demais) vira "desconhecido". */
export function normalizeSource(raw: unknown): string {
  if (typeof raw !== "string") return "desconhecido";
  const trimmed = raw.trim().slice(0, SOURCE_MAX_LEN);
  return SOURCE_SET.has(trimmed) ? trimmed : "desconhecido";
}

/**
 * Base URL para montar o link de confirmação. Env-first, com fallback para o
 * domínio de produção. Só é usada no servidor (rotas de API).
 */
export function getSiteUrl(): string {
  const raw = process.env.SITE_URL ?? "https://soliepilates.com.br";
  return raw.replace(/\/+$/, "");
}
