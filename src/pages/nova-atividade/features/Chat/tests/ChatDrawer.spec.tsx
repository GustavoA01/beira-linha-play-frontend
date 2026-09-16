import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ChatDrawer } from '../container/ChatDrawer';
import type { QuestionFormType } from '@/data/schemas/activity';

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children?: string }) => <div>{children}</div>,
}));

jest.mock('@/hooks/useMediaDevice', () => ({
  useMediaDevice: () => ({ isDesktop: true, containerClassName: '' }),
}));

const DrawerHarness = () => {
  const methods = useForm<QuestionFormType>({
    defaultValues: { questions: [] },
  });

  return (
    <FormProvider {...methods}>
      <ChatDrawer />
    </FormProvider>
  );
};

describe('ChatDrawer', () => {
  it('opens the chat from the trigger', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter
        initialEntries={['/cursos/curso-1/modulos/modulo-1/nova-atividade']}
      >
        <Routes>
          <Route
            path="/cursos/:cursoId/modulos/:moduloId/nova-atividade"
            element={<DrawerHarness />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Gerador de atividades')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button'));

    expect(
      await screen.findByText('Gerador de atividades')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Peça perguntas para o gerador de atividades')
    ).toBeInTheDocument();
  });
});
