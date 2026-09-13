import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MedalsPage } from '../index';
import { useAuthUser } from '@/providers/UserProvider';
import { mockLoggedAdmin } from '@/data/temporaryMocks/admins';
import { mockLoggedAluno } from '@/data/temporaryMocks/usuario';
import { listMedals } from '@/services/medalhas';

jest.mock('@/providers/UserProvider', () => ({
  useAuthUser: jest.fn(),
}));

jest.mock('@/services/medalhas', () => ({
  listMedals: jest.fn(),
  createMedal: jest.fn(),
  deleteMedal: jest.fn(),
  equipMedal: jest.fn(),
}));

jest.mock('@/services/cloudinary', () => ({
  uploadImage: jest.fn(),
}));

jest.mock('../components/UnknownMedal', () => ({
  UnknownMedal: () => null,
}));

const mockedUseAuthUser = useAuthUser as jest.MockedFunction<
  typeof useAuthUser
>;
const mockedListMedals = listMedals as jest.MockedFunction<typeof listMedals>;

const renderPage = (ui: ReactElement) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
};

describe('MedalsPage', () => {
  beforeEach(() => {
    mockedListMedals.mockReset();
    mockedListMedals.mockResolvedValue([
      {
        id: 'medal-1',
        nome: 'PUC Minas',
        imagemUrl: 'https://example.com/puc.png',
        pontosMin: 20,
        conquistada: true,
      },
    ]);
  });

  it('shows the gallery to the student without the add button', async () => {
    mockedUseAuthUser.mockReturnValue({
      user: mockLoggedAluno,
      setUser: jest.fn(),
      status: 'autenticado',
      isAluno: true,
      isMonitor: false,
      isAdmin: false,
    });

    renderPage(<MedalsPage />);

    expect(
      screen.getByRole('heading', { name: 'Galeria de Medalhas' })
    ).toBeInTheDocument();
    expect(await screen.findByText('PUC Minas')).toBeInTheDocument();
    expect(screen.getByText('20 xp')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Adicionar medalha' })
    ).not.toBeInTheDocument();
  });

  it('opens the create dialog when the admin adds a medal', async () => {
    const user = userEvent.setup();
    mockedUseAuthUser.mockReturnValue({
      user: mockLoggedAdmin,
      setUser: jest.fn(),
      status: 'autenticado',
      isAluno: false,
      isMonitor: false,
      isAdmin: true,
    });

    renderPage(<MedalsPage />);

    await user.click(
      await screen.findByRole('button', { name: 'Adicionar medalha' })
    );

    expect(
      screen.getByRole('heading', { name: 'Adicionar medalha' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Cadastre uma medalha do catálogo com nome, pontos mínimos e imagem.'
      )
    ).toBeInTheDocument();
  });
});
