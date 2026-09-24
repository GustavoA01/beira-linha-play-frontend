import { screen } from '@testing-library/react';
import { HeaderDesktopNav } from '@/components/Header/HeaderDesktopNav';
import { mockLoggedAdmin } from '@/data/mocks/admins';
import { mockLoggedMonitor } from '@/data/mocks/monitores';
import { mockLoggedAluno } from '@/data/mocks/usuario';
import { renderWithProviders } from './renderWithProviders';

describe('HeaderDesktopNav', () => {
  it('sends the student to the home map and medals', () => {
    renderWithProviders(<HeaderDesktopNav onLogout={jest.fn()} />, {
      route: '/cursos',
      user: mockLoggedAluno,
    });

    expect(screen.getByRole('link', { name: 'Mapa' })).toHaveAttribute(
      'href',
      '/'
    );
    expect(screen.getByRole('link', { name: 'Medalhas' })).toHaveAttribute(
      'href',
      '/medalhas'
    );
  });

  it('sends the monitor to /mapa without medals', () => {
    renderWithProviders(<HeaderDesktopNav onLogout={jest.fn()} />, {
      route: '/cursos',
      user: mockLoggedMonitor,
    });

    expect(screen.getByRole('link', { name: 'Cursos' })).toHaveAttribute(
      'href',
      '/cursos'
    );
    expect(screen.getByRole('link', { name: 'Mapa' })).toHaveAttribute(
      'href',
      '/mapa'
    );
    expect(
      screen.queryByRole('link', { name: 'Medalhas' })
    ).not.toBeInTheDocument();
  });

  it('keeps medals for the admin', () => {
    renderWithProviders(<HeaderDesktopNav onLogout={jest.fn()} />, {
      route: '/cursos',
      user: mockLoggedAdmin,
    });

    expect(screen.getByRole('link', { name: 'Mapa' })).toHaveAttribute(
      'href',
      '/mapa'
    );
    expect(screen.getByRole('link', { name: 'Medalhas' })).toHaveAttribute(
      'href',
      '/medalhas'
    );
  });

  it('disables the map when the monitor has no courses', () => {
    renderWithProviders(<HeaderDesktopNav onLogout={jest.fn()} />, {
      route: '/cursos',
      user: { ...mockLoggedMonitor, cursoIds: [] },
    });

    expect(
      screen.queryByRole('link', { name: 'Mapa' })
    ).not.toBeInTheDocument();
    expect(screen.getByText('Mapa')).toHaveAttribute('aria-disabled', 'true');
  });
});
