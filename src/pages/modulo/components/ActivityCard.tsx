import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Badge } from '@/components/ui/badge';
import { EditDeleteActions } from '@/components/EditDeleteActions';
import { Check, CircleDashed, Notebook } from 'lucide-react';
import type { AtividadeType, TentativaType } from '@/data/types/api';
import { activityXp, isActivityConcluded } from '@/data/atividades';
import { cn } from '@/lib/utils';
import { MAX_TENTATIVAS } from '@/data/constants';

type ActivityCardProps = {
  activity: AtividadeType;
  usedAttempts: number;
  bestScore: number;
  attempts?: TentativaType[];
  isMonitor: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export const ActivityCard = ({
  activity,
  usedAttempts,
  bestScore,
  attempts = [],
  isMonitor,
  onClick,
  onEdit,
  onDelete,
}: ActivityCardProps) => {
  const xpTotal = activityXp(activity);
  const questionsLabel = `${activity.quantQuestoes} ${activity.quantQuestoes === 1 ? 'PERGUNTA' : 'PERGUNTAS'}`;
  const attemptsLabel = `${usedAttempts}/${MAX_TENTATIVAS} tentativas`;
  const concluded = isActivityConcluded(
    usedAttempts,
    bestScore,
    xpTotal,
    attempts
  );

  const StudentIcon = concluded ? Check : CircleDashed;

  return (
    <Item
      onClick={onClick}
      className={cn(
        'border-2 rounded-lg hover:shadow-md transition-all duration-150 ease-in cursor-pointer',
        concluded ? 'border-green-200' : 'border-zinc-200'
      )}
    >
      <ItemMedia
        className={cn(
          'rounded-lg p-2',
          concluded
            ? 'bg-green-100 text-green-600'
            : 'bg-zinc-100 text-zinc-400'
        )}
      >
        {isMonitor ? <Notebook /> : <StudentIcon />}
      </ItemMedia>

      <ItemContent className="min-w-0">
        <ItemTitle className="font-semibold sm:text-lg text-zinc-600 truncate max-w-full">
          {activity.titulo}
        </ItemTitle>
        <ItemDescription className="flex flex-wrap items-center gap-x-1.5 font-semibold text-xs text-zinc-400">
          <span>{questionsLabel}</span>
          {!isMonitor && (
            <>
              <span aria-hidden className="max-sm:hidden">
                ·
              </span>
              <span>{attemptsLabel}</span>
            </>
          )}
        </ItemDescription>
      </ItemContent>

      <ItemActions>
        {isMonitor && (
          <EditDeleteActions
            label="atividade"
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
        <Badge className="font-bold px-2 py-1 text-xs sm:text-sm bg-zinc-100 text-zinc-500">
          + {xpTotal} pts
        </Badge>
      </ItemActions>
    </Item>
  );
};
