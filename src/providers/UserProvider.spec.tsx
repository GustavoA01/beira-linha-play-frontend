import { render, screen, waitFor } from '@testing-library/react';
import { UserProvider, useUserProvider } from '@/providers/UserProvider';
import { mockLoggedAluno } from '@/data/temporaryMocks/usuario';
import { me, refresh } from '@/services/auth';

jest.mock('@/services/auth', () => ({
  me: jest.fn(),
  refresh: jest.fn(),
  login: jest.fn(),
  cadastro: jest.fn(),
  logout: jest.fn(),
}));

const mockedMe = me as jest.MockedFunction<typeof me>;
const mockedRefresh = refresh as jest.MockedFunction<typeof refresh>;

const Probe = () => {
  const { status, user } = useUserProvider();
  return (
    <p>
      {status}:{user?.nome ?? 'none'}
    </p>
  );
};

describe('UserProvider', () => {
  beforeEach(() => {
    mockedMe.mockReset();
    mockedRefresh.mockReset();
  });

  it('skips the network boot when initialUser is passed', () => {
    render(
      <UserProvider initialUser={null}>
        <Probe />
      </UserProvider>
    );

    expect(screen.getByText('anonimo:none')).toBeInTheDocument();
    expect(mockedMe).not.toHaveBeenCalled();
    expect(mockedRefresh).not.toHaveBeenCalled();
  });

  it('authenticates from GET /me', async () => {
    mockedMe.mockResolvedValue(mockLoggedAluno);

    render(
      <UserProvider>
        <Probe />
      </UserProvider>
    );

    expect(screen.getByText('loading:none')).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.getByText('autenticado:Gustavo Aguiar')
      ).toBeInTheDocument();
    });
    expect(mockedRefresh).not.toHaveBeenCalled();
  });

  it('restores the session from refresh when /me is unauthorized', async () => {
    mockedMe.mockResolvedValue(null);
    mockedRefresh.mockResolvedValue(mockLoggedAluno);

    render(
      <UserProvider>
        <Probe />
      </UserProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText('autenticado:Gustavo Aguiar')
      ).toBeInTheDocument();
    });
  });

  it('stays anonymous when me and refresh fail', async () => {
    mockedMe.mockResolvedValue(null);
    mockedRefresh.mockResolvedValue(null);

    render(
      <UserProvider>
        <Probe />
      </UserProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('anonimo:none')).toBeInTheDocument();
    });
  });
});
