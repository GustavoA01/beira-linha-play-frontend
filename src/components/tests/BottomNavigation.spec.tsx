import { screen } from '@testing-library/react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { mockLoggedAdmin } from '@/data/temporaryMocks/admins';
import { mockLoggedMonitor } from '@/data/temporaryMocks/monitores';
import { mockLoggedAluno } from '@/data/temporaryMocks/usuario';
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
    expect(hrefs).toEqual(['/cursos', '/', '/rankings']);
  });

  it.each([
    ['monitor', mockLoggedMonitor],
    ['admin', mockLoggedAdmin],
  ] as const)('renders the %s shortcuts with /mapa', (_role, user) => {
    renderWithProviders(<BottomNavigation />, {
      route: '/cursos',
      user,
    });

    const hrefs = screen
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'));
    expect(hrefs).toEqual(['/cursos', '/mapa', '/rankings']);
  });
});
