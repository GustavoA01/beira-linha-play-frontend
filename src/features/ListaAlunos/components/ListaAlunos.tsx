import { Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { AlunoResumoType } from '@/data/types/services';

type ListaAlunosPropsType = {
  alunos: AlunoResumoType[];
  onRemove?: (aluno: AlunoResumoType) => void;
};

export const ListaAlunos = ({ alunos, onRemove }: ListaAlunosPropsType) => (
  <Table className="font-montserrat">
    <TableHeader>
      <TableRow>
        {onRemove && <TableHead className="w-10" />}
        <TableHead>Nome</TableHead>
        <TableHead>E-mail</TableHead>
        <TableHead>Apelido</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {alunos.map((aluno) => (
        <TableRow key={aluno.id}>
          {onRemove && (
            <TableCell className="w-10 pr-0">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-destructive hover:text-destructive"
                aria-label={`Remover ${aluno.nome}`}
                onClick={(event) => {
                  event.stopPropagation();
                  onRemove(aluno);
                }}
              >
                <Minus />
              </Button>
            </TableCell>
          )}
          <TableCell>{aluno.nome}</TableCell>
          <TableCell>{aluno.email ?? '—'}</TableCell>
          <TableCell>{aluno.apelido ?? '—'}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
