import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryProvider } from '@/providers/QueryProvider';
import { UserProvider } from '@/providers/UserProvider';
import { mockLoggedAluno } from '@/data/mocks/usuario';
import type { UsuarioType } from '@/data/types/api';

export const renderWithProviders = (
  ui: ReactElement,
  {
    route = '/',
    user = mockLoggedAluno,
  }: { route?: string; user?: UsuarioType | null } = {}
) =>
  render(
    <QueryProvider>
      <MemoryRouter initialEntries={[route]}>
        <UserProvider initialUser={user}>{ui}</UserProvider>
      </MemoryRouter>
    </QueryProvider>
  );
