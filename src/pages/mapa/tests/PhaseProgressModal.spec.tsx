import { render, screen } from '@testing-library/react';
import { Dialog } from '@/components/ui/dialog';
import { PhaseProgressModal } from '../components/ProgressModal/PhaseProgressModal';

const renderModal = (points: number, minPoints: number, id = '3') =>
  render(
    <Dialog open>
      <PhaseProgressModal id={id} points={points} minPoints={minPoints} />
    </Dialog>
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
  });

  it('shows completed copy when the bar is full', () => {
    renderModal(80, 80, '1');

    expect(
      screen.getByRole('heading', { name: 'Nível 1' })
    ).toBeInTheDocument();
    expect(screen.getByText('Concluído')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Legal!' })).toBeInTheDocument();
  });

  it('caps progress at 100% when points exceed the minimum', () => {
    renderModal(150, 100);

    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('Concluído')).toBeInTheDocument();
  });
});
