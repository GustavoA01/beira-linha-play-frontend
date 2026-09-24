import { CourseHeader } from './components/CourseHeader';
import { ModuleCard } from './components/ModuleCard';
import { NewModuleDialog } from './components/NewModuleDialog';
import { DeleteModuleDialog } from './components/DeleteModuleDialog';
import { useNavigate } from 'react-router-dom';
import { ResourceNotFound } from '@/components/ResourceNotFound';
import { HeaderListPageSkeleton } from '@/components/PageSkeleton';
import { courseProgressPercent, isModuleConcluded } from '@/data/atividades';
import { useDeleteModule } from './hooks/useMutation';
import { useCurso } from './hooks/useCurso';

export const CoursePage = () => {
  const navigate = useNavigate();
  const {
    curso,
    cursoId,
    isPending,
    isError,
    attempts,
    alunoId,
    isAluno,
    isMonitor,
    editingModule,
    setEditingModule,
    moduleToDelete,
    setModuleToDelete,
    handleModuleDialogChange,
    openModuleDialog,
    setOpenModuleDialog,
    bloqueado,
  } = useCurso();

  const { mutate: removeModule, isPending: isDeleting } = useDeleteModule(
    cursoId ?? ''
  );

  if (bloqueado) return null;
  if (!cursoId || isError)
    return <ResourceNotFound label="Curso não encontrado" />;
  if (isPending) return <HeaderListPageSkeleton />;
  if (!curso) return <ResourceNotFound label="Curso não encontrado" />;

  return (
    <>
      <div className="flex flex-col h-dvh overflow-hidden">
        <CourseHeader
          curso={curso}
          isAluno={isAluno}
          isMonitor={isMonitor}
          progress={
            isAluno ? courseProgressPercent(curso, attempts, alunoId) : 0
          }
          handleNewModule={() => {
            setEditingModule(undefined);
            setOpenModuleDialog(true);
          }}
        />
        <div className="flex-1 min-h-0 custom-bar sm:large-bar -mt-10 overflow-y-auto pb-4 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col pb-20">
            {curso.modulos.length === 0 ? (
              <p className="mt-14 text-sm text-muted-foreground font-montserrat">
                Nenhum módulo cadastrado.
              </p>
            ) : (
              curso.modulos.map((modulo) => (
                <ModuleCard
                  key={modulo.id}
                  modulo={modulo}
                  isMonitor={isMonitor}
                  concluded={
                    isAluno && isModuleConcluded(modulo, attempts, alunoId)
                  }
                  onEdit={() => {
                    setEditingModule(modulo);
                    setOpenModuleDialog(true);
                  }}
                  onDelete={() => setModuleToDelete(modulo)}
                  onClick={() =>
                    navigate(`/cursos/${curso.id}/modulos/${modulo.id}`)
                  }
                />
              ))
            )}
          </div>
        </div>
      </div>

      <NewModuleDialog
        open={openModuleDialog}
        onOpenChange={handleModuleDialogChange}
        courseId={cursoId}
        modulo={editingModule}
      />
      <DeleteModuleDialog
        open={Boolean(moduleToDelete)}
        onOpenChange={(open) => !open && setModuleToDelete(undefined)}
        moduleName={moduleToDelete?.nome ?? ''}
        codigoAcesso={curso.codigoAcesso}
        isPending={isDeleting}
        onConfirm={() => {
          if (!moduleToDelete) return;
          removeModule(moduleToDelete.id);
          setModuleToDelete(undefined);
        }}
      />
    </>
  );
};
