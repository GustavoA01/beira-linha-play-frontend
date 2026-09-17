import type { QuestaoType } from '@/data/types/api';
import { AlternativeOption } from './AlternativeOption';
import type { AlternativeStatusType } from '@/pages/atividade/features/QuizPlay/types';
import type { QuizPhaseType } from '@/pages/atividade/features/QuizPlay/types';

type QuestionStepPropsType = {
  question: QuestaoType;
  questionNumber: number;
  selectedId: string | null;
  phase: QuizPhaseType;
  revealCorrect: boolean;
  onSelect: (id: string) => void;
};

export const QuestionStep = ({
  question,
  questionNumber,
  selectedId,
  phase,
  revealCorrect,
  onSelect,
}: QuestionStepPropsType) => {
  const isFeedback = phase === 'feedback';
  const alternativeLetter = (index: number) => String.fromCharCode(65 + index);

  const statusFor = (
    alternativeId: string,
    isCorrect: boolean | null
  ): AlternativeStatusType => {
    const isSameAsSelected = alternativeId === selectedId;
    if (!isFeedback) return isSameAsSelected ? 'selected' : 'unselected';
    if (isCorrect == null) return isSameAsSelected ? 'selected' : 'unselected';
    if (isSameAsSelected && isCorrect) return 'correct';
    if (isSameAsSelected && !isCorrect) return 'wrong';
    if (revealCorrect && isCorrect) return 'reveal';
    return 'unselected';
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
        Pergunta {questionNumber}
      </p>
      <h2 className="font-fredoka text-2xl sm:text-3xl font-semibold text-primary-dark leading-snug">
        {question.enunciado}
      </h2>

      <div
        role="radiogroup"
        aria-label="Alternativas"
        className="flex flex-col gap-3"
      >
        {question.alternativas.map((alternative, index) => (
          <AlternativeOption
            key={alternative.id}
            disabled={isFeedback}
            letter={alternativeLetter(index)}
            description={alternative.descricao}
            selected={selectedId === alternative.id}
            onSelect={() => onSelect(alternative.id)}
            status={statusFor(alternative.id, alternative.correta)}
          />
        ))}
      </div>
    </div>
  );
};
