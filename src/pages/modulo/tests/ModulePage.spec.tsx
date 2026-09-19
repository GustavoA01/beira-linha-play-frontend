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
import { getActivity } from '@/services/atividades';
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
const mockedGetActivity = getActivity as jest.MockedFunction<
  typeof getActivity
>;
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
    mockedGetActivity.mockReset();
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
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(mockedListMyAttempts).toHaveBeenCalledWith();
    expect(mockedGetCourse).not.toHaveBeenCalled();
  });

  it('keeps the activity pending after one incomplete attempt', async () => {
    mockedListMyAttempts.mockResolvedValue([
      attempt({
        pontuacaoObtida: 5,
        respostas: [
          { id: 'r1', questaoId: 'q1', alternativaId: 'a1', correta: false },
          { id: 'r2', questaoId: 'q2', alternativaId: 'a2', correta: false },
        ],
      }),
    ]);

    renderPage(mockLoggedAluno);

    expect(await screen.findByText('1/2 tentativas')).toBeInTheDocument();
    expect(document.querySelector('.lucide-check')).not.toBeInTheDocument();
    expect(document.querySelector('.lucide-circle-dashed')).toBeInTheDocument();
  });

  it('does not fetch attempts for the monitor', async () => {
    renderPage({ ...mockLoggedMonitor, cursoIds: ['curso-1'] });

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

  it('shows activity points from the detail when the module omits questions', async () => {
    mockedGetModule.mockResolvedValue({
      ...modulo,
      atividades: [
        {
          id: 'atv-1',
          titulo: 'Cálculo de limites simples',
          quantQuestoes: 1,
          moduloId: 'modulo-1',
        },
      ],
    });
    mockedGetActivity.mockResolvedValue({
      id: 'atv-1',
      titulo: 'Cálculo de limites simples',
      quantQuestoes: 1,
      moduloId: 'modulo-1',
      questoes: [
        { id: 'q1', enunciado: 'Quanto vale?', valor: 3, alternativas: [] },
      ],
    });

    renderPage({ ...mockLoggedMonitor, cursoIds: ['curso-1'] });

    expect(await screen.findByText('+ 3 pts')).toBeInTheDocument();
    expect(screen.getByText('3 XP')).toBeInTheDocument();
    expect(mockedGetActivity).toHaveBeenCalledWith('atv-1');
  });

  it('shows an empty state when there are no activities', async () => {
    mockedGetModule.mockResolvedValue({ ...modulo, atividades: [] });

    renderPage({ ...mockLoggedMonitor, cursoIds: ['curso-1'] });

    expect(
      await screen.findByText('Nenhuma atividade cadastrada.')
    ).toBeInTheDocument();
    expect(screen.queryByText('Noção de limite')).not.toBeInTheDocument();
  });

  it('shows module progress from concluded activities', async () => {
    mockedGetModule.mockResolvedValue({
      ...modulo,
      atividades: [
        modulo.atividades[0],
        {
          id: 'atv-2',
          titulo: 'Continuidade',
          quantQuestoes: 1,
          moduloId: 'modulo-1',
          xpTotal: 2,
        },
      ],
    });
    mockedListMyAttempts.mockResolvedValue([
      attempt({ id: 't1', pontuacaoObtida: 5 }),
      attempt({
        id: 't2',
        pontuacaoObtida: 0,
        dataEnvio: '2026-09-15T12:00:00.000Z',
      }),
    ]);

    renderPage(mockLoggedAluno);

    expect(await screen.findByText('Noção de limite')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.queryByText('40%')).not.toBeInTheDocument();
  });
});
