import { AnimatePresence, motion } from 'motion/react';
import type { AtividadeType } from '@/data/types/api';
import { Dialog } from '@/components/ui/dialog';
import { PhaseProgressModal } from '@/pages/mapa/components/ProgressModal/PhaseProgressModal';
import { useAuthUser } from '@/providers/UserProvider';
import { useQuizPlay } from '../hooks/useQuizPlay';
import { QuizHeader } from '../components/QuizHeader';
import { QuestionStep } from '../components/QuestionStep';
import { QuizFooter } from '../components/QuizFooter';
import { QuizSummary } from './QuizSummary';

type QuizPlayPropsType = {
  activity: AtividadeType;
  usedAttempts: number;
};

export const QuizPlay = ({ activity, usedAttempts }: QuizPlayPropsType) => {
  const { user, isAluno } = useAuthUser();
  const {
    phase,
    currentQuestion,
    currentIndex,
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
    faseDesbloqueada,
    fecharFaseDesbloqueada,
  } = useQuizPlay(activity, usedAttempts);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-zinc-50">
      <QuizHeader
        title={activity.titulo}
        progressPercent={progressPercent}
        attemptNumber={attemptNumber}
        onLeave={leaveQuiz}
      />

      {phase === 'summary' ? (
        <QuizSummary
          questions={activity.questoes}
          answers={answers}
          score={score}
          totalXp={totalXp}
          revealCorrect={revealCorrect}
          canRetry={canRetry}
          onRetry={retry}
        />
      ) : (
        <>
          <div className="min-h-0 flex-1 overflow-y-auto custom-bar px-4 py-6 sm:px-8">
            <div className="container mx-auto max-w-xl">
              <AnimatePresence mode="wait">
                {currentQuestion && (
                  <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.2 }}
                  >
                    <QuestionStep
                      question={currentQuestion}
                      questionNumber={currentIndex + 1}
                      selectedId={selectedId}
                      selectedIsCorrect={selectedIsCorrect}
                      phase={phase}
                      revealCorrect={revealCorrect}
                      onSelect={selectAlternative}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <QuizFooter
            phase={phase}
            canCheck={Boolean(selectedId)}
            selectedIsCorrect={selectedIsCorrect}
            revealCorrect={revealCorrect}
            correctDescription={correctAlternative?.descricao}
            earnedXp={currentQuestion?.valor ?? 0}
            isLastQuestion={isLastQuestion}
            isSubmitting={isSubmitting}
            onCheck={checkAnswer}
            onNext={goNext}
          />
        </>
      )}

      {faseDesbloqueada && isAluno && (
        <Dialog open onOpenChange={(open) => !open && fecharFaseDesbloqueada()}>
          <PhaseProgressModal
            id={faseDesbloqueada.id}
            points={faseDesbloqueada.points}
            minPoints={faseDesbloqueada.minPoints}
            studentName={user.nome}
          />
        </Dialog>
      )}
    </div>
  );
};
