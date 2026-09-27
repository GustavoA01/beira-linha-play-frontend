import type { ComponentProps, FormEvent } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ImportacaoForm } from '../components/ImportacaoForm';

const evento = {
  referencia: 'referencia-opaca',
  nome: 'Beira Linha 2026',
  inicio: '01/03/2026',
  fim: '01/06/2026',
};

const renderForm = (
  props: Partial<ComponentProps<typeof ImportacaoForm>> = {}
) => {
  const trocarAno = jest.fn();
  const trocarReferencia = jest.fn();
  const onSubmit = jest.fn((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  });

  const view = render(
    <ImportacaoForm
      ano={2026}
      anos={[2026, 2025]}
      trocarAno={trocarAno}
      referencia=""
      trocarReferencia={trocarReferencia}
      eventos={[evento]}
      eventosPendentes={false}
      eventosComErro={false}
      isSubmitting={false}
      onSubmit={onSubmit}
      {...props}
    />
  );

  return { ...view, trocarAno, trocarReferencia, onSubmit };
};

const nativeSelects = () => document.querySelectorAll('select');

describe('ImportacaoForm', () => {
  it('shows the loading placeholder and blocks the submit', () => {
    renderForm({ eventosPendentes: true, eventos: [] });

    expect(screen.getByText('Carregando eventos…')).toBeInTheDocument();
    expect(screen.getByLabelText('Evento')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Importar' })).toBeDisabled();
  });

  it('shows the feedback when events fail or the year has none', () => {
    const { rerender } = renderForm({ eventosComErro: true, eventos: [] });

    expect(
      screen.getByText('Não foi possível carregar os eventos.')
    ).toBeInTheDocument();

    rerender(
      <ImportacaoForm
        ano={2026}
        anos={[2026, 2025]}
        trocarAno={jest.fn()}
        referencia=""
        trocarReferencia={jest.fn()}
        eventos={[]}
        eventosPendentes={false}
        eventosComErro={false}
        isSubmitting={false}
        onSubmit={jest.fn()}
      />
    );

    expect(
      screen.getByText('Nenhum evento publicado nesse ano.')
    ).toBeInTheDocument();
  });

  it('shows the event error and a spinner while submitting', () => {
    renderForm({ erroReferencia: 'Campo obrigatório', isSubmitting: true });

    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Importar' })
    ).not.toBeInTheDocument();
  });

  it('changes the year and the event through the form fields', async () => {
    const { trocarAno, trocarReferencia, onSubmit } = renderForm();

    await waitFor(() => {
      expect(nativeSelects()).toHaveLength(2);
    });

    fireEvent.change(nativeSelects()[0], { target: { value: '2025' } });
    fireEvent.change(nativeSelects()[1], {
      target: { value: 'referencia-opaca' },
    });
    fireEvent.submit(
      screen.getByRole('button', { name: 'Importar' }).closest('form')!
    );

    expect(trocarAno).toHaveBeenCalledWith(2025);
    expect(trocarReferencia).toHaveBeenCalledWith('referencia-opaca');
    expect(onSubmit).toHaveBeenCalled();
  });
});
