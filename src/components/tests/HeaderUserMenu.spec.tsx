import { screen } from '@testing-library/react';
import { HeaderUserMenu } from '@/components/Header/HeaderUserMenu';
import { mockLoggedMonitor } from '@/data/temporaryMocks/monitores';
import { mockLoggedAluno } from '@/data/temporaryMocks/usuario';
import { renderWithProviders } from './renderWithProviders';

describe('HeaderUserMenu', () => {
  it('greets the monitor by institutional name', () => {
    renderWithProviders(<HeaderUserMenu onLogout={jest.fn()} />, {
      user: mockLoggedMonitor,
    });

    expect(screen.getByText('Olá, Maria Souza')).toBeInTheDocument();
    expect(screen.queryByText(/xp/i)).not.toBeInTheDocument();
  });

  it('shows the student nickname and score under the profile', () => {
    renderWithProviders(<HeaderUserMenu onLogout={jest.fn()} />, {
      user: mockLoggedAluno,
    });

    expect(screen.getByText('Olá, Gu')).toBeInTheDocument();
    expect(screen.getByText('40 xp')).toBeInTheDocument();
  });
});
