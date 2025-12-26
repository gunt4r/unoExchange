import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { ContactService } from '@/services/contact';

const contactService = new ContactService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message, phone } = body;

    const userIp = request.headers.get('x-forwarded-for')
      || request.headers.get('x-real-ip')
      || 'unknown';

    const contactMessage = await contactService.submitContactForm({
      name,
      email,
      phone,
      subject,
      message,
      userIp,
    });

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully.',
      contactMessage,
    });
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Не удалось отправить сообщение. Попробуйте позже.',
      },
      { status: 400 },
    );
  }
}
