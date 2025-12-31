import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getDataSource } from '@/libs/DB';
import { Article } from '@/models/article';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const dataSource = await getDataSource();
    const articleRepo = dataSource.getRepository(Article);

    await articleRepo.increment({ slug }, 'viewCount', 1);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return NextResponse.json(
      { error: 'Failed to increment view count' },
      { status: 500 },
    );
  }
}
