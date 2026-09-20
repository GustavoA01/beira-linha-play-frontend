import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Dialog } from '@/components/ui/dialog';
import { PhaseProgressModal } from '../components/ProgressModal/PhaseProgressModal';

jest.mock('html-to-image', () => ({
  toBlob: jest.fn(() =>
    Promise.resolve(new Blob(['png'], { type: 'image/png' }))
  ),
  toPng: jest.fn(() => Promise.resolve('data:image/png;base64,xx')),
}));

const renderModal = (
  points: number,
  minPoints: number,
  id = '3',
  courses?: { id: string; nome: string; progresso: number }[],
  studentName = 'Gustavo Aguiar'
) =>
  render(
    <MemoryRouter>
      <Dialog open>
        <PhaseProgressModal
          id={id}
          points={points}
          minPoints={minPoints}
          studentName={studentName}
          courses={courses}
        />
      </Dialog>
    </MemoryRouter>
  );

describe('PhaseProgressModal', () => {
  it('shows in-progress copy when points are below the minimum', () => {
    renderModal(40, 100);

    expect(
      screen.getByRole('heading', { name: 'Nível 3' })
    ).toBeInTheDocument();
    expect(screen.getByText('Em progresso')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Voltar' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Compartilhar' })
    ).not.toBeInTheDocument();
  });

  it('shows completed copy when the bar is full', () => {
    renderModal(80, 80, '1');

    expect(
      screen.getByRole('heading', { name: 'Nível 1' })
    ).toBeInTheDocument();
    expect(screen.getByText('Concluído')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getAllByText('Gustavo Aguiar').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/nível 1/).length).toBeGreaterThan(0);
    expect(
      screen.getByRole('button', { name: 'Compartilhar' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Legal!' })).toBeInTheDocument();
  });

  it('caps progress at 100% when points exceed the minimum', () => {
    renderModal(150, 100);

    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('Concluído')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Compartilhar' })
    ).toBeInTheDocument();
    expect(screen.queryByText('Seus cursos')).not.toBeInTheDocument();
  });

  it('hides the progress bar for staff and shows the phase requirement', () => {
    render(
      <Dialog open>
        <PhaseProgressModal
          id="4"
          points={44}
          minPoints={10}
          showProgress={false}
        />
      </Dialog>
    );

    expect(
      screen.getByRole('heading', { name: 'Nível 4' })
    ).toBeInTheDocument();
    expect(screen.getByText('10 xp para liberar')).toBeInTheDocument();
    expect(
      screen.getByText('Os alunos liberam esta fase ao alcançar 10 pontos.')
    ).toBeInTheDocument();
    expect(screen.queryByText(/Você acumulou/)).not.toBeInTheDocument();
    expect(screen.queryByText('Em progresso')).not.toBeInTheDocument();
    expect(screen.queryByText('Concluído')).not.toBeInTheDocument();
    expect(screen.queryByText('Seus cursos')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Compartilhar' })
    ).not.toBeInTheDocument();
  });

  it('lists enrolled courses as cards that open the course on in-progress phases', () => {
    renderModal(40, 100, '3', [
      { id: 'curso-1', nome: 'Cálculo 1', progresso: 25 },
    ]);

    expect(screen.getByText('Seus cursos')).toBeInTheDocument();
    expect(screen.getByText('Cálculo 1')).toBeInTheDocument();
    expect(screen.getByText('25%')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Cálculo 1, 25% concluído' })
    ).toHaveAttribute('href', '/cursos/curso-1');
    expect(
      screen.queryByRole('link', { name: 'Ver atividades' })
    ).not.toBeInTheDocument();
  });

  it('hides enrolled courses on a concluded phase', () => {
    renderModal(80, 80, '1', [
      { id: 'curso-1', nome: 'Cálculo 1', progresso: 25 },
    ]);

    expect(screen.getByText('Concluído')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Compartilhar' })
    ).toBeInTheDocument();
    expect(screen.queryByText('Seus cursos')).not.toBeInTheDocument();
    expect(screen.queryByText('Cálculo 1')).not.toBeInTheDocument();
  });
});
