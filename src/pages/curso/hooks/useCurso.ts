import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { queryClientKeys } from '@/lib/queryClientKeys';
import { getCourse } from '@/services/cursos';
import { toCourse } from '@/pages/cursos/utils';
import { useAuthUser } from '@/providers/UserProvider';
import { listMyAttempts } from '@/services/tentativas';
import { useState } from 'react';
import type { ModuloType } from '@/data/types/api';
import { useCursoAlocado } from '@/hooks/useCursoAlocado';

export const useCurso = () => {
  const { cursoId } = useParams();
  const { isAluno, isMonitor, user } = useAuthUser();
  const { bloqueado } = useCursoAlocado(cursoId);
  const { data, isPending, isError } = useQuery({
    queryKey: queryClientKeys.courseKeys.detail(cursoId ?? ''),
    queryFn: () => getCourse(cursoId!),
    enabled: Boolean(cursoId) && !bloqueado,
  });
  const { data: attempts = [] } = useQuery({
    queryKey: queryClientKeys.attemptKeys.mine(),
    queryFn: () => listMyAttempts(),
    enabled: isAluno,
  });
  const curso = data ? toCourse(data) : undefined;

  const [openModuleDialog, setOpenModuleDialog] = useState(false);
  const [editingModule, setEditingModule] = useState<ModuloType>();
  const [moduleToDelete, setModuleToDelete] = useState<ModuloType>();

  const handleModuleDialogChange = (open: boolean) => {
    setOpenModuleDialog(open);
    if (!open) setEditingModule(undefined);
  };

  return {
    curso,
    isPending,
    isError,
    attempts,
    alunoId: user.id,
    isAluno,
    isMonitor,
    openModuleDialog,
    setOpenModuleDialog,
    editingModule,
    setEditingModule,
    moduleToDelete,
    setModuleToDelete,
    handleModuleDialogChange,
    cursoId,
    bloqueado,
  };
};
