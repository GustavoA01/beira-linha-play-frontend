import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/toast';
import { ApiError } from '@/services/api';
import { submitAttempt } from '@/services/tentativas';
import { activityKeys, attemptKeys, rankingKeys } from '@/lib/queryClientKeys';
import type { SubmitAttemptPayloadType } from '@/data/types/services';

const toastError = (error: unknown, fallback: string) => {
  console.error(error);
  toast.add({
    type: 'error',
    title: error instanceof ApiError ? error.message : fallback,
  });
};

export const useSubmitAttempt = (activityId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitAttemptPayloadType) =>
      submitAttempt(activityId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: attemptKeys.all });
      void queryClient.invalidateQueries({ queryKey: rankingKeys.all });
      void queryClient.invalidateQueries({
        queryKey: activityKeys.detail(activityId),
      });
    },
    onError: (error) => {
      toastError(error, 'Não foi possível enviar a tentativa');
    },
  });
};
