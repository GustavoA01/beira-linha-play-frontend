import type { ModuloType } from '@/data/types/api';
import type { ModuleResponseType } from '@/data/types/services';
import { toActivitySummary } from '@/pages/atividade/utils';

export const toModule = (modulo: ModuleResponseType): ModuloType => ({
  ...modulo,
  atividades: (modulo.atividades ?? []).map(toActivitySummary),
});
