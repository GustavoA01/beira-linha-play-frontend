import { DialogContent } from '@/components/ui/dialog';
import { ModalHeader } from './ModalHeader';
import { BarProgress } from './BarProgress';
import { ModalFooter } from './ModalFooter';

type PhaseProgressModalProps = {
  id: string;
  points: number;
  minPoints: number;
  showProgress?: boolean;
};

export const PhaseProgressModal = ({
  id,
  points,
  minPoints,
  showProgress = true,
}: PhaseProgressModalProps) => {
  const progress = Math.min(100, Math.round((points / minPoints) * 100));
  const concluded = showProgress && progress === 100;

  return (
    <DialogContent
      showCloseButton={false}
      className={
        concluded
          ? 'bg-linear-to-l from-green-500 to-emerald-600'
          : 'bg-linear-to-r from-blue-400 to-indigo-500'
      }
    >
      <ModalHeader
        level={id}
        concluded={concluded}
        showProgress={showProgress}
        minPoints={minPoints}
      />

      <div className="bg-white p-4 rounded-md">
        {showProgress && (
          <BarProgress
            points={points}
            progress={progress}
            minPoints={minPoints}
          />
        )}

        <ModalFooter
          concluded={concluded}
          showProgress={showProgress}
          minPoints={minPoints}
        />
      </div>
    </DialogContent>
  );
};
