import {
  editAccountSchema,
  type EditAccountFormType,
} from '@/data/schemas/auth';
import type { UpdateAccountPayloadType } from '@/data/types/services';
import { useAuthUser } from '@/providers/UserProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useUpdateAccount } from './useMutation';

export const useEditAccount = () => {
  const { user, setUser, isAluno, isMonitor, isAdmin } = useAuthUser();
  const { mutateAsync: saveAccount, isPending } = useUpdateAccount();
  const navigate = useNavigate();
  const homePath = isAluno ? '/' : '/cursos';

  const methods = useForm<EditAccountFormType>({
    resolver: zodResolver(editAccountSchema),
    defaultValues: {
      tipo: user.tipo,
      nome: user.nome,
      apelido: user.tipo === 'ALUNO' ? user.apelido : '',
      email: user.tipo === 'MONITOR' ? user.email : '',
      senha: '',
      confirmarSenha: '',
    },
  });

  const payloadFromForm = (
    data: EditAccountFormType
  ): UpdateAccountPayloadType => ({
    nome: data.nome,
    ...(user.tipo === 'ALUNO' ? { apelido: data.apelido } : {}),
    ...(user.tipo === 'MONITOR' ? { email: data.email } : {}),
    ...(data.senha ? { senha: data.senha } : {}),
  });

  const onSubmit = methods.handleSubmit(async (data: EditAccountFormType) => {
    const updated = await saveAccount(payloadFromForm(data));
    setUser(updated);
    navigate(homePath, { replace: true });
  });

  return {
    onSubmit,
    register: methods.register,
    errors: methods.formState.errors,
    isSubmitting: methods.formState.isSubmitting || isPending,
    isAluno,
    isMonitor,
    isAdmin,
    cancel: () => navigate(homePath),
  };
};
