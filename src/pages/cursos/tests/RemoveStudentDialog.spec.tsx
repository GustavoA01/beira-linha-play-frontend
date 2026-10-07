import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RemoveStudentDialog } from '../components/RemoveStudentDialog';

describe('RemoveStudentDialog', () => {
  it('confirms the removal', async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();

    render(
      <RemoveStudentDialog
        open
        onOpenChange={jest.fn()}
        studentName="Maria Silva"
        courseName="Cálculo I"
        onConfirm={onConfirm}
      />
    );

    expect(
      screen.getByRole('heading', { name: 'Remover aluno?' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Maria Silva será removido do curso Cálculo I. Esta ação não pode ser desfeita.'
      )
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remover' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('cancels without removing', async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    const onOpenChange = jest.fn();

    render(
      <RemoveStudentDialog
        open
        onOpenChange={onOpenChange}
        studentName="Maria Silva"
        courseName="Cálculo I"
        onConfirm={onConfirm}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
