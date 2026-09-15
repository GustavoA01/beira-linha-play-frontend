import type { AtividadeType } from '@/data/types/api';
import type { MonitoringResponseType } from '@/data/types/services';
import { alternativeLetter, toMonitoring } from '../utils';

const activity: AtividadeType = {
  id: 'atividade-1',
  titulo: 'Limites',
  quantQuestoes: 1,
  moduloId: 'modulo-1',
  questoes: [
    {
      id: 'q1',
      enunciado: 'Quanto vale o limite?',
      valor: 10,
      alternativas: [
        { id: 'a1', descricao: '0', correta: false },
        { id: 'a2', descricao: '1', correta: true },
      ],
    },
  ],
};

const monitoring: MonitoringResponseType = {
  tamanhoTurma: 8,
  envios: 2,
  xpTotal: 10,
  mediaPontuacao: 7.6,
  mediaAcertoPercentual: 50.4,
  questoes: [
    {
      questaoId: 'q1',
      enunciado: 'Quanto vale o limite?',
      numero: 1,
      acertoPercentual: 50,
      alternativas: [
        {
          alternativaId: 'a1',
          descricao: '0',
          correta: false,
          letra: 'A',
          votos: 1,
          percentual: 50,
          distrator: true,
        },
        {
          alternativaId: 'a2',
          descricao: '1',
          correta: true,
          letra: 'B',
          votos: 1,
          percentual: 50,
          distrator: false,
        },
      ],
    },
  ],
  alunos: [
    {
      alunoId: 'aluno-1',
      nome: 'Gustavo Aguiar',
      apelido: 'Gu',
      pontos: 100,
      imagemPerfil: '',
      tentativa: {
        id: 't1',
        dataEnvio: '2026-09-14T12:00:00.000Z',
        pontuacaoObtida: 10,
        alunoId: 'aluno-1',
        atividadeId: 'atividade-1',
        respostas: [
          {
            id: 'r1',
            correta: true,
            questaoId: 'q1',
            alternativaId: 'a2',
          },
        ],
      },
      respostasPorQuestao: ['B'],
    },
    {
      alunoId: 'aluno-2',
      nome: 'Ana Costa',
      apelido: 'Ana',
      pontos: 40,
      imagemPerfil: '',
      tentativa: null,
      respostasPorQuestao: [null],
    },
  ],
};

describe('toMonitoring', () => {
  it('maps letters from the alternative index', () => {
    expect(alternativeLetter(0)).toBe('A');
    expect(alternativeLetter(1)).toBe('B');
  });

  it('maps API stats onto the activity monitor view', () => {
    const result = toMonitoring(activity, monitoring);

    expect(result.classSize).toBe(8);
    expect(result.submissions).toBe(2);
    expect(result.totalXp).toBe(10);
    expect(result.averageScore).toBe(8);
    expect(result.averageAccuracy).toBe(50);
    expect(result.questionStats).toHaveLength(1);
    expect(result.questionStats[0].accuracyPercent).toBe(50);
    expect(result.questionStats[0].alternativeStats[0].isDistractor).toBe(true);
    expect(result.studentRows).toHaveLength(2);
    expect(result.studentRows[0].student.id).toBe('aluno-1');
    expect(result.studentRows[0].attempt?.pontuacaoObtida).toBe(10);
    expect(result.studentRows[1].attempt).toBeUndefined();
    expect(result.activity.questoes[0].alternativas[1].correta).toBe(true);
  });
});
