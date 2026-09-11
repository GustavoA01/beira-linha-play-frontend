import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ModalHeader } from '../components/ProgressModal/ModalHeader';

const renderHeader = (ui: ReactElement) =>
  render(
    <Dialog open>
      <DialogContent showCloseButton={false}>{ui}</DialogContent>
    </Dialog>
  );

describe('ModalHeader', () => {
  it('shows the level and in-progress status', () => {
    renderHeader(<ModalHeader level="2" concluded={false} />);

    expect(
      screen.getByRole('heading', { name: 'Nível 2' })
    ).toBeInTheDocument();
    expect(screen.getByText('Em progresso')).toBeInTheDocument();
    expect(screen.queryByText('Concluído')).not.toBeInTheDocument();
  });

  it('shows the completed status', () => {
    renderHeader(<ModalHeader level="5" concluded />);

    expect(
      screen.getByRole('heading', { name: 'Nível 5' })
    ).toBeInTheDocument();
    expect(screen.getByText('Concluído')).toBeInTheDocument();
    expect(screen.queryByText('Em progresso')).not.toBeInTheDocument();
  });
});
