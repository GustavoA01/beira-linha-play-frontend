import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ImportacaoPage } from '../index';
import { UserProvider } from '@/providers/UserProvider';
import { mockLoggedAdmin } from '@/data/mocks/admins';
import { mockLoggedAluno } from '@/data/mocks/usuario';
import {
  importarInscritos,
  listarAlunosDoLog,
  listarEventos,
  listarLogs,
} from '@/services/importacao';
import { toast } from '@/components/ui/toast';
import type { UsuarioType } from '@/data/types/api';

jest.mock('@/components/ui/toast', () => ({
  toast: { add: jest.fn() },
}));

jest.mock('@/services/importacao', () => ({
  importarInscritos: jest.fn(),
  listarEventos: jest.fn(),
  listarLogs: jest.fn(),
  listarAlunosDoLog: jest.fn(),
}));

const mockedImportar = importarInscritos as jest.MockedFunction<
  typeof importarInscritos
>;
const mockedEventos = listarEventos as jest.MockedFunction<
  typeof listarEventos
>;
const mockedLogs = listarLogs as jest.MockedFunction<typeof listarLogs>;
const mockedAlunos = listarAlunosDoLog as jest.MockedFunction<
  typeof listarAlunosDoLog
>;

const renderPage = (user: UsuarioType) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const ui: ReactElement = <ImportacaoPage />;

  return render(
    <QueryClientProvider client={client}>
      <UserProvider initialUser={user}>
        <MemoryRouter initialEntries={['/importacao']}>
          <Routes>
            <Route path="/importacao" element={ui} />
            <Route path="/cursos" element={<p>Lista de cursos</p>} />
          </Routes>
        </MemoryRouter>
      </UserProvider>
    </QueryClientProvider>
  );
};

describe('ImportacaoPage', () => {
  beforeEach(() => {
    mockedImportar.mockReset();
    mockedEventos.mockReset();
    mockedLogs.mockReset();
    mockedAlunos.mockReset();
    mockedLogs.mockResolvedValue([
      {
        id: 'log-1',
        nomeEvento: 'Beira Linha 2026',
        urlEvento: 'https://sympla.com.br/beira',
        quantidadeAlunos: 1,
        quantidadeCursos: 1,
        dataImportacao: '2026-09-27T15:00:00Z',
        adminNome: 'Administrador',
      },
    ]);
    mockedAlunos.mockResolvedValue([
      {
        nome: 'Maria Silva',
        email: 'maria@email.com',
        apelido: 'maria',
      },
    ]);
    mockedEventos.mockResolvedValue([
      {
        referencia: 'referencia-opaca',
        nome: 'Beira Linha 2026',
        inicio: '01/03/2026',
        fim: '01/06/2026',
      },
    ]);
  });

  it('sends the student back to courses', async () => {
    renderPage(mockLoggedAluno);

    expect(await screen.findByText('Lista de cursos')).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Importar participantes' })
    ).not.toBeInTheDocument();
  });

  it('lists import logs and opens the students without a password column', async () => {
    const user = userEvent.setup();
    const ano = new Date().getFullYear();
    mockedImportar.mockResolvedValue({
      id: 'log-1',
      nomeEvento: 'Beira Linha 2026',
      urlEvento: 'https://sympla.com.br/beira',
      quantidadeAlunos: 1,
      quantidadeCursos: 1,
      dataImportacao: '2026-09-27T15:00:00Z',
      adminNome: 'Administrador',
    });

    renderPage(mockLoggedAdmin);

    expect(
      await screen.findByText(
        `A senha padrão dos alunos importados é o primeiro nome, em minúsculas, seguido do ano atual. Exemplo: maria${ano}.`
      )
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('option', {
        name: 'Beira Linha 2026 (01/03/2026 - 01/06/2026)',
      })
    ).toBeInTheDocument();
    expect(screen.getByText('Administrador')).toBeInTheDocument();
    expect(
      screen.queryByRole('columnheader', { name: 'Senha' })
    ).not.toBeInTheDocument();

    await user.selectOptions(
      screen.getByLabelText('Evento'),
      'referencia-opaca'
    );
    await user.click(screen.getByRole('button', { name: 'Importar' }));
    await user.click(await screen.findByRole('button', { name: 'Ver alunos' }));

    expect(await screen.findByText('Maria Silva')).toBeInTheDocument();
    expect(screen.getByText('maria@email.com')).toBeInTheDocument();
    expect(
      screen.queryByRole('columnheader', { name: 'Senha' })
    ).not.toBeInTheDocument();
    expect(mockedImportar.mock.calls[0][0]).toBe('referencia-opaca');
    expect(toast.add).toHaveBeenCalledWith({
      type: 'success',
      title: 'Participantes importados',
    });
  });
});
