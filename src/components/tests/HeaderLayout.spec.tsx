import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { HeaderLayout } from '@/components/layouts/HeaderLayout';
import { mockLoggedAluno } from '@/data/temporaryMocks/usuario';
import { UserProvider } from '@/providers/UserProvider';

jest.mock('@/assets/logo-beira-linha.png', () => 'logo.png');

const renderLayout = (route: string) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <UserProvider initialUser={mockLoggedAluno}>
        <Routes>
          <Route element={<HeaderLayout />}>
            <Route path="/cursos" element={<p>Lista de cursos</p>} />
            <Route path="/outra" element={<p>Outra página</p>} />
          </Route>
        </Routes>
      </UserProvider>
    </MemoryRouter>
  );

describe('HeaderLayout', () => {
  it('shows the route content and bottom navigation on /cursos', () => {
    renderLayout('/cursos');

    expect(screen.getByText('Lista de cursos')).toBeInTheDocument();
    expect(screen.getByText('Beira Linha Play')).toBeInTheDocument();
    expect(screen.getAllByRole('navigation')).toHaveLength(2);
  });

  it('hides the bottom navigation outside its routes', () => {
    renderLayout('/outra');

    expect(screen.getByText('Outra página')).toBeInTheDocument();
    expect(screen.getAllByRole('navigation')).toHaveLength(1);
  });
});
