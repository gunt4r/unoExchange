import type { Repository } from 'typeorm';
import crypto from 'node:crypto';
import sanitize from 'sanitize-html';
import { NewsletterStatus } from '@/enums/newsletter.enum';
import { getDataSource } from '@/libs/DB';
import { sanitizeOptions } from '@/libs/sanitizeOptions';
import { Newsletter } from '@/models/newsletter';
import { Subscriber } from '@/models/subscriber';
import { EmailService } from './email';

const emailService = new EmailService();

export class NewsletterService {
  private async getSubscriberRepository(): Promise<Repository<Subscriber>> {
    const dataSource = await getDataSource();
    return dataSource.getRepository(Subscriber);
  }

  private async getNewsletterRepository(): Promise<Repository<Newsletter>> {
    const dataSource = await getDataSource();
    return dataSource.getRepository(Newsletter);
  }

  async subscribe(email: string) {
    const subscriberRepo = await this.getSubscriberRepository();
    const existingSubscriber = await subscriberRepo.findOne({
      where: { email },
    });

    if (existingSubscriber) {
      if (existingSubscriber.isSubscribed) {
        throw new Error('Email already subscribed');
      }
      existingSubscriber.isSubscribed = true;
      return await subscriberRepo.save(existingSubscriber);
    }

    const unsubscribeToken = crypto.randomBytes(32).toString('hex');
    const subscriber = subscriberRepo.create({
      email,
      unsubscribeToken,
      isSubscribed: true,
    });

    return await subscriberRepo.save(subscriber);
  }

  async unsubscribe(token: string) {
    const subscriberRepo = await this.getSubscriberRepository();

    const subscriber = await subscriberRepo.findOne({
      where: { unsubscribeToken: token },
    });

    if (!subscriber) {
      throw new Error('Invalid unsubscribe token');
    }

    subscriber.isSubscribed = false;
    return await subscriberRepo.save(subscriber);
  }

  async getSubscribers() {
    const subscriberRepo = await this.getSubscriberRepository();
    return await subscriberRepo.find({
      where: { isSubscribed: true },
      order: { subscribedAt: 'DESC' },
    });
  }

  async sendNewsletter(subject: string, htmlContent: string) {
    const newsletterRepo = await this.getNewsletterRepository();

    const subscribers = await this.getSubscribers();

    if (subscribers.length === 0) {
      throw new Error('No subscribers found');
    }
    const sanitizedContent = sanitize(htmlContent, sanitizeOptions);
    const newsletter = newsletterRepo.create({
      subject,
      content: sanitizedContent,
      htmlContent,
      recipientsCount: subscribers.length,
      status: NewsletterStatus.DRAFT,
    });
    await newsletterRepo.save(newsletter);

    try {
      const emails = subscribers.map((sub) => {
        const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?token=${sub.unsubscribeToken}`;

        return {
          email: sub.email,
          html: `
            ${htmlContent}
            <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #666; text-align: center;">
              Не хотите получать рассылку? 
              <a href="${unsubscribeUrl}" style="color: #666;">Отписаться</a>
            </p>
          `,
        };
      });

      const { results, errors } = await emailService.sendBulkEmails(
        emails.map(e => e.email),
        subject,
        String(emails[0]?.html),
      );

      newsletter.status = NewsletterStatus.SENT;
      newsletter.sentAt = new Date();
      await newsletterRepo.save(newsletter);

      return { newsletter, results, errors };
    } catch (error) {
      newsletter.status = NewsletterStatus.FAILED;
      await newsletterRepo.save(newsletter);
      throw error;
    }
  }

  async getNewsletterHistory() {
    const newsletterRepo = await this.getNewsletterRepository();
    return await newsletterRepo.find({
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }
}
