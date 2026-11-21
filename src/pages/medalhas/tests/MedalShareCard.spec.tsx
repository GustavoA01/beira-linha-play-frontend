import { render, screen } from '@testing-library/react';
import { DESAFIO_PHRASE, achievementCode } from '@/pages/mapa/utils';
import { MedalShareCard } from '../components/MedalShareCard';

describe('MedalShareCard', () => {
  it('shows the medal, the challenge phrase and a stable code', () => {
    const code = achievementCode('aluno-1', 'medal-1');

    render(
      <MedalShareCard
        alunoNome="Gustavo Aguiar"
        medalhaNome="PUC Minas"
        imagemUrl="https://example.com/puc.png"
        code={code}
      />
    );

    expect(screen.getByText('PUC Minas')).toBeInTheDocument();
    expect(screen.getByText('Gustavo Aguiar')).toBeInTheDocument();
    expect(screen.getByText(DESAFIO_PHRASE)).toBeInTheDocument();
    expect(screen.getByText(`Código ${code}`)).toBeInTheDocument();
    expect(
      screen.getByText(`Código ${achievementCode('aluno-1', 'medal-1')}`)
    ).toBeInTheDocument();
    expect(achievementCode('aluno-1', 'medal-2')).not.toBe(code);
  });
});
