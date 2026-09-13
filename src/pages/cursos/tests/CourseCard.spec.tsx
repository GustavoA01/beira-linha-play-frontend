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
});
