'use client';

import { useEffect } from 'react';
import { useIncrementViewCount } from '@/queries/useArticles';

export default function ViewCounter({ slug }: { slug: string }) {
  const incrementView = useIncrementViewCount();

  useEffect(() => {
    const timer = setTimeout(() => {
      incrementView.mutate(slug);
    }, 3000);

    return () => clearTimeout(timer);
  }, [slug, incrementView]);

  return null;
}
