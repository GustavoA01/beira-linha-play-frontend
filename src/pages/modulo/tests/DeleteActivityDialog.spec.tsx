import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteActivityDialog } from '../components/DeleteActivityDialog';

const renderDialog = (
  overrides: Partial<Parameters<typeof DeleteActivityDialog>[0]> = {}
) => {
  const onConfirm = jest.fn();
  const onOpenChange = jest.fn();

  render(
    <DeleteActivityDialog
      open
      onOpenChange={onOpenChange}
      activityName="Limites"
      codigoAcesso="ABC123"
      onConfirm={onConfirm}
      {...overrides}
    />
  );

  return { onConfirm, onOpenChange };
};

describe('DeleteActivityDialog', () => {
  it('confirms the deletion when the course code matches', async () => {
    const user = userEvent.setup();
    const { onConfirm } = renderDialog();

    expect(
      screen.getByRole('heading', { name: 'Excluir atividade?' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'A atividade Limites será removida. Esta ação é irreversível.'
      )
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText('Código do curso'), 'ABC123');
    await user.click(screen.getByRole('button', { name: 'Excluir' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('does not delete when the course code is missing', async () => {
    const user = userEvent.setup();
    const { onConfirm } = renderDialog();

    await user.click(screen.getByRole('button', { name: 'Excluir' }));

    expect(onConfirm).not.toHaveBeenCalled();
    expect(
      screen.getByText('O código do curso não confere')
    ).toBeInTheDocument();
  });

  it('does not delete when the course code is wrong', async () => {
    const user = userEvent.setup();
    const { onConfirm } = renderDialog();

    await user.type(screen.getByLabelText('Código do curso'), 'errado');
    await user.click(screen.getByRole('button', { name: 'Excluir' }));

    expect(onConfirm).not.toHaveBeenCalled();
    expect(
      screen.getByText('O código do curso não confere')
    ).toBeInTheDocument();
  });

  it('cancels without deleting', async () => {
    const user = userEvent.setup();
    const { onConfirm, onOpenChange } = renderDialog();

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
