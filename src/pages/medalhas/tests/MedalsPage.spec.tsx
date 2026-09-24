import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MedalsPage } from '../index';
import { useAuthUser } from '@/providers/UserProvider';
import { mockLoggedAdmin } from '@/data/mocks/admins';
import { mockLoggedAluno } from '@/data/mocks/usuario';
import { mockLoggedMonitor } from '@/data/mocks/monitores';
import { equipMedal, listMedals } from '@/services/medalhas';
import { toast } from '@/components/ui/toast';

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

jest.mock('@/components/ui/toast', () => ({
  toast: { add: jest.fn() },
}));

jest.mock('../components/UnknownMedal', () => ({
  UnknownMedal: () => null,
}));

const mockedUseAuthUser = useAuthUser as jest.MockedFunction<
  typeof useAuthUser
>;
const mockedListMedals = listMedals as jest.MockedFunction<typeof listMedals>;
const mockedEquipMedal = equipMedal as jest.MockedFunction<typeof equipMedal>;

const renderPage = (ui: ReactElement) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={['/medalhas']}>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe('MedalsPage', () => {
  beforeEach(() => {
    mockedListMedals.mockReset();
    mockedEquipMedal.mockReset();
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

  it('equips a medal and updates the student profile image', async () => {
    const user = userEvent.setup();
    const setUser = jest.fn();
    let resolveEquip!: (value: Awaited<ReturnType<typeof equipMedal>>) => void;

    mockedEquipMedal.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveEquip = resolve;
        })
    );
    mockedUseAuthUser.mockReturnValue({
      user: mockLoggedAluno,
      setUser,
      status: 'autenticado',
      isAluno: true,
      isMonitor: false,
      isAdmin: false,
    });

    renderPage(<MedalsPage />);

    await user.click(await screen.findByText('PUC Minas'));

    expect(
      await screen.findByText('Atualizando foto de perfil...')
    ).toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();

    resolveEquip({
      id: mockLoggedAluno.id,
      nome: mockLoggedAluno.nome,
      tipo: 'ALUNO',
      cursoIds: mockLoggedAluno.cursoIds,
      email: null,
      apelido: mockLoggedAluno.apelido,
      pontos: mockLoggedAluno.pontos,
      imagemPerfil: 'https://example.com/puc.png',
      cursoOrigem: null,
    });

    await screen.findByText('PUC Minas');
    expect(setUser).toHaveBeenCalledWith({
      ...mockLoggedAluno,
      imagemPerfil: 'https://example.com/puc.png',
    });
    expect(toast.add).toHaveBeenCalledWith({
      type: 'success',
      title: 'Medalha selecionada',
    });
  });

  it('redirects the monitor away from medals', () => {
    mockedUseAuthUser.mockReturnValue({
      user: mockLoggedMonitor,
      setUser: jest.fn(),
      status: 'autenticado',
      isAluno: false,
      isMonitor: true,
      isAdmin: false,
    });

    renderPage(<MedalsPage />);

    expect(
      screen.queryByRole('heading', { name: 'Galeria de Medalhas' })
    ).not.toBeInTheDocument();
  });
});
