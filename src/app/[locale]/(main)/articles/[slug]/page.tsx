/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable react-dom/no-dangerously-set-innerhtml */
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import MyLink from '@/components/common/Link';
import ViewCounter from '@/components/pages/articles/viewCounter';
import { getDataSource } from '@/libs/DB';
import { Article } from '@/models/article';
import { getBaseUrl } from '@/utils/Helpers';

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateStaticParams() {
  const dataSource = await getDataSource();
  const articleRepo = dataSource.getRepository(Article);

  const articles = await articleRepo.find({
    where: { isActive: true, type: 'article' },
    select: ['slug'],
  });

  return articles.map(article => ({
    slug: article.slug,
  }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const dataSource = await getDataSource();
  const articleRepo = dataSource.getRepository(Article);
  const article = await articleRepo.findOne({
    where: { slug, isActive: true },
  });

  if (!article) {
    return {
      title: 'Article not found',
    };
  }

  const metaTitle = article.metaTitle || article.title;
  const metaDescription = article.metaDescription || article.sanitizedHtml?.substring(0, 160);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || getBaseUrl();

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: article.metaKeywords,
    authors: article.author ? [{ name: article.author }] : undefined,

    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: 'article',
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: article.author ? [article.author] : undefined,
      tags: article.tags,
      images: article.image
        ? [
            {
              url: article.image,
              width: 1200,
              height: 630,
              alt: article.title,
            },
          ]
        : undefined,
    },

    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: article.image ? [article.image] : undefined,
    },

    alternates: {
      canonical: `${siteUrl}/articles/${article.slug}`,
    },
  };
}

export default async function ArticlesPage({ params }: Props) {
  const { slug, locale } = await params;

  const dataSource = await getDataSource();
  const articleRepo = dataSource.getRepository(Article);
  const article = await articleRepo.findOne({
    where: { slug, isActive: true },
  });

  if (!article) {
    notFound();
  }

  const siteUrl = getBaseUrl();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': article.type,
    'headline': article.title,
    'description': article.metaDescription || article.sanitizedHtml?.substring(0, 160),
    'image': article.image,
    'datePublished': article.publishedAt?.toISOString(),
    'dateModified': article.updatedAt.toISOString(),
    'author': {
      '@type': 'Person',
      'name': article.author || 'Author',
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'unoexchange',
      'logo': {
        '@type': 'ImageObject',
        'url': `${siteUrl}/logo.png`,
      },
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${siteUrl}/articles/${article.slug}`,
    },
    'keywords': article.tags?.join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-4xl px-4 py-8">
        <nav className="mb-4 text-sm text-gray-600" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li><MyLink href="/" opacity>Home</MyLink></li>
            <li>/</li>
            <li><MyLink href="/articles" opacity>Articles</MyLink></li>
            <li>/</li>
            <li className="text-gray-900" aria-current="page">{article.title}</li>
          </ol>
        </nav>

        <h1 className="mb-4 text-4xl font-bold">{article.title}</h1>

        <div className="mb-6 flex flex-wrap gap-4 text-sm text-gray-600">
          {article.author && (
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              {article.author}
            </span>
          )}
          {article.publishedAt && (
            <time dateTime={article.publishedAt.toISOString()} className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {new Date(article.publishedAt).toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}
          {article.viewCount > 0 && (
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              {article.viewCount}
              {' '}
              views
            </span>
          )}
        </div>

        {article.image && (
          <div className="relative mb-8 h-96 w-full overflow-hidden rounded-lg">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
        )}

        <div
          className="prose prose-lg prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: article.sanitizedHtml || '' }}
        />

        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 border-t pt-8">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <div
                  key={tag}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm transition-colors hover:bg-gray-200"
                >
                  #
                  {tag}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <MyLink
            href="/articles"
            opacity
            className="inline-flex items-center gap-2 text-cyan-50 "
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </MyLink>
        </div>
      </article>

      <ViewCounter slug={article.slug} />
    </>
  );
}

export const revalidate = 60;
