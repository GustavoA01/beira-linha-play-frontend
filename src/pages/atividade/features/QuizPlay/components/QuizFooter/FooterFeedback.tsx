import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Check, CircleCheck, X } from 'lucide-react';
import type { QuizFooterPropsType } from '../../types';
import { cn } from '@/lib/utils';

export const FooterFeedback = ({
  selectedIsCorrect,
  revealCorrect,
  correctDescription,
  earnedXp,
  isLastQuestion,
  isSubmitting,
  onNext,
}: QuizFooterPropsType) => {
  const isUnknown = selectedIsCorrect === null;
  const isCorrect = selectedIsCorrect === true;

  return (
    <div
      className={cn(
        'border-t px-4 py-4 sm:px-8',
        isUnknown
          ? 'border-zinc-200 bg-zinc-50'
          : isCorrect
            ? 'border-emerald-200 bg-emerald-50'
            : 'border-red-200 bg-red-50'
      )}
    >
      <div className="container mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full text-white',
              isUnknown
                ? 'bg-zinc-400'
                : isCorrect
                  ? 'bg-emerald-500'
                  : 'bg-red-500'
            )}
          >
            {isUnknown ? <CircleCheck /> : isCorrect ? <Check /> : <X />}
          </span>
          <div>
            <p
              className={cn(
                'font-fredoka text-xl font-semibold',
                isUnknown
                  ? 'text-zinc-700'
                  : isCorrect
                    ? 'text-emerald-800'
                    : 'text-red-800'
              )}
            >
              {isUnknown
                ? 'Resposta registrada'
                : isCorrect
                  ? 'Acertou!'
                  : 'Errou'}
            </p>
            {isCorrect && (
              <p className="text-sm font-medium text-emerald-700">
                +{earnedXp} pts
              </p>
            )}
            {isUnknown && (
              <p className="text-sm text-zinc-600">
                O resultado aparece ao final da tentativa.
              </p>
            )}
            {!isUnknown &&
              !isCorrect &&
              revealCorrect &&
              correctDescription && (
                <p className="text-sm font-medium text-red-800">
                  Resposta certa: {correctDescription}
                </p>
              )}
            {!isUnknown && !isCorrect && !revealCorrect && (
              <p className="text-sm text-red-700">
                Você pode ver o gabarito na próxima tentativa.
              </p>
            )}
          </div>
        </div>

        <Button
          size="lg"
          onClick={onNext}
          disabled={isSubmitting}
          className={cn(
            'h-12 w-full text-base font-bold sm:w-auto sm:min-w-40',
            isUnknown
              ? 'bg-primary hover:bg-primary/90'
              : isCorrect
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-red-600 hover:bg-red-700'
          )}
        >
          {isSubmitting ? (
            <Spinner />
          ) : isLastQuestion ? (
            'Ver resultado'
          ) : (
            'Avançar'
          )}
        </Button>
      </div>
    </div>
  );
};
