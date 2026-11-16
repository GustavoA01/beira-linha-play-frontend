import { ErrorFormMessage } from '@/components/ErrorFormMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import type { ConfiguracaoType } from '@/data/types/services';
import { Controller, useFormContext } from 'react-hook-form';

type FieldProps = {
  name: 'quantidadeQuestoesPadrao' | 'pontosQuestaoPadrao';
  lockName: 'quantidadeQuestoesTravada' | 'pontosQuestaoTravados';
  label: string;
  min: number;
  max: number;
};

const NumberLockField = ({ name, lockName, label, min, max }: FieldProps) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ConfiguracaoType>();

  return (
    <div className="space-y-2 rounded-lg border border-zinc-200 p-4">
      <Label htmlFor={name}>{label}</Label>
      <div className="flex flex-wrap items-center gap-4">
        <Input
          id={name}
          type="number"
          min={min}
          max={max}
          className="max-w-32"
          {...register(name, { setValueAs: (value) => Number(value) })}
        />
        <Controller
          name={lockName}
          control={control}
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm text-zinc-600">
              Travar este valor
              <Switch
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                aria-label={`Travar ${label}`}
              />
            </label>
          )}
        />
      </div>
      {errors[name]?.message && (
        <ErrorFormMessage message={errors[name]?.message ?? ''} />
      )}
    </div>
  );
};

type ConfigFormViewProps = {
  onSubmit: () => void;
  isLoading: boolean;
  isSaving: boolean;
};

export const ConfigFormView = ({
  onSubmit,
  isLoading,
  isSaving,
}: ConfigFormViewProps) => {
  if (isLoading) {
    return (
      <div className="mt-8 flex justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 max-w-xl space-y-4">
      <NumberLockField
        name="quantidadeQuestoesPadrao"
        lockName="quantidadeQuestoesTravada"
        label="Quantidade de questões"
        min={1}
        max={10}
      />
      <NumberLockField
        name="pontosQuestaoPadrao"
        lockName="pontosQuestaoTravados"
        label="Pontos por questão"
        min={1}
        max={3}
      />
      <Button type="submit" disabled={isSaving}>
        {isSaving ? <Spinner /> : 'Salvar'}
      </Button>
    </form>
  );
};
