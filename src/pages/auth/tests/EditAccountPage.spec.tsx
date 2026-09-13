import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useAuthUser } from '@/providers/UserProvider';
import { mockLoggedAdmin } from '@/data/temporaryMocks/admins';
import { mockLoggedMonitor } from '@/data/temporaryMocks/monitores';
import { mockLoggedAluno } from '@/data/temporaryMocks/usuario';
import { EditAccountPage } from '../editAccount';
import type { UsuarioType } from '@/data/types/api';

jest.mock('@/assets/logo-beira-linha.png', () => 'logo.png');

jest.mock('@/providers/UserProvider', () => ({
  useAuthUser: jest.fn(),
}));

jest.mock('@/components/ui/toast', () => ({
  toast: { add: jest.fn() },
}));

const mockedUseAuthUser = useAuthUser as jest.MockedFunction<
  typeof useAuthUser
>;

const authOf = (user: UsuarioType, setUser = jest.fn()) => {
  if (user.tipo === 'ALUNO') {
    return {
      user,
      setUser,
      status: 'autenticado' as const,
      isAluno: true as const,
      isMonitor: false as const,
      isAdmin: false as const,
    };
  }
  if (user.tipo === 'MONITOR') {
    return {
      user,
      setUser,
      status: 'autenticado' as const,
      isAluno: false as const,
      isMonitor: true as const,
      isAdmin: false as const,
    };
  }
  return {
    user,
    setUser,
    status: 'autenticado' as const,
    isAluno: false as const,
    isMonitor: false as const,
    isAdmin: true as const,
  };
};

const renderPage = (user: UsuarioType, setUser = jest.fn()) => {
  mockedUseAuthUser.mockReturnValue(authOf(user, setUser));

  return render(
    <MemoryRouter initialEntries={['/editar-conta']}>
      <Routes>
        <Route path="/editar-conta" element={<EditAccountPage />} />
        <Route path="/" element={<p>Mapa do aluno</p>} />
        <Route path="/cursos" element={<p>Lista de cursos</p>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('EditAccountPage', () => {
  it('shows the student fields with current values', () => {
    renderPage(mockLoggedAluno);

    expect(
      screen.getByRole('heading', { name: 'Editar conta' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Nome')).toHaveValue('Gustavo Aguiar');
    expect(screen.getByLabelText('Apelido')).toHaveValue('Gu');
    expect(screen.queryByLabelText('E-mail')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Nova senha')).toHaveValue('');
    expect(screen.getByLabelText('Confirmar senha')).toHaveValue('');
    expect(
      screen.queryByRole('button', { name: 'Entrar como aluno' })
    ).not.toBeInTheDocument();
  });

  it('shows email instead of nickname for the monitor', () => {
    renderPage(mockLoggedMonitor);

    expect(screen.getByLabelText('Nome')).toHaveValue('Maria Souza');
    expect(screen.getByLabelText('E-mail')).toHaveValue(
      'maria.souza@pucminas.br'
    );
    expect(screen.queryByLabelText('Apelido')).not.toBeInTheDocument();
  });

  it('shows only name and password for the admin', () => {
    renderPage(mockLoggedAdmin);

    expect(screen.getByLabelText('Nome')).toHaveValue('Administrador');
    expect(screen.queryByLabelText('Apelido')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('E-mail')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Nova senha')).toBeInTheDocument();
  });

  it('validates required name', async () => {
    const user = userEvent.setup();
    renderPage(mockLoggedAluno);

    await user.clear(screen.getByLabelText('Nome'));
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(await screen.findByText('Informe o nome')).toBeInTheDocument();
  });

  it('validates the monitor email', async () => {
    const user = userEvent.setup();
    renderPage(mockLoggedMonitor);

    await user.clear(screen.getByLabelText('E-mail'));
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(
      await screen.findByText('Informe um e-mail válido')
    ).toBeInTheDocument();
  });

  it('warns when passwords do not match', async () => {
    const user = userEvent.setup();
    renderPage(mockLoggedAluno);

    await user.type(screen.getByLabelText('Nova senha'), '123456');
    await user.type(screen.getByLabelText('Confirmar senha'), 'abcdef');
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(
      await screen.findByText('As senhas não coincidem')
    ).toBeInTheDocument();
  });

  it('saves the student nickname and goes to the map', async () => {
    const user = userEvent.setup();
    const setUser = jest.fn();
    renderPage(mockLoggedAluno, setUser);

    await user.clear(screen.getByLabelText('Apelido'));
    await user.type(screen.getByLabelText('Apelido'), 'Guga');
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(setUser).toHaveBeenCalledWith({
      ...mockLoggedAluno,
      apelido: 'Guga',
    });
    expect(await screen.findByText('Mapa do aluno')).toBeInTheDocument();
  });

  it('saves the monitor without changing the password', async () => {
    const user = userEvent.setup();
    const setUser = jest.fn();
    renderPage(mockLoggedMonitor, setUser);

    await user.clear(screen.getByLabelText('Nome'));
    await user.type(screen.getByLabelText('Nome'), 'Maria S.');
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(setUser).toHaveBeenCalledWith({
      ...mockLoggedMonitor,
      nome: 'Maria S.',
    });
    expect(await screen.findByText('Lista de cursos')).toBeInTheDocument();
  });

  it('cancels and goes back home', async () => {
    const user = userEvent.setup();
    renderPage(mockLoggedMonitor);

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.getByText('Lista de cursos')).toBeInTheDocument();
  });
});
