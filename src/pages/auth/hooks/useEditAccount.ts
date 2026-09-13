import {
  editAccountSchema,
  type EditAccountFormType,
} from '@/data/schemas/auth';
import type { UsuarioType } from '@/data/types/api';
import { toast } from '@/components/ui/toast';
import { useAuthUser } from '@/providers/UserProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export const useEditAccount = () => {
  const { user, setUser, isAluno, isMonitor, isAdmin } = useAuthUser();
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

  const nextUser = (
    user: UsuarioType,
    data: EditAccountFormType
  ): UsuarioType => {
    if (user.tipo === 'ALUNO') {
      return { ...user, nome: data.nome, apelido: data.apelido };
    }

    if (user.tipo === 'MONITOR') {
      return { ...user, nome: data.nome, email: data.email };
    }

    return { ...user, nome: data.nome };
  };

  const onSubmit = methods.handleSubmit((data: EditAccountFormType) => {
    setUser(nextUser(user, data));
    toast.add({
      type: 'success',
      title: 'Conta atualizada',
    });
    navigate(homePath, { replace: true });
  });

  return {
    onSubmit,
    register: methods.register,
    errors: methods.formState.errors,
    isAluno,
    isMonitor,
    isAdmin,
    cancel: () => navigate(homePath),
  };
};
