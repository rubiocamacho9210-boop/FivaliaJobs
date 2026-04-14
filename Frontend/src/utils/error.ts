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

  const message = axiosError.response.data.message;
  if (Array.isArray(message)) {
    return message[0] ?? fallback;
  }

  const normalized = (message || '').toString().trim();
  const knownMessages: Record<string, string> = {
    'Invalid credentials': t.errors.invalidCredentials,
    'Email already in use': t.errors.emailAlreadyInUse,
    'Profile not found': t.errors.profileNotFound,
    'Post not found': t.errors.postNotFound,
    'Cannot express interest in a closed post': t.errors.postClosed,
    'You cannot express interest in your own post': t.errors.cannotInterestOwnPost,
    'You have already expressed interest in this post': t.errors.alreadyExpressedInterest,
    'Only the post owner can view its interests': t.errors.onlyOwnerCanViewInterests,
  };

  return knownMessages[normalized] || normalized || fallback;
}
