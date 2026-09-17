import type { AtividadeType } from '@/data/types/api';
import type {
  ActivitySummaryResponseType,
  QuestionResponseType,
} from '@/data/types/services';

const toQuestions = (
  questoes: QuestionResponseType[] | undefined
): AtividadeType['questoes'] =>
  (questoes ?? []).map((questao) => ({
    ...questao,
    alternativas: (questao.alternativas ?? []).map((alternativa) => ({
      ...alternativa,
      correta: alternativa.correta ?? null,
    })),
  }));

export const toActivitySummary = (
  atividade: ActivitySummaryResponseType
): AtividadeType => ({
  ...atividade,
  questoes: toQuestions(atividade.questoes),
});

export const toActivity = toActivitySummary;
