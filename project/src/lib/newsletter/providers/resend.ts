import { Resend } from "resend";
import type { NewsletterProvider } from "../types";
import { renderConfirmationEmail } from "@/emails/confirm-subscription";

/**
 * Adapter Resend. Único lugar do código que conhece o Resend e lê os segredos.
 * Um futuro adapter (ex: Listmonk) implementaria a mesma interface sem que o
 * componente ou as rotas precisem saber.
 */

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY não configurado.");
  return new Resend(key);
}

function getFrom(): string {
  const from = process.env.NEWSLETTER_FROM;
  if (!from) throw new Error("NEWSLETTER_FROM não configurado.");
  return from;
}

function getAudienceId(): string {
  const id = process.env.RESEND_AUDIENCE_ID;
  if (!id) throw new Error("RESEND_AUDIENCE_ID não configurado.");
  return id;
}

export const resendProvider: NewsletterProvider = {
  async sendConfirmationEmail({ email, confirmUrl }) {
    const resend = getResend();
    const { subject, html, text } = renderConfirmationEmail({ confirmUrl });

    const { error } = await resend.emails.send({
      from: getFrom(),
      to: email,
      subject,
      html,
      text,
    });

    if (error) {
      console.error("[newsletter] erro ao enviar email de confirmação:", error);
      return { ok: false };
    }
    return { ok: true };
  },

  async confirmSubscriber({ email, source, consentAt, consentVersion }) {
    const resend = getResend();

    // Prova de consentimento nesta fase: o próprio double opt-in (clique
    // confirmado) + o timestamp de criação do contato no Resend + a versão do
    // texto. Log durável por lead fica como incremento futuro (fora do escopo).
    console.info(
      `[newsletter] consentimento confirmado: ${email} source=${source} at=${consentAt} v=${consentVersion}`
    );

    const { error } = await resend.contacts.create({
      audienceId: getAudienceId(),
      email,
      unsubscribed: false,
    });

    if (error) {
      console.error("[newsletter] erro ao criar contato:", error);
      return { ok: false };
    }
    return { ok: true };
  },
};
