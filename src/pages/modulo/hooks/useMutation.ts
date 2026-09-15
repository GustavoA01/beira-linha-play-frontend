import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/toast';
import { ApiError } from '@/services/api';
import { deleteActivity } from '@/services/atividades';
import { activityKeys, courseKeys, moduleKeys } from '@/lib/queryClientKeys';

const toastError = (error: unknown, fallback: string) => {
  console.error(error);
  toast.add({
    type: 'error',
    title: error instanceof ApiError ? error.message : fallback,
  });
};

export const useDeleteActivity = (moduleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteActivity,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: moduleKeys.detail(moduleId),
      });
      void queryClient.invalidateQueries({ queryKey: moduleKeys.all });
      void queryClient.invalidateQueries({ queryKey: activityKeys.all });
      void queryClient.invalidateQueries({ queryKey: courseKeys.all });
      toast.add({
        type: 'success',
        title: 'Atividade excluída',
      });
    },
    onError: (error) => {
      toastError(error, 'Não foi possível excluir a atividade');
    },
  });
};
