import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteModuleDialog } from '../components/DeleteModuleDialog';

describe('DeleteModuleDialog', () => {
  it('confirms the deletion', async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();

    render(
      <DeleteModuleDialog
        open
        onOpenChange={jest.fn()}
        moduleName="Derivadas"
        onConfirm={onConfirm}
      />
    );

    expect(
      screen.getByRole('heading', { name: 'Excluir módulo?' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'O módulo Derivadas será removido. Esta ação não pode ser desfeita.'
      )
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Excluir' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('cancels without deleting', async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    const onOpenChange = jest.fn();

    render(
      <DeleteModuleDialog
        open
        onOpenChange={onOpenChange}
        moduleName="Derivadas"
        onConfirm={onConfirm}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
