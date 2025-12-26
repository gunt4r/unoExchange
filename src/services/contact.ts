import { EmailService } from './email';

const emailService = new EmailService();

export class ContactService {
  async submitContactForm(data: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    userIp?: string;
  }) {
    // Валидация
    if (!data.name || data.name.length < 2) {
      throw new Error('Имя должно содержать минимум 2 символа');
    }

    if (!data.email || !/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(data.email)) {
      throw new Error('Некорректный email адрес');
    }

    try {
      await emailService.sendContactForm({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
      });

      if (process.env.CONTACT_FORM_SEND_CONFIRMATION === 'true') {
        await emailService.sendContactConfirmation(data.email, data.name);
      }
    } catch (emailError) {
      console.error('Failed to send contact email:', emailError);
    }

    return true;
  }
}
