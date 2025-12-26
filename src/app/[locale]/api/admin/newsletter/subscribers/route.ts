import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { NewsletterService } from '@/services/newsletter';

const newsletterService = new NewsletterService();
export async function GET(_request: NextRequest) {
  try {
    const subscribers = await newsletterService.getSubscribers();
    return NextResponse.json({ subscribers });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 },
    );
  }
}
