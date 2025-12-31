import 'reflect-metadata';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { Article } from '@/models/article';
import { getDataSource } from '@/libs/DB';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ type: string }> },
) {
  try {
    const { type } = await params;
    const dataSource = await getDataSource();
    const articleRepo = dataSource.getRepository(Article);

    if (type !== 'article' && type !== 'news') {
      return NextResponse.json(
        { error: 'Invalid type' },
        { status: 400 },
      );
    }

    const articles = await articleRepo.find({
      where: { isActive: true, type },
      order: { createdAt: 'DESC' },
    });
    if (!articles) {
      return NextResponse.json(
        { error: 'Articles not found' },
        { status: 404 },
      );
    }
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 },
    );
  }
}
