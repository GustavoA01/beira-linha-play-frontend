import { toast } from '@/components/ui/toast';
import { newAdminSchema, type NewAdminFormType } from '@/data/schemas/auth';
import type { AdminType } from '@/data/types/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const newAdminId = () =>
  globalThis.crypto?.randomUUID?.() ?? `admin-${Date.now()}`;

const emptyValues: NewAdminFormType = {
  nome: '',
  senha: '',
  confirmarSenha: '',
};

export const useNewAdminDialog = (onOpenChange: (open: boolean) => void) => {
  const methods = useForm<NewAdminFormType>({
    resolver: zodResolver(newAdminSchema),
    defaultValues: emptyValues,
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) methods.reset(emptyValues);
    onOpenChange(nextOpen);
  };

  const onSubmit = methods.handleSubmit((data: NewAdminFormType) => {
    const admin: AdminType = {
      id: newAdminId(),
      nome: data.nome,
      senha: data.senha,
      tipo: 'ADMIN',
    };
    console.log(admin);
    handleOpenChange(false);
    toast.add({
      type: 'success',
      title: 'Administrador adicionado',
    });
  });

  return {
    onSubmit,
    register: methods.register,
    errors: methods.formState.errors,
    handleOpenChange,
  };
};
