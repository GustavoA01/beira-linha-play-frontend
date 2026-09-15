import type { ReactElement } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CoursePage } from '../index';
import { UserProvider } from '@/providers/UserProvider';
import { mockLoggedMonitor } from '@/data/temporaryMocks/monitores';
import { getCourse } from '@/services/cursos';
import { createModule, getModule } from '@/services/modulos';
import type { CourseResponseType } from '@/data/types/services';

jest.mock('@/assets/logo-beira-linha.png', () => 'logo.png');

jest.mock('@/components/ui/toast', () => ({
  toast: { add: jest.fn() },
}));

jest.mock('@/services/cursos', () => ({
  getCourse: jest.fn(),
  listCourses: jest.fn(),
  createCourse: jest.fn(),
  updateCourse: jest.fn(),
  deleteCourse: jest.fn(),
}));

jest.mock('@/services/modulos', () => ({
  getModule: jest.fn(),
  createModule: jest.fn(),
  updateModule: jest.fn(),
  deleteModule: jest.fn(),
}));

const mockedGetCourse = getCourse as jest.MockedFunction<typeof getCourse>;
const mockedCreateModule = createModule as jest.MockedFunction<
  typeof createModule
>;
const mockedGetModule = getModule as jest.MockedFunction<typeof getModule>;

beforeAll(() => {
  class IntersectionObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserverMock,
  });
});

const course: CourseResponseType = {
  id: 'curso-1',
  nome: 'Cálculo 1',
  codigoAcesso: 'ABC123',
  monitorIds: ['monitor-1'],
  modulos: [],
};

const renderPage = (ui: ReactElement) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={client}>
      <UserProvider initialUser={mockLoggedMonitor}>
        <MemoryRouter initialEntries={['/cursos/curso-1']}>
          <Routes>
            <Route path="/cursos/:cursoId" element={ui} />
          </Routes>
        </MemoryRouter>
      </UserProvider>
    </QueryClientProvider>
  );
};

describe('CoursePage', () => {
  beforeEach(() => {
    mockedGetCourse.mockReset();
    mockedCreateModule.mockReset();
    mockedGetModule.mockReset();
    mockedGetCourse.mockResolvedValue(course);
    mockedGetModule.mockResolvedValue({
      id: 'modulo-novo',
      nome: 'Integrais',
      cursoId: 'curso-1',
      atividades: [],
    });
  });

  it('shows the created module from the updated course cache', async () => {
    const user = userEvent.setup();
    mockedCreateModule.mockResolvedValue({
      id: 'modulo-novo',
      nome: 'Integrais',
      cursoId: 'curso-1',
      atividades: [],
    });

    renderPage(<CoursePage />);

    expect(
      await screen.findByText('Nenhum módulo cadastrado.')
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /novo módulo/i }));
    await user.type(screen.getByLabelText('Nome'), 'Integrais');
    await user.click(screen.getByRole('button', { name: 'Adicionar' }));

    await waitFor(() => {
      expect(mockedCreateModule).toHaveBeenCalledWith('curso-1', {
        nome: 'Integrais',
      });
    });
    expect(await screen.findByText('Integrais')).toBeInTheDocument();
    expect(
      screen.queryByText('Nenhum módulo cadastrado.')
    ).not.toBeInTheDocument();
  });

  it('shows the activity count and xp from the module details', async () => {
    mockedGetCourse.mockResolvedValue({
      ...course,
      modulos: [
        {
          id: 'modulo-1',
          nome: 'Limites 45',
          cursoId: 'curso-1',
        },
      ],
    });
    mockedGetModule.mockResolvedValue({
      id: 'modulo-1',
      nome: 'Limites 45',
      cursoId: 'curso-1',
      atividades: [
        {
          id: 'atv-1',
          titulo: 'Noção de limite',
          quantQuestoes: 1,
          moduloId: 'modulo-1',
          xpTotal: 4,
        },
        {
          id: 'atv-2',
          titulo: 'Continuidade',
          quantQuestoes: 1,
          moduloId: 'modulo-1',
          questoes: [{ id: 'q1', enunciado: 'a', valor: 2, alternativas: [] }],
        },
      ],
    });

    renderPage(<CoursePage />);

    expect(await screen.findByText('2 atividades')).toBeInTheDocument();
    expect(screen.getByText('6 XP')).toBeInTheDocument();
  });
});
