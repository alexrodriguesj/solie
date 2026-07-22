/**
 * Contrato do provedor de newsletter. O componente e as rotas só conhecem esta
 * interface; o adapter concreto (Resend hoje) é intercambiável sem tocar no
 * resto do código.
 */
export interface NewsletterProvider {
  /** Envia o email de double opt-in (transacional). */
  sendConfirmationEmail(input: {
    email: string;
    confirmUrl: string;
  }): Promise<{ ok: boolean }>;

  /** Após o clique de confirmação, insere/atualiza o contato como inscrito. */
  confirmSubscriber(input: {
    email: string;
    source: string;
    consentAt: string; // ISO timestamp
    consentVersion: string; // vem de consent.ts
  }): Promise<{ ok: boolean; alreadyExisted?: boolean }>;
}
