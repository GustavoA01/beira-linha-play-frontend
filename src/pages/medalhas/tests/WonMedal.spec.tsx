import { render, screen } from '@testing-library/react';
import { WonMedal } from '../components/WonMedal';

describe('WonMedal', () => {
  it('shows the earned medal', () => {
    render(
      <WonMedal
        nome="PUC Minas"
        imagemUrl="https://example.com/puc.png"
        pontosMin={20}
      />
    );

    expect(screen.getByAltText('PUC Minas')).toBeInTheDocument();
    expect(screen.getByText('PUC Minas')).toBeInTheDocument();
    expect(screen.getByText('PUC Minas')).toHaveClass('line-clamp-1');
    expect(screen.getByText('20 xp')).toBeInTheDocument();
  });
});
