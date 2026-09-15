import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteModuleDialog } from '../components/DeleteModuleDialog';

const renderDialog = (
  overrides: Partial<Parameters<typeof DeleteModuleDialog>[0]> = {}
) => {
  const onConfirm = jest.fn();
  const onOpenChange = jest.fn();

  render(
    <DeleteModuleDialog
      open
      onOpenChange={onOpenChange}
      moduleName="Derivadas"
      codigoAcesso="ABC123"
      onConfirm={onConfirm}
      {...overrides}
    />
  );

  return { onConfirm, onOpenChange };
};

describe('DeleteModuleDialog', () => {
  it('confirms the deletion when the course code matches', async () => {
    const user = userEvent.setup();
    const { onConfirm } = renderDialog();

    expect(
      screen.getByRole('heading', { name: 'Excluir módulo?' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'O módulo Derivadas será removido junto com todas as atividades dele. Esta ação é irreversível.'
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
