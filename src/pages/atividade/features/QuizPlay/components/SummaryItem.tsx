import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

type SummaryItemPropsType = {
  index: number;
  enunciado: string;
  answerCorrect?: boolean | null;
  chosenDescription?: string;
  correctDescription?: string;
  revealCorrect: boolean;
};

export const SummaryItem = ({
  index,
  enunciado,
  answerCorrect,
  chosenDescription,
  correctDescription,
  revealCorrect,
}: SummaryItemPropsType) => (
  <li
    className={cn(
      'rounded-2xl border-2 p-4',
      answerCorrect
        ? 'border-emerald-200 bg-emerald-50/60'
        : 'border-red-200 bg-red-50/60'
    )}
  >
    <div className="flex items-start gap-3">
      <span
        className={cn(
          'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-white',
          answerCorrect ? 'bg-emerald-500' : 'bg-red-500'
        )}
      >
        {answerCorrect ? (
          <Check className="size-4" />
        ) : (
          <X className="size-4" />
        )}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-zinc-400">
          Pergunta {index + 1}
        </p>
        <p className="font-medium text-zinc-800">{enunciado}</p>
        <p className="mt-1 text-sm text-zinc-600">
          Sua resposta: {chosenDescription ?? '—'}
        </p>
        {revealCorrect && !answerCorrect && correctDescription && (
          <p className="mt-1 text-sm font-medium text-emerald-800">
            Gabarito: {correctDescription}
          </p>
        )}
      </div>
    </div>
  </li>
);
