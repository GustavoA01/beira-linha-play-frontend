import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ErrorFormMessage } from '@/components/ErrorFormMessage';
import { useAuthUser } from '@/providers/UserProvider';
import { Eye } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { AlunosImportadosDialog } from './components/AlunosImportadosDialog';
import { useImportacao } from './hooks/useImportacao';

const formatarData = (iso: string) => {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return iso;
  return data.toLocaleDateString('pt-BR');
};

export const ImportacaoPage = () => {
  const { isAdmin } = useAuthUser();
  const {
    register,
    errors,
    isSubmitting,
    onSubmit,
    ano,
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
  } = useImportacao();

  if (!isAdmin) return <Navigate to="/cursos" replace />;

  return (
    <div className="container mx-auto flex min-h-0 flex-1 flex-col overflow-y-auto custom-bar px-4 py-6 sm:px-8">
      <header className="max-w-3xl">
        <h1 className="font-fredoka text-xl font-semibold text-primary-dark md:text-2xl">
          Importar participantes
        </h1>
        <p className="mt-1 text-sm text-zinc-500 sm:text-base">
          Escolha o ano e o evento publicado no Sympla. Essa funcionalidade,
          além dos participantes, também importa os cursos com base nos nomes
          dos ingressos dos inscritos aprovados.
        </p>
        <p className="mt-3 text-sm text-zinc-600 sm:text-base">
          A senha padrão dos alunos importados é o primeiro nome, em minúsculas,
          seguido do ano atual. Exemplo: maria{anoAtual}.
        </p>
      </header>

      <form className="mt-6 max-w-xl space-y-4" onSubmit={onSubmit}>
        <div>
          <Label htmlFor="ano">Ano</Label>
          <select
            id="ano"
            className="border-input mt-1.5 h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            value={ano}
            disabled={isSubmitting}
            onChange={(event) => trocarAno(Number(event.target.value))}
          >
            {anos.map((opcao) => (
              <option key={opcao} value={opcao}>
                {opcao}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="referencia">Evento</Label>
          <select
            id="referencia"
            className="border-input mt-1.5 h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            disabled={isSubmitting || eventosPendentes || eventos.length === 0}
            {...register('referencia')}
          >
            <option value="">
              {eventosPendentes ? 'Carregando eventos…' : 'Selecione o evento'}
            </option>
            {eventos.map((evento) => (
              <option key={evento.referencia} value={evento.referencia}>
                {(evento.nome || 'Evento sem nome') +
                  ' (' +
                  evento.inicio +
                  ' - ' +
                  evento.fim +
                  ')'}
              </option>
            ))}
          </select>
          {errors.referencia?.message && (
            <ErrorFormMessage message={errors.referencia.message} />
          )}
          {eventosComErro && (
            <p className="mt-2 font-montserrat text-sm text-destructive">
              Não foi possível carregar os eventos.
            </p>
          )}
          {!eventosPendentes && !eventosComErro && eventos.length === 0 && (
            <p className="mt-2 font-montserrat text-sm text-muted-foreground">
              Nenhum evento publicado nesse ano.
            </p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting || eventosPendentes}>
          {isSubmitting ? <Spinner /> : 'Importar'}
        </Button>
      </form>

      <section className="mt-8">
        <h2 className="font-fredoka text-lg font-semibold text-primary-dark">
          Importações
        </h2>
        {logsPendentes && (
          <p className="mt-3 font-montserrat text-sm text-muted-foreground">
            Carregando importações…
          </p>
        )}
        {logsComErro && (
          <p className="mt-3 font-montserrat text-sm text-destructive">
            Não foi possível carregar as importações.
          </p>
        )}
        {!logsPendentes && !logsComErro && logs.length === 0 && (
          <p className="mt-3 font-montserrat text-sm text-muted-foreground">
            Nenhuma importação realizada.
          </p>
        )}
        {logs.length > 0 && (
          <Table className="mt-4 font-montserrat">
            <TableHeader>
              <TableRow>
                <TableHead>Evento</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Alunos</TableHead>
                <TableHead>Cursos</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.nomeEvento}</TableCell>
                  <TableCell className="max-w-48 truncate">
                    {log.urlEvento || '—'}
                  </TableCell>
                  <TableCell>{log.quantidadeAlunos}</TableCell>
                  <TableCell>{log.quantidadeCursos}</TableCell>
                  <TableCell>{formatarData(log.dataImportacao)}</TableCell>
                  <TableCell>{log.adminNome}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => abrirLog(log.id)}
                    >
                      <Eye />
                      Ver alunos
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>

      <AlunosImportadosDialog
        logId={logAberto}
        nomeEvento={nomeLogAberto}
        onOpenChange={(aberto) => {
          if (!aberto) abrirLog(null);
        }}
      />
    </div>
  );
};
