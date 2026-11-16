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
import { Check, CircleDashed, Lock, Notebook } from 'lucide-react';
import type { AtividadeType, TentativaType } from '@/data/types/api';
import {
  activityXp,
  isActivityBlocked,
  isActivityConcluded,
  maxAttemptsFor,
} from '@/data/atividades';
import { cn } from '@/lib/utils';
import { BlockToggle } from '@/components/BlockToggle';

type ActivityCardProps = {
  activity: AtividadeType;
  usedAttempts: number;
  bestScore: number;
  attempts?: TentativaType[];
  isStaff: boolean;
  canManage: boolean;
  moduloBloqueado?: boolean;
  onToggleBlock?: () => void;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export const ActivityCard = ({
  activity,
  usedAttempts,
  bestScore,
  attempts = [],
  isStaff,
  canManage,
  moduloBloqueado = false,
  onToggleBlock,
  onClick,
  onEdit,
  onDelete,
}: ActivityCardProps) => {
  const xpTotal = activityXp(activity);
  const blocked = isActivityBlocked(activity, moduloBloqueado);
  const studentLocked = blocked && !isStaff;
  const questionsLabel = `${activity.quantQuestoes} ${activity.quantQuestoes === 1 ? 'PERGUNTA' : 'PERGUNTAS'}`;
  const attemptsLabel = `${usedAttempts}/${maxAttemptsFor(activity.permiteMaisTentativas)} tentativas`;
  const concluded = isActivityConcluded(
    usedAttempts,
    bestScore,
    xpTotal,
    attempts,
    maxAttemptsFor(activity.permiteMaisTentativas)
  );

  const StudentIcon = concluded ? Check : CircleDashed;

  return (
    <Item
      onClick={() => {
        if (studentLocked) return;
        onClick();
      }}
      className={cn(
        'border-2 rounded-lg hover:shadow-md transition-all duration-150 ease-in',
        studentLocked
          ? 'cursor-default opacity-60 hover:shadow-none'
          : 'cursor-pointer',
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
        {isStaff ? <Notebook /> : <StudentIcon />}
      </ItemMedia>

      <ItemContent className="min-w-0">
        <ItemTitle className="font-semibold sm:text-lg text-zinc-600 truncate max-w-full">
          {activity.titulo}
        </ItemTitle>
        <ItemDescription className="flex flex-wrap items-center gap-x-1.5 font-semibold text-xs text-zinc-400">
          <span>{questionsLabel}</span>
          {!isStaff && (
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
        {canManage && onToggleBlock && (
          <BlockToggle
            blocked={Boolean(activity.bloqueada)}
            label="atividade"
            onToggle={onToggleBlock}
          />
        )}
        {studentLocked && (
          <span title="Atividade indisponível para realização">
            <Lock className="text-zinc-400" aria-label="Atividade bloqueada" />
          </span>
        )}
        {canManage && (
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
