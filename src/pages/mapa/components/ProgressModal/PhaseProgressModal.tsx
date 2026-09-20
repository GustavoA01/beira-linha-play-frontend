import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { DialogContent } from '@/components/ui/dialog';
import { ModalHeader } from './ModalHeader';
import { BarProgress } from './BarProgress';
import { ModalFooter } from './ModalFooter';
import { AchievementCard } from './AchievementCard';
import { ShareButtons } from './ShareButtons';
import {
  CourseProgressList,
  type CourseProgressItemType,
} from './CourseProgressList';

type PhaseProgressModalProps = {
  id: string;
  points: number;
  minPoints: number;
  showProgress?: boolean;
  studentName?: string;
  courses?: CourseProgressItemType[];
  coursesPending?: boolean;
};

export const PhaseProgressModal = ({
  id,
  points,
  minPoints,
  showProgress = true,
  studentName = '',
  courses = [],
  coursesPending = false,
}: PhaseProgressModalProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const progress = Math.min(100, Math.round((points / minPoints) * 100));
  const concluded = showProgress && progress === 100;
  const exportCard =
    concluded && typeof document !== 'undefined'
      ? createPortal(
          <div
            aria-hidden
            style={{
              position: 'fixed',
              left: -1200,
              top: 0,
              width: 1080,
              height: 1080,
              pointerEvents: 'none',
            }}
          >
            <AchievementCard
              ref={cardRef}
              variant="export"
              nome={studentName}
              level={id}
              points={points}
              minPoints={minPoints}
            />
          </div>,
          document.body
        )
      : null;

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

        {concluded && (
          <>
            <AchievementCard
              nome={studentName}
              level={id}
              points={points}
              minPoints={minPoints}
            />
            <ShareButtons
              cardRef={cardRef}
              nome={studentName}
              level={id}
              points={points}
            />
          </>
        )}

        {showProgress && !concluded && (
          <CourseProgressList cursos={courses} isPending={coursesPending} />
        )}

        <ModalFooter
          concluded={concluded}
          showProgress={showProgress}
          minPoints={minPoints}
        />
      </div>
      {exportCard}
    </DialogContent>
  );
};
