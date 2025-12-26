import axios from 'axios';
import { getBaseUrl } from '@/utils/Helpers';

export const api = axios.create({
  baseURL: `${getBaseUrl()}/api`,
});

api.interceptors.response.use(
  response => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Произошла ошибка';
    return Promise.reject(new Error(message));
  },
);
