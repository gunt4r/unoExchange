/* eslint-disable regexp/no-obscure-range */
import type { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import sanitize from 'sanitize-html';
import { getDataSource } from '@/libs/DB';
import { sanitizeOptions } from '@/libs/sanitizeOptions';
import { Article } from '@/models/article';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      image,
      title,
      html,
      type = 'article',
      isActive = true,
      slug,
      metaTitle,
      metaDescription,
      metaKeywords,
      author,
      tags,
    } = body;

    if (!title || !html) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 },
      );
    }

    const dataSource = await getDataSource();
    const articleRepo = dataSource.getRepository(Article);

    const sanitizedHtml = sanitize(html, sanitizeOptions);

    // Генерация slug если не указан
    let finalSlug = slug;
    if (!finalSlug) {
      finalSlug = title
        .toLowerCase()
        .replace(/[^а-яёa-z0-9]+/gi, '-')
        .replace(/(^-|-$)/g, '')
        .substring(0, 255);

      // Проверка уникальности slug
      const existingArticle = await articleRepo.findOne({ where: { slug: finalSlug } });
      if (existingArticle) {
        finalSlug = `${finalSlug}-${Date.now()}`;
      }
    }

    const article = articleRepo.create({
      image,
      title,
      html,
      sanitizedHtml,
      type,
      isActive,
      slug: finalSlug,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || sanitizedHtml.substring(0, 160),
      metaKeywords,
      author,
      tags,
    });

    const savedArticle = await articleRepo.save(article);

    revalidatePath('/articles');
    revalidatePath(`/articles/${savedArticle.slug}`);
    revalidatePath('/news');

    return NextResponse.json(savedArticle, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 },
    );
  }
}
