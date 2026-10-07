import { useAuthUser } from '@/providers/UserProvider';
import { Navigate } from 'react-router-dom';
import { AlunosImportadosDialog } from './components/AlunosImportadosDialog';
import { useImportacao } from './hooks/useImportacao';
import { Header } from './components/Header';
import { CoursesTable } from './components/CoursesTable';
import { ImportacaoForm } from './components/ImportacaoForm';

export const ImportacaoPage = () => {
  const { isAdmin } = useAuthUser();
  const {
    errors,
    isSubmitting,
    onSubmit,
    ano,
    referencia,
    anoAtual,
    anos,
    eventos,
    eventosPendentes,
    eventosComErro,
    logs,
    logsPendentes,
    logsComErro,
    logAberto,
    nomeLogAberto,
    abrirLog,
    trocarAno,
    trocarReferencia,
    cursos,
    selecionados,
    cursosPendentes,
    cursosComErro,
    alternarCurso,
    alternarTodos,
  } = useImportacao();

  if (!isAdmin) return <Navigate to="/cursos" replace />;

  return (
    <div className="container mx-auto flex min-h-0 flex-1 flex-col overflow-y-auto custom-bar px-4 py-6 sm:px-8">
      <Header anoAtual={anoAtual} />

      <ImportacaoForm
        ano={ano}
        anos={anos}
        trocarAno={trocarAno}
        referencia={referencia}
        trocarReferencia={trocarReferencia}
        eventos={eventos}
        eventosPendentes={eventosPendentes}
        eventosComErro={eventosComErro}
        erroReferencia={errors.referencia?.message}
        cursos={cursos}
        selecionados={selecionados}
        cursosPendentes={cursosPendentes}
        cursosComErro={cursosComErro}
        alternarCurso={alternarCurso}
        alternarTodos={alternarTodos}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
      />

      <CoursesTable
        logsPendentes={logsPendentes}
        logsComErro={logsComErro}
        logs={logs}
        abrirLog={abrirLog}
      />

      <AlunosImportadosDialog
        logId={logAberto}
        nomeEvento={nomeLogAberto}
        onOpenChange={(aberto) => !aberto && abrirLog(null)}
      />
    </div>
  );
};
