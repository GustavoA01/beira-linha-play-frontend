import { ErrorFormMessage } from '@/components/ErrorFormMessage';
import { Button } from '@/components/ui/button';
import { AuthFields } from './components/AuthFields';
import { AuthLayout } from './components/AuthLayout';
import { AuthFooterLink } from './components/AuthFooterLink';
import { useLogin } from './hooks/useLogin';

export const LoginPage = () => {
  const {
    register,
    onSubmit,
    errors,
    isAluno,
    isAdmin,
    enterAsStudent,
    enterAsMonitor,
    enterAsAdmin,
  } = useLogin();

  return (
    <AuthLayout
      title="Entrar"
      isAluno={isAluno}
      isAdmin={isAdmin}
      onEnterAsStudent={enterAsStudent}
      onEnterAsMonitor={enterAsMonitor}
      onEnterAsAdmin={enterAsAdmin}
      description={
        isAluno
          ? 'Entre para continuar jogando.'
          : isAdmin
            ? 'Entre para gerenciar os cursos.'
            : 'Entre para gerenciar as turmas.'
      }
      footer={
        <AuthFooterLink
          prompt="Não tem uma conta?"
          to="/cadastro"
          label="Cadastre-se"
        />
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <AuthFields
          autoFocus
          errors={errors}
          isAluno={isAluno}
          isAdmin={isAdmin}
          register={register}
        />
        {errors.root?.message && (
          <ErrorFormMessage message={errors.root.message} />
        )}
        <Button type="submit" className="w-full font-montserrat">
          Entrar
        </Button>
      </form>
    </AuthLayout>
  );
};
