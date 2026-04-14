import { AxiosError } from 'axios';
import { ApiError } from '@/types/api';

export function getApiErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ApiError>;
  const fallback = 'Algo salio mal. Intenta de nuevo.';

  if (axiosError?.code === 'ECONNABORTED') {
    return 'El servidor tardo demasiado en responder. Intenta de nuevo.';
  }

  if (!axiosError?.response && axiosError?.request) {
    return 'No se pudo conectar al servidor. Verifica que el backend este activo y la URL API sea correcta.';
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
    'Invalid credentials': 'Credenciales invalidas.',
    'Email already in use': 'Ese correo ya esta registrado.',
    'Profile not found': 'Completa tu perfil para continuar.',
    'Post not found': 'No encontramos la publicacion.',
    'Cannot express interest in a closed post': 'La publicacion esta cerrada.',
    'You cannot express interest in your own post': 'No puedes marcar interes en tu propia publicacion.',
    'You have already expressed interest in this post': 'Ya marcaste interes en esta publicacion.',
    'Only the post owner can view its interests': 'Solo el autor puede ver intereses de esta publicacion.',
  };

  return knownMessages[normalized] || normalized || fallback;
}
