import { useParams } from 'react-router-dom';
import { MonitoramentoContent } from './components/MonitoramentoContent';
import { ResourceNotFound } from '@/components/ResourceNotFound';
import { useQuery } from '@tanstack/react-query';
import { getActivity, getActivityMonitoring } from '@/services/atividades';
import { activityKeys } from '@/lib/queryClientKeys';
import { toActivity } from '@/pages/atividade/utils';
import { HeaderListPageSkeleton } from '@/components/PageSkeleton';
import { ApiError } from '@/services/api';

export const ManagementPage = () => {
  const { atividadeId } = useParams();
  const enabled = Boolean(atividadeId);
  const {
    data: activity,
    isPending: isActivityPending,
    isError: isActivityError,
    error: activityError,
  } = useQuery({
    queryKey: activityKeys.detail(atividadeId ?? ''),
    queryFn: async () => toActivity(await getActivity(atividadeId!)),
    enabled,
  });
  const {
    data: monitoring,
    isPending: isMonitoringPending,
    isError: isMonitoringError,
  } = useQuery({
    queryKey: activityKeys.monitoring(atividadeId ?? ''),
    queryFn: () => getActivityMonitoring(atividadeId!),
    enabled,
  });

  if (!atividadeId) {
    return <ResourceNotFound label="Atividade não encontrada" />;
  }

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
