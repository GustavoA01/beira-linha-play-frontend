import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LogoutDialog } from '@/components/LogoutDialog';
import { mockLoggedAluno } from '@/data/temporaryMocks/usuario';
import { UserProvider } from '@/providers/UserProvider';
import { logout } from '@/services/auth';

jest.mock('@/services/auth', () => ({
  login: jest.fn(),
  register: jest.fn(),
  currentUser: jest.fn(),
  refresh: jest.fn(),
  logout: jest.fn(),
}));

const mockedLogout = logout as jest.MockedFunction<typeof logout>;

const wrapClient = (ui: ReactElement) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return <QueryClientProvider client={client}>{ui}</QueryClientProvider>;
};

const renderDialog = () =>
  render(
    wrapClient(
      <MemoryRouter initialEntries={['/cursos']}>
        <UserProvider initialUser={mockLoggedAluno}>
          <Routes>
            <Route
              path="/cursos"
              element={<LogoutDialog openDialog setOpenDialog={jest.fn()} />}
            />
            <Route path="/login" element={<p>Login</p>} />
          </Routes>
        </UserProvider>
      </MemoryRouter>
    )
  );

describe('LogoutDialog', () => {
  beforeEach(() => {
    mockedLogout.mockReset();
    mockedLogout.mockResolvedValue({
      data: undefined,
      status: 204,
      statusText: 'No Content',
      headers: {},
      config: { headers: {} },
    } as Awaited<ReturnType<typeof logout>>);
  });

  it('shows the dialog when open', () => {
    renderDialog();

    expect(
      screen.getByText('Deseja mesmo sair da sua conta?')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Você será redirecionado para a tela de login.')
    ).toBeInTheDocument();
  });

  it('closes when cancelled', async () => {
    const user = userEvent.setup();
    const setOpenDialog = jest.fn();

    render(
      wrapClient(
        <MemoryRouter>
          <UserProvider initialUser={mockLoggedAluno}>
            <LogoutDialog openDialog setOpenDialog={setOpenDialog} />
          </UserProvider>
        </MemoryRouter>
      )
    );

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(setOpenDialog).toHaveBeenCalledWith(false);
  });

  it('calls logout and goes to login', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole('button', { name: 'Sair' }));

    expect(mockedLogout).toHaveBeenCalled();
    expect(await screen.findByText('Login')).toBeInTheDocument();
  });

  it('goes to login even if the API call fails', async () => {
    const user = userEvent.setup();
    mockedLogout.mockRejectedValue(new Error('network'));
    renderDialog();

    await user.click(screen.getByRole('button', { name: 'Sair' }));

    expect(await screen.findByText('Login')).toBeInTheDocument();
  });
});
