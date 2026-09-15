import {
  registerSchema,
  type RegisterFormType,
  type RegisterRoleType,
} from '@/data/schemas/auth';
import { useUserProvider } from '@/providers/UserProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from './useMutation';

const registerErrorMessage = (error: unknown) =>
  error instanceof Error &&
  error.message !== 'Não foi possível completar a operação'
    ? error.message
    : 'Não foi possível cadastrar';

export const useRegister = () => {
  const { setUser } = useUserProvider();
  const navigate = useNavigate();
  const { mutateAsync: signUp, isPending } = useRegisterMutation();
  const methods = useForm<RegisterFormType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      tipo: 'ALUNO',
      nome: '',
      apelido: '',
      email: '',
      senha: '',
      confirmarSenha: '',
    },
  });

  const tipo = methods.watch('tipo');
  const isAluno = tipo === 'ALUNO';

  const enterAs = (nextTipo: RegisterRoleType) => {
    methods.setValue('tipo', nextTipo);
    methods.clearErrors(['apelido', 'email']);
  };

  const onSubmit = methods.handleSubmit(async (data: RegisterFormType) => {
    try {
      const user = await signUp({
        tipo: data.tipo,
        nome: data.nome,
        senha: data.senha,
        ...(data.tipo === 'ALUNO'
          ? { apelido: data.apelido }
          : { email: data.email }),
      });
      setUser(user);
      navigate(user.tipo === 'ALUNO' ? '/' : '/cursos', { replace: true });
    } catch (error) {
      methods.setError('root', {
        message: registerErrorMessage(error),
      });
    }
  });

  return {
    onSubmit,
    register: methods.register,
    errors: methods.formState.errors,
    isSubmitting: methods.formState.isSubmitting || isPending,
    isAluno,
    enterAsStudent: () => enterAs('ALUNO'),
    enterAsMonitor: () => enterAs('MONITOR'),
  };
};
