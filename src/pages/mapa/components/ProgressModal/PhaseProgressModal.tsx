import { DialogContent } from '@/components/ui/dialog';
import { ModalHeader } from './ModalHeader';
import { BarProgress } from './BarProgress';
import { ModalFooter } from './ModalFooter';
import {
  CourseProgressList,
  type CourseProgressItemType,
} from './CourseProgressList';

type PhaseProgressModalProps = {
  id: string;
  points: number;
  minPoints: number;
  showProgress?: boolean;
  courses?: CourseProgressItemType[];
  coursesPending?: boolean;
};

export const PhaseProgressModal = ({
  id,
  points,
  minPoints,
  showProgress = true,
  courses = [],
  coursesPending = false,
}: PhaseProgressModalProps) => {
  const progress = Math.min(100, Math.round((points / minPoints) * 100));
  const concluded = showProgress && progress === 100;

  return (
    <DialogContent
      showCloseButton={false}
      className={
        concluded
          ? 'bg-linear-to-l from-green-500 to-emerald-600 max-h-[90vh] overflow-y-auto'
          : 'bg-linear-to-r from-blue-400 to-indigo-500 max-h-[90vh] overflow-y-auto'
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

        {showProgress && (
          <CourseProgressList cursos={courses} isPending={coursesPending} />
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
