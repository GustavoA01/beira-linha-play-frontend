import { activityXp, moduleXp } from '../atividades';
import type { AtividadeType, ModuloType } from '@/data/types/api';

describe('activityXp', () => {
  const activity = (
    overrides: Partial<AtividadeType> & { xpTotal?: number } = {}
  ): AtividadeType & { xpTotal?: number } => ({
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
