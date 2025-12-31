import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { NewsletterService } from '@/services/newsletter';

const newsletterService = new NewsletterService();

export async function POST(request: NextRequest) {
  try {
    // Проверка авторизации админа (добавьте свою логику)
    // const session = await getServerSession();
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { subject, htmlContent } = await request.json();

    if (!subject || !htmlContent) {
      return NextResponse.json(
        { error: 'Subject and content are required' },
        { status: 400 },
      );
    }

    const newsletter = await newsletterService.sendNewsletter(subject, htmlContent);

    return NextResponse.json({
      success: true,
      newsletter,
      message: `Newsletter sent to ${newsletter} subscribers`,
    });
  } catch (error: any) {
    console.error('Newsletter send error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send newsletter' },
      { status: 500 },
    );
  }
}
