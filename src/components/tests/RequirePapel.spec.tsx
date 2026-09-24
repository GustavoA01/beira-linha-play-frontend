import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RequirePapel } from '@/components/layouts/RequirePapel';
import { mockLoggedAluno } from '@/data/mocks/usuario';
import { mockLoggedMonitor } from '@/data/mocks/monitores';
import { useAuthUser } from '@/providers/UserProvider';

jest.mock('@/providers/UserProvider', () => ({
  useAuthUser: jest.fn(),
}));

const mockedUseAuthUser = useAuthUser as jest.MockedFunction<
  typeof useAuthUser
>;

const renderGuard = () =>
  render(
    <MemoryRouter initialEntries={['/cursos/1/modulos/1/nova-atividade']}>
      <Routes>
        <Route path="/cursos" element={<p>Lista de cursos</p>} />
        <Route element={<RequirePapel papeis={['MONITOR']} />}>
          <Route
            path="/cursos/:cursoId/modulos/:moduloId/nova-atividade"
            element={<p>Nova atividade</p>}
          />
        </Route>
      </Routes>
    </MemoryRouter>
  );

describe('RequirePapel', () => {
  it('allows the route for the expected role', () => {
    mockedUseAuthUser.mockReturnValue({
      user: mockLoggedMonitor,
      setUser: jest.fn(),
      status: 'autenticado',
      isAluno: false,
      isMonitor: true,
      isAdmin: false,
    });

    renderGuard();
    expect(screen.getByText('Nova atividade')).toBeInTheDocument();
  });

  it('redirects other roles to courses', () => {
    mockedUseAuthUser.mockReturnValue({
      user: mockLoggedAluno,
      setUser: jest.fn(),
      status: 'autenticado',
      isAluno: true,
      isMonitor: false,
      isAdmin: false,
    });

    renderGuard();
    expect(screen.getByText('Lista de cursos')).toBeInTheDocument();
  });
});
