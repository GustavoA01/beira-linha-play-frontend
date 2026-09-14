import { render, screen, waitFor } from '@testing-library/react';
import { UserProvider, useUserProvider } from '@/providers/UserProvider';
import { mockLoggedAluno } from '@/data/temporaryMocks/usuario';
import { currentUser } from '@/services/auth';

jest.mock('@/services/auth', () => ({
  currentUser: jest.fn(),
  refresh: jest.fn(),
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
}));

const mockedCurrentUser = currentUser as jest.MockedFunction<
  typeof currentUser
>;

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
    mockedCurrentUser.mockReset();
  });

  it('skips the network boot when initialUser is passed', () => {
    render(
      <UserProvider initialUser={null}>
        <Probe />
      </UserProvider>
    );

    expect(screen.getByText('anonimo:none')).toBeInTheDocument();
    expect(mockedCurrentUser).not.toHaveBeenCalled();
  });

  it('authenticates from GET current user', async () => {
    mockedCurrentUser.mockResolvedValue(mockLoggedAluno);

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
  });

  it('stays anonymous when current user is unauthorized', async () => {
    mockedCurrentUser.mockResolvedValue(null);

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
