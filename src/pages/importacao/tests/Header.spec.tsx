import { render, screen } from '@testing-library/react';
import { Header } from '../components/Header';

describe('Header', () => {
  it('explains the default password with the current year', () => {
    render(<Header anoAtual={2026} />);

    expect(
      screen.getByRole('heading', { name: 'Importar dados' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'A senha padrão dos alunos importados é o primeiro nome, em minúsculas, seguido do ano atual.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Exemplo: maria2026.')).toBeInTheDocument();
  });
});
