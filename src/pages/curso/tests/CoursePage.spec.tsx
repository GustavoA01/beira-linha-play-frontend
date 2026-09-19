import type { ReactElement } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CoursePage } from '../index';
import { UserProvider } from '@/providers/UserProvider';
import { mockLoggedMonitor } from '@/data/temporaryMocks/monitores';
import { mockLoggedAluno } from '@/data/temporaryMocks/usuario';
import { getCourse } from '@/services/cursos';
import { createModule, getModule } from '@/services/modulos';
import { getActivity } from '@/services/atividades';
import { listMyAttempts } from '@/services/tentativas';
import type { CourseResponseType } from '@/data/types/services';
import type { UsuarioType } from '@/data/types/api';

jest.mock('@/assets/logo-beira-linha.png', () => 'logo.png');

jest.mock('@/components/ui/toast', () => ({
  toast: { add: jest.fn() },
}));

jest.mock('@/services/cursos', () => ({
  getCourse: jest.fn(),
  listCourses: jest.fn(),
  createCourse: jest.fn(),
  updateCourse: jest.fn(),
  deleteCourse: jest.fn(),
}));

jest.mock('@/services/modulos', () => ({
  getModule: jest.fn(),
  createModule: jest.fn(),
  updateModule: jest.fn(),
  deleteModule: jest.fn(),
}));

jest.mock('@/services/atividades', () => ({
  getActivity: jest.fn(),
  getActivityMonitoring: jest.fn(),
  updateActivity: jest.fn(),
  deleteActivity: jest.fn(),
}));

jest.mock('@/services/tentativas', () => ({
  listMyAttempts: jest.fn(),
  submitAttempt: jest.fn(),
}));

const mockedGetCourse = getCourse as jest.MockedFunction<typeof getCourse>;
const mockedCreateModule = createModule as jest.MockedFunction<
  typeof createModule
>;
const mockedGetModule = getModule as jest.MockedFunction<typeof getModule>;
const mockedGetActivity = getActivity as jest.MockedFunction<
  typeof getActivity
>;
const mockedListMyAttempts = listMyAttempts as jest.MockedFunction<
  typeof listMyAttempts
>;

beforeAll(() => {
  class IntersectionObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserverMock,
  });
});

const course: CourseResponseType = {
  id: 'curso-1',
  nome: 'Cálculo 1',
  codigoAcesso: 'ABC123',
  monitorIds: ['monitor-1'],
  modulos: [],
};

const renderPage = (
  ui: ReactElement,
  user: UsuarioType = { ...mockLoggedMonitor, cursoIds: ['curso-1'] }
) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={client}>
      <UserProvider initialUser={user}>
        <MemoryRouter initialEntries={['/cursos/curso-1']}>
          <Routes>
            <Route path="/cursos/:cursoId" element={ui} />
          </Routes>
        </MemoryRouter>
      </UserProvider>
    </QueryClientProvider>
  );
};

describe('CoursePage', () => {
  beforeEach(() => {
    mockedGetCourse.mockReset();
    mockedCreateModule.mockReset();
    mockedGetModule.mockReset();
    mockedGetActivity.mockReset();
    mockedListMyAttempts.mockReset();
    mockedListMyAttempts.mockResolvedValue([]);
    mockedGetCourse.mockResolvedValue(course);
    mockedGetModule.mockResolvedValue({
      id: 'modulo-novo',
      nome: 'Integrais',
      cursoId: 'curso-1',
      atividades: [],
    });
  });

  it('shows the created module from the updated course cache', async () => {
    const user = userEvent.setup();
    mockedCreateModule.mockResolvedValue({
      id: 'modulo-novo',
      nome: 'Integrais',
      cursoId: 'curso-1',
      atividades: [],
    });

    renderPage(<CoursePage />);

    expect(
      await screen.findByText('Nenhum módulo cadastrado.')
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /novo módulo/i }));
    await user.type(screen.getByLabelText('Nome'), 'Integrais');
    await user.click(screen.getByRole('button', { name: 'Adicionar' }));

    await waitFor(() => {
      expect(mockedCreateModule).toHaveBeenCalledWith('curso-1', {
        nome: 'Integrais',
      });
    });
    expect(await screen.findByText('Integrais')).toBeInTheDocument();
    expect(
      screen.queryByText('Nenhum módulo cadastrado.')
    ).not.toBeInTheDocument();
  });

  it('shows the activity count and xp from the course payload', async () => {
    mockedGetCourse.mockResolvedValue({
      ...course,
      modulos: [
        {
          id: 'modulo-1',
          nome: 'Limites 45',
          cursoId: 'curso-1',
          atividades: [
            {
              id: 'atv-1',
              titulo: 'Noção de limite',
              quantQuestoes: 1,
              moduloId: 'modulo-1',
              xpTotal: 4,
            },
            {
              id: 'atv-2',
              titulo: 'Continuidade',
              quantQuestoes: 1,
              moduloId: 'modulo-1',
              questoes: [
                { id: 'q1', enunciado: 'a', valor: 2, alternativas: [] },
              ],
            },
          ],
        },
      ],
    });

    renderPage(<CoursePage />);

    expect(await screen.findByText('2 atividades')).toBeInTheDocument();
    expect(screen.getByText('6 XP')).toBeInTheDocument();
    expect(mockedGetModule).not.toHaveBeenCalled();
  });

  it('shows course progress from concluded activities', async () => {
    mockedGetCourse.mockResolvedValue({
      ...course,
      modulos: [
        {
          id: 'modulo-1',
          nome: 'Limites',
          cursoId: 'curso-1',
          atividades: [
            {
              id: 'atv-1',
              titulo: 'Noção de limite',
              quantQuestoes: 1,
              moduloId: 'modulo-1',
              xpTotal: 2,
            },
            {
              id: 'atv-2',
              titulo: 'Continuidade',
              quantQuestoes: 1,
              moduloId: 'modulo-1',
              xpTotal: 2,
            },
            {
              id: 'atv-3',
              titulo: 'Derivadas',
              quantQuestoes: 1,
              moduloId: 'modulo-1',
              xpTotal: 2,
            },
            {
              id: 'atv-4',
              titulo: 'Integrais',
              quantQuestoes: 1,
              moduloId: 'modulo-1',
              xpTotal: 2,
            },
          ],
        },
      ],
    });
    mockedListMyAttempts.mockResolvedValue([
      {
        id: 't1',
        alunoId: mockLoggedAluno.id,
        atividadeId: 'atv-1',
        pontuacaoObtida: 2,
        dataEnvio: '2026-09-14T12:00:00.000Z',
        respostas: [],
      },
      {
        id: 't2',
        alunoId: mockLoggedAluno.id,
        atividadeId: 'atv-1',
        pontuacaoObtida: 0,
        dataEnvio: '2026-09-15T12:00:00.000Z',
        respostas: [],
      },
    ]);

    renderPage(<CoursePage />, { ...mockLoggedAluno, cursoIds: ['curso-1'] });

    expect(await screen.findByText('Progresso do Curso')).toBeInTheDocument();
    expect(screen.getByText('25%')).toBeInTheDocument();
    expect(screen.queryByText('50%')).not.toBeInTheDocument();
  });
});
