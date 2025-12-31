import { useMutation } from '@tanstack/react-query';
import { api } from './api';

export function useLoginAdmin() {
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post(`/admin/login`, data);
      return response.data;
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      const response = await api.post(`/admin/logout`);
      return response.data;
    },
  });
}
