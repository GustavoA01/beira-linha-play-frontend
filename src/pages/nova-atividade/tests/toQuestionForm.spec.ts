import { toQuestionForm } from '../utils';
import type { ActivityResponseType } from '@/data/types/services';

const activity: ActivityResponseType = {
  id: 'atividade-1',
  titulo: 'Limites',
  quantQuestoes: 1,
  moduloId: 'modulo-1',
  questoes: [
    {
      id: 'q1',
      enunciado: 'Quanto vale o limite?',
      valor: 10,
      alternativas: [
        { id: 'a1', descricao: '0', correta: false },
        { id: 'a2', descricao: '1', correta: true },
      ],
    },
  ],
};

describe('toQuestionForm', () => {
  it('maps the activity into the question form and pads alternatives', () => {
    expect(toQuestionForm(activity)).toEqual({
      questions: [
        {
          statement: 'Quanto vale o limite?',
          xp: 3,
          alternatives: [
            { text: '0', isCorrect: false },
            { text: '1', isCorrect: true },
            { text: 'ignore', isCorrect: false },
            { text: 'ignore', isCorrect: false },
          ],
        },
      ],
    });
  });
});
