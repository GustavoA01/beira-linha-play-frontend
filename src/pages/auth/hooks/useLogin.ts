import {
  loginSchema,
  type LoginFormType,
  type LoginRoleType,
} from '@/data/schemas/auth';
import { useUserProvider } from '@/providers/UserProvider';
import { ApiError } from '@/services/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from './useMutation';

const credentialsMessage = (tipo: LoginRoleType) => {
  if (tipo === 'ALUNO') {
    return 'Apelido ou senha incorretos. Confira e tente de novo.';
  }
  if (tipo === 'MONITOR') {
    return 'E-mail ou senha incorretos. Confira e tente de novo.';
  }
  return 'Nome ou senha incorretos. Confira e tente de novo.';
};

const loginErrorMessage = (tipo: LoginRoleType, error: unknown) => {
  if (
    error instanceof ApiError &&
    (error.status === 401 || error.status === 403)
  ) {
    return credentialsMessage(tipo);
  }

  return error instanceof Error &&
    error.message !== 'Não foi possível completar a operação'
    ? error.message
    : 'Não foi possível entrar. Tente de novo em instantes.';
};

export const useLogin = () => {
  const { setUser } = useUserProvider();
  const navigate = useNavigate();
  const { mutateAsync: signIn, isPending } = useLoginMutation();
  const methods = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      tipo: 'ALUNO',
      apelido: '',
      email: '',
      nome: '',
      senha: '',
    },
  });

  const tipo = methods.watch('tipo');
  const isAluno = tipo === 'ALUNO';
  const isAdmin = tipo === 'ADMIN';

  const enterAs = (nextTipo: LoginRoleType) => {
    methods.setValue('tipo', nextTipo);
    methods.clearErrors(['apelido', 'email', 'nome', 'senha']);
  };

  const onSubmit = methods.handleSubmit(async (data: LoginFormType) => {
    try {
      const user = await signIn({
        tipo: data.tipo,
        senha: data.senha,
        ...(data.tipo === 'ALUNO'
          ? { apelido: data.apelido }
          : data.tipo === 'MONITOR'
            ? { email: data.email }
            : { nome: data.nome }),
      });
      setUser(user);
      navigate(user.tipo === 'ALUNO' ? '/' : '/cursos', { replace: true });
    } catch (error) {
      methods.setError('root', {
        message: loginErrorMessage(data.tipo, error),
      });
    }
  });

  return {
    onSubmit,
    register: methods.register,
    errors: methods.formState.errors,
    isSubmitting: methods.formState.isSubmitting || isPending,
    isAluno,
    isAdmin,
    enterAsStudent: () => enterAs('ALUNO'),
    enterAsMonitor: () => enterAs('MONITOR'),
    enterAsAdmin: () => enterAs('ADMIN'),
  };
};
