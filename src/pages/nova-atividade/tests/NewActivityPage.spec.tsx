import type { ReactElement } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { NewActivityPage } from '../index';
import { UserProvider } from '@/providers/UserProvider';
import { mockLoggedMonitor } from '@/data/mocks/monitores';
import {
  createActivity,
  getActivity,
  updateActivity,
} from '@/services/atividades';
import { toast } from '@/components/ui/toast';
import {
  NEW_ACTIVITY_STORAGE_KEY,
  setNewActivityStorage,
} from '@/data/newActivityStorage';

jest.mock('@/components/ui/toast', () => ({
  toast: { add: jest.fn() },
}));

jest.mock('../features/Chat/container/ChatDrawer', () => ({
  ChatDrawer: () => null,
}));

jest.mock('@/services/atividades', () => ({
  createActivity: jest.fn(),
  getActivity: jest.fn(),
  updateActivity: jest.fn(),
  deleteActivity: jest.fn(),
}));

const mockedCreateActivity = createActivity as jest.MockedFunction<
  typeof createActivity
>;
const mockedGetActivity = getActivity as jest.MockedFunction<
  typeof getActivity
>;
const mockedUpdateActivity = updateActivity as jest.MockedFunction<
  typeof updateActivity
>;
const mockedToastAdd = toast.add as jest.MockedFunction<typeof toast.add>;

const renderPage = (
  ui: ReactElement,
  path = '/cursos/curso-calculo-1/modulos/modulo-1/nova-atividade'
) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={client}>
      <UserProvider initialUser={mockLoggedMonitor}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route
              path="/cursos/:cursoId/modulos/:moduloId/nova-atividade"
              element={ui}
            />
            <Route
              path="/cursos/:cursoId/modulos/:moduloId/nova-atividade/:atividadeId"
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

describe('NewActivityPage', () => {
  beforeEach(() => {
    localStorage.clear();
    mockedToastAdd.mockReset();
    mockedCreateActivity.mockReset();
    mockedGetActivity.mockReset();
    mockedUpdateActivity.mockReset();
  });

  it('shows a message when there is no draft in storage', () => {
    renderPage(<NewActivityPage />);

    expect(
      screen.getByRole('heading', { name: 'Atividade não encontrada' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Salvar' })
    ).not.toBeInTheDocument();
  });

  it('creates the activity and goes back to the module', async () => {
    const user = userEvent.setup();
    setNewActivityStorage({
      activityName: 'Limites',
      qtdQuestions: 1,
      messages: [],
    });
    mockedCreateActivity.mockResolvedValue({
      id: 'atividade-nova',
      titulo: 'Limites',
      quantQuestoes: 1,
      moduloId: 'modulo-1',
      questoes: [],
    });

    renderPage(<NewActivityPage />);

    expect(
      screen.getByRole('heading', { name: 'Limites' })
    ).toBeInTheDocument();

    const fill = (placeholder: string, value: string) => {
      fireEvent.change(screen.getByPlaceholderText(placeholder), {
        target: { value },
      });
    };

    fill('Escreva a pergunta...', 'O que é um limite?');
    fill('Alternativa 1', 'Uma tendência');
    fill('Alternativa 2', 'Um número');
    fill('Alternativa 3', 'Uma função');
    fill('Alternativa 4', 'Um gráfico');
    await user.click(screen.getAllByRole('radio')[0]);
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() => {
      expect(mockedCreateActivity).toHaveBeenCalledWith('modulo-1', {
        titulo: 'Limites',
        questoes: [
          {
            enunciado: 'O que é um limite?',
            valor: 1,
            alternativas: [
              { descricao: 'Uma tendência', correta: true },
              { descricao: 'Um número', correta: false },
              { descricao: 'Uma função', correta: false },
              { descricao: 'Um gráfico', correta: false },
            ],
          },
        ],
      });
    });
    expect(mockedToastAdd).toHaveBeenCalledWith({
      type: 'success',
      title: 'Atividade criada',
    });
    expect(localStorage.getItem(NEW_ACTIVITY_STORAGE_KEY)).toBeNull();
    expect(await screen.findByText('Módulo')).toBeInTheDocument();
  });

  it('resets the form with the existing activity when an id is in the params', async () => {
    const user = userEvent.setup();
    setNewActivityStorage({
      activityName: 'Limites 2',
      qtdQuestions: 1,
      messages: [],
    });
    mockedGetActivity.mockResolvedValue({
      id: 'atividade-1',
      titulo: 'Limites',
      quantQuestoes: 1,
      moduloId: 'modulo-1',
      questoes: [
        {
          id: 'q1',
          enunciado: 'Quanto vale o limite?',
          valor: 2,
          alternativas: [
            { id: 'a1', descricao: '0', correta: false },
            { id: 'a2', descricao: '1', correta: true },
          ],
        },
      ],
    });
    mockedUpdateActivity.mockResolvedValue({
      id: 'atividade-1',
      titulo: 'Limites 2',
      quantQuestoes: 1,
      moduloId: 'modulo-1',
      questoes: [],
    });

    renderPage(
      <NewActivityPage />,
      '/cursos/curso-calculo-1/modulos/modulo-1/nova-atividade/atividade-1'
    );

    expect(
      await screen.findByDisplayValue('Quanto vale o limite?')
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue('0')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() => {
      expect(mockedUpdateActivity).toHaveBeenCalledWith('atividade-1', {
        titulo: 'Limites 2',
        questoes: [
          {
            enunciado: 'Quanto vale o limite?',
            valor: 2,
            alternativas: [
              { descricao: '0', correta: false },
              { descricao: '1', correta: true },
            ],
          },
        ],
      });
    });
    expect(mockedCreateActivity).not.toHaveBeenCalled();
    expect(mockedToastAdd).toHaveBeenCalledWith({
      type: 'success',
      title: 'Atividade atualizada',
    });
    expect(await screen.findByText('Módulo')).toBeInTheDocument();
  });
});
