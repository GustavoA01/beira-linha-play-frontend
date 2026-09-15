import { newAdminSchema, type NewAdminFormType } from '@/data/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useCreateAdmin } from './useMutation';

const emptyValues: NewAdminFormType = {
  nome: '',
  senha: '',
  confirmarSenha: '',
};

export const useNewAdminDialog = (onOpenChange: (open: boolean) => void) => {
  const { mutateAsync: addAdmin, isPending } = useCreateAdmin();
  const methods = useForm<NewAdminFormType>({
    resolver: zodResolver(newAdminSchema),
    defaultValues: emptyValues,
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) methods.reset(emptyValues);
    onOpenChange(nextOpen);
  };

  const onSubmit = methods.handleSubmit(async (data: NewAdminFormType) => {
    await addAdmin({ nome: data.nome, senha: data.senha });
    handleOpenChange(false);
  });

  return {
    onSubmit,
    register: methods.register,
    errors: methods.formState.errors,
    isSubmitting: methods.formState.isSubmitting || isPending,
    handleOpenChange,
  };
};
