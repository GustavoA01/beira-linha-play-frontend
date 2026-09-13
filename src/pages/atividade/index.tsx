import { Navigate, useParams } from 'react-router-dom';
import { xpDaAtividade } from '@/data/temporaryMocks/cursos';
import { temporaryTentativas } from '@/data/temporaryMocks/tentativas';
import {
  contarTentativasDoAluno,
  melhorPontuacaoDoAluno,
} from '@/data/tentativas';
import { useAuthUser } from '@/providers/UserProvider';
import { MAX_TENTATIVAS } from '@/data/constants';
import { QuizPlay } from './features/QuizPlay/container/QuizPlay';
import { ActivityConcluded } from './components/ActivityConcluded';
import { ResourceNotFound } from '@/components/ResourceNotFound';
import { useQuery } from '@tanstack/react-query';
import { getActivity } from '@/services/atividades';
import { activityKeys } from '@/lib/queryClientKeys';
import { toAtividade } from './utils';
import { QuizPageSkeleton } from '@/components/PageSkeleton';
import { ApiError } from '@/services/api';

export const ActivityPage = () => {
  const { cursoId, moduloId, atividadeId } = useParams();
  const auth = useAuthUser();
  const validIds = Boolean(cursoId && moduloId && atividadeId);
  const { data, isPending, isError, error } = useQuery({
    queryKey: activityKeys.detail(atividadeId ?? ''),
    queryFn: async () => toAtividade(await getActivity(atividadeId!)),
    enabled: validIds && !auth.isMonitor,
  });

  if (auth.isMonitor && validIds) {
    return (
      <Navigate
        to={`/cursos/${cursoId}/modulos/${moduloId}/monitoramento/${atividadeId}`}
        replace
      />
    );
  }

  if (!validIds) {
    return <ResourceNotFound label="Atividade não encontrada" />;
  }

  if (isPending) {
    return <QuizPageSkeleton />;
  }

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

  const studentId = auth.user.id;
  const usedAttempts = contarTentativasDoAluno(
    temporaryTentativas,
    studentId,
    data.id
  );
  const bestScore = melhorPontuacaoDoAluno(
    temporaryTentativas,
    studentId,
    data.id
  );
  const totalXp = xpDaAtividade(data);
  const hasBoasted = usedAttempts > 0 && bestScore >= totalXp;
  const hasConcluded = usedAttempts === MAX_TENTATIVAS || hasBoasted;

  if (hasConcluded) {
    return (
      <ActivityConcluded
        activity={data}
        bestScore={bestScore}
        totalXp={totalXp}
      />
    );
  }

  return <QuizPlay activity={data} />;
};
