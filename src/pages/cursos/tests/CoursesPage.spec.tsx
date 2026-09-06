import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CoursesPage } from '../index';
import { useAuthUser } from '@/providers/UserProvider';
import { mockLoggedAdmin } from '@/data/temporaryMocks/admins';
import { mockLoggedMonitor } from '@/data/temporaryMocks/monitores';

jest.mock('@/providers/UserProvider', () => ({
  useAuthUser: jest.fn(),
}));

const mockedUseAuthUser = useAuthUser as jest.MockedFunction<
  typeof useAuthUser
>;

const renderPage = () =>
  render(
    <MemoryRouter>
      <CoursesPage />
    </MemoryRouter>
  );

describe('CoursesPage', () => {
  it('hides admin actions from the monitor', () => {
    mockedUseAuthUser.mockReturnValue({
      user: mockLoggedMonitor,
      setUser: jest.fn(),
      isAluno: false,
      isMonitor: true,
      isAdmin: false,
    });

    renderPage();

    expect(
      screen.queryByRole('button', { name: 'Adicionar Admin' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Adicionar Curso' })
    ).not.toBeInTheDocument();
  });

  it('opens the create admin dialog from the header', async () => {
    const user = userEvent.setup();
    mockedUseAuthUser.mockReturnValue({
      user: mockLoggedAdmin,
      setUser: jest.fn(),
      isAluno: false,
      isMonitor: false,
      isAdmin: true,
    });

    renderPage();

    await user.click(screen.getByRole('button', { name: 'Adicionar Admin' }));

    expect(
      screen.getByRole('heading', { name: 'Novo administrador' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Informe o nome e a senha do novo usuário administrador.'
      )
    ).toBeInTheDocument();
  });
});
