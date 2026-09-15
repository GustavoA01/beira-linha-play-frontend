import type { ReactElement } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ModulePage } from '../index';
import { UserProvider } from '@/providers/UserProvider';
import { mockLoggedAluno } from '@/data/temporaryMocks/usuario';
import { mockLoggedMonitor } from '@/data/temporaryMocks/monitores';
import { getCourse } from '@/services/cursos';
import { getModule } from '@/services/modulos';
import { listMyAttempts } from '@/services/tentativas';
import type { ModuleResponseType } from '@/data/types/services';
import type { TentativaType } from '@/data/types/api';
import type { UsuarioType } from '@/data/types/api';

jest.mock('@/assets/logo-beira-linha.png', () => 'logo.png');

jest.mock('@/services/cursos', () => ({
  getCourse: jest.fn(),
  listCourses: jest.fn(),
}));

jest.mock('@/services/modulos', () => ({
  getModule: jest.fn(),
  createModule: jest.fn(),
  updateModule: jest.fn(),
  deleteModule: jest.fn(),
}));

jest.mock('@/services/tentativas', () => ({
  listMyAttempts: jest.fn(),
  submitAttempt: jest.fn(),
}));

jest.mock('@/services/atividades', () => ({
  getActivity: jest.fn(),
  updateActivity: jest.fn(),
  deleteActivity: jest.fn(),
}));

const mockedGetCourse = getCourse as jest.MockedFunction<typeof getCourse>;
const mockedGetModule = getModule as jest.MockedFunction<typeof getModule>;
const mockedListMyAttempts = listMyAttempts as jest.MockedFunction<
  typeof listMyAttempts
>;

const modulo: ModuleResponseType = {
  id: 'modulo-1',
  nome: 'Limites',
  cursoId: 'curso-1',
  atividades: [
    {
      id: 'atv-1',
      titulo: 'Noção de limite',
      quantQuestoes: 2,
      moduloId: 'modulo-1',
      questoes: [
        { id: 'q1', enunciado: 'a', valor: 2, alternativas: [] },
        { id: 'q2', enunciado: 'b', valor: 3, alternativas: [] },
      ],
    },
  ],
};

const attempt = (overrides: Partial<TentativaType> = {}): TentativaType => ({
  id: 'tent-1',
  alunoId: mockLoggedAluno.id,
  atividadeId: 'atv-1',
  pontuacaoObtida: 3,
  dataEnvio: '2026-09-14T12:00:00.000Z',
  respostas: [],
  ...overrides,
});

const renderPage = (user: UsuarioType) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const ui: ReactElement = <ModulePage />;

  return render(
    <QueryClientProvider client={client}>
      <UserProvider initialUser={user}>
        <MemoryRouter initialEntries={['/cursos/curso-1/modulos/modulo-1']}>
          <Routes>
            <Route path="/cursos/:cursoId/modulos/:moduloId" element={ui} />
          </Routes>
        </MemoryRouter>
      </UserProvider>
    </QueryClientProvider>
  );
};

describe('ModulePage', () => {
  beforeEach(() => {
    mockedGetCourse.mockReset();
    mockedGetModule.mockReset();
    mockedListMyAttempts.mockReset();
    mockedGetCourse.mockResolvedValue({
      id: 'curso-1',
      nome: 'Cálculo 1',
      codigoAcesso: 'ABC123',
      monitorIds: ['monitor-1'],
      modulos: [],
    });
    mockedGetModule.mockResolvedValue(modulo);
    mockedListMyAttempts.mockResolvedValue([]);
  });

  it('shows the student attempt count from the API', async () => {
    mockedListMyAttempts.mockResolvedValue([attempt()]);

    renderPage(mockLoggedAluno);

    expect(await screen.findByText('Noção de limite')).toBeInTheDocument();
    expect(screen.getByText('1/2 tentativas')).toBeInTheDocument();
    expect(screen.getByText('+ 5 pts')).toBeInTheDocument();
    expect(mockedListMyAttempts).toHaveBeenCalledWith();
    expect(mockedGetCourse).not.toHaveBeenCalled();
  });

  it('does not fetch attempts for the monitor', async () => {
    renderPage(mockLoggedMonitor);

    expect(await screen.findByText('Noção de limite')).toBeInTheDocument();
    expect(screen.getByText('0/2 tentativas')).toBeInTheDocument();
    expect(screen.getByText('+ 5 pts')).toBeInTheDocument();
    expect(screen.getByText('1 atividade')).toBeInTheDocument();
    expect(screen.getByText('5 XP')).toBeInTheDocument();
    expect(mockedListMyAttempts).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(mockedGetCourse).toHaveBeenCalledWith('curso-1');
    });
  });

  it('shows an empty state when there are no activities', async () => {
    mockedGetModule.mockResolvedValue({ ...modulo, atividades: [] });

    renderPage(mockLoggedMonitor);

    expect(
      await screen.findByText('Nenhuma atividade cadastrada.')
    ).toBeInTheDocument();
    expect(screen.queryByText('Noção de limite')).not.toBeInTheDocument();
  });
});
