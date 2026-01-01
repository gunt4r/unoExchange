'use client';
import { useLocale, useTranslations } from 'next-intl';
import Loader from '@/components/common/loader';
import ArticleCard from '@/components/pages/articles/ArticleCard';
import { useArticlesByType } from '@/queries/useArticles';

export default function ClientNewsPage() {
  const { data: articles, isLoading, isPending, isError } = useArticlesByType('news');
  const t = useTranslations('Articles');
  const commonTranslation = useTranslations('Common');
  const locale = useLocale();

  if (isLoading || isPending) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-600">{commonTranslation('error')}</p>
      </div>
    );
  }
  return (
    <div className="mx-auto my-10 max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold text-cyan-50">
        {t('title')}
      </h1>

      {articles.length === 0
        ? (
            <div className="py-20 text-center">
              <p className="text-cyan-50">{commonTranslation('no_data')}</p>
            </div>
          )
        : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from(articles).map(article => (
                <ArticleCard href="news" key={article.id} article={article} locale={locale} />
              ))}
            </div>
          )}
    </div>
  );
}

export const revalidate = 60;
