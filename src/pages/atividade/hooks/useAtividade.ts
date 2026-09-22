import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { queryClientKeys } from '@/lib/queryClientKeys';
import { activityXp, isActivityConcluded } from '@/data/atividades';
import {
  countStudentAttempts,
  bestStudentScore,
  studentAttemptsOnActivity,
} from '@/data/tentativas';
import { useAuthUser } from '@/providers/UserProvider';
import { getActivity } from '@/services/atividades';
import { listMyAttempts } from '@/services/tentativas';
import { toActivity } from '../utils';

export const useAtividade = () => {
  const auth = useAuthUser();
  const { cursoId, moduloId, atividadeId } = useParams();
  const [stayOnQuiz, setStayOnQuiz] = useState(false);
  const validIds = Boolean(cursoId && moduloId && atividadeId);

  const {
    data: atividade,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: queryClientKeys.activityKeys.detail(atividadeId ?? ''),
    queryFn: async () => toActivity(await getActivity(atividadeId!)),
    enabled: validIds && !auth.isMonitor,
  });

  const attemptsEnabled = validIds && auth.isAluno;

  const {
    data: attempts = [],
    isPending: isAttemptsPending,
    isError: isAttemptsError,
  } = useQuery({
    queryKey: queryClientKeys.attemptKeys.mine(atividadeId),
    queryFn: () => listMyAttempts(atividadeId),
    enabled: attemptsEnabled,
  });

  const studentId = auth.user.id;
  const usedAttempts = atividade
    ? countStudentAttempts(attempts, studentId, atividade.id)
    : 0;
  const bestScore = atividade
    ? bestStudentScore(attempts, studentId, atividade.id)
    : 0;
  const totalXp = atividade ? activityXp(atividade) : 0;
  const hasConcluded = atividade
    ? isActivityConcluded(
        usedAttempts,
        bestScore,
        totalXp,
        studentAttemptsOnActivity(attempts, studentId, atividade.id)
      )
    : false;

  useEffect(() => {
    if (atividade && !hasConcluded) setStayOnQuiz(true);
  }, [atividade, hasConcluded]);

  return {
    cursoId,
    moduloId,
    atividadeId,
    auth,
    validIds,
    atividade,
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
