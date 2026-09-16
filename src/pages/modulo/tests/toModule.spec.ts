import { fillActivityXp, toModule } from '../utils';

describe('toModule', () => {
  it('keeps the questions so the activity xp can be summed', () => {
    const result = toModule({
      id: 'modulo-1',
      nome: 'Limites',
      cursoId: 'curso-1',
      atividades: [
        {
          id: 'atv-1',
          titulo: 'Noção de limite',
          quantQuestoes: 1,
          moduloId: 'modulo-1',
          questoes: [
            { id: 'q1', enunciado: 'Quanto vale?', valor: 4, alternativas: [] },
          ],
        },
      ],
    });

    expect(result.atividades[0].questoes).toEqual([
      { id: 'q1', enunciado: 'Quanto vale?', valor: 4, alternativas: [] },
    ]);
  });

  it('keeps flattened xp when questions are omitted', () => {
    const result = toModule({
      id: 'modulo-1',
      nome: 'Limites',
      cursoId: 'curso-1',
      atividades: [
        {
          id: 'atv-1',
          titulo: 'Noção de limite',
          quantQuestoes: 2,
          moduloId: 'modulo-1',
          xpTotal: 7,
        },
      ],
    });

    expect(result.atividades[0]).toMatchObject({ xpTotal: 7, questoes: [] });
  });
});

describe('fillActivityXp', () => {
  it('fetches the activity detail when the list has no xp', async () => {
    const result = await fillActivityXp(
      [
        {
          id: 'atv-1',
          titulo: 'Noção de limite',
          quantQuestoes: 1,
          moduloId: 'modulo-1',
          questoes: [],
        },
      ],
      async () => ({
        id: 'atv-1',
        titulo: 'Noção de limite',
        quantQuestoes: 1,
        moduloId: 'modulo-1',
        questoes: [
          { id: 'q1', enunciado: 'Quanto vale?', valor: 3, alternativas: [] },
        ],
      })
    );

    expect(result[0].questoes[0].valor).toBe(3);
  });

  it('does not fetch when the list already has xp', async () => {
    const fetchActivity = jest.fn();

    await fillActivityXp(
      [
        {
          id: 'atv-1',
          titulo: 'Noção de limite',
          quantQuestoes: 1,
          moduloId: 'modulo-1',
          questoes: [
            { id: 'q1', enunciado: 'Quanto vale?', valor: 4, alternativas: [] },
          ],
        },
      ],
      fetchActivity
    );

    expect(fetchActivity).not.toHaveBeenCalled();
  });
});
