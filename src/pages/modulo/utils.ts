import type { ModuloType } from '@/data/types/api';
import type { ModuleResponseType } from '@/data/types/services';

export const toModulo = (modulo: ModuleResponseType): ModuloType => ({
  ...modulo,
  atividades: (modulo.atividades ?? []).map((atividade) => ({
    ...atividade,
    questoes: [],
  })),
});
