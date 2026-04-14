import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/api/client';

export type CreateReportRequest = {
  targetType: 'REPORT_USER' | 'REPORT_POST';
  targetId: string;
  reason: 'SPAM' | 'HARASSMENT' | 'INAPPROPRIATE' | 'FAKE' | 'OTHER';
  details?: string;
};

export function useCreateReportMutation() {
  return useMutation({
    mutationFn: (payload: CreateReportRequest) => api.post('/reports', payload),
  });
}
