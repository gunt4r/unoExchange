import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_GET_CURRENCIES } from '@/config/const';
import { api } from './api';

export function useCurrencies() {
  return useQuery({
    queryKey: [REACT_QUERY_GET_CURRENCIES],
    queryFn: async () => await api.get('/currencies'),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    retry: 3,
    retryDelay: 1000,
  });
}
