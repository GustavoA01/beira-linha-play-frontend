import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryClientKeys } from '@/lib/queryClientKeys';
import { toast } from '@/components/ui/toast';
import { toastError } from '@/lib/utils';
import {
  createMedal,
  deleteMedal,
  equipMedal,
  listMedals,
} from '@/services/medalhas';
import { useAuthUser } from '@/providers/UserProvider';
import { toUser } from '@/services/auth';

export const useCreateMedal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMedal,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryClientKeys.medalKeys.all,
      });
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

export const useGetMedals = () => {
  return useQuery({
    queryKey: queryClientKeys.medalKeys.all,
    queryFn: listMedals,
  });
};

export const useSelectMedal = () => {
  const { setUser } = useAuthUser();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: equipMedal,
    onSuccess: (user) => {
      setUser(toUser(user));
      void queryClient.invalidateQueries({
        queryKey: queryClientKeys.rankingKeys.all,
      });
      toast.add({ type: 'success', title: 'Medalha selecionada' });
    },
    onError: (error) => {
      console.error(error);
      toast.add({ type: 'error', title: 'Erro ao selecionar medalha' });
    },
  });
};

export const useDeleteMedal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMedal,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryClientKeys.medalKeys.all,
      });
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
