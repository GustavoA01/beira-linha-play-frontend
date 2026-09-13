import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UserProvider } from '@/providers/UserProvider';
import { mockLoggedAluno } from '@/data/temporaryMocks/usuario';
import { mockLoggedMonitor } from '@/data/temporaryMocks/monitores';
import { login } from '@/services/auth';
import { LoginPage } from '../login';

jest.mock('@/assets/logo-beira-linha.png', () => 'logo.png');

jest.mock('@/services/auth', () => ({
  login: jest.fn(),
  register: jest.fn(),
  currentUser: jest.fn(),
  refresh: jest.fn(),
  logout: jest.fn(),
}));

const mockedLogin = login as jest.MockedFunction<typeof login>;

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/login']}>
      <UserProvider initialUser={null}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<p>Mapa do aluno</p>} />
          <Route path="/cursos" element={<p>Lista de cursos</p>} />
          <Route path="/cadastro" element={<p>Tela de cadastro</p>} />
        </Routes>
      </UserProvider>
    </MemoryRouter>
  );

describe('LoginPage', () => {
  beforeEach(() => {
    mockedLogin.mockReset();
  });

  it('shows the student form by default', () => {
    renderPage();

    expect(screen.getByRole('heading', { name: 'Entrar' })).toBeInTheDocument();
    expect(screen.getByLabelText('Apelido')).toBeInTheDocument();
    expect(screen.queryByLabelText('E-mail')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
  });

  it('swaps nickname for email when entering as monitor', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(
      screen.getByRole('button', { name: 'Entrar como monitor' })
    );

    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    expect(screen.queryByLabelText('Apelido')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Entrar' })).toBeInTheDocument();
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

    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText('Informe o apelido')).toBeInTheDocument();
    expect(screen.getByText('Informe a senha')).toBeInTheDocument();
  });

  it('validates the monitor email', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(
      screen.getByRole('button', { name: 'Entrar como monitor' })
    );
    await user.type(screen.getByLabelText('Senha'), '123456');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(
      await screen.findByText('Informe um e-mail válido')
    ).toBeInTheDocument();
  });

  it('shows an error when student credentials are invalid', async () => {
    const user = userEvent.setup();
    mockedLogin.mockRejectedValue(new Error('Apelido ou senha inválidos'));
    renderPage();

    await user.type(screen.getByLabelText('Apelido'), 'Gu');
    await user.type(screen.getByLabelText('Senha'), 'senha-errada');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(
      await screen.findByText('Apelido ou senha inválidos')
    ).toBeInTheDocument();
  });

  it('logs in the student and goes to the map', async () => {
    const user = userEvent.setup();
    mockedLogin.mockResolvedValue(mockLoggedAluno);
    renderPage();

    await user.type(screen.getByLabelText('Apelido'), 'Gu');
    await user.type(screen.getByLabelText('Senha'), '123456');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(mockedLogin).toHaveBeenCalledWith({
      tipo: 'ALUNO',
      apelido: 'Gu',
      senha: '123456',
    });
    expect(await screen.findByText('Mapa do aluno')).toBeInTheDocument();
  });

  it('logs in the monitor and goes to courses', async () => {
    const user = userEvent.setup();
    mockedLogin.mockResolvedValue(mockLoggedMonitor);
    renderPage();

    await user.click(
      screen.getByRole('button', { name: 'Entrar como monitor' })
    );
    await user.type(screen.getByLabelText('E-mail'), 'maria.souza@pucminas.br');
    await user.type(screen.getByLabelText('Senha'), '123456');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(mockedLogin).toHaveBeenCalledWith({
      tipo: 'MONITOR',
      email: 'maria.souza@pucminas.br',
      senha: '123456',
    });
    expect(await screen.findByText('Lista de cursos')).toBeInTheDocument();
  });

  it('navigates to register', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('link', { name: 'Cadastre-se' }));

    expect(screen.getByText('Tela de cadastro')).toBeInTheDocument();
  });
});
