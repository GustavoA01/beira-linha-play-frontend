import { ErrorFormMessage } from '@/components/ErrorFormMessage';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Footer } from './Footer';
import { Controller, useFormContext } from 'react-hook-form';
import { type NewActivityFormType } from '@/data/schemas/activity';

type FormProps = {
  onSubmit: () => void;
  isEditing?: boolean;
  quantidadeTravada?: boolean;
};

export const Form = ({ onSubmit, isEditing, quantidadeTravada }: FormProps) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<NewActivityFormType>();

  const showErrorFormMessage =
    errors.activityName && errors.activityName.message;

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-3">
        <div>
          <Input
            {...register('activityName')}
            placeholder="Nome da atividade"
            className="placeholder:max-sm:text-sm"
          />

          {showErrorFormMessage && (
            <ErrorFormMessage
              message={errors.activityName?.message as string}
            />
          )}
        </div>

        {!isEditing && (
          <div>
            <Input
              placeholder="Max: 10"
              type="number"
              disabled={quantidadeTravada}
              className="placeholder:max-sm:text-sm"
              {...register('qtdQuestions', {
                setValueAs: (value) => Number(value),
              })}
            />

            {quantidadeTravada && (
              <p className="mt-1 text-xs text-zinc-400">
                Definido pelo administrador
              </p>
            )}

            {errors.qtdQuestions && errors.qtdQuestions.message && (
              <ErrorFormMessage message={errors.qtdQuestions.message} />
            )}
          </div>
        )}

        <Controller
          name="permiteMaisTentativas"
          control={control}
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm text-zinc-600">
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                aria-label="Permitir mais de uma tentativa"
              />
              Permitir mais de uma tentativa
            </label>
          )}
        />
      </div>

      <Footer />
    </form>
  );
};
