import type { GenerateQuestionsResponseType } from '@/data/types/services';
import { endpoints } from '../endpoints';
import { api } from '../api';
import { generateQuestions } from '../ia';

jest.mock('../api', () => ({
  api: {
    post: jest.fn(),
  },
}));

const mockedPost = api.post as jest.Mock;

const questao = (
  alternativas: { descricao: string; correta: boolean }[],
  valor = 5
): GenerateQuestionsResponseType['questoes'][number] => ({
  enunciado: 'Quanto vale?',
  valor,
  alternativas,
});

describe('generateQuestions', () => {
  beforeEach(() => {
    mockedPost.mockReset();
  });

  it('keeps only the first correct alternative and pads a pair to four', async () => {
    mockedPost.mockResolvedValue({
      data: {
        questoes: [
          questao([
            { descricao: '0', correta: false },
            { descricao: '1', correta: true },
            { descricao: '2', correta: true },
          ]),
          questao(
            [
              { descricao: 'sim', correta: false },
              { descricao: 'não', correta: true },
            ],
            3
          ),
        ],
      },
    });

    await expect(
      generateQuestions('modulo-1', { mensagem: 'limites' })
    ).resolves.toEqual([
      {
        statement: 'Quanto vale?',
        xp: 5,
        alternatives: [
          { text: '0', isCorrect: false },
          { text: '1', isCorrect: true },
          { text: '2', isCorrect: false },
        ],
      },
      {
        statement: 'Quanto vale?',
        xp: 3,
        alternatives: [
          { text: 'sim', isCorrect: false },
          { text: 'não', isCorrect: true },
          { text: 'ignore', isCorrect: false },
          { text: 'ignore', isCorrect: false },
        ],
      },
    ]);

    expect(mockedPost).toHaveBeenCalledWith(
      endpoints.modules.generateQuestions('modulo-1'),
      { mensagem: 'limites' }
    );
  });

  it('marks the first alternative when none is correct', async () => {
    mockedPost.mockResolvedValue({
      data: {
        questoes: [
          questao([
            { descricao: 'a', correta: false },
            { descricao: 'b', correta: false },
            { descricao: 'c', correta: false },
          ]),
        ],
      },
    });

    const [question] = await generateQuestions('modulo-1', {
      mensagem: 'sem gabarito',
    });

    expect(question.alternatives.map((alt) => alt.isCorrect)).toEqual([
      true,
      false,
      false,
    ]);
  });
});
