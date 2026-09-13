import type { AtividadeType } from '@/data/types/api';
import type { ActivityResponseType } from '@/data/types/services';

export const toAtividade = (
  atividade: ActivityResponseType
): AtividadeType => ({
  ...atividade,
  questoes: (atividade.questoes ?? []).map((questao) => ({
    ...questao,
    alternativas: (questao.alternativas ?? []).map((alternativa) => ({
      ...alternativa,
      correta: alternativa.correta ?? false,
    })),
  })),
});
