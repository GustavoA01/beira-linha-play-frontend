import { DescriptionCircle } from '@/components/DescriptionCircle';
import { EditDeleteActions } from '@/components/EditDeleteActions';
import { Card } from '@/components/ui/card';
import { Check, ChevronRight, Layers, Lock, Notebook } from 'lucide-react';
import { motion } from 'motion/react';
import type { ModuloType } from '@/data/types/api';
import { countModuleActivities, moduleXp } from '@/data/atividades';
import { cn } from '@/lib/utils';
import { BlockToggle } from '@/components/BlockToggle';

type ModuleCardProps = {
  modulo: ModuloType;
  isMonitor: boolean;
  concluded?: boolean;
  interactionLocked?: boolean;
  onToggleBlock?: () => void;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export const ModuleCard = ({
  modulo,
  isMonitor,
  concluded = false,
  interactionLocked = false,
  onToggleBlock,
  onClick,
  onEdit,
  onDelete,
}: ModuleCardProps) => {
  const atividadesCount = countModuleActivities(modulo);
  const atividadesLabel = `${atividadesCount} ${atividadesCount === 1 ? 'atividade' : 'atividades'}`;
  const StudentIcon = concluded ? Check : Layers;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      onClick={() => {
        if (interactionLocked) return;
        onClick();
      }}
    >
      <Card
        className={cn(
          'group flex flex-row justify-between items-center py-4 pl-2 pr-4 mt-4 shadow-sm hover:shadow-md transition-all ease-in',
          interactionLocked ? 'cursor-default' : 'cursor-pointer'
        )}
      >
        <div className="flex items-center gap-4 pl-2 min-w-0">
          <div
            className={cn(
              'p-2 rounded-full transition-colors ease-in shrink-0',
              isMonitor || concluded
                ? 'bg-green-100 group-hover:bg-green-400'
                : 'bg-zinc-100 group-hover:bg-zinc-300'
            )}
          >
            {isMonitor ? (
              <Notebook className="group-hover:text-white text-green-400 transition-colors ease-in" />
            ) : (
              <StudentIcon
                className={cn(
                  'transition-colors ease-in group-hover:text-white',
                  concluded ? 'text-green-400' : 'text-zinc-400'
                )}
              />
            )}
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold sm:text-lg text-zinc-600 truncate">
              {modulo.nome}
            </h2>
            <DescriptionCircle
              left={atividadesLabel}
              right={`${moduleXp(modulo)} XP`}
            />
          </div>
        </div>

        <div className="flex items-center gap-0.5 shrink-0 ml-2">
          {isMonitor ? (
            <>
              {onToggleBlock && (
                <BlockToggle
                  blocked={Boolean(modulo.bloqueado)}
                  label="módulo"
                  onToggle={onToggleBlock}
                />
              )}
              <EditDeleteActions
                label="módulo"
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </>
          ) : interactionLocked ? (
            <span title="Módulo indisponível para realização">
              <Lock
                size={16}
                className="text-zinc-400"
                aria-label="Módulo bloqueado"
              />
            </span>
          ) : (
            <ChevronRight size={16} className="text-zinc-400" />
          )}
        </div>
      </Card>
    </motion.div>
  );
};
