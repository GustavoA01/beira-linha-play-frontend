import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    expect(screen.getByText('PUC Minas')).toHaveClass('line-clamp-2');
    expect(screen.getByText('20 xp')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Compartilhar' })
    ).not.toBeInTheDocument();
  });

  it('shares without selecting the medal as the profile image', async () => {
    const user = userEvent.setup();
    const selectImage = jest.fn();
    const onShare = jest.fn();

    render(
      <WonMedal
        nome="PUC Minas"
        imagemUrl="https://example.com/puc.png"
        pontosMin={20}
        selectImage={selectImage}
        onShare={onShare}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Compartilhar' }));

    expect(onShare).toHaveBeenCalledTimes(1);
    expect(selectImage).not.toHaveBeenCalled();
  });
});
