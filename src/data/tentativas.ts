import type { TentativaType } from './types/api';

export const studentAttemptsOnActivity = (
  tentativas: TentativaType[],
  alunoId: string,
  atividadeId: string
) =>
  tentativas.filter(
    (item) => item.alunoId === alunoId && item.atividadeId === atividadeId
  );

export const countStudentAttempts = (
  tentativas: TentativaType[],
  alunoId: string,
  atividadeId: string
) => studentAttemptsOnActivity(tentativas, alunoId, atividadeId).length;

export const bestStudentScore = (
  tentativas: TentativaType[],
  alunoId: string,
  atividadeId: string
) => {
  const pontuacoes = studentAttemptsOnActivity(
    tentativas,
    alunoId,
    atividadeId
  ).map((item) => item.pontuacaoObtida);

  return pontuacoes.length ? Math.max(...pontuacoes) : 0;
};

export const activityAttempts = (
  tentativas: TentativaType[],
  atividadeId: string
) => tentativas.filter((item) => item.atividadeId === atividadeId);

export const latestAttemptByStudent = (
  tentativas: TentativaType[],
  atividadeId: string
) => {
  const porAluno = new Map<string, TentativaType>();

  activityAttempts(tentativas, atividadeId).forEach((item) => {
    const atual = porAluno.get(item.alunoId);
    if (!atual || item.dataEnvio >= atual.dataEnvio) {
      porAluno.set(item.alunoId, item);
    }
  });

  return [...porAluno.values()];
};
