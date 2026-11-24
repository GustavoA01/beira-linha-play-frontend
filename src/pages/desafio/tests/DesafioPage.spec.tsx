import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DesafioPage } from '../index';
import { DesafioGate } from '@/components/layouts/DesafioGate';
import { UserProvider } from '@/providers/UserProvider';
import { mockLoggedAluno } from '@/data/mocks/usuario';
import { mockLoggedMonitor } from '@/data/mocks/monitores';
import { getConfiguracao } from '@/services/configuracao';
import { listCourses } from '@/services/cursos';
import { escolherCursoPontuado } from '@/services/usuarios';
import {
  limparEntradaDesafio,
  confirmarEntradaDesafio,
} from '@/data/desafioEntrada';
import type { AlunoType } from '@/data/types/api';

jest.mock('@/components/ui/toast', () => ({
  toast: { add: jest.fn() },
}));

jest.mock('@/services/configuracao', () => ({
  getConfiguracao: jest.fn(),
  updateConfiguracao: jest.fn(),
}));

jest.mock('@/services/cursos', () => ({
  listCourses: jest.fn(),
  enrollCourse: jest.fn(),
}));

jest.mock('@/services/usuarios', () => ({
  escolherCursoPontuado: jest.fn(),
}));

const mockedGetConfiguracao = getConfiguracao as jest.MockedFunction<
  typeof getConfiguracao
>;
const mockedListCourses = listCourses as jest.MockedFunction<
  typeof listCourses
>;
const mockedEscolher = escolherCursoPontuado as jest.MockedFunction<
  typeof escolherCursoPontuado
>;

const aluno: AlunoType = {
  ...mockLoggedAluno,
  cursoIds: ['curso-calculo-1', 'curso-algebra'],
  cursoPontuadoId: null,
};

const renderComRotas = (
  ui: ReactElement,
  path = '/desafio',
  current: AlunoType = aluno
) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={client}>
      <UserProvider initialUser={current}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/desafio" element={ui} />
            <Route path="/" element={<p>Mapa do aluno</p>} />
          </Routes>
        </MemoryRouter>
      </UserProvider>
    </QueryClientProvider>
  );
};

describe('DesafioPage', () => {
  beforeEach(() => {
    limparEntradaDesafio();
    mockedListCourses.mockReset();
    mockedEscolher.mockReset();
    mockedGetConfiguracao.mockResolvedValue({
      quantidadeQuestoesPadrao: 1,
      quantidadeQuestoesTravada: false,
      pontosQuestaoPadrao: 1,
      pontosQuestaoTravados: false,
      desafioAtivo: true,
      trocaCursoLiberada: false,
    });
    mockedListCourses.mockResolvedValue([
      {
        id: 'curso-calculo-1',
        nome: 'Cálculo 1',
        codigoAcesso: null,
        monitorIds: [],
        modulos: [],
      },
      {
        id: 'curso-algebra',
        nome: 'Álgebra',
        codigoAcesso: null,
        monitorIds: [],
        modulos: [],
      },
    ]);
  });

  it('asks the student to join a course when there is none', async () => {
    mockedListCourses.mockResolvedValue([]);
    renderComRotas(<DesafioPage />, '/desafio');

    expect(
      await screen.findByRole('button', { name: 'Entrar com código' })
    ).toBeInTheDocument();
  });

  it('saves the chosen course and leaves the screen', async () => {
    const user = userEvent.setup();
    mockedEscolher.mockResolvedValue({
      ...aluno,
      cursoPontuadoId: 'curso-algebra',
    });

    renderComRotas(<DesafioPage />);

    await user.click(await screen.findByRole('radio', { name: 'Álgebra' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));

    expect(await screen.findByText('Mapa do aluno')).toBeInTheDocument();
    expect(mockedEscolher.mock.calls[0][0]).toBe('curso-algebra');
  });

  it('keeps the other courses disabled after the first choice', async () => {
    renderComRotas(<DesafioPage />, '/desafio', {
      ...aluno,
      cursoPontuadoId: 'curso-calculo-1',
    });

    expect(
      await screen.findByRole('radio', { name: 'Cálculo 1' })
    ).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Álgebra' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Sair' })).toBeInTheDocument();
  });
});

describe('DesafioGate', () => {
  beforeEach(() => {
    limparEntradaDesafio();
    mockedGetConfiguracao.mockReset();
  });

  const renderGate = (
    user: AlunoType | typeof mockLoggedMonitor,
    path = '/'
  ) => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    return render(
      <QueryClientProvider client={client}>
        <UserProvider initialUser={user}>
          <MemoryRouter initialEntries={[path]}>
            <Routes>
              <Route element={<DesafioGate />}>
                <Route path="/" element={<p>Mapa do aluno</p>} />
                <Route path="/desafio" element={<p>Tela do desafio</p>} />
                <Route path="/cursos" element={<p>Lista de cursos</p>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </UserProvider>
      </QueryClientProvider>
    );
  };

  it('sends the student to the choice screen when the challenge is on', async () => {
    mockedGetConfiguracao.mockResolvedValue({
      quantidadeQuestoesPadrao: 1,
      quantidadeQuestoesTravada: false,
      pontosQuestaoPadrao: 1,
      pontosQuestaoTravados: false,
      desafioAtivo: true,
      trocaCursoLiberada: false,
    });

    renderGate(aluno);

    expect(await screen.findByText('Tela do desafio')).toBeInTheDocument();
  });

  it('keeps the student on the map when the challenge is off', async () => {
    mockedGetConfiguracao.mockResolvedValue({
      quantidadeQuestoesPadrao: 1,
      quantidadeQuestoesTravada: false,
      pontosQuestaoPadrao: 1,
      pontosQuestaoTravados: false,
      desafioAtivo: false,
      trocaCursoLiberada: false,
    });

    renderGate(aluno);

    expect(await screen.findByText('Mapa do aluno')).toBeInTheDocument();
  });

  it('does not stop a monitor', async () => {
    mockedGetConfiguracao.mockResolvedValue({
      quantidadeQuestoesPadrao: 1,
      quantidadeQuestoesTravada: false,
      pontosQuestaoPadrao: 1,
      pontosQuestaoTravados: false,
      desafioAtivo: true,
      trocaCursoLiberada: false,
    });

    renderGate(mockLoggedMonitor);

    expect(await screen.findByText('Mapa do aluno')).toBeInTheDocument();
  });

  it('lets the student through after the choice in this entry', async () => {
    confirmarEntradaDesafio();
    mockedGetConfiguracao.mockResolvedValue({
      quantidadeQuestoesPadrao: 1,
      quantidadeQuestoesTravada: false,
      pontosQuestaoPadrao: 1,
      pontosQuestaoTravados: false,
      desafioAtivo: true,
      trocaCursoLiberada: false,
    });

    renderGate({ ...aluno, cursoPontuadoId: 'curso-calculo-1' });

    expect(await screen.findByText('Mapa do aluno')).toBeInTheDocument();
  });
});
