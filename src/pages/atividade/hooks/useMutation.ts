import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryClientKeys } from '@/lib/queryClientKeys';
import { toastError } from '@/lib/utils';
import { submitAttempt } from '@/services/tentativas';
import type { SubmitAttemptPayloadType } from '@/data/types/services';

export const useSubmitAttempt = (activityId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitAttemptPayloadType) =>
      submitAttempt(activityId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryClientKeys.attemptKeys.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryClientKeys.rankingKeys.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryClientKeys.activityKeys.detail(activityId),
      });
    },
    onError: (error) => {
      toastError(error, 'Não foi possível enviar a tentativa');
    },
  });
};
