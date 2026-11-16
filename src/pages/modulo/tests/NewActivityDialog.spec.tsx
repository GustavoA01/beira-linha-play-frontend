import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { NewActivityDialog } from '../features/NewActivityDialog/container/NewActivityDialog';
import { NEW_ACTIVITY_STORAGE_KEY } from '@/data/newActivityStorage';
import type { AtividadeType } from '@/data/types/api';
import { getConfiguracao } from '@/services/configuracao';

jest.mock('@/services/configuracao', () => ({
  getConfiguracao: jest.fn(),
  updateConfiguracao: jest.fn(),
}));

const mockedGetConfiguracao = getConfiguracao as jest.MockedFunction<
  typeof getConfiguracao
>;

const configSolta = {
  quantidadeQuestoesPadrao: 1,
  quantidadeQuestoesTravada: false,
  pontosQuestaoPadrao: 1,
  pontosQuestaoTravados: false,
};

const atividade: AtividadeType = {
  id: 'atividade-1',
  titulo: 'Limites',
  quantQuestoes: 2,
  moduloId: 'modulo-1',
  questoes: [],
};

const renderDialog = (ui: ReactElement) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={['/cursos/curso-1/modulos/modulo-1']}>
        <Routes>
          <Route path="/cursos/:cursoId/modulos/:moduloId" element={ui} />
          <Route
            path="/cursos/:cursoId/modulos/:moduloId/nova-atividade"
            element={<p>Formulário de criação</p>}
          />
          <Route
            path="/cursos/:cursoId/modulos/:moduloId/nova-atividade/:atividadeId"
            element={<p>Formulário de edição</p>}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('NewActivityDialog', () => {
  beforeEach(() => {
    localStorage.clear();
    mockedGetConfiguracao.mockReset();
    mockedGetConfiguracao.mockResolvedValue(configSolta);
  });

  it('creates a draft and goes to the question form', async () => {
    const user = userEvent.setup();

    renderDialog(
      <NewActivityDialog openActivityDialog setOpenActivityDialog={jest.fn()} />
    );

    expect(
      screen.getByRole('heading', { name: 'Nova Atividade' })
    ).toBeInTheDocument();
    expect(await screen.findByPlaceholderText('Max: 10')).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Permitir mais de uma tentativa' })
    ).toBeChecked();

    await user.type(screen.getByPlaceholderText('Nome da atividade'), 'Quiz');
    await user.clear(screen.getByPlaceholderText('Max: 10'));
    await user.type(screen.getByPlaceholderText('Max: 10'), '2');
    await user.click(screen.getByRole('button', { name: 'Continuar' }));

    expect(
      await screen.findByText('Formulário de criação')
    ).toBeInTheDocument();
    expect(localStorage.getItem(NEW_ACTIVITY_STORAGE_KEY)).toContain('Quiz');
    expect(localStorage.getItem(NEW_ACTIVITY_STORAGE_KEY)).toContain(
      '"permiteMaisTentativas":true'
    );
  });

  it('keeps the question count fixed when the admin locked it', async () => {
    mockedGetConfiguracao.mockResolvedValue({
      ...configSolta,
      quantidadeQuestoesPadrao: 4,
      quantidadeQuestoesTravada: true,
    });

    renderDialog(
      <NewActivityDialog openActivityDialog setOpenActivityDialog={jest.fn()} />
    );

    const count = await screen.findByPlaceholderText('Max: 10');
    expect(count).toBeDisabled();
    expect(count).toHaveValue(4);
    expect(screen.getByText('Definido pelo administrador')).toBeInTheDocument();
  });

  it('hides the question count and continues to edit the existing activity', async () => {
    const user = userEvent.setup();

    renderDialog(
      <NewActivityDialog
        openActivityDialog
        setOpenActivityDialog={jest.fn()}
        atividade={atividade}
      />
    );

    expect(
      screen.getByRole('heading', { name: 'Editar atividade' })
    ).toBeInTheDocument();
    expect(await screen.findByPlaceholderText('Nome da atividade')).toHaveValue(
      'Limites'
    );
    expect(screen.queryByPlaceholderText('Max: 10')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Continuar' }));

    expect(await screen.findByText('Formulário de edição')).toBeInTheDocument();
  });
});
