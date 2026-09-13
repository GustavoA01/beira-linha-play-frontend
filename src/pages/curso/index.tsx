import { useState } from 'react';
import { CourseHeader } from './components/CourseHeader';
import { ModuleCard } from './components/ModuleCard';
import { NewModuleDialog } from './components/NewModuleDialog';
import { DeleteModuleDialog } from './components/DeleteModuleDialog';
import { motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthUser } from '@/providers/UserProvider';
import { ResourceNotFound } from '@/components/ResourceNotFound';
import { useQuery } from '@tanstack/react-query';
import { getCourse } from '@/services/cursos';
import { courseKeys } from '@/lib/queryClientKeys';
import { toCurso } from '@/pages/cursos/utils';
import { HeaderListPageSkeleton } from '@/components/PageSkeleton';
import type { ModuloType } from '@/data/types/api';
import { useDeleteModule } from './hooks/useMutation';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

export const CoursePage = () => {
  const navigate = useNavigate();
  const { cursoId } = useParams();
  const { data, isPending, isError } = useQuery({
    queryKey: courseKeys.detail(cursoId ?? ''),
    queryFn: () => getCourse(cursoId!),
    enabled: Boolean(cursoId),
  });
  const curso = data ? toCurso(data) : undefined;
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
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="flex-1 min-h-0 custom-bar sm:large-bar -mt-10 overflow-y-auto pb-4 container mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="flex flex-col  pb-20">
            {curso.modulos.map((modulo) => (
              <motion.div key={modulo.id} variants={itemVariants}>
                <ModuleCard
                  modulo={modulo}
                  isMonitor={isMonitor}
                  onEdit={() => {
                    setEditingModule(modulo);
                    setOpenModuleDialog(true);
                  }}
                  onDelete={() => setModuleToDelete(modulo)}
                  onClick={() =>
                    navigate(`/cursos/${curso.id}/modulos/${modulo.id}`)
                  }
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <NewModuleDialog
        open={openModuleDialog}
        onOpenChange={handleModuleDialogChange}
        courseId={curso.id}
        modulo={editingModule}
      />
      <DeleteModuleDialog
        open={Boolean(moduleToDelete)}
        onOpenChange={(open) => {
          if (!open) setModuleToDelete(undefined);
        }}
        moduleName={moduleToDelete?.nome ?? ''}
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
