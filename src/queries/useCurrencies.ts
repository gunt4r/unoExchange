import type { Currency } from '@/models/currency';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { REACT_QUERY_GET_CURRENCIES } from '@/config/const';
import { api } from './api';

export function useCurrencies() {
  return useQuery({
    queryKey: [REACT_QUERY_GET_CURRENCIES],
    queryFn: async () => {
      const response = await api.get('/currencies');
      return response;
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    retry: 3,
    retryDelay: 1000,
  });
}

export function useCurrenciesAdmin() {
  return useQuery({
    queryKey: [REACT_QUERY_GET_CURRENCIES],
    queryFn: async () => {
      const response = await api.get('/admin/currencies');
      return response.data as Currency[];
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    retry: 3,
    retryDelay: 1000,
  });
}

export function useCreateCurrency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      code: string;
      name: string;
      rateToZL: number;
      imageUrl?: string;
      reserve?: number;
      isBase?: boolean;
    }) => {
      const response = await api.post('/admin/currencies', data);
      return response.data as Currency;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REACT_QUERY_GET_CURRENCIES] });
    },
  });
}

export function useUpdateCurrency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Currency> }) => {
      const response = await api.patch(`/admin/currencies/${id}`, data);
      return response.data as Currency;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REACT_QUERY_GET_CURRENCIES] });
    },
  });
}

export function useDeleteCurrency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/admin/currencies/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REACT_QUERY_GET_CURRENCIES] });
    },
  });
}
