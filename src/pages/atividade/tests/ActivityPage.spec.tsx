import type { ReactElement } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ActivityPage } from '../index';
import { UserProvider } from '@/providers/UserProvider';
import { mockLoggedAluno } from '@/data/mocks/usuario';
import { getActivity } from '@/services/atividades';
import { listMyAttempts, submitAttempt } from '@/services/tentativas';
import { toast } from '@/components/ui/toast';
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
const mockedToastAdd = toast.add as jest.MockedFunction<typeof toast.add>;

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

const activityWithoutGabarito: ActivityResponseType = {
  ...activity,
  questoes: [
    {
      ...activity.questoes[0],
      alternativas: activity.questoes[0].alternativas.map((alternativa) => ({
        ...alternativa,
        correta: null,
      })),
    },
  ],
};

describe('ActivityPage', () => {
  beforeEach(() => {
    mockedGetActivity.mockReset();
    mockedListMyAttempts.mockReset();
    mockedSubmitAttempt.mockReset();
    mockedToastAdd.mockReset();
    mockedGetActivity.mockResolvedValue(activityWithoutGabarito);
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

  it('submits the attempt and goes to the result without per-question feedback', async () => {
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

    expect(screen.queryByText('Acertou!')).not.toBeInTheDocument();
    expect(screen.queryByText('Errou')).not.toBeInTheDocument();
    await waitFor(() => {
      expect(mockedSubmitAttempt).toHaveBeenCalledWith('atividade-1', {
        respostas: [{ questaoId: 'q1', alternativaId: 'a2' }],
      });
    });
    expect(mockedToastAdd).toHaveBeenCalledWith({
      type: 'success',
      title: 'Você fez 10 pts',
    });
    expect(
      await screen.findByRole('heading', { name: 'Gabaritou!' })
    ).toBeInTheDocument();
  });

  it('grades the last question from the API even without gabarito', async () => {
    const user = userEvent.setup();
    mockedGetActivity.mockResolvedValue({
      ...activityWithoutGabarito,
      quantQuestoes: 2,
      questoes: [
        {
          id: 'q1',
          enunciado: 'Primeira?',
          valor: 5,
          alternativas: [
            { id: 'a1', descricao: 'A', correta: null },
            { id: 'a2', descricao: 'B', correta: null },
          ],
        },
        {
          id: 'q2',
          enunciado: 'Última?',
          valor: 5,
          alternativas: [
            { id: 'b1', descricao: 'C', correta: null },
            { id: 'b2', descricao: 'D', correta: null },
          ],
        },
      ],
    });
    mockedSubmitAttempt.mockResolvedValue({
      tentativa: attempt({
        pontuacaoObtida: 10,
        respostas: [
          {
            id: 'r1',
            questaoId: 'q1',
            alternativaId: 'a2',
            correta: true,
          },
          {
            id: 'r2',
            questaoId: 'q2',
            alternativaId: 'b2',
            correta: true,
          },
        ],
      }),
      tentativasUsadas: 1,
      melhorPontuacao: 10,
      pontosDelta: 10,
      pontosTotais: 50,
      concluida: true,
    });

    renderPage();

    expect(await screen.findByText('Primeira?')).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: /B/ }));
    await user.click(screen.getByRole('button', { name: 'Enviar resposta' }));
    expect(await screen.findByText('Resposta registrada')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Avançar' }));
    expect(await screen.findByText('Última?')).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: /D/ }));
    await user.click(screen.getByRole('button', { name: 'Enviar resposta' }));

    expect(
      await screen.findByRole('heading', { name: 'Gabaritou!' })
    ).toBeInTheDocument();
    expect(screen.queryByText('Acertou!')).not.toBeInTheDocument();
    expect(screen.queryByText('Errou')).not.toBeInTheDocument();
    expect(mockedToastAdd).toHaveBeenCalledWith({
      type: 'success',
      title: 'Você fez 10 pts',
    });
  });
});
