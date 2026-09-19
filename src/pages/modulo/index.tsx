import { ModuloHeader } from './components/ModuloHeader';
import { useMediaDevice } from '@/hooks/useMediaDevice';
import { ActivityCard } from './components/ActivityCard';
import { NewActivityDialog } from './features/NewActivityDialog/container/NewActivityDialog';
import { DeleteActivityDialog } from './components/DeleteActivityDialog';
import { useParams } from 'react-router-dom';
import {
  countStudentAttempts,
  bestStudentScore,
  studentAttemptsOnActivity,
} from '@/data/tentativas';
import { useAuthUser } from '@/providers/UserProvider';
import { cn } from '@/lib/utils';
import { ResourceNotFound } from '@/components/ResourceNotFound';
import { HeaderListPageSkeleton } from '@/components/PageSkeleton';
import { useDeleteActivity } from './hooks/useMutation';
import { useModulo } from './hooks/useModulo';

export const ModulePage = () => {
  const { cursoId, moduloId } = useParams();
  const { isAluno, isMonitor, user } = useAuthUser();
  const { containerClassName } = useMediaDevice();
  const { mutate: removeActivity, isPending: isDeleting } = useDeleteActivity(
    moduloId ?? ''
  );
  const {
    modulo,
    isPending,
    isError,
    course,
    attempts,
    isAttemptsPending,
    isAttemptsError,
    onClickActivity,
    handleActivityDialogChange,
    openActivityDialog,
    setOpenActivityDialog,
    editingActivity,
    setEditingActivity,
    activityToDelete,
    setActivityToDelete,
    bloqueado,
  } = useModulo(moduloId ?? '', isAluno, isMonitor, cursoId ?? '');

  if (bloqueado) return null;

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
                attempts={studentAttemptsOnActivity(
                  attempts,
                  user.id,
                  atividade.id
                )}
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
