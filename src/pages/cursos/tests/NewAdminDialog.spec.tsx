import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NewAdminDialog } from '../components/NewAdminDialog';
import { toast } from '@/components/ui/toast';

jest.mock('@/components/ui/toast', () => ({
  toast: { add: jest.fn() },
}));

const mockedToastAdd = toast.add as jest.MockedFunction<typeof toast.add>;

describe('NewAdminDialog', () => {
  beforeEach(() => {
    mockedToastAdd.mockReset();
  });

  it('shows the form when open', () => {
    render(<NewAdminDialog open onOpenChange={jest.fn()} />);

    expect(
      screen.getByRole('heading', { name: 'Novo administrador' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar senha')).toBeInTheDocument();
  });

  it('does not render the content when closed', () => {
    render(<NewAdminDialog open={false} onOpenChange={jest.fn()} />);

    expect(
      screen.queryByRole('heading', { name: 'Novo administrador' })
    ).not.toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();

    render(<NewAdminDialog open onOpenChange={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Adicionar' }));

    expect(await screen.findByText('Informe o nome')).toBeInTheDocument();
    expect(
      screen.getByText('A senha deve ter pelo menos 6 caracteres')
    ).toBeInTheDocument();
  });

  it('warns when passwords do not match', async () => {
    const user = userEvent.setup();

    render(<NewAdminDialog open onOpenChange={jest.fn()} />);

    await user.type(screen.getByLabelText('Nome'), 'Ana Oliveira');
    await user.type(screen.getByLabelText('Senha'), '123456');
    await user.type(screen.getByLabelText('Confirmar senha'), 'abcdef');
    await user.click(screen.getByRole('button', { name: 'Adicionar' }));

    expect(
      await screen.findByText('As senhas não coincidem')
    ).toBeInTheDocument();
  });

  it('closes when cancelled', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();

    render(<NewAdminDialog open onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('creates the admin and closes the dialog', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(<NewAdminDialog open onOpenChange={onOpenChange} />);

    await user.type(screen.getByLabelText('Nome'), 'Ana Oliveira');
    await user.type(screen.getByLabelText('Senha'), '123456');
    await user.type(screen.getByLabelText('Confirmar senha'), '123456');
    await user.click(screen.getByRole('button', { name: 'Adicionar' }));

    expect(logSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: 'Ana Oliveira',
        senha: '123456',
        tipo: 'ADMIN',
      })
    );
    expect(mockedToastAdd).toHaveBeenCalledWith({
      type: 'success',
      title: 'Administrador adicionado',
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);

    logSpy.mockRestore();
  });
});
