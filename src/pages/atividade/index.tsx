import { Navigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { activityXp } from '@/data/atividades';
import { countStudentAttempts, bestStudentScore } from '@/data/tentativas';
import { useAuthUser } from '@/providers/UserProvider';
import { MAX_TENTATIVAS } from '@/data/constants';
import { QuizPlay } from './features/QuizPlay/container/QuizPlay';
import { ActivityConcluded } from './components/ActivityConcluded';
import { ResourceNotFound } from '@/components/ResourceNotFound';
import { useQuery } from '@tanstack/react-query';
import { getActivity } from '@/services/atividades';
import { listMyAttempts } from '@/services/tentativas';
import { activityKeys, attemptKeys } from '@/lib/queryClientKeys';
import { toActivity } from './utils';
import { QuizPageSkeleton } from '@/components/PageSkeleton';
import { ApiError } from '@/services/api';

export const ActivityPage = () => {
  const { cursoId, moduloId, atividadeId } = useParams();
  const auth = useAuthUser();
  const validIds = Boolean(cursoId && moduloId && atividadeId);
  const { data, isPending, isError, error } = useQuery({
    queryKey: activityKeys.detail(atividadeId ?? ''),
    queryFn: async () => toActivity(await getActivity(atividadeId!)),
    enabled: validIds && !auth.isMonitor,
  });
  const attemptsEnabled = validIds && auth.isAluno;
  const {
    data: attempts = [],
    isPending: isAttemptsPending,
    isError: isAttemptsError,
  } = useQuery({
    queryKey: attemptKeys.mine(atividadeId),
    queryFn: () => listMyAttempts(atividadeId),
    enabled: attemptsEnabled,
  });
  const [stayOnQuiz, setStayOnQuiz] = useState(false);

  const studentId = auth.user.id;
  const usedAttempts = data
    ? countStudentAttempts(attempts, studentId, data.id)
    : 0;
  const bestScore = data ? bestStudentScore(attempts, studentId, data.id) : 0;
  const totalXp = data ? activityXp(data) : 0;
  const hasBoasted = usedAttempts > 0 && bestScore >= totalXp;
  const hasConcluded =
    Boolean(data) && (usedAttempts === MAX_TENTATIVAS || hasBoasted);

  useEffect(() => {
    if (data && !hasConcluded) setStayOnQuiz(true);
  }, [data, hasConcluded]);

  if (auth.isMonitor && validIds) {
    return (
      <Navigate
        to={`/cursos/${cursoId}/modulos/${moduloId}/monitoramento/${atividadeId}`}
        replace
      />
    );
  }

  if (!validIds) return <ResourceNotFound label="Atividade não encontrada" />;

  if (isPending || (attemptsEnabled && isAttemptsPending)) {
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

  if (attemptsEnabled && isAttemptsError) {
    return <ResourceNotFound label="Não foi possível carregar as tentativas" />;
  }

  if (hasConcluded && !stayOnQuiz) {
    return (
      <ActivityConcluded
        activity={data}
        bestScore={bestScore}
        totalXp={totalXp}
      />
    );
  }

  return <QuizPlay activity={data} usedAttempts={usedAttempts} />;
};
