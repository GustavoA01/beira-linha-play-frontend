import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MedalsPage } from '../index';
import { useAuthUser } from '@/providers/UserProvider';
import { mockLoggedAdmin } from '@/data/temporaryMocks/admins';
import { mockLoggedAluno } from '@/data/temporaryMocks/usuario';

jest.mock('@/providers/UserProvider', () => ({
  useAuthUser: jest.fn(),
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

describe('MedalsPage', () => {
  it('shows the gallery to the student without the add button', () => {
    mockedUseAuthUser.mockReturnValue({
      user: mockLoggedAluno,
      setUser: jest.fn(),
      status: 'autenticado',
      isAluno: true,
      isMonitor: false,
      isAdmin: false,
    });

    render(<MedalsPage />);

    expect(
      screen.getByRole('heading', { name: 'Galeria de Medalhas' })
    ).toBeInTheDocument();
    expect(screen.getByText('PUC Minas')).toBeInTheDocument();
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

    render(<MedalsPage />);

    await user.click(screen.getByRole('button', { name: 'Adicionar medalha' }));

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
