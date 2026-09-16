import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { activityKeys } from '@/lib/queryClientKeys';
import { toActivity } from '@/pages/atividade/utils';
import { getActivity, getActivityMonitoring } from '@/services/atividades';

export const useMonitoramento = () => {
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

  return {
    atividadeId,
    activity,
    isActivityPending,
    isActivityError,
    activityError,
    monitoring,
    isMonitoringPending,
    isMonitoringError,
  };
};
