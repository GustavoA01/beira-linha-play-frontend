import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfiguracoesPage } from '../index';
import { UserProvider } from '@/providers/UserProvider';
import { mockLoggedAdmin } from '@/data/mocks/admins';
import { mockLoggedMonitor } from '@/data/mocks/monitores';
import { getConfiguracao, updateConfiguracao } from '@/services/configuracao';
import type { UsuarioType } from '@/data/types/api';

jest.mock('@/components/ui/toast', () => ({
  toast: { add: jest.fn() },
}));

jest.mock('@/services/configuracao', () => ({
  getConfiguracao: jest.fn(),
  updateConfiguracao: jest.fn(),
}));

const mockedGetConfiguracao = getConfiguracao as jest.MockedFunction<
  typeof getConfiguracao
>;
const mockedUpdateConfiguracao = updateConfiguracao as jest.MockedFunction<
  typeof updateConfiguracao
>;

const renderPage = (user: UsuarioType) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const ui: ReactElement = <ConfiguracoesPage />;

  return render(
    <QueryClientProvider client={client}>
      <UserProvider initialUser={user}>
        <MemoryRouter initialEntries={['/configuracoes']}>
          <Routes>
            <Route path="/configuracoes" element={ui} />
            <Route path="/cursos" element={<p>Lista de cursos</p>} />
          </Routes>
        </MemoryRouter>
      </UserProvider>
    </QueryClientProvider>
  );
};

describe('ConfiguracoesPage', () => {
  beforeEach(() => {
    mockedGetConfiguracao.mockReset();
    mockedUpdateConfiguracao.mockReset();
    mockedGetConfiguracao.mockResolvedValue({
      quantidadeQuestoesPadrao: 4,
      quantidadeQuestoesTravada: true,
      pontosQuestaoPadrao: 2,
      pontosQuestaoTravados: false,
      desafioAtivo: false,
    });
  });

  it('sends anyone who is not admin back to the courses', async () => {
    renderPage(mockLoggedMonitor);

    expect(await screen.findByText('Lista de cursos')).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Configurações' })
    ).not.toBeInTheDocument();
  });

  it('shows the saved defaults to the admin', async () => {
    const user = userEvent.setup();
    mockedUpdateConfiguracao.mockImplementation(async (payload) => payload);

    renderPage(mockLoggedAdmin);

    expect(
      await screen.findByRole('heading', { name: 'Configurações' })
    ).toBeInTheDocument();
    expect(await screen.findByLabelText('Quantidade de questões')).toHaveValue(
      4
    );
    expect(screen.getByLabelText('Pontos por questão')).toHaveValue(2);
    expect(
      screen.getByRole('switch', { name: 'Travar Quantidade de questões' })
    ).toBeChecked();

    await user.clear(screen.getByLabelText('Pontos por questão'));
    await user.type(screen.getByLabelText('Pontos por questão'), '3');
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(mockedUpdateConfiguracao.mock.calls[0][0]).toEqual({
      quantidadeQuestoesPadrao: 4,
      quantidadeQuestoesTravada: true,
      pontosQuestaoPadrao: 3,
      pontosQuestaoTravados: false,
      desafioAtivo: false,
    });
  });
});
