import { screen } from '@testing-library/react';
import { Header } from '@/components/Header';
import { renderWithProviders } from './renderWithProviders';

jest.mock('@/assets/logo-beira-linha.png', () => 'logo.png');

describe('Header', () => {
  it('shows the app name and logo', () => {
    renderWithProviders(<Header />);

    expect(screen.getByText('Beira Linha Play')).toBeInTheDocument();
    expect(screen.getByAltText('Beira Linha Play')).toBeInTheDocument();
  });
});
