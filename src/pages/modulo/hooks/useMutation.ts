import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryClientKeys } from '@/lib/queryClientKeys';
import { toast } from '@/components/ui/toast';
import { toastError } from '@/lib/utils';
import { deleteActivity } from '@/services/atividades';

export const useDeleteActivity = (moduleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteActivity,
    onSuccess: () => {
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
