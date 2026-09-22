import { Handle, Position } from '@xyflow/react';
import { motion } from 'motion/react';
import { PhaseProgressModal } from '@/pages/mapa/components/ProgressModal/PhaseProgressModal';
import type { PhaseNodeProps } from '@/data/types/reactFlow';
import { usePhaseNode } from '@/pages/mapa/hooks/usePhaseNode';
import { useAlunoCursosProgresso } from '@/pages/mapa/hooks/useAlunoCursosProgresso';
import { Dialog } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export const PhaseNode = ({ id, data: { minPoints } }: PhaseNodeProps) => {
  const {
    Icon,
    openDialog,
    setOpenDialog,
    showProgress,
    studentName,
    points,
    glowColors,
    glowShadows,
    glowOpacities,
    glowScales,
    iconClassName,
  } = usePhaseNode(minPoints);
  const phaseProgress = Math.min(100, Math.round((points / minPoints) * 100));
  const phaseConcluded = showProgress && phaseProgress === 100;
  const { cursos, isPending: coursesPending } = useAlunoCursosProgresso(
    openDialog && showProgress && !phaseConcluded
  );

  const pulseDelay = ((Number(id) || 1) % 5) * 0.6;
  
  const colorTransition = {
    duration: 6,
    delay: pulseDelay,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  };

  return (
    <>
      <div
        onClick={() => setOpenDialog(true)}
        className="relative w-20 h-20 rounded-full select-none transition-all ease-in hover:scale-105 cursor-pointer"
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-2 rounded-full blur-xl"
          animate={{
            backgroundColor: glowColors,
            opacity: glowOpacities,
            scale: glowScales,
          }}
          transition={colorTransition}
        />
        <motion.div
          className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/10"
          animate={{
            backgroundColor: glowColors,
            boxShadow: glowShadows,
          }}
          transition={colorTransition}
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

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <PhaseProgressModal
          id={id}
          points={points}
          minPoints={minPoints}
          showProgress={showProgress}
          studentName={studentName}
          courses={cursos}
          coursesPending={coursesPending}
        />
      </Dialog>
    </>
  );
};
