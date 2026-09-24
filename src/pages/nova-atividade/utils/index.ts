import type { QuestionFormType } from '@/data/schemas/activity';
import type {
  ActivityResponseType,
  SaveActivityPayloadType,
} from '@/data/types/services';

const ignoredAlternative = () => ({ text: 'ignore', isCorrect: false });
const emptyAlternative = () => ({ text: '', isCorrect: false });

export const toQuestionForm = (
  activity: ActivityResponseType
): QuestionFormType => ({
  questions: (activity.questoes ?? []).map((questao) => {
    const mapped = (questao.alternativas ?? []).map((alternativa) => ({
      text: alternativa.descricao,
      isCorrect: alternativa.correta ?? false,
    }));

    while (mapped.length < 2) mapped.push(emptyAlternative());
    while (mapped.length < 4) mapped.push(ignoredAlternative());

    return {
      statement: questao.enunciado,
      xp: Math.min(3, Math.max(1, questao.valor)),
      alternatives: mapped.slice(0, 4),
    };
  }),
});

export const toSaveActivityPayload = (
  titulo: string,
  questions: QuestionFormType['questions']
): SaveActivityPayloadType => ({
  titulo,
  questoes: questions.map((question) => ({
    enunciado: question.statement,
    valor: question.xp,
    alternativas: question.alternatives
      .filter((alternative) => alternative.text !== 'ignore')
      .map((alternative) => ({
        descricao: alternative.text,
        correta: alternative.isCorrect,
      })),
  })),
});

export const emptyQuestion = () => ({
  statement: '',
  xp: 1,
  alternatives: [
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ],
});

export const radioValueFor = (questionNumber: number, alternativeIndex: number) =>
  `id-question-${questionNumber - 1}-alternative-${alternativeIndex}`;