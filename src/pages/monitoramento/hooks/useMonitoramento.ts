import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { queryClientKeys } from '@/lib/queryClientKeys';
import { toActivity } from '@/pages/atividade/utils';
import { getActivity, getActivityMonitoring } from '@/services/atividades';
import { useCursoAlocado } from '@/hooks/useCursoAlocado';

export const useMonitoramento = () => {
  const { atividadeId, cursoId } = useParams();
  const { bloqueado } = useCursoAlocado(cursoId);
  const enabled = Boolean(atividadeId) && !bloqueado;

  const {
    data: activity,
    isPending: isActivityPending,
    isError: isActivityError,
    error: activityError,
  } = useQuery({
    queryKey: queryClientKeys.activityKeys.detail(atividadeId ?? ''),
    queryFn: async () => toActivity(await getActivity(atividadeId!)),
    enabled,
  });

  const {
    data: monitoring,
    isPending: isMonitoringPending,
    isError: isMonitoringError,
  } = useQuery({
    queryKey: queryClientKeys.activityKeys.monitoring(atividadeId ?? ''),
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
    bloqueado,
  };
};
