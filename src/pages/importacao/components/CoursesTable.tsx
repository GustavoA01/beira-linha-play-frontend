import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { LogImportacaoType } from '@/data/types/services';
import { Eye } from 'lucide-react';
import { formatDate } from '../utils';

type CoursesTableProps = {
  logsPendentes: boolean;
  logsComErro: boolean;
  logs: LogImportacaoType[];
  abrirLog: (id: string | null) => void;
};

export const CoursesTable = ({
  logsPendentes,
  logsComErro,
  logs,
  abrirLog,
}: CoursesTableProps) => (
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
              <TableCell>{formatDate(log.dataImportacao)}</TableCell>
              <TableCell>{log.adminNome}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
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
);
