import type { AtividadeType, QuestaoType } from '@/data/types/api';
import type {
  MonitoringResponseType,
  QuestionStatsResponseType,
} from '@/data/types/services';
import type { QuestionStatType, StudentRowType } from '../types';

export const alternativeLetter = (index: number) =>
  String.fromCharCode(65 + index);

const toQuestion = (
  activity: AtividadeType,
  stat: QuestionStatsResponseType
): QuestaoType => {
  const question = activity.questoes.find((item) => item.id === stat.questaoId);
  const alternativas = (stat.alternativas ?? []).map((alternativa) => ({
    id: alternativa.alternativaId,
    descricao: alternativa.descricao,
    correta: alternativa.correta,
  }));

  if (!question) {
    return {
      id: stat.questaoId,
      enunciado: stat.enunciado,
      valor: 0,
      alternativas,
    };
  }

  return {
    ...question,
    enunciado: stat.enunciado || question.enunciado,
    alternativas: question.alternativas.map((alternativa) => {
      const fromStat = alternativas.find((item) => item.id === alternativa.id);
      return fromStat
        ? { ...alternativa, correta: fromStat.correta }
        : alternativa;
    }),
  };
};

export const toMonitoring = (
  activity: AtividadeType,
  monitoring: MonitoringResponseType
) => {
  const questionStats: QuestionStatType[] = (monitoring.questoes ?? []).map(
    (stat) => ({
      question: toQuestion(activity, stat),
      number: stat.numero,
      accuracyPercent: Math.round(stat.acertoPercentual),
      alternativeStats: (stat.alternativas ?? []).map((alternativa) => ({
        alternative: {
          id: alternativa.alternativaId,
          descricao: alternativa.descricao,
          correta: alternativa.correta,
        },
        letter: alternativa.letra,
        votes: alternativa.votos,
        percent: Math.round(alternativa.percentual),
        isDistractor: alternativa.distrator,
      })),
    })
  );

  const questoes = activity.questoes.length
    ? activity.questoes.map((questao) => {
        const overlay = questionStats.find(
          (item) => item.question.id === questao.id
        );
        return overlay?.question ?? questao;
      })
    : questionStats.map((item) => item.question);

  const studentRows: StudentRowType[] = (monitoring.alunos ?? []).map(
    (aluno) => ({
      student: {
        id: aluno.alunoId,
        nome: aluno.nome,
        apelido: aluno.apelido,
        pontos: aluno.pontos,
        imagemPerfil: aluno.imagemPerfil,
      },
      attempt: aluno.tentativa ?? undefined,
      answersByQuestion: aluno.respostasPorQuestao ?? [],
    })
  );

  return {
    classSize: monitoring.tamanhoTurma,
    submissions: monitoring.envios,
    totalXp: monitoring.xpTotal,
    averageScore: Math.round(monitoring.mediaPontuacao),
    averageAccuracy: Math.round(monitoring.mediaAcertoPercentual),
    questionStats,
    studentRows,
    activity: {
      ...activity,
      questoes,
      quantQuestoes: questoes.length || activity.quantQuestoes,
    },
  };
};
