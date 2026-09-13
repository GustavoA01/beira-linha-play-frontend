import { useParams } from 'react-router-dom';
import { MonitoramentoContent } from './components/MonitoramentoContent';
import { ResourceNotFound } from '@/components/ResourceNotFound';
import { useQuery } from '@tanstack/react-query';
import { getActivity } from '@/services/atividades';
import { activityKeys } from '@/lib/queryClientKeys';
import { toAtividade } from '@/pages/atividade/utils';
import { HeaderListPageSkeleton } from '@/components/PageSkeleton';
import { ApiError } from '@/services/api';

export const ManagementPage = () => {
  const { atividadeId } = useParams();
  const { data, isPending, isError, error } = useQuery({
    queryKey: activityKeys.detail(atividadeId ?? ''),
    queryFn: async () => toAtividade(await getActivity(atividadeId!)),
    enabled: Boolean(atividadeId),
  });

  if (!atividadeId) {
    return <ResourceNotFound label="Atividade não encontrada" />;
  }

  if (isPending) return <HeaderListPageSkeleton />;

  if (isError || !data) {
    const isMissing =
      error instanceof ApiError &&
      (error.status === 404 || error.status === 400);
    return (
      <ResourceNotFound
        label={
          isMissing
            ? 'Atividade não encontrada'
            : error instanceof ApiError
              ? error.message
              : 'Não foi possível carregar a atividade'
        }
      />
    );
  }

  return <MonitoramentoContent activity={data} />;
};
