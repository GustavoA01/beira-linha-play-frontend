import { useMemo, useRef, useState } from 'react';
import type { AtividadeType } from '@/data/types/api';
import { activityXp } from '@/data/atividades';
import { useAuthUser } from '@/providers/UserProvider';
import { MAX_TENTATIVAS } from '@/data/constants';
import type { QuizPhaseType } from '@/pages/atividade/features/QuizPlay/types';
import { useSubmitAttempt } from '../../../hooks/useMutation';

export type QuizAnswerType = {
  questaoId: string;
  alternativaId: string;
  correta: boolean | null;
  valor: number;
};

const questionHasGabarito = (
  question: AtividadeType['questoes'][number] | undefined
) => Boolean(question?.alternativas.some((item) => item.correta === true));

export const useQuizPlay = (activity: AtividadeType, usedAttempts: number) => {
  const auth = useAuthUser();
  const { mutateAsync: sendAttempt, isPending: isSubmitting } =
    useSubmitAttempt(activity.id);
  const persistedAttempt = useRef(false);

  const [attemptsUsed, setAttemptsUsed] = useState(usedAttempts);
  const [phase, setPhase] = useState<QuizPhaseType>('answering');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuizAnswerType[]>([]);
  const [selectedIsCorrect, setSelectedIsCorrect] = useState<boolean | null>(
    null
  );
  const [revealCorrect, setRevealCorrect] = useState(usedAttempts >= 1);
  const [attemptNumber, setAttemptNumber] = useState(usedAttempts + 1);

  const questions = activity.questoes;
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const totalXp = activityXp(activity);
  const hasGabarito = questionHasGabarito(currentQuestion);

  const score = useMemo(
    () =>
      answers.reduce(
        (sum, answer) => sum + (answer.correta ? answer.valor : 0),
        0
      ),
    [answers]
  );

  const correctAlternative = currentQuestion?.alternativas.find(
    (item) => item.correta === true
  );

  const progressPercent =
    phase === 'summary'
      ? 100
      : Math.round(
          ((currentIndex + (phase === 'feedback' ? 1 : 0)) /
            Math.max(totalQuestions, 1)) *
            100
        );

  const persistAttempt = async (finalAnswers: QuizAnswerType[]) => {
    if (!auth.isAluno || persistedAttempt.current) {
      return finalAnswers;
    }

    persistedAttempt.current = true;
    try {
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

      const scoredAnswers = finalAnswers.map((answer) => ({
        ...answer,
        correta: corretoPorQuestao.get(answer.questaoId) ?? answer.correta,
      }));

      setAnswers(scoredAnswers);
      return scoredAnswers;
    } catch (error) {
      persistedAttempt.current = false;
      throw error;
    }
  };

  const selectAlternative = (id: string) => {
    if (phase !== 'answering') return;
    setSelectedId(id);
  };

  const checkAnswer = async () => {
    if (phase !== 'answering' || !selectedId || !currentQuestion) return;

    const alternative = currentQuestion.alternativas.find(
      (item) => item.id === selectedId
    );

    if (!alternative) return;

    const localCorrect = hasGabarito ? Boolean(alternative.correta) : null;
    let nextAnswers: QuizAnswerType[] = [
      ...answers,
      {
        questaoId: currentQuestion.id,
        alternativaId: alternative.id,
        correta: localCorrect,
        valor: currentQuestion.valor,
      },
    ];

    setAnswers(nextAnswers);

    if (isLastQuestion && !hasGabarito) {
      try {
        nextAnswers = await persistAttempt(nextAnswers);
      } catch {
        return;
      }
      const last = nextAnswers.find(
        (item) => item.questaoId === currentQuestion.id
      );
      setSelectedIsCorrect(last?.correta ?? null);
      setPhase('feedback');
      return;
    }

    setSelectedIsCorrect(localCorrect);
    setPhase('feedback');

    if (!isLastQuestion || !hasGabarito) return;

    try {
      await persistAttempt(nextAnswers);
    } catch {
      return;
    }
  };

  const goNext = async () => {
    if (phase !== 'feedback' || isSubmitting) return;

    if (isLastQuestion) {
      if (!persistedAttempt.current) {
        try {
          await persistAttempt(answers);
        } catch {
          return;
        }
      }
      setPhase('summary');
      return;
    }

    setCurrentIndex((index) => index + 1);
    setSelectedId(null);
    setSelectedIsCorrect(null);
    setPhase('answering');
  };

  const leaveQuiz = async () => {
    if (persistedAttempt.current || answers.length === 0) return true;

    if (answers.length === totalQuestions) {
      try {
        await persistAttempt(answers);
        return true;
      } catch {
        return false;
      }
    }

    return window.confirm(
      'Se sair agora, as respostas desta tentativa serão perdidas. Deseja sair?'
    );
  };

  const canRetry =
    phase === 'summary' && attemptsUsed < MAX_TENTATIVAS && score < totalXp;

  const retry = () => {
    const hasBoasted = score >= totalXp;
    const retryLimit = attemptsUsed >= MAX_TENTATIVAS;

    if (retryLimit || hasBoasted) return;

    persistedAttempt.current = false;
    setRevealCorrect(attemptsUsed >= 1);
    setAttemptNumber(attemptsUsed + 1);
    setPhase('answering');
    setCurrentIndex(0);
    setSelectedId(null);
    setSelectedIsCorrect(null);
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
    leaveQuiz,
    retry,
  };
};
