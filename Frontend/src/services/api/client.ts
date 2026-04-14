import axios from 'axios';
import { authStore } from '@/store/authStore';

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!baseURL) {
  // eslint-disable-next-line no-console
  console.warn('EXPO_PUBLIC_API_BASE_URL is not set. API calls will fail until configured.');
}

export const api = axios.create({
  baseURL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = authStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      authStore.getState().clearSession();
    }

    return Promise.reject(error);
  },
);
