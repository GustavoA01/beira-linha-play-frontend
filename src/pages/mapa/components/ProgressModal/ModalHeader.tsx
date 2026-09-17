import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Medal, TrainFront } from 'lucide-react';
import { cn } from '@/lib/utils';

type ModalHeaderProps = {
  level: string;
  concluded: boolean;
  showProgress?: boolean;
  minPoints?: number;
};

export const ModalHeader = ({
  level,
  concluded,
  showProgress = true,
  minPoints,
}: ModalHeaderProps) => {
  const badge = showProgress
    ? concluded
      ? 'Concluído'
      : 'Em progresso'
    : `${minPoints} xp para liberar`;

  return (
    <DialogHeader className="flex items-center">
      <DialogTitle className="font-bold text-white font-montserrat">
        Nível {level}
      </DialogTitle>
      <div
        className={cn(
          'p-4 rounded-full',
          showProgress && concluded
            ? 'bg-linear-to-l from-green-400 to-emerald-500'
            : 'bg-linear-to-r from-blue-400 to-indigo-400'
        )}
      >
        {showProgress && concluded ? (
          <Medal size={32} className="text-white" />
        ) : (
          <TrainFront size={32} className="text-white" />
        )}
      </div>

      <DialogDescription
        className={cn(
          'text-white text-xs font-fredoka font-semibold py-1 px-4 rounded-full',
          showProgress && concluded ? 'bg-green-500' : 'bg-blue-800'
        )}
      >
        {badge}
      </DialogDescription>
    </DialogHeader>
  );
};
