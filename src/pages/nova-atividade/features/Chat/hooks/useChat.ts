import type { QuestionFormType } from '@/data/schemas/activity';
import {
  getNewActivityStorage,
  setNewActivityChatMessages,
  type NewActivityChatMessageType,
} from '@/data/newActivityStorage';
import { generateContent } from '@/services/googleConfig';
import { useEffect, useState, type KeyboardEvent } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { CHAT_SYSTEM_INSTRUCTION } from '../utils/constants';
import { formatQuestionsMessage } from '../utils/formatQuestionsMessage';
import { parseGeneratedQuestions } from '../utils/parseGeneratedQuestions';

export type ChatMessageType = NewActivityChatMessageType;

const appliedKey = (messageIndex: number, questionIndex: number) =>
  `${messageIndex}-${questionIndex}`;

export const useChat = () => {
  const {
    register,
    handleSubmit,
    reset: resetInput,
  } = useForm<{
    message: string;
  }>();
  const { getValues, setValue, watch } = useFormContext<QuestionFormType>();
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>(
    () => getNewActivityStorage()?.messages ?? []
  );
  const [appliedQuestionKeys, setAppliedQuestionKeys] = useState<string[]>([]);

  useEffect(() => {
    setNewActivityChatMessages(messages);
  }, [messages]);
  const formQuestions = watch('questions');

  const formFull =
    !!formQuestions?.length &&
    formQuestions.every((question) => question.statement.trim() !== '');

  const onSubmit = handleSubmit(async (data: { message: string }) => {
    const userMessage = data.message;

    resetInput({ message: '' });
    setIsLoading(true);

    try {
      const qtdQuestions = getValues('questions')?.length;
      const prompt =
        qtdQuestions > 0
          ? `${userMessage}\n\n(A atividade atual tem ${qtdQuestions} pergunta(s). Se o usuário não pedir outra quantidade, gere exatamente ${qtdQuestions}.)`
          : userMessage;

      const response = await generateContent(prompt, CHAT_SYSTEM_INSTRUCTION);
      const questions = parseGeneratedQuestions(response || '');
      const content = questions
        ? formatQuestionsMessage(questions)
        : 'Não consegui organizar as perguntas no formato da atividade. Tente de novo, por exemplo: “crie 3 perguntas sobre listas”.';

      setMessages((prev) => [
        ...prev,
        { role: 'user', content: userMessage },
        { role: 'assistant', content, questions: questions ?? undefined },
      ]);
    } catch (error) {
      console.error('Erro ao gerar conteúdo', error);
      setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    } finally {
      setIsLoading(false);
    }
  });

  const emptySlotIndexes = (slots: QuestionFormType['questions']) =>
    slots.flatMap((slot, index) => (slot.statement.trim() ? [] : [index]));

  const applyQuestion = (
    question: QuestionFormType['questions'][number],
    messageIndex: number,
    questionIndex: number
  ) => {
    const emptyIndex = emptySlotIndexes(getValues('questions') ?? [])[0];
    if (emptyIndex === undefined) return;

    setValue(`questions.${emptyIndex}`, question, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setAppliedQuestionKeys((prev) => [
      ...prev,
      appliedKey(messageIndex, questionIndex),
    ]);
  };

  const applyAllQuestions = (
    questions: QuestionFormType['questions'],
    messageIndex: number
  ) => {
    const emptyIndexes = emptySlotIndexes(getValues('questions') ?? []);
    const pending = questions.flatMap((question, questionIndex) =>
      appliedQuestionKeys.includes(appliedKey(messageIndex, questionIndex))
        ? []
        : [{ question, questionIndex }]
    );
    const pairs = emptyIndexes
      .slice(0, pending.length)
      .map((slotIndex, i) => ({ slotIndex, ...pending[i] }));

    pairs.forEach(({ slotIndex, question }) => {
      setValue(`questions.${slotIndex}`, question, {
        shouldDirty: true,
        shouldValidate: true,
      });
    });

    if (pairs.length) {
      setAppliedQuestionKeys((prev) => [
        ...prev,
        ...pairs.map(({ questionIndex }) =>
          appliedKey(messageIndex, questionIndex)
        ),
      ]);
    }
  };

  const isQuestionApplied = (messageIndex: number, questionIndex: number) =>
    appliedQuestionKeys.includes(appliedKey(messageIndex, questionIndex));

  const clearMessages = () => {
    setMessages([]);
    setAppliedQuestionKeys([]);
  };

  const handleOnKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter' || e.shiftKey || e.nativeEvent.isComposing) return;
    e.preventDefault();
    e.currentTarget.form?.requestSubmit();
  };

  return {
    messages,
    isLoading,
    onSubmit,
    register,
    applyQuestion,
    applyAllQuestions,
    isQuestionApplied,
    formFull,
    clearMessages,
    handleOnKeyDown,
  };
};
