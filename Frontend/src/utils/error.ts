import { AxiosError } from 'axios';
import { ApiError } from '@/types/api';
import { useI18n } from '@/i18n';

export function getApiErrorMessage(error: unknown): string {
  const { t } = useI18n.getState();
  const axiosError = error as AxiosError<ApiError>;
  const fallback = t.errors.generic;

  if (axiosError?.code === 'ECONNABORTED') {
    return t.errors.serverTimeout;
  }

  if (!axiosError?.response && axiosError?.request) {
    return t.errors.connectionFailed;
  }

  if (!axiosError?.response?.data) {
    return fallback;
  }

  const status = axiosError.response.status;

  if (status === 401) {
    return t.errors.invalidCredentials;
  }

  if (status === 403) {
    return t.errors.generic;
  }

  if (status === 404) {
    return t.errors.postNotFound;
  }

  if (status === 429) {
    return t.errors.generic;
  }

  const message = axiosError.response.data.message;
  if (Array.isArray(message)) {
    return message[0] ?? fallback;
  }

  const normalized = (message || '').toString().trim().toLowerCase();
  const knownMessages: Record<string, string> = {
    'invalid credentials': t.errors.invalidCredentials,
    'email already in use': t.errors.emailAlreadyInUse,
    'profile not found': t.errors.profileNotFound,
    'post not found': t.errors.postNotFound,
    'cannot express interest in a closed post': t.errors.postClosed,
    'you cannot express interest in your own post': t.errors.cannotInterestOwnPost,
    'you have already expressed interest in this post': t.errors.alreadyExpressedInterest,
    'only the post owner can view its interests': t.errors.onlyOwnerCanViewInterests,
    'internal server error': fallback,
  };

  return knownMessages[normalized] || fallback;
}
