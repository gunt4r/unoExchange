import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { NewsletterService } from '@/services/newsletter';

const newsletterService = new NewsletterService();
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 },
      );
    }

    await newsletterService.unsubscribe(token);

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to unsubscribe' },
      { status: 500 },
    );
  }
}
