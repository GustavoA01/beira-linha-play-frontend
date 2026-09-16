import { MonitoramentoContent } from './components/MonitoramentoContent';
import { ResourceNotFound } from '@/components/ResourceNotFound';
import { HeaderListPageSkeleton } from '@/components/PageSkeleton';
import { ApiError } from '@/services/api';
import { useMonitoramento } from './hooks/useMonitoramento';

export const ManagementPage = () => {
  const {
    atividadeId,
    activity,
    isActivityPending,
    isActivityError,
    activityError,
    monitoring,
    isMonitoringPending,
    isMonitoringError,
  } = useMonitoramento();

  if (!atividadeId)
    return <ResourceNotFound label="Atividade não encontrada" />;

  if (isActivityPending) return <HeaderListPageSkeleton />;

  if (isActivityError || !activity) {
    const isMissing =
      activityError instanceof ApiError &&
      (activityError.status === 404 || activityError.status === 400);
    return (
      <ResourceNotFound
        label={
          isMissing
            ? 'Atividade não encontrada'
            : 'Não foi possível carregar a atividade'
        }
      />
    );
  }

  if (isMonitoringPending) return <HeaderListPageSkeleton />;

  if (isMonitoringError || !monitoring) {
    return (
      <ResourceNotFound label="Não foi possível carregar o monitoramento" />
    );
  }

  return <MonitoramentoContent activity={activity} monitoring={monitoring} />;
};
