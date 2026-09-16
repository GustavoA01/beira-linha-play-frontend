import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryClientKeys } from '@/lib/queryClientKeys';
import { toast } from '@/components/ui/toast';
import { toastError } from '@/lib/utils';
import { createActivity, updateActivity } from '@/services/atividades';
import type { SaveActivityPayloadType } from '@/data/types/services';

const invalidateActivityQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  moduleId: string
) => {
  void queryClient.invalidateQueries({
    queryKey: queryClientKeys.moduleKeys.detail(moduleId),
  });
  void queryClient.invalidateQueries({
    queryKey: queryClientKeys.moduleKeys.all,
  });
  void queryClient.invalidateQueries({
    queryKey: queryClientKeys.activityKeys.all,
  });
  void queryClient.invalidateQueries({
    queryKey: queryClientKeys.courseKeys.all,
  });
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
