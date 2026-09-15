import { useMediaDevice } from '@/hooks/useMediaDevice';
import { useState } from 'react';
import type { AtividadeType } from '@/data/types/api';
import type { MonitoringResponseType } from '@/data/types/services';
import { MonitorHeader } from './MonitorHeader';
import { SummaryCards } from './SummaryCards';
import { QuestionsAccordion } from './QuestionsAccordion';
import { StudentsTable } from './StudentsTable';
import { AttemptDialog } from './AttemptDialog';
import type { StudentRowType } from '../types';
import { useActivityMonitor } from '../hooks/useActivityMonitor';

type MonitoramentoContentPropsType = {
  activity: AtividadeType;
  monitoring: MonitoringResponseType;
};

export const MonitoramentoContent = ({
  activity,
  monitoring,
}: MonitoramentoContentPropsType) => {
  const { containerClassName } = useMediaDevice();
  const [selectedStudent, setSelectedStudent] = useState<StudentRowType | null>(
    null
  );
  const {
    classSize,
    submissions,
    totalXp,
    averageScore,
    averageAccuracy,
    questionStats,
    studentRows,
    activity: monitoredActivity,
  } = useActivityMonitor(activity, monitoring);

  const hardestQuestion = [...questionStats].sort(
    (a, b) => a.accuracyPercent - b.accuracyPercent
  )[0]?.number;

  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <MonitorHeader activity={monitoredActivity} totalXp={totalXp} />

      <div
        className={`flex-1 min-h-0 overflow-y-auto custom-bar space-y-6 pb-20 ${containerClassName}`}
      >
        <SummaryCards
          submissions={submissions}
          classSize={classSize}
          averageAccuracy={averageAccuracy}
          averageScore={averageScore}
          hardestQuestion={hardestQuestion}
        />
        <QuestionsAccordion questionStats={questionStats} />
        <StudentsTable
          activity={monitoredActivity}
          rows={studentRows}
          onSelectStudent={setSelectedStudent}
        />
      </div>

      <AttemptDialog
        activity={monitoredActivity}
        row={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
};
