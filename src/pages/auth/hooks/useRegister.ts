import {
  registerSchema,
  type RegisterFormType,
  type RegisterRoleType,
} from '@/data/schemas/auth';
import { useUserProvider } from '@/providers/UserProvider';
import { cadastro } from '@/services/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export const useRegister = () => {
  const { setUser } = useUserProvider();
  const navigate = useNavigate();
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
      const user = await cadastro({
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
        message:
          error instanceof Error ? error.message : 'Não foi possível cadastrar',
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
