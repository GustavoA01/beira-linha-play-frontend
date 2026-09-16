import { activityXp } from '@/data/atividades';
import type { AtividadeType, ModuloType } from '@/data/types/api';
import type {
  ActivitySummaryResponseType,
  ModuleResponseType,
} from '@/data/types/services';
import { toActivitySummary } from '@/pages/atividade/utils';

export const toModule = (modulo: ModuleResponseType): ModuloType => ({
  ...modulo,
  atividades: (modulo.atividades ?? []).map(toActivitySummary),
});

export const fillActivityXp = async (
  atividades: AtividadeType[],
  fetchActivity: (id: string) => Promise<ActivitySummaryResponseType>
) =>
  Promise.all(
    atividades.map(async (atividade) => {
      if (activityXp(atividade) > 0) return atividade;
      try {
        return toActivitySummary(await fetchActivity(atividade.id));
      } catch {
        return atividade;
      }
    })
  );
