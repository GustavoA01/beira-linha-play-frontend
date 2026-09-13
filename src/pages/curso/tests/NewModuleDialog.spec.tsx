import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NewModuleDialog } from '../components/NewModuleDialog';

jest.mock('@/services/modulos', () => ({
  createModule: jest.fn(),
  updateModule: jest.fn(),
  deleteModule: jest.fn(),
}));

const renderDialog = (ui: ReactElement) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
};

describe('NewModuleDialog', () => {
  it('shows the form when open', () => {
    renderDialog(
      <NewModuleDialog open onOpenChange={jest.fn()} courseId="curso-1" />
    );

    expect(
      screen.getByRole('heading', { name: 'Novo módulo' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
  });

  it('shows the edit form when a module is passed', () => {
    renderDialog(
      <NewModuleDialog
        open
        onOpenChange={jest.fn()}
        courseId="curso-1"
        modulo={{
          id: 'modulo-1',
          nome: 'Derivadas',
          cursoId: 'curso-1',
          atividades: [],
        }}
      />
    );

    expect(
      screen.getByRole('heading', { name: 'Editar módulo' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Nome')).toHaveValue('Derivadas');
  });

  it('does not render the content when closed', () => {
    renderDialog(
      <NewModuleDialog
        open={false}
        onOpenChange={jest.fn()}
        courseId="curso-1"
      />
    );

    expect(
      screen.queryByRole('heading', { name: 'Novo módulo' })
    ).not.toBeInTheDocument();
  });

  it('closes when cancelled', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();

    renderDialog(
      <NewModuleDialog open onOpenChange={onOpenChange} courseId="curso-1" />
    );

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
