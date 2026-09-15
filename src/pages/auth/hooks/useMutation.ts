import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/toast';
import { ApiError } from '@/services/api';
import { login, logout, register } from '@/services/auth';
import { updateAccount } from '@/services/usuarios';
import type {
  LoginPayloadType,
  RegisterPayloadType,
} from '@/data/types/services';

const toastError = (error: unknown, fallback: string) => {
  console.error(error);
  toast.add({
    type: 'error',
    title: error instanceof ApiError ? error.message : fallback,
  });
};

const resetSessionQueries = (
  queryClient: ReturnType<typeof useQueryClient>
) => {
  queryClient.removeQueries();
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayloadType) => login(payload),
    onSuccess: () => {
      resetSessionQueries(queryClient);
    },
  });
};

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterPayloadType) => register(payload),
    onSuccess: () => {
      resetSessionQueries(queryClient);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    onSettled: () => {
      resetSessionQueries(queryClient);
    },
  });
};

export const useUpdateAccount = () =>
  useMutation({
    mutationFn: updateAccount,
    onSuccess: () => {
      toast.add({
        type: 'success',
        title: 'Conta atualizada',
      });
    },
    onError: (error) => {
      toastError(error, 'Não foi possível atualizar a conta');
    },
  });
