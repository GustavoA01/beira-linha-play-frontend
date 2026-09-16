import { Navigate } from 'react-router-dom';
import { QuizPlay } from './features/QuizPlay/container/QuizPlay';
import { ActivityConcluded } from './components/ActivityConcluded';
import { ResourceNotFound } from '@/components/ResourceNotFound';
import { QuizPageSkeleton } from '@/components/PageSkeleton';
import { ApiError } from '@/services/api';
import { useAtividade } from './hooks/useAtividade';

export const ActivityPage = () => {
  const {
    cursoId,
    moduloId,
    atividadeId,
    auth,
    validIds,
    data,
    isPending,
    isError,
    error,
    attemptsEnabled,
    isAttemptsPending,
    isAttemptsError,
    stayOnQuiz,
    usedAttempts,
    bestScore,
    totalXp,
    hasConcluded,
  } = useAtividade();

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
