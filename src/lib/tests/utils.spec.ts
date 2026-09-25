import type { GenerateQuestionsResponseType } from '@/data/types/services';
import { getInitials, toFormQuestion } from '../utils';

const questao = (
  alternativas: { descricao: string; correta: boolean }[],
  valor = 5
): GenerateQuestionsResponseType['questoes'][number] => ({
  enunciado: 'Quanto vale?',
  valor,
  alternativas,
});

describe('getInitials', () => {
  it('uses first letters of the first two names', () => {
    expect(getInitials('Gustavo Aguiar')).toBe('GA');
    expect(getInitials('Maria A.')).toBe('MA');
  });

  it('uses the first two letters of a single name', () => {
    expect(getInitials('Maria')).toBe('MA');
    expect(getInitials('A')).toBe('A');
  });

  it('returns empty for blank names', () => {
    expect(getInitials('')).toBe('');
    expect(getInitials('   ')).toBe('');
  });
});

describe('toFormQuestion', () => {
  it('keeps only the first correct alternative', () => {
    expect(
      toFormQuestion(
        questao([
          { descricao: '0', correta: false },
          { descricao: '1', correta: true },
          { descricao: '2', correta: true },
        ])
      )
    ).toEqual({
      statement: 'Quanto vale?',
      xp: 5,
      alternatives: [
        { text: '0', isCorrect: false },
        { text: '1', isCorrect: true },
        { text: '2', isCorrect: false },
      ],
    });
  });

  it('pads a pair of alternatives to four', () => {
    expect(
      toFormQuestion(
        questao(
          [
            { descricao: 'sim', correta: false },
            { descricao: 'não', correta: true },
          ],
          3
        )
      ).alternatives
    ).toEqual([
      { text: 'sim', isCorrect: false },
      { text: 'não', isCorrect: true },
      { text: 'ignore', isCorrect: false },
      { text: 'ignore', isCorrect: false },
    ]);
  });

  it('marks the first alternative when none is correct', () => {
    expect(
      toFormQuestion(
        questao([
          { descricao: 'a', correta: false },
          { descricao: 'b', correta: false },
          { descricao: 'c', correta: false },
        ])
      ).alternatives.map((alt) => alt.isCorrect)
    ).toEqual([true, false, false]);
  });
});
