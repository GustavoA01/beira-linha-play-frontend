import { achievementCode } from '../utils';

describe('achievementCode', () => {
  it('keeps the same 3-digit code for the same student and level', () => {
    const first = achievementCode('aluno-1', '3');
    const again = achievementCode('aluno-1', '3');

    expect(first).toMatch(/^\d{3}$/);
    expect(again).toBe(first);
  });

  it('changes when the student or the level changes', () => {
    const code = achievementCode('aluno-1', '3');

    expect(achievementCode('aluno-2', '3')).not.toBe(code);
    expect(achievementCode('aluno-1', '4')).not.toBe(code);
  });
});
