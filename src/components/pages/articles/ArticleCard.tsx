import type { Article } from '@/models/article';
import Image from 'next/image';
import MyLink from '@/components/common/Link';

type Props = {
  article: Article;
  locale: string;
  href?: string;
};

export default function ArticleCard({ article, locale, href = 'articles' }: Props) {
  const publishedAt = article.publishedAt
    ? new Date(article.publishedAt)
    : null;
  return (
    <MyLink
      href={`/${href}/${article.slug}`}
      opacity
      className="group block rounded-lg text-cyan-50  shadow transition-shadow hover:border hover:border-cyan-100/10 hover:shadow-lg hover:shadow-cyan-100/10"
    >
      {article.image && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-all duration-300 ease-in-out group-hover:opacity-50"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <div className="p-4">
        <h2 className="mb-2 text-xl font-semibold transition-colors group-hover:text-cyan-100">
          {article.title}
        </h2>

        <div className="flex items-center justify-between text-xs text-cyan-50">
          {publishedAt && (
            <time dateTime={publishedAt.toISOString()}>
              {publishedAt.toLocaleDateString(locale)}
            </time>
          )}

          {article.viewCount > 0 && (
            <span>
              {article.viewCount}
              {' '}
              просмотров
            </span>
          )}
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {article.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="rounded bg-gray-100 px-2 py-1 text-xs"
              >
                #
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </MyLink>
  );
}
