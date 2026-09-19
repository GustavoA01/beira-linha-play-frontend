import { MAX_TENTATIVAS } from '@/data/constants';
import type {
  AtividadeType,
  CursoType,
  ModuloType,
  TentativaType,
} from '@/data/types/api';
import {
  bestStudentScore,
  countStudentAttempts,
  studentAttemptsOnActivity,
} from '@/data/tentativas';

type WithFlattenedXp = {
  xpTotal?: number;
  xp?: number;
  valorTotal?: number;
};

type AttemptLike = Pick<TentativaType, 'pontuacaoObtida' | 'respostas'>;

export const activityXp = (item: AtividadeType & WithFlattenedXp) => {
  const fromQuestions = (item.questoes ?? []).reduce(
    (total, questao) => total + (questao.valor ?? 0),
    0
  );
  return fromQuestions || item.xpTotal || item.xp || item.valorTotal || 0;
};

const attemptHasAnswers = (attempt: AttemptLike) =>
  (attempt.respostas?.length ?? 0) > 0;

const attemptIsPerfect = (attempt: AttemptLike, xpTotal: number) => {
  if (attemptHasAnswers(attempt)) {
    return attempt.respostas!.every((resposta) => resposta.correta);
  }
  return xpTotal > 0 && attempt.pontuacaoObtida >= xpTotal;
};

export const isActivityConcluded = (
  usedAttempts: number,
  bestScore: number,
  xpTotal: number,
  attempts: AttemptLike[] = []
) => {
  if (usedAttempts >= MAX_TENTATIVAS) return true;
  if (usedAttempts <= 0) return false;

  if (attempts.some(attemptHasAnswers)) {
    return attempts.some((attempt) => attemptIsPerfect(attempt, xpTotal));
  }

  return xpTotal > 0 && bestScore >= xpTotal;
};

export const isStudentActivityConcluded = (
  atividade: AtividadeType,
  tentativas: TentativaType[],
  alunoId: string
) =>
  isActivityConcluded(
    countStudentAttempts(tentativas, alunoId, atividade.id),
    bestStudentScore(tentativas, alunoId, atividade.id),
    activityXp(atividade),
    studentAttemptsOnActivity(tentativas, alunoId, atividade.id)
  );

export const isModuleConcluded = (
  modulo: ModuloType,
  tentativas: TentativaType[],
  alunoId: string
) => {
  if (modulo.atividades.length === 0) return false;

  return modulo.atividades.every((atividade) =>
    isStudentActivityConcluded(atividade, tentativas, alunoId)
  );
};

export const courseProgressPercent = (
  curso: CursoType,
  tentativas: TentativaType[],
  alunoId: string
) => {
  const atividades = curso.modulos.flatMap((modulo) => modulo.atividades);
  if (atividades.length === 0) return 0;

  const concluded = atividades.filter((atividade) =>
    isStudentActivityConcluded(atividade, tentativas, alunoId)
  ).length;

  return Math.round((concluded / atividades.length) * 100);
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
