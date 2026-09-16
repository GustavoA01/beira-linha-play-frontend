import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Chat } from '../container/Chat';
import { ApiError } from '@/services/api';
import { generateQuestions } from '@/services/ia';
import type { QuestionFormType } from '@/data/schemas/activity';
import type { ReactNode } from 'react';
import {
  NEW_ACTIVITY_STORAGE_KEY,
  setNewActivityStorage,
} from '@/data/newActivityStorage';

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children?: string }) => <div>{children}</div>,
}));

jest.mock('@/components/ui/drawer', () => ({
  DrawerHeader: ({ children }: { children: ReactNode }) => (
    <header>{children}</header>
  ),
  DrawerTitle: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
  DrawerDescription: ({ children }: { children: ReactNode }) => (
    <p>{children}</p>
  ),
  DrawerClose: ({ children }: { children: ReactNode }) => children,
}));

jest.mock('@/services/ia', () => ({
  generateQuestions: jest.fn(),
}));

const mockedGenerateQuestions = generateQuestions as jest.MockedFunction<
  typeof generateQuestions
>;

const emptyQuestion = (): QuestionFormType['questions'][number] => ({
  statement: '',
  xp: 1,
  alternatives: [
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ],
});

const generatedQuestions: QuestionFormType['questions'] = [
  {
    statement: 'O que é uma lista?',
    xp: 1,
    alternatives: [
      { text: 'Uma coleção', isCorrect: true },
      { text: 'Um número', isCorrect: false },
      { text: 'ignore', isCorrect: false },
      { text: 'ignore', isCorrect: false },
    ],
  },
];

const ChatHarness = ({
  questions = [emptyQuestion(), emptyQuestion()],
}: {
  questions?: QuestionFormType['questions'];
}) => {
  const methods = useForm<QuestionFormType>({
    defaultValues: { questions },
  });
  const firstStatement = methods.watch('questions.0.statement');

  return (
    <FormProvider {...methods}>
      <Chat />
      <p data-testid="slot-0">{firstStatement || 'vazio'}</p>
    </FormProvider>
  );
};

const renderChat = (ui: ReactNode = <ChatHarness />) =>
  render(
    <MemoryRouter
      initialEntries={['/cursos/curso-1/modulos/modulo-1/nova-atividade']}
    >
      <Routes>
        <Route
          path="/cursos/:cursoId/modulos/:moduloId/nova-atividade"
          element={ui}
        />
      </Routes>
    </MemoryRouter>
  );

const typeAndSend = async (text: string) => {
  const user = userEvent.setup();
  await user.type(
    screen.getByPlaceholderText('Crie perguntas de três níveis sobre...'),
    text
  );
  await user.click(
    screen
      .getByPlaceholderText('Crie perguntas de três níveis sobre...')
      .closest('form')
      ?.querySelector('button[type="submit"]') as HTMLButtonElement
  );
  return user;
};

describe('Chat', () => {
  beforeEach(() => {
    mockedGenerateQuestions.mockReset();
    localStorage.clear();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('restores chat messages from localStorage', () => {
    setNewActivityStorage({
      activityName: 'Listas',
      qtdQuestions: 2,
      messages: [{ role: 'user', content: 'Crie perguntas sobre listas' }],
    });

    renderChat();

    expect(screen.getByText('Crie perguntas sobre listas')).toBeInTheDocument();
  });

  it('shows the empty state', () => {
    renderChat();

    expect(
      screen.getByText('Peça perguntas para o gerador de atividades')
    ).toBeInTheDocument();
    expect(screen.queryByTitle('Limpar conversa')).not.toBeInTheDocument();
  });

  it('sends a prompt and shows the generated question', async () => {
    mockedGenerateQuestions.mockResolvedValue(generatedQuestions);
    setNewActivityStorage({
      activityName: 'Listas',
      qtdQuestions: 2,
      messages: [],
    });
    renderChat();

    await typeAndSend('Crie 1 pergunta sobre listas');

    expect(
      await screen.findByText('Crie 1 pergunta sobre listas')
    ).toBeInTheDocument();
    expect(await screen.findByText(/O que é uma lista/)).toBeInTheDocument();
    expect(screen.getByTitle('Limpar conversa')).toBeInTheDocument();
    expect(mockedGenerateQuestions).toHaveBeenCalledWith('modulo-1', {
      mensagem: 'Crie 1 pergunta sobre listas',
      quantidadeQuestoes: 2,
    });

    const stored = JSON.parse(
      localStorage.getItem(NEW_ACTIVITY_STORAGE_KEY) ?? '{}'
    );
    expect(stored.messages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          role: 'user',
          content: 'Crie 1 pergunta sobre listas',
        }),
      ])
    );
  });

  it('applies a generated question to the activity form', async () => {
    mockedGenerateQuestions.mockResolvedValue(generatedQuestions);
    renderChat();

    await typeAndSend('Crie 1 pergunta sobre listas');
    await userEvent
      .setup()
      .click(await screen.findByRole('button', { name: 'Adicionar' }));

    expect(screen.getByTestId('slot-0')).toHaveTextContent(
      'O que é uma lista?'
    );
  });

  it('clears the conversation', async () => {
    mockedGenerateQuestions.mockResolvedValue(generatedQuestions);
    renderChat();

    const user = await typeAndSend('Crie 1 pergunta sobre listas');
    await screen.findByText(/O que é uma lista/);
    await user.click(screen.getByTitle('Limpar conversa'));

    expect(
      screen.getByText('Peça perguntas para o gerador de atividades')
    ).toBeInTheDocument();
    expect(screen.queryByText(/O que é uma lista/)).not.toBeInTheDocument();
  });

  it('keeps the user message when generation fails', async () => {
    mockedGenerateQuestions.mockRejectedValue(new Error('falha'));
    renderChat();

    await typeAndSend('Crie 1 pergunta sobre listas');

    expect(
      await screen.findByText('Crie 1 pergunta sobre listas')
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText('Gerando resposta...')).not.toBeInTheDocument();
    });
    expect(screen.queryByText(/O que é uma lista/)).not.toBeInTheDocument();
  });

  it('shows the fallback when the reply is not valid questions', async () => {
    mockedGenerateQuestions.mockRejectedValue(
      new ApiError('Não foi possível organizar as perguntas', 422)
    );
    renderChat();

    await typeAndSend('Crie 1 pergunta sobre listas');

    expect(
      await screen.findByText(/Não consegui organizar as perguntas/)
    ).toBeInTheDocument();
  });
});
