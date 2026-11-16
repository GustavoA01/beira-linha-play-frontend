import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActivityCard } from '../components/ActivityCard';
import type { AtividadeType } from '@/data/types/api';

const activity = (overrides: Partial<AtividadeType> = {}): AtividadeType => ({
  id: 'atividade-1',
  titulo: 'Limites',
  quantQuestoes: 1,
  moduloId: 'modulo-1',
  questoes: [],
  ...overrides,
});

describe('ActivityCard', () => {
  it('shows one attempt when the activity does not allow another', () => {
    render(
      <ActivityCard
        activity={activity({ permiteMaisTentativas: false })}
        usedAttempts={0}
        bestScore={0}
        isStaff={false}
        canManage={false}
        onClick={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText('0/1 tentativas')).toBeInTheDocument();
  });

  it('does not open a locked activity for the student', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(
      <ActivityCard
        activity={activity({ bloqueada: true })}
        usedAttempts={0}
        bestScore={0}
        isStaff={false}
        canManage={false}
        onClick={onClick}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByLabelText('Atividade bloqueada')).toBeInTheDocument();
    await user.click(screen.getByText('Limites'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('toggles the lock without opening the activity', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    const onToggleBlock = jest.fn();

    render(
      <ActivityCard
        activity={activity()}
        usedAttempts={0}
        bestScore={0}
        isStaff
        canManage
        onToggleBlock={onToggleBlock}
        onClick={onClick}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    await user.click(
      screen.getByRole('button', { name: 'Bloquear atividade' })
    );
    expect(onToggleBlock).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });
});
