import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

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
    } catch (err) {
      this.logger.error(`Falha ao enviar e-mail para ${email}: ${err.message}`);
    }
  }
}
