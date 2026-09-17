import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ModalFooter } from '../components/ProgressModal/ModalFooter';

const renderFooter = (ui: ReactElement, onOpenChange = jest.fn()) =>
  render(
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>{ui}</DialogContent>
    </Dialog>
  );

describe('ModalFooter', () => {
  it('asks the student to keep going when the phase is in progress', () => {
    renderFooter(<ModalFooter concluded={false} />);

    expect(
      screen.getByText(
        'Você está indo bem! Continue fazendo as atividades da disciplina para preencher a barra e liberar o próximo nível.'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Voltar' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Legal!' })
    ).not.toBeInTheDocument();
  });

  it('congratulates when the phase is completed', () => {
    renderFooter(<ModalFooter concluded />);

    expect(
      screen.getByText('Parabéns! Você concluiu a fase com sucesso!')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Legal!' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Voltar' })
    ).not.toBeInTheDocument();
  });

  it('closes the dialog from the back button', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();

    renderFooter(<ModalFooter concluded={false} />, onOpenChange);

    await user.click(screen.getByRole('button', { name: 'Voltar' }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('explains the unlock requirement without student copy', () => {
    renderFooter(
      <ModalFooter concluded={false} showProgress={false} minPoints={10} />
    );

    expect(
      screen.getByText('Os alunos liberam esta fase ao alcançar 10 pontos.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Voltar' })).toBeInTheDocument();
    expect(
      screen.queryByText('Parabéns! Você concluiu a fase com sucesso!')
    ).not.toBeInTheDocument();
  });
});
