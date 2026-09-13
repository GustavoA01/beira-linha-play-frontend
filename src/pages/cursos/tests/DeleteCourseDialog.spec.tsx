import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteCourseDialog } from '../components/DeleteCourseDialog';

describe('DeleteCourseDialog', () => {
  it('confirms the deletion', async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    const onOpenChange = jest.fn();

    render(
      <DeleteCourseDialog
        open
        onOpenChange={onOpenChange}
        courseName="Cálculo I"
        onConfirm={onConfirm}
      />
    );

    expect(
      screen.getByRole('heading', { name: 'Excluir curso?' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'O curso Cálculo I será removido. Esta ação não pode ser desfeita.'
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
      <DeleteCourseDialog
        open
        onOpenChange={onOpenChange}
        courseName="Cálculo I"
        onConfirm={onConfirm}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
