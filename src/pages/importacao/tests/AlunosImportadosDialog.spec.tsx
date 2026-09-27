import { fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AlunosImportadosDialog } from '../components/AlunosImportadosDialog';
import { listarAlunosDoLog } from '@/services/importacao';

jest.mock('@/services/importacao', () => ({
  listarAlunosDoLog: jest.fn(),
}));

const mockedAlunos = listarAlunosDoLog as jest.MockedFunction<
  typeof listarAlunosDoLog
>;

const renderDialog = (logId: string | null, onOpenChange = jest.fn()) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={client}>
      <AlunosImportadosDialog
        logId={logId}
        nomeEvento="Beira Linha 2026"
        onOpenChange={onOpenChange}
      />
    </QueryClientProvider>
  );
};

describe('AlunosImportadosDialog', () => {
  beforeEach(() => {
    mockedAlunos.mockReset();
  });

  it('stays closed without a log', () => {
    mockedAlunos.mockResolvedValue([]);
    renderDialog(null);

    expect(
      screen.queryByRole('heading', { name: 'Alunos importados' })
    ).not.toBeInTheDocument();
    expect(mockedAlunos).not.toHaveBeenCalled();
  });

  it('lists the students without a password column', async () => {
    mockedAlunos.mockResolvedValue([
      { nome: 'Maria Silva', email: 'maria@email.com', apelido: 'maria' },
      { nome: 'João', email: null, apelido: null },
    ]);
    renderDialog('log-1');

    expect(
      await screen.findByRole('heading', { name: 'Alunos importados' })
    ).toBeInTheDocument();
    expect(screen.getByText('Beira Linha 2026')).toBeInTheDocument();
    expect(await screen.findByText('Maria Silva')).toBeInTheDocument();
    expect(screen.getByText('maria@email.com')).toBeInTheDocument();
    expect(screen.getAllByText('—')).toHaveLength(2);
    expect(
      screen.queryByRole('columnheader', { name: 'Senha' })
    ).not.toBeInTheDocument();
    expect(mockedAlunos).toHaveBeenCalledWith('log-1');
  });

  it('shows the empty and error states', async () => {
    mockedAlunos.mockResolvedValue([]);
    const { rerender } = renderDialog('log-1');

    expect(
      await screen.findByText('Nenhum aluno nesta importação.')
    ).toBeInTheDocument();

    mockedAlunos.mockRejectedValue(new Error('falha'));
    rerender(
      <QueryClientProvider
        client={
          new QueryClient({ defaultOptions: { queries: { retry: false } } })
        }
      >
        <AlunosImportadosDialog
          logId="log-2"
          nomeEvento="Beira Linha 2026"
          onOpenChange={jest.fn()}
        />
      </QueryClientProvider>
    );

    expect(
      await screen.findByText('Não foi possível carregar os alunos.')
    ).toBeInTheDocument();
  });

  it('closes when the dialog is dismissed', async () => {
    const onOpenChange = jest.fn();
    mockedAlunos.mockResolvedValue([]);
    renderDialog('log-1', onOpenChange);

    fireEvent.click(await screen.findByRole('button', { name: 'Close' }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
