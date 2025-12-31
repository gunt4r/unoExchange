import type { Article, ArticleType } from '@/models/article';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './api';

type CreateArticleDto = {
  image: string;
  title: string;
  html: string;
  type: ArticleType;
  isActive: boolean;
  // Новые SEO поля
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  author?: string;
  tags?: string[];
};

type UpdateArticleDto = {
  id: string;
} & CreateArticleDto;

const ARTICLES_KEY = ['articles'];

async function fetchArticles(): Promise<Article[]> {
  const { data } = await api.get<Article[]>('/articles');
  return data;
}

async function fetchArticlesByType(type: ArticleType): Promise<Article[]> {
  const { data } = await api.get<Article[]>(`/articles/type/${type}`);
  return data;
}
async function fetchArticleBySlug(slug: string): Promise<Article> {
  const { data } = await api.get<Article>(`/articles/${slug}`);
  return data;
}

async function createArticle(payload: CreateArticleDto): Promise<Article> {
  const { data } = await api.post<Article>('/admin/articles', payload);
  return data;
}

async function updateArticle({ id, ...payload }: UpdateArticleDto): Promise<Article> {
  const { data } = await api.put<Article>(`/admin/articles/${id}`, payload);
  return data;
}

async function deleteArticle(id: string): Promise<void> {
  await api.delete(`/admin/articles/${id}`);
}

async function incrementViewCount(slug: string): Promise<void> {
  await api.post(`/articles/${slug}/view`);
}

export function useArticles() {
  return useQuery({
    queryKey: ARTICLES_KEY,
    queryFn: fetchArticles,
    staleTime: 30_000,
  });
}

export function useArticlesByType(type: ArticleType) {
  return useQuery({
    queryKey: [ARTICLES_KEY, type],
    queryFn: () => fetchArticlesByType(type),
    staleTime: 30_000,
  });
}
export function useArticleBySlug(slug: string) {
  return useQuery({
    queryKey: [...ARTICLES_KEY, slug],
    queryFn: () => fetchArticleBySlug(slug),
    staleTime: 60_000,
    enabled: !!slug,
    retry: 2,
  });
}

export function useIncrementViewCount() {
  return useMutation({
    mutationFn: incrementViewCount,
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ARTICLES_KEY });
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateArticle,
    onMutate: async (updatedArticle) => {
      await queryClient.cancelQueries({ queryKey: ARTICLES_KEY });

      const previousArticles
        = queryClient.getQueryData<Article[]>(ARTICLES_KEY);

      queryClient.setQueryData<Article[]>(ARTICLES_KEY, (old): any =>
        old?.map(article =>
          article.id === updatedArticle.id
            ? { ...article, ...updatedArticle }
            : article,
        ) ?? []);

      return { previousArticles };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousArticles) {
        queryClient.setQueryData(ARTICLES_KEY, context.previousArticles);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ARTICLES_KEY });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteArticle,
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ARTICLES_KEY });

      const previousArticles
        = queryClient.getQueryData<Article[]>(ARTICLES_KEY);

      queryClient.setQueryData<Article[]>(ARTICLES_KEY, old =>
        old?.filter(article => article.id !== deletedId) ?? []);

      return { previousArticles };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousArticles) {
        queryClient.setQueryData(ARTICLES_KEY, context.previousArticles);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ARTICLES_KEY });
    },
  });
}
