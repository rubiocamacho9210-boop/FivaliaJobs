import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api/client';
import { queryKeys } from '@/hooks/queryKeys';

export type Notification = {
  id: string;
  type: 'INTEREST' | 'FOLLOW' | 'REVIEW';
  title: string;
  message: string;
  data?: Record<string, string>;
  createdAt: string;
  read: boolean;
};

const POLLING_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function useNotificationsQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.notifications,
    queryFn: async () => {
      const response = await api.get<Notification[]>('/notifications');
      return response.data;
    },
    refetchInterval: POLLING_INTERVAL,
    enabled,
  });
}

export function useNotificationsCountQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.notificationsCount,
    queryFn: async () => {
      const response = await api.get<number>('/notifications/count');
      return response.data;
    },
    refetchInterval: POLLING_INTERVAL,
    enabled,
  });
}
