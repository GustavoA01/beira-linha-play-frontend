import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/toast';
import { ApiError } from '@/services/api';
import { createActivity, updateActivity } from '@/services/atividades';
import { activityKeys, courseKeys, moduleKeys } from '@/lib/queryClientKeys';
import type { SaveActivityPayloadType } from '@/data/types/services';

const toastError = (error: unknown, fallback: string) => {
  console.error(error);
  toast.add({
    type: 'error',
    title: error instanceof ApiError ? error.message : fallback,
  });
};

const invalidateActivityQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  moduleId: string
) => {
  void queryClient.invalidateQueries({
    queryKey: moduleKeys.detail(moduleId),
  });
  void queryClient.invalidateQueries({ queryKey: moduleKeys.all });
  void queryClient.invalidateQueries({ queryKey: activityKeys.all });
  void queryClient.invalidateQueries({ queryKey: courseKeys.all });
};

export const useCreateActivity = (moduleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SaveActivityPayloadType) =>
      createActivity(moduleId, payload),
    onSuccess: () => {
      invalidateActivityQueries(queryClient, moduleId);
      toast.add({
        type: 'success',
        title: 'Atividade criada',
      });
    },
    onError: (error) => {
      toastError(error, 'Não foi possível criar a atividade');
    },
  });
};

export const useUpdateActivity = (moduleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: SaveActivityPayloadType;
    }) => updateActivity(id, payload),
    onSuccess: () => {
      invalidateActivityQueries(queryClient, moduleId);
      toast.add({
        type: 'success',
        title: 'Atividade atualizada',
      });
    },
    onError: (error) => {
      toastError(error, 'Não foi possível atualizar a atividade');
    },
  });
};
