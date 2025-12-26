import { useMutation } from '@tanstack/react-query';
import { api } from './api';

export function usePostContact() {
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/contacts', data);
      return response.data;
    },
  });
}
