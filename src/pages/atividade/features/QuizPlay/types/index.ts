export type AlternativeStatusType =
  | 'unselected'
  | 'selected'
  | 'correct'
  | 'wrong'
  | 'reveal';

export type QuizPhaseType = 'answering' | 'feedback' | 'summary';

export type QuizFooterPropsType = {
  phase: QuizPhaseType;
  canCheck: boolean;
  selectedIsCorrect: boolean;
  revealCorrect: boolean;
  correctDescription?: string;
  earnedXp: number;
  isLastQuestion: boolean;
  isSubmitting: boolean;
  onCheck: () => void;
  onNext: () => void;
};
