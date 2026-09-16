import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryClientKeys } from '@/lib/queryClientKeys';
import { toModule } from '../utils';
import { getCourse } from '@/services/cursos';
import { getModule } from '@/services/modulos';
import { listMyAttempts } from '@/services/tentativas';
import type { AtividadeType } from '@/data/types/api';
import { useNavigate } from 'react-router-dom';

export const useModulo = (
  moduloId: string,
  isAluno: boolean,
  isMonitor: boolean,
  cursoId: string
) => {
  const navigate = useNavigate();
  const [openActivityDialog, setOpenActivityDialog] = useState(false);
  const [editingActivity, setEditingActivity] = useState<AtividadeType>();
  const [activityToDelete, setActivityToDelete] = useState<AtividadeType>();

  const { data, isPending, isError } = useQuery({
    queryKey: queryClientKeys.moduleKeys.detail(moduloId ?? ''),
    queryFn: async () => toModule(await getModule(moduloId!)),
    enabled: Boolean(moduloId),
  });

  const { data: course } = useQuery({
    queryKey: queryClientKeys.courseKeys.detail(cursoId ?? ''),
    queryFn: () => getCourse(cursoId!),
    enabled: Boolean(cursoId) && isMonitor,
  });

  const {
    data: attempts = [],
    isPending: isAttemptsPending,
    isError: isAttemptsError,
  } = useQuery({
    queryKey: queryClientKeys.attemptKeys.mine(),
    queryFn: () => listMyAttempts(),
    enabled: isAluno,
  });
  const modulo = data;

  const onClickActivity = (activityId?: string) => {
    if (!activityId || !cursoId || !moduloId) return;
    const basePath = `/cursos/${cursoId}/modulos/${moduloId}`;
    if (isMonitor) navigate(`${basePath}/monitoramento/${activityId}`);
    else navigate(`${basePath}/atividade/${activityId}`);
  };

  const handleActivityDialogChange = (open: boolean) => {
    setOpenActivityDialog(open);
    if (!open) setEditingActivity(undefined);
  };

  return {
    openActivityDialog,
    setOpenActivityDialog,
    editingActivity,
    setEditingActivity,
    activityToDelete,
    setActivityToDelete,
    modulo,
    isPending,
    isError,
    course,
    attempts,
    isAttemptsPending,
    isAttemptsError,
    onClickActivity,
    handleActivityDialogChange,
  };
};
