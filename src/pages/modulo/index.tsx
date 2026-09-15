import { ModuloHeader } from './components/ModuloHeader';
import { useMediaDevice } from '@/hooks/useMediaDevice';
import { ActivityCard } from './components/ActivityCard';
import { useState } from 'react';
import { NewActivityDialog } from './features/NewActivityDialog/container/NewActivityDialog';
import { DeleteActivityDialog } from './components/DeleteActivityDialog';
import { useNavigate, useParams } from 'react-router-dom';
import { countStudentAttempts, bestStudentScore } from '@/data/tentativas';
import { useAuthUser } from '@/providers/UserProvider';
import { cn } from '@/lib/utils';
import { ResourceNotFound } from '@/components/ResourceNotFound';
import { useQuery } from '@tanstack/react-query';
import { getCourse } from '@/services/cursos';
import { getModule } from '@/services/modulos';
import { listMyAttempts } from '@/services/tentativas';
import { attemptKeys, courseKeys, moduleKeys } from '@/lib/queryClientKeys';
import { toModule } from './utils';
import { HeaderListPageSkeleton } from '@/components/PageSkeleton';
import type { AtividadeType } from '@/data/types/api';
import { useDeleteActivity } from './hooks/useMutation';

export const ModulePage = () => {
  const navigate = useNavigate();
  const { cursoId, moduloId } = useParams();
  const { isAluno, isMonitor, user } = useAuthUser();
  const { containerClassName } = useMediaDevice();
  const [openActivityDialog, setOpenActivityDialog] = useState(false);
  const [editingActivity, setEditingActivity] = useState<AtividadeType>();
  const [activityToDelete, setActivityToDelete] = useState<AtividadeType>();
  const { mutate: removeActivity, isPending: isDeleting } = useDeleteActivity(
    moduloId ?? ''
  );
  const { data, isPending, isError } = useQuery({
    queryKey: moduleKeys.detail(moduloId ?? ''),
    queryFn: async () => toModule(await getModule(moduloId!)),
    enabled: Boolean(moduloId),
  });
  const { data: course } = useQuery({
    queryKey: courseKeys.detail(cursoId ?? ''),
    queryFn: () => getCourse(cursoId!),
    enabled: Boolean(cursoId) && isMonitor,
  });
  const {
    data: attempts = [],
    isPending: isAttemptsPending,
    isError: isAttemptsError,
  } = useQuery({
    queryKey: attemptKeys.mine(),
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

  if (!moduloId) return <ResourceNotFound label="Módulo não encontrado" />;

  if (isPending || (isAluno && isAttemptsPending)) {
    return <HeaderListPageSkeleton />;
  }

  if (isError || !modulo) {
    return <ResourceNotFound label="Não foi possível carregar o módulo" />;
  }

  if (isAluno && isAttemptsError) {
    return <ResourceNotFound label="Não foi possível carregar as tentativas" />;
  }

  return (
    <>
      <div className="flex flex-col h-dvh overflow-hidden">
        <ModuloHeader
          modulo={modulo}
          isAluno={isAluno}
          isMonitor={isMonitor}
          setOpenActivityDialog={() => {
            setEditingActivity(undefined);
            setOpenActivityDialog(true);
          }}
        />

        <div
          className={cn(
            'flex flex-col max-sm:pb-20 custom-bar gap-4 overflow-auto',
            containerClassName
          )}
        >
          {modulo.atividades.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground font-montserrat">
              Nenhuma atividade cadastrada.
            </p>
          ) : (
            modulo.atividades.map((atividade) => (
              <ActivityCard
                key={atividade.id}
                activity={atividade}
                isMonitor={isMonitor}
                onClick={() => onClickActivity(atividade.id)}
                onEdit={() => {
                  setOpenActivityDialog(true);
                  setEditingActivity(atividade);
                }}
                onDelete={() => setActivityToDelete(atividade)}
                usedAttempts={countStudentAttempts(
                  attempts,
                  user.id,
                  atividade.id
                )}
                bestScore={bestStudentScore(attempts, user.id, atividade.id)}
              />
            ))
          )}
        </div>
      </div>

      <NewActivityDialog
        openActivityDialog={openActivityDialog}
        setOpenActivityDialog={handleActivityDialogChange}
        atividade={editingActivity}
      />
      <DeleteActivityDialog
        open={Boolean(activityToDelete)}
        onOpenChange={(open) => {
          if (!open) setActivityToDelete(undefined);
        }}
        activityName={activityToDelete?.titulo ?? ''}
        codigoAcesso={course?.codigoAcesso ?? ''}
        isPending={isDeleting}
        onConfirm={() => {
          if (!activityToDelete) return;
          removeActivity(activityToDelete.id);
          setActivityToDelete(undefined);
        }}
      />
    </>
  );
};
