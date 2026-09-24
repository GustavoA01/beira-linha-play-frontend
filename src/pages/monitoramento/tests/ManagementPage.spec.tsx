import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ManagementPage } from '../index';
import { UserProvider } from '@/providers/UserProvider';
import { mockLoggedMonitor } from '@/data/mocks/monitores';
import { getActivity, getActivityMonitoring } from '@/services/atividades';
import { ApiError } from '@/services/api';
import type { ActivityResponseType } from '@/data/types/services';
import type { MonitoringResponseType } from '@/data/types/services';

jest.mock('@/services/atividades', () => ({
  getActivity: jest.fn(),
  getActivityMonitoring: jest.fn(),
}));

const mockedGetActivity = getActivity as jest.MockedFunction<
  typeof getActivity
>;
const mockedGetActivityMonitoring =
  getActivityMonitoring as jest.MockedFunction<typeof getActivityMonitoring>;

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

const monitoring: MonitoringResponseType = {
  tamanhoTurma: 8,
  envios: 2,
  xpTotal: 10,
  mediaPontuacao: 8,
  mediaAcertoPercentual: 50,
  questoes: [
    {
      questaoId: 'q1',
      enunciado: 'Quanto vale o limite?',
      numero: 1,
      acertoPercentual: 50,
      alternativas: [
        {
          alternativaId: 'a1',
          descricao: '0',
          correta: false,
          letra: 'A',
          votos: 1,
          percentual: 50,
          distrator: true,
        },
        {
          alternativaId: 'a2',
          descricao: '1',
          correta: true,
          letra: 'B',
          votos: 1,
          percentual: 50,
          distrator: false,
        },
      ],
    },
  ],
  alunos: [
    {
      alunoId: 'aluno-1',
      nome: 'Gustavo Aguiar',
      apelido: 'Gu',
      pontos: 100,
      imagemPerfil: '',
      tentativa: {
        id: 't1',
        dataEnvio: '2026-09-14T12:00:00.000Z',
        pontuacaoObtida: 10,
        alunoId: 'aluno-1',
        atividadeId: 'atividade-1',
        respostas: [],
      },
      respostasPorQuestao: ['B'],
    },
  ],
};

const renderPage = (ui: ReactElement) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={client}>
      <UserProvider
        initialUser={{ ...mockLoggedMonitor, cursoIds: ['curso-1'] }}
      >
        <MemoryRouter
          initialEntries={[
            '/cursos/curso-1/modulos/modulo-1/monitoramento/atividade-1',
          ]}
        >
          <Routes>
            <Route
              path="/cursos/:cursoId/modulos/:moduloId/monitoramento/:atividadeId"
              element={ui}
            />
          </Routes>
        </MemoryRouter>
      </UserProvider>
    </QueryClientProvider>
  );
};

describe('ManagementPage', () => {
  beforeEach(() => {
    mockedGetActivity.mockReset();
    mockedGetActivityMonitoring.mockReset();
    mockedGetActivity.mockResolvedValue(activity);
    mockedGetActivityMonitoring.mockResolvedValue(monitoring);
  });

  it('shows monitoring stats from the API', async () => {
    renderPage(<ManagementPage />);

    expect(await screen.findByText('Limites')).toBeInTheDocument();
    expect(screen.getByText('2 de 8')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('8 pts')).toBeInTheDocument();
    expect(screen.getByText('Gustavo Aguiar')).toBeInTheDocument();
    expect(screen.getByText('Gu')).toBeInTheDocument();
  });

  it('shows a generic error when monitoring fails', async () => {
    mockedGetActivityMonitoring.mockRejectedValue(
      new ApiError('Não foi possível completar a operação', 403)
    );

    renderPage(<ManagementPage />);

    expect(
      await screen.findByText('Não foi possível carregar o monitoramento')
    ).toBeInTheDocument();
  });
});
