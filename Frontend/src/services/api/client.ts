import axios from 'axios';
import { authStore } from '@/store/authStore';

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL;
const isLikelyLocalhost = typeof baseURL === 'string' && /localhost|127\.0\.0\.1/.test(baseURL);

if (!baseURL) {
  // eslint-disable-next-line no-console
  console.warn('EXPO_PUBLIC_API_BASE_URL is not set. API calls will fail until configured.');
} else if (isLikelyLocalhost) {
  // eslint-disable-next-line no-console
  console.warn(
    'EXPO_PUBLIC_API_BASE_URL points to localhost. For real devices use your LAN IP, e.g. http://192.168.x.x:3000',
  );
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
