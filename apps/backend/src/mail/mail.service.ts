import { Injectable, Logger } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: any;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host:   process.env.MAIL_HOST,
      port:   Number(process.env.MAIL_PORT ?? 587),
      secure: process.env.MAIL_SECURE === 'true',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async enviarNotificacaoDocumentos(params: { nome: string; email: string; docsLabel: string[] }) {
    const { nome, email, docsLabel } = params;
    const primeiroNome = nome.split(' ')[0];
    const listaHtml = docsLabel.map(d =>
      `<li style="margin-bottom:6px;font-size:14px;color:#78350f;">📄 ${d}</li>`
    ).join('');
    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#001b3d;padding:32px 40px;border-bottom:4px solid #ffd21f;">
            <p style="margin:0;color:#ffd21f;font-size:22px;font-weight:bold;letter-spacing:1px;">MERITUS</p>
            <p style="margin:4px 0 0;color:#ffffff;font-size:12px;opacity:0.7;">Gestores Escolares — Prefeitura Municipal de Oriximiná/PA</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <h2 style="margin:0 0 8px;color:#001b3d;font-size:20px;">Atualização de Documentos Necessária</h2>
            <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 24px;">
              Olá, <strong>${primeiroNome}</strong>!<br/>
              Identificamos que ${docsLabel.length === 1 ? 'um documento da sua inscrição precisa' : `${docsLabel.length} documentos da sua inscrição precisam`} ser ${docsLabel.length === 1 ? 'reenviado' : 'reenviados'} no <strong>Processo Seletivo de Gestores Escolares</strong>.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fbbf24;border-radius:10px;margin-bottom:28px;">
              <tr><td style="padding:18px 20px;">
                <p style="margin:0 0 10px;font-size:13px;font-weight:bold;color:#92400e;">⚠️ Documento${docsLabel.length > 1 ? 's' : ''} pendente${docsLabel.length > 1 ? 's' : ''}:</p>
                <ul style="margin:0;padding-left:18px;">
                  ${listaHtml}
                </ul>
              </td></tr>
            </table>
            <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 8px;">
              Para reenviar, faça login na plataforma Meritus e clique em <strong>"Reenviar documentos"</strong> na sua área do candidato.
            </p>
            <p style="color:#9ca3af;font-size:12px;margin:0;">Em caso de dúvidas, entre em contato com a Secretaria Municipal de Educação — SEMED.</p>
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
            <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;">Secretaria Municipal de Educação — SEMED · Oriximiná/PA</p>
            <p style="margin:0;font-size:11px;color:#d1d5db;">Este é um e-mail automático. Não responda a esta mensagem.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
    try {
      await this.transporter.sendMail({
        from: `"Meritus — SEMED Oriximiná" <${process.env.MAIL_USER}>`,
        to: email,
        subject: `⚠️ Ação necessária: reenvie seus documentos — Meritus`,
        html,
      });
      this.logger.log(`E-mail de notificação de docs enviado para ${email}`);
    } catch (err: any) {
      this.logger.error(`Falha ao notificar ${email}: ${err?.message}`);
    }
  }

  async enviarMensagemPersonalizada(params: { nome: string; email: string; assunto: string; mensagem: string }) {
    const { nome, email, assunto, mensagem } = params;
    const primeiroNome = nome.split(' ')[0];
    const linhas = mensagem.replace(/\n/g, '<br/>');
    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#001b3d;padding:32px 40px;border-bottom:4px solid #ffd21f;">
            <p style="margin:0;color:#ffd21f;font-size:22px;font-weight:bold;letter-spacing:1px;">MERITUS</p>
            <p style="margin:4px 0 0;color:#ffffff;font-size:12px;opacity:0.7;">Gestores Escolares — Prefeitura Municipal de Oriximiná/PA</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <h2 style="margin:0 0 16px;color:#001b3d;font-size:18px;">${assunto}</h2>
            <p style="color:#555;font-size:15px;margin:0 0 4px;">Olá, <strong>${primeiroNome}</strong>!</p>
            <div style="color:#444;font-size:14px;line-height:1.7;margin:16px 0 24px;padding:16px 20px;background:#f9fafb;border-left:4px solid #001b3d;border-radius:4px;">
              ${linhas}
            </div>
            <p style="color:#9ca3af;font-size:12px;margin:0;">Em caso de dúvidas, entre em contato com a Secretaria Municipal de Educação — SEMED.</p>
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
            <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;">Secretaria Municipal de Educação — SEMED · Oriximiná/PA</p>
            <p style="margin:0;font-size:11px;color:#d1d5db;">Este é um e-mail automático. Não responda a esta mensagem.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
    try {
      await this.transporter.sendMail({
        from: `"Meritus — SEMED Oriximiná" <${process.env.MAIL_USER}>`,
        to: email,
        subject: assunto,
        html,
      });
      this.logger.log(`Mensagem personalizada enviada para ${email}`);
    } catch (err: any) {
      this.logger.error(`Falha ao enviar mensagem para ${email}: ${err?.message}`);
    }
  }

  async enviarResultadoHomologacao(params: { nome: string; email: string; habilitado: boolean; justificativa?: string; linkDiario?: string }) {
    const { nome, email, habilitado, justificativa, linkDiario } = params;
    const appUrl = process.env.APP_URL ?? 'https://meritus.oriximina.pa.gov.br';
    const primeiroNome = nome.split(' ')[0];
    const cor = habilitado ? '#166534' : '#991b1b';
    const bgCor = habilitado ? '#f0fdf4' : '#fef2f2';
    const bordaCor = habilitado ? '#86efac' : '#fecaca';
    const titulo = habilitado ? '✅ Inscrição Habilitada' : '❌ Inscrição Inabilitada';
    const texto = habilitado
      ? 'Sua inscrição foi <strong>habilitada</strong> na etapa de Habilitação Documental. Você está apto a prosseguir nas próximas etapas do processo seletivo.'
      : 'Sua inscrição foi <strong>inabilitada</strong> na etapa de Habilitação Documental. Consulte a justificativa abaixo e acesse o sistema para mais detalhes.';
    const justificativaHtml = !habilitado && justificativa ? `
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;margin:20px 0;">
        <tr><td style="padding:16px 20px;">
          <p style="margin:0 0 6px;font-size:13px;font-weight:bold;color:#991b1b;">Justificativa:</p>
          <p style="margin:0;font-size:14px;color:#7f1d1d;line-height:1.6;">${justificativa}</p>
        </td></tr>
      </table>` : '';
    const linkDiarioHtml = linkDiario ? `
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:10px;margin:20px 0;">
        <tr><td style="padding:16px 20px;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:bold;color:#0369a1;">📋 Resultado no Diário Oficial</p>
          <p style="margin:0 0 12px;font-size:13px;color:#0c4a6e;line-height:1.6;">Confira o resultado publicado no Diário Oficial do Município:</p>
          <a href="${linkDiario}" target="_blank" style="display:inline-block;padding:10px 20px;background:#0369a1;color:#ffffff;font-size:13px;font-weight:bold;border-radius:8px;text-decoration:none;">Acessar Diário Oficial</a>
        </td></tr>
      </table>` : '';
    const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr><td style="background:#001b3d;padding:32px 40px;border-bottom:4px solid #ffd21f;">
          <p style="margin:0;color:#ffd21f;font-size:22px;font-weight:bold;">MERITUS</p>
          <p style="margin:4px 0 0;color:#fff;font-size:12px;opacity:0.7;">Gestores Escolares — Prefeitura Municipal de Oriximiná/PA</p>
        </td></tr>
        <tr><td style="padding:40px;">
          <h2 style="margin:0 0 8px;color:#001b3d;font-size:20px;">${titulo}</h2>
          <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 20px;">Olá, <strong>${primeiroNome}</strong>!<br/>${texto}</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:${bgCor};border:2px solid ${bordaCor};border-radius:10px;margin-bottom:20px;">
            <tr><td style="padding:18px 20px;text-align:center;">
              <p style="margin:0;font-size:18px;font-weight:bold;color:${cor};">${habilitado ? 'HABILITADO' : 'INABILITADO'}</p>
              <p style="margin:4px 0 0;font-size:12px;color:#6b7280;">Resultado da Homologação de Inscrições</p>
            </td></tr>
          </table>
          ${justificativaHtml}
          ${linkDiarioHtml}
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin:20px 0;">
            <tr><td style="padding:20px;text-align:center;">
              <p style="margin:0 0 12px;font-size:14px;color:#374151;">${habilitado
                ? 'Acesse sua <strong>Área do Candidato</strong> para acompanhar as próximas etapas do processo seletivo.'
                : 'Acesse sua <strong>Área do Candidato</strong> para consultar todos os detalhes do seu resultado e documentos analisados.'
              }</p>
              <a href="${appUrl}/login" target="_blank" style="display:inline-block;padding:12px 28px;background:#001b3d;color:#ffffff;font-size:14px;font-weight:bold;border-radius:8px;text-decoration:none;">Acessar Área do Candidato</a>
            </td></tr>
          </table>
          <p style="color:#9ca3af;font-size:12px;margin:0;">Em caso de dúvidas, entre em contato com a SEMED.</p>
        </td></tr>
        <tr><td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
          <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;">Secretaria Municipal de Educação — SEMED · Oriximiná/PA</p>
          <p style="margin:0;font-size:11px;color:#d1d5db;">Este é um e-mail automático. Não responda a esta mensagem.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
    try {
      await this.transporter.sendMail({
        from: `"Meritus — SEMED Oriximiná" <${process.env.MAIL_USER}>`,
        to: email,
        subject: `${habilitado ? '✅' : '❌'} Resultado da Homologação — Meritus`,
        html,
      });
      this.logger.log(`E-mail de resultado enviado para ${email}`);
    } catch (err: any) {
      this.logger.error(`Falha ao enviar resultado para ${email}: ${err?.message}`);
    }
  }

  async enviarConfirmacaoInscricao(params: {
    nome: string;
    email: string;
    protocolo: string;
  }) {
    const { nome, email, protocolo } = params;
    const primeiroNome = nome.split(' ')[0];
    const dataAtual = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric',
    });

    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#001b3d;padding:32px 40px;border-bottom:4px solid #ffd21f;">
              <p style="margin:0;color:#ffd21f;font-size:22px;font-weight:bold;letter-spacing:1px;">MERITUS</p>
              <p style="margin:4px 0 0;color:#ffffff;font-size:12px;opacity:0.7;">Gestores Escolares — Prefeitura Municipal de Oriximiná/PA</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;color:#001b3d;font-size:20px;">Inscrição Recebida com Sucesso!</h2>
              <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 24px;">
                Olá, <strong>${primeiroNome}</strong>!<br/>
                Sua inscrição no <strong>Processo Seletivo de Gestores Escolares</strong> foi recebida e registrada em nosso sistema.
              </p>

              <!-- Protocolo -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f7ff;border:2px solid #38b6ff;border-radius:10px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px;text-align:center;">
                    <p style="margin:0 0 4px;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Número de Protocolo</p>
                    <p style="margin:0;font-size:22px;font-weight:bold;color:#001b3d;font-family:monospace;letter-spacing:2px;">${protocolo}</p>
                  </td>
                </tr>
              </table>

              <!-- Aviso -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fbbf24;border-radius:10px;margin-bottom:28px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 6px;font-size:13px;font-weight:bold;color:#92400e;">⏳ Próximo passo</p>
                    <p style="margin:0;font-size:14px;color:#78350f;line-height:1.6;">
                      Aguarde a avaliação da comissão responsável para habilitação ou não no processo seletivo. O resultado será comunicado através desta plataforma.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 8px;">
                Guarde o número do seu protocolo. Você pode acompanhar o andamento da sua inscrição na <strong>Área do Candidato</strong> da plataforma.
              </p>
              <p style="color:#9ca3af;font-size:12px;margin:0;">Data de inscrição: ${dataAtual}</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;">
                Secretaria Municipal de Educação — SEMED · Oriximiná/PA
              </p>
              <p style="margin:0;font-size:11px;color:#d1d5db;">
                Este é um e-mail automático. Não responda a esta mensagem.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    try {
      await this.transporter.sendMail({
        from: `"Meritus — SEMED Oriximiná" <${process.env.MAIL_USER}>`,
        to: email,
        subject: `✅ Inscrição Recebida — Protocolo ${protocolo}`,
        html,
      });
      this.logger.log(`E-mail de confirmação enviado para ${email}`);
    } catch (err: any) {
      this.logger.error(`Falha ao enviar e-mail para ${email}: ${err.message}`);
    }
  }
}
