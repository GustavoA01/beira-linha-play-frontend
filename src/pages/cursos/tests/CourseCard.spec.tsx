import { render, screen } from '@testing-library/react';
import { CourseCard } from '../components/CourseCard';
import type { CursoType } from '@/data/types/api';

const curso: CursoType = {
  id: 'curso-1',
  nome: 'Cálculo I',
  codigoAcesso: 'ABC123',
  monitorIds: ['monitor-1'],
  modulos: [],
};

describe('CourseCard', () => {
  it('hides the actions menu when the user cannot delete', () => {
    render(
      <CourseCard
        curso={curso}
        monitorNome="Maria Souza"
        onClick={jest.fn()}
        codCurso="ABC123"
      />
    );

    expect(
      screen.queryByRole('button', { name: 'Ações do curso' })
    ).not.toBeInTheDocument();
  });

  it('shows the actions menu for the admin', () => {
    render(
      <CourseCard
        curso={curso}
        monitorNome="Maria Souza"
        onClick={jest.fn()}
        codCurso="ABC123"
        canDelete
        onDelete={jest.fn()}
      />
    );

    expect(
      screen.getByRole('button', { name: 'Ações do curso' })
    ).toBeInTheDocument();
  });

  it('shows the number of activities in the course', () => {
    render(
      <CourseCard
        curso={{
          ...curso,
          modulos: [
            {
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
                {
                  id: 'atv-2',
                  titulo: 'Continuidade',
                  quantQuestoes: 1,
                  moduloId: 'modulo-1',
                  questoes: [],
                },
              ],
            },
          ],
        }}
        monitorNome="Maria Souza"
        onClick={jest.fn()}
        codCurso="ABC123"
      />
    );

    expect(screen.getByText('1 módulo')).toBeInTheDocument();
    expect(screen.getByText('2 Ativ.')).toBeInTheDocument();
  });

  it('clamps long course titles to one line', () => {
    render(
      <CourseCard
        curso={{
          ...curso,
          nome: 'Biologia para o Enem com nome bem longo',
        }}
        monitorNome="Maria Souza"
        onClick={jest.fn()}
        codCurso="ABC123"
      />
    );

    expect(
      screen.getByRole('heading', {
        name: 'Biologia para o Enem com nome bem longo',
      })
    ).toHaveClass('line-clamp-1');
  });
});
