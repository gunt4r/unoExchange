import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { NewsletterService } from '@/services/newsletter';

const newsletterService = new NewsletterService();
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 },
      );
    }

    await newsletterService.subscribe(email);

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to subscribe' },
      { status: 500 },
    );
  }
}
