import type { Metadata } from 'next';
import NewsPageSlug from '@/components/pages/news/slug/ClientNewsSlug';
import { getDataSource } from '@/libs/DB';
import { getBaseUrl } from '@/utils/Helpers';
import { Article } from '../../../../../models/article';

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateStaticParams() {
  const dataSource = await getDataSource();
  const articleRepo = dataSource.getRepository(Article);

  const news = await articleRepo.find({
    where: { isActive: true, type: 'news' },
    select: ['slug'],
  });

  return news.map(article => ({
    slug: article.slug,
  }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const dataSource = await getDataSource();
  const articleRepo = dataSource.getRepository(Article);
  const news = await articleRepo.findOne({
    where: { slug, isActive: true },
  });

  if (!news) {
    return {
      title: 'News not found',
    };
  }

  const metaTitle = news.metaTitle || news.title;
  const metaDescription = news.metaDescription || news.sanitizedHtml?.substring(0, 160);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || getBaseUrl();

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: news.metaKeywords,
    authors: news.author ? [{ name: news.author }] : undefined,

    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: 'article',
      publishedTime: news.publishedAt?.toISOString(),
      modifiedTime: news.updatedAt.toISOString(),
      authors: news.author ? [news.author] : undefined,
      tags: news.tags,
      images: news.image
        ? [
            {
              url: news.image,
              width: 1200,
              height: 630,
              alt: news.title,
            },
          ]
        : undefined,
    },

    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: news.image ? [news.image] : undefined,
    },

    alternates: {
      canonical: `${siteUrl}/news/${news.slug}`,
    },
  };
}

export default async function NewsPage() {
  return (
    <NewsPageSlug />
  );
}

export const revalidate = 60;
