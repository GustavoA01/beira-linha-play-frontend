import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RequireGuest } from '@/components/layouts/RequireGuest';
import { mockLoggedAluno } from '@/data/mocks/usuario';
import { mockLoggedMonitor } from '@/data/mocks/monitores';
import { useUserProvider } from '@/providers/UserProvider';

jest.mock('@/providers/UserProvider', () => ({
  useUserProvider: jest.fn(),
}));

const mockedUseUserProvider = useUserProvider as jest.MockedFunction<
  typeof useUserProvider
>;

const renderGuard = (path = '/login') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<RequireGuest />}>
          <Route path="/login" element={<p>Login</p>} />
          <Route path="/cadastro" element={<p>Cadastro</p>} />
        </Route>
        <Route path="/" element={<p>Mapa do aluno</p>} />
        <Route path="/cursos" element={<p>Lista de cursos</p>} />
      </Routes>
    </MemoryRouter>
  );

describe('RequireGuest', () => {
  it('does not navigate while the session is loading', () => {
    mockedUseUserProvider.mockReturnValue({
      user: null,
      setUser: jest.fn(),
      status: 'loading',
      isAluno: false,
      isMonitor: false,
      isAdmin: false,
    });

    renderGuard();
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });

  it('shows the public route when the session is anonymous', () => {
    mockedUseUserProvider.mockReturnValue({
      user: null,
      setUser: jest.fn(),
      status: 'anonimo',
      isAluno: false,
      isMonitor: false,
      isAdmin: false,
    });

    renderGuard();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('sends the student home when already authenticated', () => {
    mockedUseUserProvider.mockReturnValue({
      user: mockLoggedAluno,
      setUser: jest.fn(),
      status: 'autenticado',
      isAluno: true,
      isMonitor: false,
      isAdmin: false,
    });

    renderGuard();
    expect(screen.getByText('Mapa do aluno')).toBeInTheDocument();
  });

  it('sends the monitor to courses when already authenticated', () => {
    mockedUseUserProvider.mockReturnValue({
      user: mockLoggedMonitor,
      setUser: jest.fn(),
      status: 'autenticado',
      isAluno: false,
      isMonitor: true,
      isAdmin: false,
    });

    renderGuard();
    expect(screen.getByText('Lista de cursos')).toBeInTheDocument();
  });
});
