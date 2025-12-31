import type { MetadataRoute } from 'next';
import { getDataSource } from '@/libs/DB';
import { Article } from '@/models/article';
import { getBaseUrl } from '@/utils/Helpers';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getBaseUrl();

  const dataSource = await getDataSource();
  const articleRepo = dataSource.getRepository(Article);

  const articles = await articleRepo.find({
    where: { isActive: true },
    select: ['slug', 'updatedAt', 'type'],
  });

  const articleUrls = articles.map(article => ({
    url: `${siteUrl}/${article.type === 'news' ? 'news' : 'articles'}/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...articleUrls,
  ];
}
