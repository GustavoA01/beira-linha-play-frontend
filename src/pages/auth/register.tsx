import { LabelInput } from '@/components/LabelInput';
import { ErrorFormMessage } from '@/components/ErrorFormMessage';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { AuthFields } from './components/AuthFields';
import { AuthLayout } from './components/AuthLayout';
import { AuthFooterLink } from './components/AuthFooterLink';
import { useRegister } from './hooks/useRegister';

export const RegisterPage = () => {
  const {
    register,
    onSubmit,
    errors,
    isSubmitting,
    isAluno,
    enterAsStudent,
    enterAsMonitor,
  } = useRegister();

  return (
    <AuthLayout
      title="Cadastre-se"
      isAluno={isAluno}
      onEnterAsStudent={enterAsStudent}
      onEnterAsMonitor={enterAsMonitor}
      description={
        isAluno
          ? 'Crie sua conta para começar a jogar.'
          : 'Crie sua conta de monitor para gerenciar as turmas.'
      }
      footer={
        <AuthFooterLink prompt="Já tem uma conta?" to="/login" label="Entrar" />
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <LabelInput
          id="nome"
          autoFocus
          label="Nome completo"
          autoComplete="name"
          placeholder="Ex.: João da Silva"
          error={errors.nome?.message}
          register={register}
        />
        <AuthFields
          isAluno={isAluno}
          errors={errors}
          register={register}
          passwordAutoComplete="new-password"
        />
        <LabelInput
          label="Confirmar senha"
          id="confirmarSenha"
          type="password"
          autoComplete="new-password"
          error={errors.confirmarSenha?.message}
          register={register}
        />
        {errors.root?.message && (
          <ErrorFormMessage message={errors.root.message} />
        )}
        <Button
          type="submit"
          className="w-full font-montserrat"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner /> : 'Cadastrar'}
        </Button>
      </form>
    </AuthLayout>
  );
};
