import { siteConfig } from "@/data/content";
import { formatWhatsAppLink } from "@/lib/utils";

/**
 * Template do email de confirmação (double opt-in), como HTML string.
 * Sem React Email para não puxar dependência só por um email.
 *
 * A Soliê não tem caixa monitorada: o rodapé avisa que é mensagem automática e
 * direciona para o WhatsApp do estúdio (reaproveitando o helper de link).
 */
export function renderConfirmationEmail(input: { confirmUrl: string }): {
  subject: string;
  html: string;
  text: string;
} {
  const { confirmUrl } = input;
  const whatsappLink = formatWhatsAppLink(siteConfig.whatsapp);
  const subject = "Confirme seu cadastro na newsletter da Soliê";

  const text = [
    "Falta um passo para concluir seu cadastro na newsletter da Soliê.",
    "",
    "Confirme pelo link abaixo:",
    confirmUrl,
    "",
    "Se você não fez este cadastro, é só ignorar este email.",
    "",
    "Esta é uma mensagem automática e não é monitorada. Para falar com a gente, use o WhatsApp:",
    whatsappLink,
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${subject}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f5f1ea;font-family:Arial,Helvetica,sans-serif;color:#2f3b2f;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f1ea;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;padding:40px 32px;max-width:480px;">
            <tr>
              <td>
                <h1 style="margin:0 0 16px;font-size:22px;color:#4a5d4a;">Falta um passo</h1>
                <p style="margin:0 0 24px;font-size:16px;line-height:1.6;">
                  Para concluir seu cadastro na newsletter da Soliê, confirme seu email clicando no botão abaixo.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                  <tr>
                    <td style="border-radius:9999px;background-color:#4a5d4a;">
                      <a href="${confirmUrl}" style="display:inline-block;padding:14px 28px;font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:9999px;">
                        Confirmar cadastro
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 24px;font-size:13px;line-height:1.6;color:#6b756b;">
                  Se o botão não funcionar, copie e cole este endereço no navegador:<br />
                  <a href="${confirmUrl}" style="color:#4a5d4a;word-break:break-all;">${confirmUrl}</a>
                </p>
                <p style="margin:0 0 24px;font-size:14px;line-height:1.6;">
                  Se você não fez este cadastro, é só ignorar este email.
                </p>
                <hr style="border:none;border-top:1px solid #e5ddd0;margin:0 0 16px;" />
                <p style="margin:0;font-size:12px;line-height:1.6;color:#9aa39a;">
                  Esta é uma mensagem automática e não é monitorada. Para falar com a gente, use o WhatsApp:
                  <a href="${whatsappLink}" style="color:#4a5d4a;">${siteConfig.phone}</a>.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, html, text };
}
