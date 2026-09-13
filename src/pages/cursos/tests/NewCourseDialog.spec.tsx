import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NewCourseDialog } from '../components/NewCourseDialog';
import { listMonitors } from '@/services/usuarios';

jest.mock('@/services/cursos', () => ({
  listCourses: jest.fn(),
  createCourse: jest.fn(),
  updateCourse: jest.fn(),
  deleteCourse: jest.fn(),
}));

jest.mock('@/services/usuarios', () => ({
  listMonitors: jest.fn(),
}));

const mockedListMonitors = listMonitors as jest.MockedFunction<
  typeof listMonitors
>;

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

describe('NewCourseDialog', () => {
  beforeEach(() => {
    mockedListMonitors.mockReset();
    mockedListMonitors.mockResolvedValue([
      {
        id: 'monitor-1',
        nome: 'Maria Souza',
        tipo: 'MONITOR',
        email: 'maria.souza@pucminas.br',
        cursoIds: [],
      },
    ]);
  });

  it('shows the form when open', async () => {
    renderDialog(<NewCourseDialog open onOpenChange={jest.fn()} />);

    expect(
      screen.getByRole('heading', { name: 'Novo curso' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(await screen.findByText('Selecione um monitor')).toBeInTheDocument();
  });

  it('does not render the content when closed', () => {
    renderDialog(<NewCourseDialog open={false} onOpenChange={jest.fn()} />);

    expect(
      screen.queryByRole('heading', { name: 'Novo curso' })
    ).not.toBeInTheDocument();
  });

  it('closes when cancelled', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();

    renderDialog(<NewCourseDialog open onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
