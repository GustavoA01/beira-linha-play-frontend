import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from '@/providers/UserProvider';
import { mockLoggedAluno } from '@/data/mocks/usuario';
import { mockLoggedMonitor } from '@/data/mocks/monitores';
import { ApiError } from '@/services/api';
import { register } from '@/services/auth';
import { RegisterPage } from '../register';

jest.mock('@/assets/logo-beira-linha.png', () => 'logo.png');

jest.mock('@/services/auth', () => ({
  login: jest.fn(),
  register: jest.fn(),
  currentUser: jest.fn(),
  refresh: jest.fn(),
  logout: jest.fn(),
}));

const mockedRegister = register as jest.MockedFunction<typeof register>;

const renderPage = () => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={['/cadastro']}>
        <UserProvider initialUser={null}>
          <Routes>
            <Route path="/cadastro" element={<RegisterPage />} />
            <Route path="/" element={<p>Mapa do aluno</p>} />
            <Route path="/cursos" element={<p>Lista de cursos</p>} />
            <Route path="/login" element={<p>Tela de login</p>} />
          </Routes>
        </UserProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('RegisterPage', () => {
  beforeEach(() => {
    mockedRegister.mockReset();
  });

  it('shows the student form by default', () => {
    renderPage();

    expect(
      screen.getByRole('heading', { name: 'Cadastre-se' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Nome completo')).toBeInTheDocument();
    expect(screen.getByLabelText('Apelido')).toBeInTheDocument();
    expect(screen.queryByLabelText('E-mail')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar senha')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Entrar como admin' })
    ).not.toBeInTheDocument();
  });

  it('swaps nickname for email when entering as monitor', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(
      screen.getByRole('button', { name: 'Entrar como monitor' })
    );

    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    expect(screen.queryByLabelText('Apelido')).not.toBeInTheDocument();
    expect(screen.getByText('Cadastre-se')).toBeInTheDocument();
  });

  it('restores nickname when entering as student', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(
      screen.getByRole('button', { name: 'Entrar como monitor' })
    );
    await user.click(screen.getByRole('button', { name: 'Entrar como aluno' }));

    expect(screen.getByLabelText('Apelido')).toBeInTheDocument();
    expect(screen.queryByLabelText('E-mail')).not.toBeInTheDocument();
  });

  it('validates required student fields', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: 'Cadastrar' }));

    expect(
      await screen.findByText('Informe o nome completo')
    ).toBeInTheDocument();
    expect(screen.getByText('Informe o apelido')).toBeInTheDocument();
    expect(
      screen.getByText('A senha deve ter pelo menos 6 caracteres')
    ).toBeInTheDocument();
  });

  it('validates the monitor email', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(
      screen.getByRole('button', { name: 'Entrar como monitor' })
    );
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }));

    expect(
      await screen.findByText('Informe um e-mail válido')
    ).toBeInTheDocument();
  });

  it('warns when passwords do not match', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText('Nome completo'), 'Gustavo Aguiar');
    await user.type(screen.getByLabelText('Apelido'), 'Gu');
    await user.type(screen.getByLabelText('Senha'), '123456');
    await user.type(screen.getByLabelText('Confirmar senha'), 'abcdef');
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }));

    expect(
      await screen.findByText('As senhas não coincidem')
    ).toBeInTheDocument();
  });

  it('registers the student and goes to the map', async () => {
    const user = userEvent.setup();
    mockedRegister.mockResolvedValue(mockLoggedAluno);
    renderPage();

    await user.type(screen.getByLabelText('Nome completo'), 'Gustavo Aguiar');
    await user.type(screen.getByLabelText('Apelido'), 'Gu');
    await user.type(screen.getByLabelText('Senha'), '123456');
    await user.type(screen.getByLabelText('Confirmar senha'), '123456');
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }));

    expect(mockedRegister).toHaveBeenCalledWith({
      tipo: 'ALUNO',
      nome: 'Gustavo Aguiar',
      apelido: 'Gu',
      senha: '123456',
    });
    expect(await screen.findByText('Mapa do aluno')).toBeInTheDocument();
  });

  it('registers the monitor and goes to courses', async () => {
    const user = userEvent.setup();
    mockedRegister.mockResolvedValue(mockLoggedMonitor);
    renderPage();

    await user.click(
      screen.getByRole('button', { name: 'Entrar como monitor' })
    );
    await user.type(screen.getByLabelText('Nome completo'), 'Maria Souza');
    await user.type(screen.getByLabelText('E-mail'), 'maria.souza@pucminas.br');
    await user.type(screen.getByLabelText('Senha'), '123456');
    await user.type(screen.getByLabelText('Confirmar senha'), '123456');
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }));

    expect(mockedRegister).toHaveBeenCalledWith({
      tipo: 'MONITOR',
      nome: 'Maria Souza',
      email: 'maria.souza@pucminas.br',
      senha: '123456',
    });
    expect(await screen.findByText('Lista de cursos')).toBeInTheDocument();
  });

  it('shows an error when registration fails', async () => {
    const user = userEvent.setup();
    mockedRegister.mockRejectedValue(
      new ApiError('Apelido já está em uso', 409)
    );
    renderPage();

    await user.type(screen.getByLabelText('Nome completo'), 'Gustavo Aguiar');
    await user.type(screen.getByLabelText('Apelido'), 'Gu');
    await user.type(screen.getByLabelText('Senha'), '123456');
    await user.type(screen.getByLabelText('Confirmar senha'), '123456');
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }));

    expect(
      await screen.findByText('Apelido já está em uso')
    ).toBeInTheDocument();
  });

  it('navigates to login', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('link', { name: 'Entrar' }));

    expect(screen.getByText('Tela de login')).toBeInTheDocument();
  });
});
