import { ErrorFormMessage } from '@/components/ErrorFormMessage';
import { Input } from '@/components/ui/input';
import { Footer } from './Footer';
import { useFormContext } from 'react-hook-form';
import { type NewActivityFormType } from '@/data/schemas/activity';

type FormProps = {
  onSubmit: () => void;
  isEditing?: boolean;
};

export const Form = ({ onSubmit, isEditing }: FormProps) => {
  const {
    register,
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
              className="placeholder:max-sm:text-sm"
              {...register('qtdQuestions', {
                setValueAs: (value) => Number(value),
              })}
            />

            {errors.qtdQuestions && errors.qtdQuestions.message && (
              <ErrorFormMessage message={errors.qtdQuestions!.message!} />
            )}
          </div>
        )}
      </div>

      <Footer />
    </form>
  );
};
