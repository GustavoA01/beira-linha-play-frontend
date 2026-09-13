import {
  loginSchema,
  type LoginFormType,
  type LoginRoleType,
} from '@/data/schemas/auth';
import { useUserProvider } from '@/providers/UserProvider';
import { login } from '@/services/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const { setUser } = useUserProvider();
  const navigate = useNavigate();
  const methods = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      tipo: 'ALUNO',
      apelido: '',
      email: '',
      senha: '',
    },
  });

  const tipo = methods.watch('tipo');
  const isAluno = tipo === 'ALUNO';

  const enterAs = (nextTipo: LoginRoleType) => {
    methods.setValue('tipo', nextTipo);
    methods.clearErrors(['apelido', 'email', 'senha']);
  };

  const onSubmit = methods.handleSubmit(async (data: LoginFormType) => {
    try {
      const user = await login({
        tipo: data.tipo,
        senha: data.senha,
        ...(data.tipo === 'ALUNO'
          ? { apelido: data.apelido }
          : { email: data.email }),
      });
      setUser(user);
      navigate(user.tipo === 'ALUNO' ? '/' : '/cursos', { replace: true });
    } catch (error) {
      methods.setError('root', {
        message:
          error instanceof Error ? error.message : 'Não foi possível entrar',
      });
    }
  });

  return {
    onSubmit,
    register: methods.register,
    errors: methods.formState.errors,
    isAluno,
    enterAsStudent: () => enterAs('ALUNO'),
    enterAsMonitor: () => enterAs('MONITOR'),
  };
};
