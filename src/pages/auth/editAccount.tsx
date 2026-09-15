import { LabelInput } from '@/components/LabelInput';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { AuthLayout } from './components/AuthLayout';
import { useEditAccount } from './hooks/useEditAccount';

export const EditAccountPage = () => {
  const {
    register,
    onSubmit,
    errors,
    isSubmitting,
    isAluno,
    isMonitor,
    isAdmin,
    cancel,
  } = useEditAccount();

  return (
    <AuthLayout
      title="Editar conta"
      description={
        isAdmin
          ? 'Altere seu nome ou senha.'
          : 'Altere seus dados. A senha só muda se você preencher.'
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <LabelInput
          label="Nome"
          id="nome"
          autoFocus
          autoComplete="name"
          placeholder="Ex.: João da Silva"
          error={errors.nome?.message}
          register={register}
          disabled={isSubmitting}
        />
        {isAluno && (
          <LabelInput
            label="Apelido"
            id="apelido"
            autoComplete="nickname"
            placeholder="Ex.: Joãozinho"
            error={errors.apelido?.message}
            register={register}
            disabled={isSubmitting}
          />
        )}
        {isMonitor && (
          <LabelInput
            label="E-mail"
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Ex.: joaosilva@gmail.com"
            error={errors.email?.message}
            register={register}
            disabled={isSubmitting}
          />
        )}
        <LabelInput
          label="Nova senha"
          id="senha"
          type="password"
          autoComplete="new-password"
          error={errors.senha?.message}
          register={register}
          disabled={isSubmitting}
        />
        <LabelInput
          label="Confirmar senha"
          id="confirmarSenha"
          type="password"
          autoComplete="new-password"
          error={errors.confirmarSenha?.message}
          register={register}
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          className="w-full font-montserrat"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner /> : 'Salvar'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full font-montserrat"
          onClick={cancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
      </form>
    </AuthLayout>
  );
};
