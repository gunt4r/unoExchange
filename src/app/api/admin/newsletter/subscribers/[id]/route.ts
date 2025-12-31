import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { NewsletterService } from '@/services/newsletter';

const newsletterService = new NewsletterService();

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const deleted = await newsletterService.unsubscribeUser(id);

    return NextResponse.json({ deleted });
  } catch (error) {
    console.error('Failed to delete subscriber:', error);

    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message === 'Subscriber not found' ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
