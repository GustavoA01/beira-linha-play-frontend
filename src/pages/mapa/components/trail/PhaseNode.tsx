import { Handle, Position } from '@xyflow/react';
import { motion } from 'motion/react';
import { PhaseProgressModal } from '@/pages/mapa/components/ProgressModal/PhaseProgressModal';
import type { PhaseNodeProps } from '@/data/types/reactFlow';
import { usePhaseNode } from '@/pages/mapa/hooks/usePhaseNode';
import { Dialog } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export const PhaseNode = ({ id, data: { minPoints } }: PhaseNodeProps) => {
  const {
    Icon,
    openDialog,
    setOpenDialog,
    isInteractive,
    points,
    glowColors,
    iconClassName,
  } = usePhaseNode(minPoints);

  const pulseDelay = ((Number(id) || 1) % 5) * 0.6;

  return (
    <>
      <div
        onClick={isInteractive ? () => setOpenDialog(true) : undefined}
        className={cn(
          'relative w-20 h-20 rounded-full select-none drop-shadow-lg',
          isInteractive &&
            'transition-all ease-in hover:scale-105 cursor-pointer'
        )}
      >
        <motion.div
          className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/10"
          animate={{ backgroundColor: glowColors }}
          transition={{
            duration: 6,
            delay: pulseDelay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <div className="pointer-events-none absolute inset-0 bottom-[3px] rounded-full bg-linear-to-b from-white/25 to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center">
          <Icon size={32} className={cn('drop-shadow-sm', iconClassName)} />
        </div>

        <Handle
          type="source"
          id={`${id}-top`}
          position={Position.Top}
          className="opacity-0 w-2 h-2"
        />
        <Handle
          type="target"
          id={`${id}-bottom`}
          position={Position.Bottom}
          className="opacity-0 w-2 h-2"
        />
      </div>

      {isInteractive && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <PhaseProgressModal id={id} points={points} minPoints={minPoints} />
        </Dialog>
      )}
    </>
  );
};
