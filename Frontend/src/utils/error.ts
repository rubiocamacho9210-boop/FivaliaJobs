import { AxiosError } from 'axios';
import { ApiError } from '@/types/api';

export function getApiErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ApiError>;
  const fallback = 'Algo salio mal. Intenta de nuevo.';

  if (!axiosError?.response?.data) {
    return fallback;
  }

  const message = axiosError.response.data.message;
  if (Array.isArray(message)) {
    return message[0] ?? fallback;
  }

  return message || fallback;
}
