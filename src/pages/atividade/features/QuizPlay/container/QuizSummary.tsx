import { Button } from '@/components/ui/button';
import type { QuestaoType } from '@/data/types/api';
import { useNavigate, useParams } from 'react-router-dom';
import type { QuizAnswerType } from '../hooks/useQuizPlay';
import { SummaryItem } from '../components/SummaryItem';

type QuizSummaryPropsType = {
  questions: QuestaoType[];
  answers: QuizAnswerType[];
  score: number;
  totalXp: number;
  revealCorrect: boolean;
  canRetry: boolean;
  onRetry: () => void;
};

export const QuizSummary = ({
  questions,
  answers,
  score,
  totalXp,
  revealCorrect,
  canRetry,
  onRetry,
}: QuizSummaryPropsType) => {
  const navigate = useNavigate();
  const { cursoId, moduloId } = useParams();
  const gabaritou = score >= totalXp;
  const correctCount = answers.filter((answer) => answer.correta).length;
  const modulePath = `/cursos/${cursoId}/modulos/${moduloId}`;

  return (
    <div className="container mx-auto flex min-h-0 flex-1 flex-col overflow-y-auto custom-bar px-4 py-6 sm:px-8">
      <div className="mx-auto w-full max-w-xl space-y-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Resultado
          </p>
          <h2 className="mt-2 font-fredoka text-3xl font-semibold text-primary-dark">
            {gabaritou ? 'Gabaritou!' : 'Tentativa concluída'}
          </h2>
          <p className="mt-2 font-montserrat text-zinc-600">
            {correctCount} de {questions.length} certas · {score}/{totalXp} pts
          </p>
        </div>

        <ul className="space-y-3">
          {questions.map((question, index) => {
            const answer = answers.find(
              (item) => item.questaoId === question.id
            );
            const chosen = question.alternativas.find(
              (item) => item.id === answer?.alternativaId
            );
            const correct = question.alternativas.find((item) => item.correta);

            return (
              <SummaryItem
                key={question.id}
                index={index}
                enunciado={question.enunciado}
                answerCorrect={answer?.correta}
                chosenDescription={chosen?.descricao}
                correctDescription={correct?.descricao}
                revealCorrect={revealCorrect}
              />
            );
          })}
        </ul>

        <div className="flex flex-col gap-2 pb-4">
          {canRetry && (
            <Button size="lg" className="h-12 font-bold" onClick={onRetry}>
              Tentar de novo
            </Button>
          )}
          <Button
            size="lg"
            className="h-12 font-bold"
            variant={canRetry ? 'outline' : 'default'}
            onClick={() => navigate(modulePath, { replace: true })}
          >
            Voltar ao módulo
          </Button>
        </div>
      </div>
    </div>
  );
};
