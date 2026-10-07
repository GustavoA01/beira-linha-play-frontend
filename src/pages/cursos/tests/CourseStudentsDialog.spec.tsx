import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CourseStudentsDialog } from '../components/CourseStudentsDialog';
import { listCourseStudents, removeCourseStudent } from '@/services/cursos';
import { toast } from '@/components/ui/toast';

jest.mock('@/components/ui/toast', () => ({
  toast: { add: jest.fn() },
}));

jest.mock('@/services/cursos', () => ({
  listCourseStudents: jest.fn(),
  removeCourseStudent: jest.fn(),
}));

const mockedList = listCourseStudents as jest.MockedFunction<
  typeof listCourseStudents
>;
const mockedRemove = removeCourseStudent as jest.MockedFunction<
  typeof removeCourseStudent
>;

const renderDialog = () => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={client}>
      <CourseStudentsDialog
        cursoId="curso-1"
        nomeCurso="Cálculo I"
        onOpenChange={jest.fn()}
      />
    </QueryClientProvider>
  );
};

describe('CourseStudentsDialog', () => {
  beforeEach(() => {
    mockedList.mockReset();
    mockedRemove.mockReset();
    mockedList.mockResolvedValue([
      {
        id: 'aluno-1',
        nome: 'Maria Silva',
        email: 'maria@email.com',
        apelido: 'maria',
      },
    ]);
    mockedRemove.mockResolvedValue(undefined);
  });

  it('removes a student after confirmation', async () => {
    const user = userEvent.setup();
    renderDialog();

    expect(await screen.findByText('Maria Silva')).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Remover Maria Silva' })
    );
    expect(
      await screen.findByRole('heading', { name: 'Remover aluno?' })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remover' }));

    await waitFor(() => {
      expect(mockedRemove).toHaveBeenCalledWith('curso-1', 'aluno-1');
    });
    expect(toast.add).toHaveBeenCalledWith({
      type: 'success',
      title: 'Aluno removido do curso',
    });
  });
});
