import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_GET_NEWSLETTER_HISTORY, REACT_QUERY_GET_NEWSLETTER_SUBSCRIBERS } from '@/config/const';
import { api } from './api';

export const usePostNewsletter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/subscribe', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter'] });
    },
  });
};

export const useGetSubscribers = () => {
  return useQuery({
    queryKey: [REACT_QUERY_GET_NEWSLETTER_SUBSCRIBERS],
    queryFn: async () => await api.get('/admin/newsletter/subscribers'),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    retry: 3,
    retryDelay: 1000,
  });
};

export const useGetHistory = () => {
  return useQuery({
    queryKey: [REACT_QUERY_GET_NEWSLETTER_HISTORY],
    queryFn: async () => await api.get('/admin/newsletter/history'),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    retry: 3,
    retryDelay: 1000,
  });
};

export const useSendNewsletter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/admin/newsletter', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter'] });
    },
  });
};

export const useUnsubscribeUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.delete(`/admin/newsletter/subscribers/${data}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REACT_QUERY_GET_NEWSLETTER_SUBSCRIBERS] });
    },
  });
};
