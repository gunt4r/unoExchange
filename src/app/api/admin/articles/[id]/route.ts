import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import sanitize from 'sanitize-html';
import { getDataSource } from '@/libs/DB';
import { sanitizeOptions } from '@/libs/sanitizeOptions';
import { Article } from '@/models/article';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { image, title, html, type, isActive } = body;

    if (!title || !html) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 },
      );
    }

    const dataSource = await getDataSource();
    const articleRepo = dataSource.getRepository(Article);

    const article = await articleRepo.findOne({ where: { id } });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 },
      );
    }

    const sanitizedHtml = sanitize(html, sanitizeOptions);

    article.image = image;
    article.title = title;
    article.html = html;
    article.sanitizedHtml = sanitizedHtml;
    article.type = type;
    article.isActive = isActive;

    const updatedArticle = await articleRepo.save(article);

    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const dataSource = await getDataSource();
    const articleRepo = dataSource.getRepository(Article);

    const article = await articleRepo.findOne({ where: { id } });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 },
      );
    }

    await articleRepo.remove(article);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 },
    );
  }
}
