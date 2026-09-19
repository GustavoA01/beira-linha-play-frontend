import {
  activityXp,
  courseProgressPercent,
  isActivityConcluded,
  moduleXp,
} from '../atividades';
import type { AtividadeType, CursoType, ModuloType } from '@/data/types/api';

describe('activityXp', () => {
  const activity = (
    overrides: Partial<AtividadeType> & {
      xpTotal?: number;
      xp?: number;
      valorTotal?: number;
    } = {}
  ): AtividadeType & {
    xpTotal?: number;
    xp?: number;
    valorTotal?: number;
  } => ({
    id: 'atv-1',
    titulo: 'Limites',
    quantQuestoes: 0,
    moduloId: 'modulo-1',
    questoes: [],
    ...overrides,
  });

  it('sums the question values', () => {
    expect(
      activityXp(
        activity({
          questoes: [
            {
              id: 'q1',
              enunciado: 'a',
              valor: 2,
              alternativas: [],
            },
            {
              id: 'q2',
              enunciado: 'b',
              valor: 3,
              alternativas: [],
            },
          ],
        })
      )
    ).toBe(5);
  });

  it('uses the flattened xp when there are no questions', () => {
    expect(activityXp(activity({ xpTotal: 8 }))).toBe(8);
    expect(activityXp(activity({ xp: 6 }))).toBe(6);
    expect(activityXp(activity({ valorTotal: 4 }))).toBe(4);
  });
});

describe('isActivityConcluded', () => {
  it('stays pending after one incomplete attempt', () => {
    expect(
      isActivityConcluded(1, 0, 2, [
        {
          pontuacaoObtida: 0,
          respostas: [
            { id: 'r1', questaoId: 'q1', alternativaId: 'a1', correta: false },
          ],
        },
      ])
    ).toBe(false);
  });

  it('stays pending when the score matches xp but answers are wrong', () => {
    expect(
      isActivityConcluded(1, 2, 2, [
        {
          pontuacaoObtida: 2,
          respostas: [
            { id: 'r1', questaoId: 'q1', alternativaId: 'a1', correta: false },
          ],
        },
      ])
    ).toBe(false);
  });

  it('concludes when the student aces on the first attempt', () => {
    expect(
      isActivityConcluded(1, 2, 2, [
        {
          pontuacaoObtida: 2,
          respostas: [
            { id: 'r1', questaoId: 'q1', alternativaId: 'a2', correta: true },
          ],
        },
      ])
    ).toBe(true);
  });

  it('concludes after using both attempts', () => {
    expect(isActivityConcluded(2, 0, 2)).toBe(true);
  });

  it('does not treat a zero-xp activity as aced', () => {
    expect(isActivityConcluded(1, 0, 0)).toBe(false);
  });
});

describe('moduleXp', () => {
  it('sums the xp of every activity', () => {
    const modulo: ModuloType & { xpTotal?: number } = {
      id: 'modulo-1',
      nome: 'Limites',
      cursoId: 'curso-1',
      atividades: [
        {
          id: 'atv-1',
          titulo: 'A',
          quantQuestoes: 1,
          moduloId: 'modulo-1',
          questoes: [{ id: 'q1', enunciado: 'a', valor: 2, alternativas: [] }],
        },
        {
          id: 'atv-2',
          titulo: 'B',
          quantQuestoes: 1,
          moduloId: 'modulo-1',
          xpTotal: 4,
          questoes: [],
        } as ModuloType['atividades'][number] & { xpTotal: number },
      ],
    };

    expect(moduleXp(modulo)).toBe(6);
  });
});

describe('courseProgressPercent', () => {
  const curso = (atividades: AtividadeType[]): CursoType => ({
    id: 'curso-1',
    nome: 'Cálculo 1',
    codigoAcesso: 'ABC123',
    monitorIds: ['monitor-1'],
    modulos: [
      {
        id: 'modulo-1',
        nome: 'Limites',
        cursoId: 'curso-1',
        atividades,
      },
    ],
  });

  const activity = (id: string): AtividadeType => ({
    id,
    titulo: id,
    quantQuestoes: 1,
    moduloId: 'modulo-1',
    questoes: [{ id: `${id}-q`, enunciado: 'a', valor: 2, alternativas: [] }],
  });

  it('returns 0 when the course has no activities', () => {
    expect(courseProgressPercent(curso([]), [], 'aluno-1')).toBe(0);
  });

  it('returns the share of concluded activities', () => {
    expect(
      courseProgressPercent(
        curso([
          activity('atv-1'),
          activity('atv-2'),
          activity('atv-3'),
          activity('atv-4'),
        ]),
        [
          {
            id: 't1',
            alunoId: 'aluno-1',
            atividadeId: 'atv-1',
            pontuacaoObtida: 2,
            dataEnvio: '2026-09-14T12:00:00.000Z',
            respostas: [],
          },
          {
            id: 't2',
            alunoId: 'aluno-1',
            atividadeId: 'atv-1',
            pontuacaoObtida: 0,
            dataEnvio: '2026-09-15T12:00:00.000Z',
            respostas: [],
          },
        ],
        'aluno-1'
      )
    ).toBe(25);
  });
});
