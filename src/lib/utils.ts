import { toast } from '@/components/ui/toast';
import type { QuestionFormType } from '@/data/schemas/activity';
import type { GenerateQuestionsResponseType } from '@/data/types/services';
import { ApiError } from '@/services/api';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const toastError = (error: unknown, fallback: string) => {
  console.error(error);
  toast.add({
    type: 'error',
    title: error instanceof ApiError ? error.message : fallback,
  });
};

export const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

export const toFormQuestion = (
  questao: GenerateQuestionsResponseType['questoes'][number]
): QuestionFormType['questions'][number] => {
  const firstCorrect = questao.alternativas.findIndex((alt) => alt.correta);
  const correctIndex = firstCorrect === -1 ? 0 : firstCorrect;
  const alternatives = questao.alternativas.map((alt, index) => ({
    text: alt.descricao,
    isCorrect: index === correctIndex,
  }));

  if (alternatives.length === 2) {
    alternatives.push(
      { text: 'ignore', isCorrect: false },
      { text: 'ignore', isCorrect: false }
    );
  }

  return {
    statement: questao.enunciado,
    xp: questao.valor,
    alternatives,
  };
};
