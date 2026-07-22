import type { NewsletterProvider } from "../types";
import { NEWSLETTER_PROVIDER } from "../config";
import { resendProvider } from "./resend";

/** Seleciona o adapter de provedor a partir da config. */
export function getProvider(): NewsletterProvider {
  switch (NEWSLETTER_PROVIDER) {
    case "resend":
      return resendProvider;
    default:
      throw new Error(`Provedor de newsletter desconhecido: ${NEWSLETTER_PROVIDER}`);
  }
}
