import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ListaAlunos } from '@/features/ListaAlunos/components/ListaAlunos';
import { useQuery } from '@tanstack/react-query';
import { listCourseStudents } from '@/services/cursos';

type CourseStudentsDialogPropsType = {
  cursoId: string | null;
  nomeCurso: string;
  onOpenChange: (open: boolean) => void;
};

export const CourseStudentsDialog = ({
  cursoId,
  nomeCurso,
  onOpenChange,
}: CourseStudentsDialogPropsType) => {
  const alunos = useQuery({
    queryKey: ['courses', cursoId, 'students'],
    queryFn: () => listCourseStudents(cursoId ?? ''),
    enabled: cursoId != null,
  });

  return (
    <Dialog open={cursoId != null} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-3xl"
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Alunos do curso</DialogTitle>
          <DialogDescription>{nomeCurso}</DialogDescription>
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
            Nenhum aluno neste curso.
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
