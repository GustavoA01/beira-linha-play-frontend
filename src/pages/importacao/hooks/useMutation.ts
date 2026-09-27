import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/toast';
import { queryClientKeys } from '@/lib/queryClientKeys';
import { toastError } from '@/lib/utils';
import { importarInscritos } from '@/services/importacao';

export const useImportarInscritos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: importarInscritos,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['importacao', 'logs'] });
      void queryClient.invalidateQueries({
        queryKey: queryClientKeys.courseKeys.all,
      });
      toast.add({
        type: 'success',
        title: 'Participantes importados',
      });
    },
    onError: (error) => {
      toastError(error, 'Não foi possível importar os participantes');
    },
  });
};
