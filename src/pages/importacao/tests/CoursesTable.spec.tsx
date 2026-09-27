import { fireEvent, render, screen } from '@testing-library/react';
import { CoursesTable } from '../components/CoursesTable';
import type { LogImportacaoType } from '@/data/types/services';

const log: LogImportacaoType = {
  id: 'log-1',
  nomeEvento: 'Beira Linha 2026',
  urlEvento: 'https://sympla.com.br/beira',
  quantidadeAlunos: 2,
  quantidadeCursos: 1,
  dataImportacao: '2026-09-27T15:00:00Z',
  adminNome: 'Administrador',
};

describe('CoursesTable', () => {
  it('shows the loading message', () => {
    render(
      <CoursesTable
        logsPendentes
        logsComErro={false}
        logs={[]}
        abrirLog={jest.fn()}
      />
    );

    expect(screen.getByText('Carregando importações…')).toBeInTheDocument();
  });

  it('shows the error message', () => {
    render(
      <CoursesTable
        logsPendentes={false}
        logsComErro
        logs={[]}
        abrirLog={jest.fn()}
      />
    );

    expect(
      screen.getByText('Não foi possível carregar as importações.')
    ).toBeInTheDocument();
  });

  it('shows the empty message', () => {
    render(
      <CoursesTable
        logsPendentes={false}
        logsComErro={false}
        logs={[]}
        abrirLog={jest.fn()}
      />
    );

    expect(
      screen.getByText('Nenhuma importação realizada.')
    ).toBeInTheDocument();
  });

  it('lists a log and opens its students without a password column', () => {
    const abrirLog = jest.fn();
    render(
      <CoursesTable
        logsPendentes={false}
        logsComErro={false}
        logs={[{ ...log, urlEvento: null, dataImportacao: 'invalida' }]}
        abrirLog={abrirLog}
      />
    );

    expect(screen.getByText('Beira Linha 2026')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.getByText('invalida')).toBeInTheDocument();
    expect(screen.getByText('Administrador')).toBeInTheDocument();
    expect(
      screen.queryByRole('columnheader', { name: 'Senha' })
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Ver alunos' }));

    expect(abrirLog).toHaveBeenCalledWith('log-1');
  });

  it('formats the import date', () => {
    render(
      <CoursesTable
        logsPendentes={false}
        logsComErro={false}
        logs={[log]}
        abrirLog={jest.fn()}
      />
    );

    expect(screen.getByText('27/09/2026')).toBeInTheDocument();
    expect(screen.getByText('https://sympla.com.br/beira')).toBeInTheDocument();
  });
});
