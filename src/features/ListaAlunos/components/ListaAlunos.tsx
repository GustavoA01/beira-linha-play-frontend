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
};

export const ListaAlunos = ({ alunos }: ListaAlunosPropsType) => (
  <Table className="font-montserrat">
    <TableHeader>
      <TableRow>
        <TableHead>Nome</TableHead>
        <TableHead>E-mail</TableHead>
        <TableHead>Apelido</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {alunos.map((aluno, indice) => (
        <TableRow key={`${indice}-${aluno.apelido ?? aluno.nome}`}>
          <TableCell>{aluno.nome}</TableCell>
          <TableCell>{aluno.email ?? '—'}</TableCell>
          <TableCell>{aluno.apelido ?? '—'}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
