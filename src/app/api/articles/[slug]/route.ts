import 'reflect-metadata';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { Article } from '../../../../models/article';
import { getDataSource } from '@/libs/DB';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    console.log(slug);
    const dataSource = await getDataSource();
    const articleRepo = dataSource.getRepository(Article);

    const article = await articleRepo.findOne({
      where: { slug, isActive: true },
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 },
    );
  }
}
