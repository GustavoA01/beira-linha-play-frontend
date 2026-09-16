import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { activityXp } from '@/data/atividades';
import { MAX_TENTATIVAS } from '@/data/constants';
import { countStudentAttempts, bestStudentScore } from '@/data/tentativas';
import { activityKeys, attemptKeys } from '@/lib/queryClientKeys';
import { useAuthUser } from '@/providers/UserProvider';
import { getActivity } from '@/services/atividades';
import { listMyAttempts } from '@/services/tentativas';
import { toActivity } from '../utils';

export const useAtividade = () => {
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

  return {
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
  };
};
