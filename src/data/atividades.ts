import { MAX_TENTATIVAS } from '@/data/constants';
import type {
  AtividadeType,
  CursoType,
  ModuloType,
  TentativaType,
} from '@/data/types/api';
import { bestStudentScore, countStudentAttempts } from '@/data/tentativas';

type WithFlattenedXp = {
  xpTotal?: number;
  xp?: number;
  valorTotal?: number;
};

export const activityXp = (item: AtividadeType & WithFlattenedXp) => {
  const fromQuestions = (item.questoes ?? []).reduce(
    (total, questao) => total + (questao.valor ?? 0),
    0
  );
  return fromQuestions || item.xpTotal || item.xp || item.valorTotal || 0;
};

export const isActivityConcluded = (
  usedAttempts: number,
  bestScore: number,
  xpTotal: number
) =>
  usedAttempts === MAX_TENTATIVAS || (usedAttempts > 0 && bestScore >= xpTotal);

export const isModuleConcluded = (
  modulo: ModuloType,
  tentativas: TentativaType[],
  alunoId: string
) => {
  if (modulo.atividades.length === 0) return false;

  return modulo.atividades.every((atividade) =>
    isActivityConcluded(
      countStudentAttempts(tentativas, alunoId, atividade.id),
      bestStudentScore(tentativas, alunoId, atividade.id),
      activityXp(atividade)
    )
  );
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
