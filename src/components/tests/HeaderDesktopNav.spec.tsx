import { screen } from '@testing-library/react';
import { HeaderDesktopNav } from '@/components/Header/HeaderDesktopNav';
import { mockLoggedAdmin } from '@/data/temporaryMocks/admins';
import { mockLoggedMonitor } from '@/data/temporaryMocks/monitores';
import { mockLoggedAluno } from '@/data/temporaryMocks/usuario';
import { renderWithProviders } from './renderWithProviders';

describe('HeaderDesktopNav', () => {
  it('sends the student to the home map', () => {
    renderWithProviders(<HeaderDesktopNav onLogout={jest.fn()} />, {
      route: '/cursos',
      user: mockLoggedAluno,
    });

    expect(screen.getByRole('link', { name: 'Mapa' })).toHaveAttribute(
      'href',
      '/'
    );
  });

  it.each([
    ['monitor', mockLoggedMonitor],
    ['admin', mockLoggedAdmin],
  ] as const)('sends the %s to /mapa', (_role, user) => {
    renderWithProviders(<HeaderDesktopNav onLogout={jest.fn()} />, {
      route: '/cursos',
      user,
    });

    expect(screen.getByRole('link', { name: 'Cursos' })).toHaveAttribute(
      'href',
      '/cursos'
    );
    expect(screen.getByRole('link', { name: 'Mapa' })).toHaveAttribute(
      'href',
      '/mapa'
    );
    expect(screen.getByRole('link', { name: 'Medalhas' })).toHaveAttribute(
      'href',
      '/medalhas'
    );
  });
});
