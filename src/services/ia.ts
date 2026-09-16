import type { QuestionFormType } from '@/data/schemas/activity';
import type {
  GenerateQuestionsPayloadType,
  GenerateQuestionsResponseType,
} from '@/data/types/services';
import { api } from './api';
import { endpoints } from './endpoints';

const toFormQuestion = (
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

export const generateQuestions = async (
  moduleId: string,
  payload: GenerateQuestionsPayloadType
) => {
  const { data } = await api.post<GenerateQuestionsResponseType>(
    endpoints.modules.generateQuestions(moduleId),
    payload
  );
  return data.questoes.map(toFormQuestion);
};
