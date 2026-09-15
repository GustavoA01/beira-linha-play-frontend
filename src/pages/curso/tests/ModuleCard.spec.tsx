import { render, screen } from '@testing-library/react';
import { ModuleCard } from '../components/ModuleCard';
import type { ModuloType } from '@/data/types/api';

const modulo = (atividades: ModuloType['atividades']): ModuloType => ({
  id: 'modulo-1',
  nome: 'Limites',
  cursoId: 'curso-1',
  atividades,
});

const atividade = (id: string): ModuloType['atividades'][number] => ({
  id,
  titulo: id,
  quantQuestoes: 1,
  moduloId: 'modulo-1',
  questoes: [],
});

describe('ModuleCard', () => {
  it('shows the number of activities in the module', () => {
    render(
      <ModuleCard
        modulo={modulo([atividade('atv-1'), atividade('atv-2')])}
        isMonitor={false}
        onClick={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText('2 atividades')).toBeInTheDocument();
    expect(screen.getByText('0 XP')).toBeInTheDocument();
  });

  it('uses the singular label for one activity', () => {
    render(
      <ModuleCard
        modulo={modulo([atividade('atv-1')])}
        isMonitor={false}
        onClick={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText('1 atividade')).toBeInTheDocument();
  });

  it('shows the summed xp of the activities', () => {
    render(
      <ModuleCard
        modulo={modulo([
          {
            ...atividade('atv-1'),
            questoes: [
              { id: 'q1', enunciado: 'a', valor: 2, alternativas: [] },
            ],
          },
          {
            ...atividade('atv-2'),
            questoes: [
              { id: 'q2', enunciado: 'b', valor: 3, alternativas: [] },
            ],
          },
        ])}
        isMonitor={false}
        onClick={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText('2 atividades')).toBeInTheDocument();
    expect(screen.getByText('5 XP')).toBeInTheDocument();
  });
});
