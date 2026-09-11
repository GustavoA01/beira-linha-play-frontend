import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { ChatForm } from '../components/ChatForm';

const ChatFormHarness = ({
  isLoading = false,
  canSend,
  onSubmit = jest.fn((event: React.FormEvent<HTMLFormElement>) =>
    event.preventDefault()
  ),
  handleOnKeyDown = jest.fn(),
}: {
  isLoading?: boolean;
  canSend?: boolean;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  handleOnKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
}) => {
  const { register, watch } = useForm<{ message: string }>({
    defaultValues: { message: '' },
  });
  const hasText = !!watch('message')?.trim();

  return (
    <ChatForm
      onSubmit={onSubmit}
      register={register}
      isLoading={isLoading}
      canSend={canSend ?? hasText}
      handleOnKeyDown={handleOnKeyDown}
    />
  );
};

const submitButton = () => screen.getByRole('button', { name: 'Enviar' });

describe('ChatForm', () => {
  it('shows the idle placeholder with a dimmed send button', () => {
    render(<ChatFormHarness />);

    expect(
      screen.getByPlaceholderText('Crie perguntas de três níveis sobre...')
    ).toBeInTheDocument();
    expect(submitButton()).toBeDisabled();
  });

  it('enables send when there is text and submits the form', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn((event: React.FormEvent<HTMLFormElement>) =>
      event.preventDefault()
    );

    render(<ChatFormHarness onSubmit={onSubmit} />);

    await user.type(
      screen.getByPlaceholderText('Crie perguntas de três níveis sobre...'),
      'crie 2 perguntas'
    );
    expect(submitButton()).toBeEnabled();

    await user.click(submitButton());

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('disables the field while loading', () => {
    render(<ChatFormHarness isLoading canSend />);

    expect(screen.getByPlaceholderText('Aguarde a resposta...')).toBeDisabled();
    expect(submitButton()).toBeDisabled();
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  it('forwards Enter on the textarea', async () => {
    const user = userEvent.setup();
    const handleOnKeyDown = jest.fn();

    render(<ChatFormHarness handleOnKeyDown={handleOnKeyDown} />);

    await user.type(
      screen.getByPlaceholderText('Crie perguntas de três níveis sobre...'),
      'oi{Enter}'
    );

    expect(handleOnKeyDown).toHaveBeenCalled();
  });
});
