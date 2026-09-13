import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CoursesPage } from '../index';
import { useAuthUser } from '@/providers/UserProvider';
import { mockLoggedAdmin } from '@/data/temporaryMocks/admins';
import { mockLoggedMonitor } from '@/data/temporaryMocks/monitores';
import { listCourses } from '@/services/cursos';
import { listMonitors } from '@/services/usuarios';

jest.mock('@/providers/UserProvider', () => ({
  useAuthUser: jest.fn(),
}));

jest.mock('@/services/cursos', () => ({
  listCourses: jest.fn(),
  createCourse: jest.fn(),
  updateCourse: jest.fn(),
  deleteCourse: jest.fn(),
}));

jest.mock('@/services/usuarios', () => ({
  listMonitors: jest.fn(),
  createAdmin: jest.fn(),
  updateAccount: jest.fn(),
}));

const mockedUseAuthUser = useAuthUser as jest.MockedFunction<
  typeof useAuthUser
>;
const mockedListCourses = listCourses as jest.MockedFunction<
  typeof listCourses
>;
const mockedListMonitors = listMonitors as jest.MockedFunction<
  typeof listMonitors
>;
const renderPage = (ui: ReactElement) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe('CoursesPage', () => {
  beforeEach(() => {
    mockedListCourses.mockReset();
    mockedListMonitors.mockReset();
    mockedListCourses.mockResolvedValue([]);
    mockedListMonitors.mockResolvedValue([]);
  });

  it('hides admin actions from the monitor', async () => {
    mockedUseAuthUser.mockReturnValue({
      user: mockLoggedMonitor,
      setUser: jest.fn(),
      status: 'autenticado',
      isAluno: false,
      isMonitor: true,
      isAdmin: false,
    });

    renderPage(<CoursesPage />);

    expect(
      screen.queryByRole('button', { name: 'Adicionar Admin' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Adicionar Curso' })
    ).not.toBeInTheDocument();
    expect(
      await screen.findByText('Nenhum curso cadastrado.')
    ).toBeInTheDocument();
  });

  it('opens the create admin dialog from the header', async () => {
    const user = userEvent.setup();
    mockedUseAuthUser.mockReturnValue({
      user: mockLoggedAdmin,
      setUser: jest.fn(),
      status: 'autenticado',
      isAluno: false,
      isMonitor: false,
      isAdmin: true,
    });

    renderPage(<CoursesPage />);

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

  it('shows the course and the admin actions menu', async () => {
    mockedUseAuthUser.mockReturnValue({
      user: mockLoggedAdmin,
      setUser: jest.fn(),
      status: 'autenticado',
      isAluno: false,
      isMonitor: false,
      isAdmin: true,
    });
    mockedListCourses.mockResolvedValue([
      {
        id: 'curso-1',
        nome: 'Cálculo I',
        codigoAcesso: 'ABC123',
        monitorIds: ['monitor-1'],
        modulos: [],
      },
    ]);
    mockedListMonitors.mockResolvedValue([
      {
        id: 'monitor-1',
        nome: 'Maria Souza',
        tipo: 'MONITOR',
        email: 'maria.souza@pucminas.br',
        cursoIds: [],
      },
    ]);

    renderPage(<CoursesPage />);

    expect(await screen.findByText('Cálculo I')).toBeInTheDocument();
    expect(screen.getByText('Maria Souza')).toBeInTheDocument();
    expect(screen.getByText('ABC123')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Ações do curso' })
    ).toBeInTheDocument();
  });

  it('locks courses the monitor does not teach and shows her name on her course', async () => {
    mockedUseAuthUser.mockReturnValue({
      user: mockLoggedMonitor,
      setUser: jest.fn(),
      status: 'autenticado',
      isAluno: false,
      isMonitor: true,
      isAdmin: false,
    });
    mockedListCourses.mockResolvedValue([
      {
        id: 'curso-calculo-1',
        nome: 'Cálculo',
        codigoAcesso: 'CALC-2026-A',
        monitorIds: ['monitor-1'],
        modulos: [],
      },
      {
        id: 'curso-prog-1',
        nome: 'Programação 1',
        codigoAcesso: 'PROG-2026-A',
        monitorIds: ['monitor-2'],
        modulos: [],
      },
    ]);

    const user = userEvent.setup();
    renderPage(<CoursesPage />);

    expect(await screen.findByText('Cálculo')).toBeInTheDocument();
    expect(screen.getByText('Maria Souza')).toBeInTheDocument();
    expect(screen.getByText('Programação 1')).toBeInTheDocument();
    expect(screen.getByText('Sem monitor')).toBeInTheDocument();

    await user.click(screen.getByText('Programação 1'));
    expect(
      screen.queryByRole('heading', { name: 'Entrar na turma' })
    ).not.toBeInTheDocument();
  });
});
