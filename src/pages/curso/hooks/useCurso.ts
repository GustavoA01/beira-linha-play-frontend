import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { courseKeys } from '@/lib/queryClientKeys';
import { getCourse } from '@/services/cursos';
import { useQueries } from '@tanstack/react-query';
import { moduleKeys } from '@/lib/queryClientKeys';
import { toModule } from '@/pages/modulo/utils';
import { toCourse } from '@/pages/cursos/utils';
import { useAuthUser } from '@/providers/UserProvider';
import { getModule } from '@/services/modulos';
import { useState } from 'react';
import type { ModuloType } from '@/data/types/api';

export const useCurso = () => {
  const { cursoId } = useParams();
  const { data, isPending, isError } = useQuery({
    queryKey: courseKeys.detail(cursoId ?? ''),
    queryFn: () => getCourse(cursoId!),
    enabled: Boolean(cursoId),
  });
  const moduleDetails = useQueries({
    queries: (data?.modulos ?? []).map((modulo) => ({
      queryKey: moduleKeys.detail(modulo.id),
      queryFn: async () => toModule(await getModule(modulo.id)),
    })),
  });
  const curso = data ? toCourse(data) : undefined;
  const { isAluno, isMonitor } = useAuthUser();

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
    moduleDetails,
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
  };
};
