import { useState } from 'react';
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
import { queryClientKeys } from '@/lib/queryClientKeys';
import type { AlunoResumoType } from '@/data/types/services';
import { useRemoveCourseStudent } from '../hooks/useMutation';
import { RemoveStudentDialog } from './RemoveStudentDialog';

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
  const [alunoParaRemover, setAlunoParaRemover] =
    useState<AlunoResumoType | null>(null);
  const { mutate: removeStudent, isPending } = useRemoveCourseStudent(
    cursoId ?? ''
  );

  const alunos = useQuery({
    queryKey: queryClientKeys.courseKeys.students(cursoId ?? ''),
    queryFn: () => listCourseStudents(cursoId ?? ''),
    enabled: cursoId != null,
  });

  const handleConfirmRemove = () => {
    if (!alunoParaRemover) return;
    removeStudent(alunoParaRemover.id, {
      onSuccess: () => setAlunoParaRemover(null),
    });
  };

  return (
    <>
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
              <ListaAlunos
                alunos={alunos.data}
                onRemove={setAlunoParaRemover}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <RemoveStudentDialog
        open={alunoParaRemover != null}
        onOpenChange={(aberto) => {
          if (!aberto) setAlunoParaRemover(null);
        }}
        studentName={alunoParaRemover?.nome ?? ''}
        courseName={nomeCurso}
        onConfirm={handleConfirmRemove}
        isPending={isPending}
      />
    </>
  );
};
