import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from '@/components/Header';
import { renderWithProviders } from './renderWithProviders';

jest.mock('@/assets/logo-beira-linha.png', () => 'logo.png');

jest.mock('@/components/Header/HeaderDesktopNav', () => ({
  HeaderDesktopNav: ({ onLogout }: { onLogout: () => void }) => (
    <button type="button" onClick={onLogout}>
      Abrir saída
    </button>
  ),
}));

jest.mock('@/features/DrawerNavigation/container/DrawerNavButton', () => ({
  DrawerNavButton: () => null,
}));

describe('Header', () => {
  it('shows the app name and logo linking to home', () => {
    renderWithProviders(<Header />);

    expect(screen.getByText('Beira Linha Play')).toBeInTheDocument();
    expect(screen.getByAltText('Beira Linha Play')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Beira Linha Play/i })
    ).toHaveAttribute('href', '/');
  });

  it('opens the logout dialog from the desktop nav', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header />, { route: '/cursos' });

    await user.click(screen.getByRole('button', { name: 'Abrir saída' }));

    expect(
      screen.getByText('Deseja mesmo sair da sua conta?')
    ).toBeInTheDocument();
  });
});
