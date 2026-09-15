import type { ReactElement } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ActivityPage } from '../index';
import { UserProvider } from '@/providers/UserProvider';
import { mockLoggedAluno } from '@/data/temporaryMocks/usuario';
import { getActivity } from '@/services/atividades';
import { listMyAttempts, submitAttempt } from '@/services/tentativas';
import type { ActivityResponseType } from '@/data/types/services';
import type { TentativaType } from '@/data/types/api';

jest.mock('@/components/ui/toast', () => ({
  toast: { add: jest.fn() },
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

const mockedGetActivity = getActivity as jest.MockedFunction<
  typeof getActivity
>;
const mockedListMyAttempts = listMyAttempts as jest.MockedFunction<
  typeof listMyAttempts
>;
const mockedSubmitAttempt = submitAttempt as jest.MockedFunction<
  typeof submitAttempt
>;

const activity: ActivityResponseType = {
  id: 'atividade-1',
  titulo: 'Limites',
  quantQuestoes: 1,
  moduloId: 'modulo-1',
  questoes: [
    {
      id: 'q1',
      enunciado: 'Quanto vale o limite?',
      valor: 10,
      alternativas: [
        { id: 'a1', descricao: '0', correta: false },
        { id: 'a2', descricao: '1', correta: true },
      ],
    },
  ],
};

const attempt = (overrides: Partial<TentativaType> = {}): TentativaType => ({
  id: 'tent-1',
  alunoId: mockLoggedAluno.id,
  atividadeId: 'atividade-1',
  pontuacaoObtida: 10,
  dataEnvio: '2026-09-14T12:00:00.000Z',
  respostas: [
    {
      id: 'r1',
      questaoId: 'q1',
      alternativaId: 'a2',
      correta: true,
    },
  ],
  ...overrides,
});

const renderPage = () => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const ui: ReactElement = <ActivityPage />;

  return render(
    <QueryClientProvider client={client}>
      <UserProvider initialUser={mockLoggedAluno}>
        <MemoryRouter
          initialEntries={[
            '/cursos/curso-1/modulos/modulo-1/atividades/atividade-1',
          ]}
        >
          <Routes>
            <Route
              path="/cursos/:cursoId/modulos/:moduloId/atividades/:atividadeId"
              element={ui}
            />
            <Route
              path="/cursos/:cursoId/modulos/:moduloId"
              element={<p>Módulo</p>}
            />
          </Routes>
        </MemoryRouter>
      </UserProvider>
    </QueryClientProvider>
  );
};

describe('ActivityPage', () => {
  beforeEach(() => {
    mockedGetActivity.mockReset();
    mockedListMyAttempts.mockReset();
    mockedSubmitAttempt.mockReset();
    mockedGetActivity.mockResolvedValue(activity);
    mockedListMyAttempts.mockResolvedValue([]);
  });

  it('shows the concluded screen when the student already finished', async () => {
    mockedListMyAttempts.mockResolvedValue([
      attempt({ id: 'tent-1', pontuacaoObtida: 4 }),
      attempt({ id: 'tent-2', pontuacaoObtida: 8 }),
    ]);

    renderPage();

    expect(
      await screen.findByRole('heading', { name: 'Atividade concluída' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Sua melhor pontuação: 8/10 pts')
    ).toBeInTheDocument();
    expect(mockedListMyAttempts).toHaveBeenCalledWith('atividade-1');
  });

  it('submits the attempt and shows the summary', async () => {
    const user = userEvent.setup();
    mockedListMyAttempts
      .mockResolvedValueOnce([])
      .mockResolvedValue([attempt()]);
    mockedSubmitAttempt.mockResolvedValue({
      tentativa: attempt(),
      tentativasUsadas: 1,
      melhorPontuacao: 10,
      pontosDelta: 10,
      pontosTotais: 50,
      concluida: true,
    });

    renderPage();

    expect(
      await screen.findByText('Quanto vale o limite?')
    ).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: /1/ }));
    await user.click(screen.getByRole('button', { name: 'Enviar resposta' }));
    await user.click(screen.getByRole('button', { name: 'Ver resultado' }));

    await waitFor(() => {
      expect(mockedSubmitAttempt).toHaveBeenCalledWith('atividade-1', {
        respostas: [{ questaoId: 'q1', alternativaId: 'a2' }],
      });
    });
    expect(
      await screen.findByRole('heading', { name: 'Gabaritou!' })
    ).toBeInTheDocument();
  });
});
