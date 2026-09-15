import { DescriptionCircle } from '@/components/DescriptionCircle';
import { EditDeleteActions } from '@/components/EditDeleteActions';
import { Card } from '@/components/ui/card';
import { Check, ChevronRight, Notebook } from 'lucide-react';
import { motion } from 'motion/react';
import type { ModuloType } from '@/data/types/api';
import { countModuleActivities, moduleXp } from '@/data/atividades';

type ModuleCardProps = {
  modulo: ModuloType;
  isMonitor: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export const ModuleCard = ({
  modulo,
  isMonitor,
  onClick,
  onEdit,
  onDelete,
}: ModuleCardProps) => {
  const atividadesCount = countModuleActivities(modulo);
  const atividadesLabel = `${atividadesCount} ${atividadesCount === 1 ? 'atividade' : 'atividades'}`;
  const iconClassName =
    'group-hover:text-white text-green-400 transition-colors ease-in';

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      <Card className="group flex flex-row justify-between items-center py-4 pl-2 pr-4 cursor-pointer mt-4 shadow-sm hover:shadow-md transition-all ease-in">
        <div className="flex items-center gap-4 pl-2 min-w-0">
          <div className="p-2 bg-green-100 group-hover:bg-green-400 rounded-full transition-colors ease-in shrink-0">
            {isMonitor ? (
              <Notebook className={iconClassName} />
            ) : (
              <Check className={iconClassName} />
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
            <EditDeleteActions
              label="módulo"
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ) : (
            <ChevronRight size={16} className="text-zinc-400" />
          )}
        </div>
      </Card>
    </motion.div>
  );
};
