import type { ReactElement } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NewAdminDialog } from '../components/NewAdminDialog';
import { createAdmin } from '@/services/usuarios';
import { toast } from '@/components/ui/toast';

jest.mock('@/components/ui/toast', () => ({
  toast: { add: jest.fn() },
}));

jest.mock('@/services/usuarios', () => ({
  createAdmin: jest.fn(),
  listMonitors: jest.fn(),
  updateAccount: jest.fn(),
}));

const mockedCreateAdmin = createAdmin as jest.MockedFunction<
  typeof createAdmin
>;
const mockedToastAdd = toast.add as jest.MockedFunction<typeof toast.add>;

const renderDialog = (ui: ReactElement) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
};

describe('NewAdminDialog', () => {
  beforeEach(() => {
    mockedToastAdd.mockReset();
    mockedCreateAdmin.mockReset();
  });

  it('shows the form when open', () => {
    renderDialog(<NewAdminDialog open onOpenChange={jest.fn()} />);

    expect(
      screen.getByRole('heading', { name: 'Novo administrador' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar senha')).toBeInTheDocument();
  });

  it('does not render the content when closed', () => {
    renderDialog(<NewAdminDialog open={false} onOpenChange={jest.fn()} />);

    expect(
      screen.queryByRole('heading', { name: 'Novo administrador' })
    ).not.toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();

    renderDialog(<NewAdminDialog open onOpenChange={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Adicionar' }));

    expect(await screen.findByText('Informe o nome')).toBeInTheDocument();
    expect(
      screen.getByText('A senha deve ter pelo menos 6 caracteres')
    ).toBeInTheDocument();
  });

  it('warns when passwords do not match', async () => {
    const user = userEvent.setup();

    renderDialog(<NewAdminDialog open onOpenChange={jest.fn()} />);

    await user.type(screen.getByLabelText('Nome'), 'Ana Oliveira');
    await user.type(screen.getByLabelText('Senha'), '123456');
    await user.type(screen.getByLabelText('Confirmar senha'), 'abcdef');
    await user.click(screen.getByRole('button', { name: 'Adicionar' }));

    expect(
      await screen.findByText('As senhas não coincidem')
    ).toBeInTheDocument();
    expect(mockedCreateAdmin).not.toHaveBeenCalled();
  });

  it('closes when cancelled', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();

    renderDialog(<NewAdminDialog open onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('creates the admin and closes the dialog', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    mockedCreateAdmin.mockResolvedValue({
      id: 'admin-2',
      nome: 'Ana Oliveira',
      tipo: 'ADMIN',
    });

    renderDialog(<NewAdminDialog open onOpenChange={onOpenChange} />);

    await user.type(screen.getByLabelText('Nome'), 'Ana Oliveira');
    await user.type(screen.getByLabelText('Senha'), '123456');
    await user.type(screen.getByLabelText('Confirmar senha'), '123456');
    await user.click(screen.getByRole('button', { name: 'Adicionar' }));

    await waitFor(() => {
      expect(mockedCreateAdmin).toHaveBeenCalledWith(
        { nome: 'Ana Oliveira', senha: '123456' },
        expect.anything()
      );
    });
    expect(mockedToastAdd).toHaveBeenCalledWith({
      type: 'success',
      title: 'Administrador adicionado',
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
