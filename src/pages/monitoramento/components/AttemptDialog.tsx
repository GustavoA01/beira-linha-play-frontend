import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { AtividadeType } from '@/data/types/api';
import type { StudentRowType } from '../types';
import { alternativeLetter } from '../utils';

type AttemptDialogPropsType = {
  activity: AtividadeType;
  row: StudentRowType | null;
  onClose: () => void;
};

export const AttemptDialog = ({
  activity,
  row,
  onClose,
}: AttemptDialogPropsType) => (
  <Dialog open={Boolean(row)} onOpenChange={(open) => !open && onClose()}>
    <DialogContent className="max-h-[85dvh] overflow-y-auto custom-bar">
      <DialogHeader>
        <DialogTitle className="font-fredoka text-primary-dark">
          {row?.student.nome}
        </DialogTitle>
        <DialogDescription>
          {row?.attempt
            ? `${row.attempt.pontuacaoObtida} pontos nesta tentativa`
            : 'Sem envio'}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {activity.questoes.map((question, index) => {
          const selectedAnswer = row?.attempt?.respostas.find(
            (answer) => answer.questaoId === question.id
          );

          return (
            <div key={question.id} className="rounded-lg border p-3">
              <p className="mb-2 text-sm font-semibold text-zinc-700">
                Q{index + 1}. {question.enunciado}
              </p>
              <ul className="space-y-1">
                {question.alternativas.map((alternative, alternativeIndex) => {
                  const letter = alternativeLetter(alternativeIndex);
                  const isChosen =
                    selectedAnswer?.alternativaId === alternative.id;

                  return (
                    <li
                      key={alternative.id}
                      className={cn(
                        'rounded-md px-2 py-1 text-sm',
                        alternative.correta && 'bg-green-50 text-green-800',
                        isChosen &&
                          !alternative.correta &&
                          'bg-orange-50 text-orange-800',
                        !isChosen && !alternative.correta && 'text-zinc-500'
                      )}
                    >
                      <span className="font-bold">{letter}.</span>{' '}
                      {alternative.descricao}
                      {alternative.correta && ' · gabarito'}
                      {isChosen && ' · marcou'}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </DialogContent>
  </Dialog>
);
