import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { NewsletterService } from '@/services/newsletter';

const newsletterService = new NewsletterService();
export async function GET(_request: NextRequest) {
  try {
    const history = await newsletterService.getNewsletterHistory();
    return NextResponse.json({ history });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 },
    );
  }
}
