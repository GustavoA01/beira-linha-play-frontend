import { CourseHeader } from './components/CourseHeader';
import { ModuleCard } from './components/ModuleCard';
import { NewModuleDialog } from './components/NewModuleDialog';
import { DeleteModuleDialog } from './components/DeleteModuleDialog';
import { useNavigate } from 'react-router-dom';
import { ResourceNotFound } from '@/components/ResourceNotFound';
import { HeaderListPageSkeleton } from '@/components/PageSkeleton';
import type { ModuloType } from '@/data/types/api';
import { isModuleConcluded } from '@/data/atividades';
import { useDeleteModule } from './hooks/useMutation';
import { useCurso } from './hooks/useCurso';

export const CoursePage = () => {
  const navigate = useNavigate();
  const {
    curso,
    cursoId,
    isPending,
    isError,
    moduleDetails,
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
  } = useCurso();

  const { mutate: removeModule, isPending: isDeleting } = useDeleteModule(
    cursoId ?? ''
  );

  if (!cursoId || isError) {
    return <ResourceNotFound label="Curso não encontrado" />;
  }

  if (isPending) return <HeaderListPageSkeleton />;

  if (!curso) return <ResourceNotFound label="Curso não encontrado" />;

  const moduloForCard = (modulo: ModuloType) =>
    moduleDetails.find((item) => item.data?.id === modulo.id)?.data ?? modulo;

  return (
    <>
      <div className="flex flex-col h-dvh overflow-hidden">
        <CourseHeader
          curso={curso}
          isAluno={isAluno}
          isMonitor={isMonitor}
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
              curso.modulos.map((modulo) => {
                const moduloCard = moduloForCard(modulo);
                return (
                  <ModuleCard
                    key={modulo.id}
                    modulo={moduloCard}
                    isMonitor={isMonitor}
                    concluded={
                      isAluno &&
                      isModuleConcluded(moduloCard, attempts, alunoId)
                    }
                    onEdit={() => {
                      setEditingModule(moduloCard);
                      setOpenModuleDialog(true);
                    }}
                    onDelete={() => setModuleToDelete(moduloCard)}
                    onClick={() =>
                      navigate(`/cursos/${curso.id}/modulos/${modulo.id}`)
                    }
                  />
                );
              })
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
        onOpenChange={(open) => {
          if (!open) setModuleToDelete(undefined);
        }}
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
