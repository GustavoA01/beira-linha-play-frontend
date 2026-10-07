import type { ReactElement } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ImportacaoPage } from '../index';
import { UserProvider } from '@/providers/UserProvider';
import { mockLoggedAluno } from '@/data/mocks/usuario';
import {
  importarInscritos,
  listarAlunosDoLog,
  listarCursos,
  listarEventos,
  listarLogs,
} from '@/services/importacao';
import type { UsuarioType } from '@/data/types/api';

jest.mock('@/components/ui/toast', () => ({
  toast: { add: jest.fn() },
}));

jest.mock('@/services/importacao', () => ({
  importarInscritos: jest.fn(),
  listarEventos: jest.fn(),
  listarLogs: jest.fn(),
  listarCursos: jest.fn(),
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
const mockedCursos = listarCursos as jest.MockedFunction<typeof listarCursos>;

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
    mockedCursos.mockReset();
    mockedCursos.mockResolvedValue(['Cálculo', 'Física']);
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
        id: 'aluno-1',
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
      screen.queryByRole('heading', { name: 'Importar dados' })
    ).not.toBeInTheDocument();
  });

  it('sends only the courses left checked', async () => {
    mockedImportar.mockResolvedValue({
      id: 'log-1',
      nomeEvento: 'Beira Linha 2026',
      urlEvento: 'https://sympla.com.br/beira',
      quantidadeAlunos: 1,
      quantidadeCursos: 1,
      dataImportacao: '2026-09-27T15:00:00Z',
      adminNome: 'Administrador',
    });
    renderPage({ id: 'admin-1', nome: 'Admin', tipo: 'ADMIN' });

    await screen.findByRole('heading', { name: 'Importar dados' });
    await waitFor(() => {
      expect(document.querySelectorAll('select')).toHaveLength(2);
    });
    fireEvent.change(document.querySelectorAll('select')[1], {
      target: { value: 'referencia-opaca' },
    });

    expect(
      await screen.findByRole('checkbox', { name: 'Cálculo' })
    ).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Física' })).toBeChecked();

    fireEvent.click(screen.getByRole('checkbox', { name: 'Física' }));
    fireEvent.submit(
      screen.getByRole('button', { name: 'Importar' }).closest('form')!
    );

    await waitFor(() => {
      expect(mockedImportar.mock.calls[0][0]).toEqual({
        referencia: 'referencia-opaca',
        cursos: ['Cálculo'],
      });
    });
  });
});
