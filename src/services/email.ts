import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export class EmailService {
  async sendEmail(to: string, subject: string, html: string) {
    try {
      const info = await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
        to,
        subject,
        html,
      });
      return info;
    } catch (error) {
      console.error('Email send error:', error);
      throw error;
    }
  }

  async sendBulkEmails(recipients: string[], subject: string, htmlContent: string) {
    const results = [];
    const errors = [];

    for (const email of recipients) {
      try {
        await this.sendEmail(email, subject, htmlContent);
        results.push({ email, status: 'sent' });

        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error: any) {
        errors.push({ email, error: error.message });
      }
    }

    return { results, errors };
  }

  async sendContactForm(data: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
  }) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f4f4f4; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
            .content { padding: 20px; background: #fff; border: 1px solid #ddd; border-radius: 5px; }
            .field { margin-bottom: 15px; }
            .field-label { font-weight: bold; color: #555; }
            .field-value { margin-top: 5px; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">Новое сообщение с формы контакта</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="field-label">Имя:</div>
                <div class="field-value">${data.name}</div>
              </div>
              <div class="field">
                <div class="field-label">Телефон:</div>
                <div class="field-value">${data.phone}</div>
              </div>
              <div class="field">
                <div class="field-label">Email:</div>
                <div class="field-value"><a href="mailto:${data.email}">${data.email}</a></div>
              </div>
              ${data.subject
                ? `
                <div class="field">
                  <div class="field-label">Тема:</div>
                  <div class="field-value">${data.subject}</div>
                </div>
              `
                : ''}
              <div class="field">
                <div class="field-label">Сообщение:</div>
                <div class="field-value" style="white-space: pre-wrap;">${data.message}</div>
              </div>
            </div>
            <div class="footer">
              <p>Это автоматическое письмо с формы контакта. Для ответа используйте email: ${data.email}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return await this.sendEmail(
      String(process.env.CONTACT_FORM_RECIPIENT || process.env.SMTP_FROM_EMAIL),
      `Контактная форма: ${data.subject || 'Новое сообщение'}`,
      html,
    );
  }

  async sendContactConfirmation(email: string, name: string) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .content { padding: 20px; background: #fff; border: 1px solid #ddd; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <h2>Здравствуйте, ${name}!</h2>
              <p>Спасибо за ваше сообщение. Мы получили его и ответим вам в ближайшее время.</p>
              <p>С уважением,<br>Команда поддержки</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return await this.sendEmail(
      email,
      'Мы получили ваше сообщение',
      html,
    );
  }
}
