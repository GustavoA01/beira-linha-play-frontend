import { useMemo, useState } from 'react';
import type { AtividadeType } from '@/data/types/api';
import { activityXp } from '@/data/atividades';
import { useAuthUser } from '@/providers/UserProvider';
import { MAX_TENTATIVAS } from '@/data/constants';
import type { QuizPhaseType } from '@/pages/atividade/features/QuizPlay/types';
import { useSubmitAttempt } from '../../../hooks/useMutation';

export type QuizAnswerType = {
  questaoId: string;
  alternativaId: string;
  correta: boolean;
  valor: number;
};

export const useQuizPlay = (activity: AtividadeType, usedAttempts: number) => {
  const auth = useAuthUser();
  const { mutateAsync: sendAttempt, isPending: isSubmitting } =
    useSubmitAttempt(activity.id);

  const [attemptsUsed, setAttemptsUsed] = useState(usedAttempts);
  const [phase, setPhase] = useState<QuizPhaseType>('answering');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuizAnswerType[]>([]);
  const [revealCorrect, setRevealCorrect] = useState(usedAttempts >= 1);
  const [attemptNumber, setAttemptNumber] = useState(usedAttempts + 1);

  const questions = activity.questoes;
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const totalXp = activityXp(activity);

  const score = useMemo(
    () =>
      answers.reduce(
        (sum, answer) => sum + (answer.correta ? answer.valor : 0),
        0
      ),
    [answers]
  );

  const selectedAlternative = currentQuestion?.alternativas.find(
    (item) => item.id === selectedId
  );
  const correctAlternative = currentQuestion?.alternativas.find(
    (item) => item.correta
  );
  const selectedIsCorrect = Boolean(selectedAlternative?.correta);

  const progressPercent =
    phase === 'summary'
      ? 100
      : Math.round(
          ((currentIndex + (phase === 'feedback' ? 1 : 0)) /
            Math.max(totalQuestions, 1)) *
            100
        );

  const persistAttempt = async (finalAnswers: QuizAnswerType[]) => {
    if (!auth.isAluno) return;

    const result = await sendAttempt({
      respostas: finalAnswers.map(({ questaoId, alternativaId }) => ({
        questaoId,
        alternativaId,
      })),
    });

    setAttemptsUsed(result.tentativasUsadas);
    auth.setUser({ ...auth.user, pontos: result.pontosTotais });

    const corretoPorQuestao = new Map(
      (result.tentativa.respostas ?? []).map((item) => [
        item.questaoId,
        item.correta,
      ])
    );

    if (corretoPorQuestao.size === 0) return;

    setAnswers((prev) =>
      prev.map((answer) => ({
        ...answer,
        correta: corretoPorQuestao.get(answer.questaoId) ?? answer.correta,
      }))
    );
  };

  const selectAlternative = (id: string) => {
    if (phase !== 'answering') return;
    setSelectedId(id);
  };

  const checkAnswer = () => {
    if (phase !== 'answering' || !selectedId || !currentQuestion) return;

    const alternative = currentQuestion.alternativas.find(
      (item) => item.id === selectedId
    );

    if (!alternative) return;

    setAnswers((prev) => [
      ...prev,
      {
        questaoId: currentQuestion.id,
        alternativaId: alternative.id,
        correta: alternative.correta,
        valor: currentQuestion.valor,
      },
    ]);
    setPhase('feedback');
  };

  const goNext = async () => {
    if (phase !== 'feedback' || isSubmitting) return;

    if (isLastQuestion) {
      await persistAttempt(answers);
      setPhase('summary');
      return;
    }

    setCurrentIndex((index) => index + 1);
    setSelectedId(null);
    setPhase('answering');
  };

  const canRetry =
    phase === 'summary' && attemptsUsed < MAX_TENTATIVAS && score < totalXp;

  const retry = () => {
    const hasBoasted = score >= totalXp;
    const retryLimit = attemptsUsed >= MAX_TENTATIVAS;

    if (retryLimit || hasBoasted) return;

    setRevealCorrect(attemptsUsed >= 1);
    setAttemptNumber(attemptsUsed + 1);
    setPhase('answering');
    setCurrentIndex(0);
    setSelectedId(null);
    setAnswers([]);
  };

  return {
    phase,
    currentQuestion,
    currentIndex,
    totalQuestions,
    selectedId,
    selectedIsCorrect,
    correctAlternative,
    answers,
    score,
    totalXp,
    revealCorrect,
    isLastQuestion,
    progressPercent,
    attemptNumber,
    canRetry,
    isSubmitting,
    selectAlternative,
    checkAnswer,
    goNext,
    retry,
  };
};
