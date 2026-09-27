import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ListaAlunos } from '@/features/ListaAlunos/components/ListaAlunos';
import { useQuery } from '@tanstack/react-query';
import { listarAlunosDoLog } from '@/services/importacao';

type AlunosImportadosDialogPropsType = {
  logId: string | null;
  nomeEvento: string;
  onOpenChange: (open: boolean) => void;
};

export const AlunosImportadosDialog = ({
  logId,
  nomeEvento,
  onOpenChange,
}: AlunosImportadosDialogPropsType) => {
  const alunos = useQuery({
    queryKey: ['importacao', 'logs', logId, 'alunos'],
    queryFn: () => listarAlunosDoLog(logId ?? ''),
    enabled: logId != null,
  });

  return (
    <Dialog open={logId != null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Alunos importados</DialogTitle>
          <DialogDescription>{nomeEvento}</DialogDescription>
        </DialogHeader>
        {alunos.isPending && (
          <p className="font-montserrat text-sm text-muted-foreground">
            Carregando alunos…
          </p>
        )}
        {alunos.isError && (
          <p className="font-montserrat text-sm text-destructive">
            Não foi possível carregar os alunos.
          </p>
        )}
        {alunos.data && alunos.data.length === 0 && (
          <p className="font-montserrat text-sm text-muted-foreground">
            Nenhum aluno nesta importação.
          </p>
        )}
        {alunos.data && alunos.data.length > 0 && (
          <div className="max-h-[60vh] overflow-y-auto">
            <ListaAlunos alunos={alunos.data} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
