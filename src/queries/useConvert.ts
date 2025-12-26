import { useMutation } from '@tanstack/react-query';
import { api } from './api';

type ConvertRequest = {
  from: string;
  to: string;
  amount: number;
};

type ConvertResponse = {
  success: boolean;
  conversion: {
    from: {
      code: string;
      name: string;
      amount: number;
    };
    to: {
      code: string;
      name: string;
      amount: number;
    };
    rate: number;
    timestamp: string;
  };
};

export const usePostConvert = () => {
  return useMutation({
    mutationFn: async (data: ConvertRequest): Promise<ConvertResponse> => {
      const response = await api.post<ConvertResponse>('/convert', data);
      return response.data;
    },
  });
};
