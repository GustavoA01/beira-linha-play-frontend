import { LabelInput } from '@/components/LabelInput';
import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';

type AuthFieldsValues = {
  apelido: string;
  email: string;
  senha: string;
  nome?: string;
};

type AuthFieldError = { message?: string };

type AuthFieldsPropsType<T extends FieldValues & AuthFieldsValues> = {
  isAluno: boolean;
  isAdmin?: boolean;
  errors: {
    apelido?: AuthFieldError;
    email?: AuthFieldError;
    nome?: AuthFieldError;
    senha?: AuthFieldError;
  };
  register: UseFormRegister<T>;
  autoFocus?: boolean;
  passwordAutoComplete?: 'current-password' | 'new-password';
};

export const AuthFields = <T extends FieldValues & AuthFieldsValues>({
  isAluno,
  isAdmin = false,
  errors,
  register,
  autoFocus = false,
  passwordAutoComplete = 'current-password',
}: AuthFieldsPropsType<T>) => (
  <>
    {isAdmin ? (
      <LabelInput
        label="Nome"
        id={'nome' as Path<T>}
        autoFocus={autoFocus}
        autoComplete="username"
        placeholder="Ex.: Administrador"
        error={errors.nome?.message}
        register={register}
      />
    ) : isAluno ? (
      <LabelInput
        label="Apelido"
        id={'apelido' as Path<T>}
        autoFocus={autoFocus}
        autoComplete="nickname"
        placeholder="Ex.: Joãozinho"
        error={errors.apelido?.message}
        register={register}
      />
    ) : (
      <LabelInput
        label="E-mail"
        id={'email' as Path<T>}
        type="email"
        autoFocus={autoFocus}
        autoComplete="email"
        placeholder="Ex.: maria@pucminas.br"
        error={errors.email?.message}
        register={register}
      />
    )}
    <LabelInput
      label="Senha"
      id={'senha' as Path<T>}
      type="password"
      autoComplete={passwordAutoComplete}
      error={errors.senha?.message}
      register={register}
    />
  </>
);
