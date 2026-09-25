import type {
  GenerateQuestionsPayloadType,
  GenerateQuestionsResponseType,
} from '@/data/types/services';
import { api } from './api';
import { endpoints } from './endpoints';
import { toFormQuestion } from '@/lib/utils';

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
