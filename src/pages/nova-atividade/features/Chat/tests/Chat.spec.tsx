import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { Chat } from '../container/Chat';
import { generateContent } from '@/services/googleConfig';
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

jest.mock('@/services/googleConfig', () => ({
  generateContent: jest.fn(),
}));

const mockedGenerateContent = generateContent as jest.MockedFunction<
  typeof generateContent
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

const generatedJson = JSON.stringify({
  questions: [
    {
      statement: 'O que é uma lista?',
      xp: 1,
      alternatives: [
        { text: 'Uma coleção', isCorrect: true },
        { text: 'Um número', isCorrect: false },
      ],
    },
  ],
});

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
    mockedGenerateContent.mockReset();
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

    render(<ChatHarness />);

    expect(screen.getByText('Crie perguntas sobre listas')).toBeInTheDocument();
  });

  it('shows the empty state', () => {
    render(<ChatHarness />);

    expect(
      screen.getByText('Peça perguntas para o gerador de atividades')
    ).toBeInTheDocument();
    expect(screen.queryByTitle('Limpar conversa')).not.toBeInTheDocument();
  });

  it('sends a prompt and shows the generated question', async () => {
    mockedGenerateContent.mockResolvedValue(generatedJson);
    setNewActivityStorage({
      activityName: 'Listas',
      qtdQuestions: 2,
      messages: [],
    });
    render(<ChatHarness />);

    await typeAndSend('Crie 1 pergunta sobre listas');

    expect(
      await screen.findByText('Crie 1 pergunta sobre listas')
    ).toBeInTheDocument();
    expect(await screen.findByText(/O que é uma lista/)).toBeInTheDocument();
    expect(screen.getByTitle('Limpar conversa')).toBeInTheDocument();

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
    mockedGenerateContent.mockResolvedValue(generatedJson);
    render(<ChatHarness />);

    await typeAndSend('Crie 1 pergunta sobre listas');
    await userEvent
      .setup()
      .click(await screen.findByRole('button', { name: 'Adicionar' }));

    expect(screen.getByTestId('slot-0')).toHaveTextContent(
      'O que é uma lista?'
    );
  });

  it('clears the conversation', async () => {
    mockedGenerateContent.mockResolvedValue(generatedJson);
    render(<ChatHarness />);

    const user = await typeAndSend('Crie 1 pergunta sobre listas');
    await screen.findByText(/O que é uma lista/);
    await user.click(screen.getByTitle('Limpar conversa'));

    expect(
      screen.getByText('Peça perguntas para o gerador de atividades')
    ).toBeInTheDocument();
    expect(screen.queryByText(/O que é uma lista/)).not.toBeInTheDocument();
  });

  it('keeps the user message when generation fails', async () => {
    mockedGenerateContent.mockRejectedValue(new Error('falha'));
    render(<ChatHarness />);

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
    mockedGenerateContent.mockResolvedValue('isso não é json');
    render(<ChatHarness />);

    await typeAndSend('Crie 1 pergunta sobre listas');

    expect(
      await screen.findByText(/Não consegui organizar as perguntas/)
    ).toBeInTheDocument();
  });
});
