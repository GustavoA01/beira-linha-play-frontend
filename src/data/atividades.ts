import type { AtividadeType, CursoType, ModuloType } from '@/data/types/api';

type WithFlattenedXp = { xpTotal?: number };

export const activityXp = (item: AtividadeType & WithFlattenedXp) => {
  const fromQuestions = (item.questoes ?? []).reduce(
    (total, questao) => total + (questao.valor ?? 0),
    0
  );
  return fromQuestions || item.xpTotal || 0;
};

export const moduleXp = (modulo: ModuloType & WithFlattenedXp) => {
  const fromActivities = modulo.atividades.reduce(
    (total, item) => total + activityXp(item),
    0
  );
  return fromActivities || modulo.xpTotal || 0;
};

export const countModuleActivities = (
  modulo: ModuloType,
  quantAtividades?: number
) => modulo.atividades.length || quantAtividades || 0;

export const countCourseActivities = (curso: CursoType) =>
  curso.modulos.reduce(
    (total, modulo) => total + countModuleActivities(modulo),
    0
  );
