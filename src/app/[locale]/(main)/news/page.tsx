import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import ClientNewsPage from '@/components/pages/news/ClientNews';

type IIndexProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tag?: string }>;
};

export async function generateMetadata(props: IIndexProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Articles',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
    openGraph: {
      title: t('meta_title'),
      description: t('meta_description'),
      type: 'website',
    },
  };
}

export default async function ArticlesPage(props: IIndexProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  return (
    <ClientNewsPage />
  );
}

export const revalidate = 60;
