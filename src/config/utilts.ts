import { getTranslations } from 'next-intl/server';

const t = getTranslations('Header');
export const navigation = [
  { name: t('home_link'), href: '/' },
  { name: t('news_link'), href: '/news' },
  { name: t('reviews_link'), href: '/reviews' },
  { name: t('articles_link'), href: '/articles' },
  { name: t('contacts_link'), href: '/contacts' },
];
