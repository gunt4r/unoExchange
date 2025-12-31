import 'reflect-metadata';
import { NextResponse } from 'next/server';
import { Article } from '@/models/article';
import { getDataSource } from '@/libs/DB';

export async function GET() {
  try {
    const dataSource = await getDataSource();
    const articleRepo = dataSource.getRepository(Article);

    const articles = await articleRepo.find({
      order: { createdAt: 'DESC' },
    });
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 },
    );
  }
}
