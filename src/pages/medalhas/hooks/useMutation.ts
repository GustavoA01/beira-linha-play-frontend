import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/toast';
import { ApiError } from '@/services/api';
import { createMedal, deleteMedal } from '@/services/medalhas';
import { medalKeys } from '@/lib/queryClientKeys';

const toastError = (error: unknown, fallback: string) => {
  console.error(error);
  toast.add({
    type: 'error',
    title: error instanceof ApiError ? error.message : fallback,
  });
};

export const useCreateMedal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMedal,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: medalKeys.all });
      toast.add({
        type: 'success',
        title: 'Medalha adicionada',
      });
    },
    onError: (error) => {
      toastError(error, 'Não foi possível adicionar a medalha');
    },
  });
};

export const useDeleteMedal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMedal,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: medalKeys.all });
      toast.add({
        type: 'success',
        title: 'Medalha excluída',
      });
    },
    onError: (error) => {
      toastError(error, 'Não foi possível excluir a medalha');
    },
  });
};
