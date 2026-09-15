import { useState } from 'react';
import { CourseHeader } from './components/CourseHeader';
import { ModuleCard } from './components/ModuleCard';
import { NewModuleDialog } from './components/NewModuleDialog';
import { DeleteModuleDialog } from './components/DeleteModuleDialog';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthUser } from '@/providers/UserProvider';
import { ResourceNotFound } from '@/components/ResourceNotFound';
import { useQuery, useQueries } from '@tanstack/react-query';
import { getCourse } from '@/services/cursos';
import { getModule } from '@/services/modulos';
import { courseKeys, moduleKeys } from '@/lib/queryClientKeys';
import { toCourse } from '@/pages/cursos/utils';
import { toModule } from '@/pages/modulo/utils';
import { HeaderListPageSkeleton } from '@/components/PageSkeleton';
import type { ModuloType } from '@/data/types/api';
import { useDeleteModule } from './hooks/useMutation';

export const CoursePage = () => {
  const navigate = useNavigate();
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
  const { mutate: removeModule, isPending: isDeleting } = useDeleteModule(
    cursoId ?? ''
  );
  const [openModuleDialog, setOpenModuleDialog] = useState(false);
  const [editingModule, setEditingModule] = useState<ModuloType>();
  const [moduleToDelete, setModuleToDelete] = useState<ModuloType>();

  const handleModuleDialogChange = (open: boolean) => {
    setOpenModuleDialog(open);
    if (!open) setEditingModule(undefined);
  };

  if (!cursoId || isError) {
    return <ResourceNotFound label="Curso não encontrado" />;
  }

  if (isPending) {
    return <HeaderListPageSkeleton />;
  }

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
