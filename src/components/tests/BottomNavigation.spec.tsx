import { screen } from '@testing-library/react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { mockLoggedAdmin } from '@/data/mocks/admins';
import { mockLoggedMonitor } from '@/data/mocks/monitores';
import { mockLoggedAluno } from '@/data/mocks/usuario';
import { renderWithProviders } from './renderWithProviders';

describe('BottomNavigation', () => {
  it('renders the student shortcuts', () => {
    renderWithProviders(<BottomNavigation />, {
      route: '/cursos',
      user: mockLoggedAluno,
    });

    const hrefs = screen
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'));
    expect(hrefs).toEqual(['/cursos', '/', '/rankings', '/medalhas']);
  });

  it('renders the monitor shortcuts with /mapa and without medals', () => {
    renderWithProviders(<BottomNavigation />, {
      route: '/cursos',
      user: mockLoggedMonitor,
    });

    const hrefs = screen
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'));
    expect(hrefs).toEqual(['/cursos', '/mapa', '/rankings']);
  });

  it('renders the admin shortcuts with /mapa and medals', () => {
    renderWithProviders(<BottomNavigation />, {
      route: '/cursos',
      user: mockLoggedAdmin,
    });

    const hrefs = screen
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'));
    expect(hrefs).toEqual(['/cursos', '/mapa', '/rankings', '/medalhas']);
  });

  it('disables the map shortcut when the monitor has no courses', () => {
    renderWithProviders(<BottomNavigation />, {
      route: '/cursos',
      user: { ...mockLoggedMonitor, cursoIds: [] },
    });

    const hrefs = screen
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'));
    expect(hrefs).toEqual(['/cursos', '/rankings']);
    expect(
      document.querySelector('[aria-disabled="true"]')
    ).toBeInTheDocument();
  });
});
