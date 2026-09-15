import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { NewActivityDialog } from '../features/NewActivityDialog/container/NewActivityDialog';
import { NEW_ACTIVITY_STORAGE_KEY } from '@/data/newActivityStorage';
import type { AtividadeType } from '@/data/types/api';

const atividade: AtividadeType = {
  id: 'atividade-1',
  titulo: 'Limites',
  quantQuestoes: 2,
  moduloId: 'modulo-1',
  questoes: [],
};

const renderDialog = (ui: ReactElement) =>
  render(
    <MemoryRouter initialEntries={['/cursos/curso-1/modulos/modulo-1']}>
      <Routes>
        <Route path="/cursos/:cursoId/modulos/:moduloId" element={ui} />
        <Route
          path="/cursos/:cursoId/modulos/:moduloId/nova-atividade"
          element={<p>Formulário de criação</p>}
        />
        <Route
          path="/cursos/:cursoId/modulos/:moduloId/nova-atividade/:atividadeId"
          element={<p>Formulário de edição</p>}
        />
      </Routes>
    </MemoryRouter>
  );

describe('NewActivityDialog', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('creates a draft and goes to the question form', async () => {
    const user = userEvent.setup();

    renderDialog(
      <NewActivityDialog openActivityDialog setOpenActivityDialog={jest.fn()} />
    );

    expect(
      screen.getByRole('heading', { name: 'Nova Atividade' })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Max: 10')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('Nome da atividade'), 'Quiz');
    await user.type(screen.getByPlaceholderText('Max: 10'), '2');
    await user.click(screen.getByRole('button', { name: 'Continuar' }));

    expect(
      await screen.findByText('Formulário de criação')
    ).toBeInTheDocument();
    expect(localStorage.getItem(NEW_ACTIVITY_STORAGE_KEY)).toContain('Quiz');
  });

  it('hides the question count and continues to edit the existing activity', async () => {
    const user = userEvent.setup();

    renderDialog(
      <NewActivityDialog
        openActivityDialog
        setOpenActivityDialog={jest.fn()}
        atividade={atividade}
      />
    );

    expect(
      screen.getByRole('heading', { name: 'Editar atividade' })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nome da atividade')).toHaveValue(
      'Limites'
    );
    expect(screen.queryByPlaceholderText('Max: 10')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Continuar' }));

    expect(await screen.findByText('Formulário de edição')).toBeInTheDocument();
  });
});
