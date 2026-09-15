import { toCourse, withModuleDetails } from '../utils';
import type { CourseResponseType } from '@/data/types/services';
import type { ModuloType } from '@/data/types/api';

const course = (
  overrides: CourseResponseType['modulos']
): CourseResponseType => ({
  id: 'curso-1',
  nome: 'Cálculo 1',
  codigoAcesso: 'ABC123',
  monitorIds: ['monitor-1'],
  modulos: overrides,
});

describe('toCourse', () => {
  it('counts activities sent in the module payload', () => {
    const result = toCourse(
      course([
        {
          id: 'modulo-1',
          nome: 'Limites',
          cursoId: 'curso-1',
          atividades: [
            {
              id: 'atv-1',
              titulo: 'Noção de limite',
              quantQuestoes: 2,
              moduloId: 'modulo-1',
            },
            {
              id: 'atv-2',
              titulo: 'Continuidade',
              quantQuestoes: 1,
              moduloId: 'modulo-1',
            },
          ],
        },
      ])
    );

    expect(result.modulos[0].atividades).toHaveLength(2);
  });

  it('uses quantAtividades when the list is missing', () => {
    const result = toCourse(
      course([
        {
          id: 'modulo-1',
          nome: 'Limites',
          cursoId: 'curso-1',
          quantAtividades: 3,
        },
      ])
    );

    expect(result.modulos[0].atividades).toHaveLength(3);
  });

  it('uses quantidadeAtividades when the list is missing', () => {
    const result = toCourse(
      course([
        {
          id: 'modulo-1',
          nome: 'Limites',
          cursoId: 'curso-1',
          quantidadeAtividades: 2,
        },
      ])
    );

    expect(result.modulos[0].atividades).toHaveLength(2);
  });
});

describe('withModuleDetails', () => {
  it('replaces thin modules with the fetched activity lists', () => {
    const course = toCourse({
      id: 'curso-1',
      nome: 'Cálculo 1',
      codigoAcesso: 'ABC123',
      monitorIds: ['monitor-1'],
      modulos: [
        {
          id: 'modulo-1',
          nome: 'Limites',
          cursoId: 'curso-1',
        },
      ],
    });
    const detailed: ModuloType = {
      id: 'modulo-1',
      nome: 'Limites',
      cursoId: 'curso-1',
      atividades: [
        {
          id: 'atv-1',
          titulo: 'Noção de limite',
          quantQuestoes: 1,
          moduloId: 'modulo-1',
          questoes: [],
        },
      ],
    };

    const result = withModuleDetails(course, new Map([['modulo-1', detailed]]));

    expect(result.modulos[0].atividades).toHaveLength(1);
  });
});
