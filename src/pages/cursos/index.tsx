import { CourseCard } from '@/pages/cursos/components/CourseCard';
import { CoursesHeader } from './components/CoursesHeader';
import { CodeDialog } from './components/CodeDialog';
import { NewCourseDialog } from './components/NewCourseDialog';
import { NewAdminDialog } from './components/NewAdminDialog';
import { useMediaDevice } from '@/hooks/useMediaDevice';
import { motion } from 'framer-motion';
import { useCursos } from './hooks/useCursos';
import { useAuthUser } from '@/providers/UserProvider';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import type { CursoType } from '@/data/types/api';
import { useQuery } from '@tanstack/react-query';
import { listCourses } from '@/services/cursos';
import { listMonitors } from '@/services/usuarios';
import { courseKeys, monitorKeys } from '@/lib/queryClientKeys';
import { CoursesPageSkeleton } from '@/components/PageSkeleton';
import { useDeleteCourse } from './hooks/useMutation';
import { monitorNames, toCurso } from './utils';

export const CoursesPage = () => {
  const { containerClassName } = useMediaDevice();
  const { user, isAdmin, isAluno } = useAuthUser();
  const {
    data: courses = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: courseKeys.all,
    queryFn: listCourses,
  });
  const { data: monitors = [] } = useQuery({
    queryKey: monitorKeys.all,
    queryFn: listMonitors,
  });
  const { mutate: removeCourse } = useDeleteCourse();
  const cursos = courses.map(toCurso);
  const {
    openCodeDialog,
    setOpenCodeDialog,
    isLocked,
    handleCourseClick,
    handleCodeSubmit,
  } = useCursos(user);
  const [openCourseDialog, setOpenCourseDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CursoType>();
  const [openAdminDialog, setOpenAdminDialog] = useState(false);

  const handleCourseDialogChange = (open: boolean) => {
    setOpenCourseDialog(open);
    if (!open) setEditingCourse(undefined);
  };

  return (
    <div
      className={cn(
        'flex flex-col h-dvh custom-bar sm:large-bar overflow-hidden',
        containerClassName
      )}
    >
      <CoursesHeader
        role={user.tipo}
        isAdmin={isAdmin}
        onAddCourse={() => {
          setEditingCourse(undefined);
          setOpenCourseDialog(true);
        }}
        onAddAdmin={() => setOpenAdminDialog(true)}
      />

      {isPending && <CoursesPageSkeleton />}

      {isError && (
        <p className="mt-8 text-sm text-destructive font-montserrat">
          Não foi possível carregar os cursos.
        </p>
      )}

      {!isPending && !isError && cursos.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground font-montserrat">
          Nenhum curso cadastrado.
        </p>
      )}

      <div className="flex flex-col scrollbar-hidden overflow-y-auto md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 mt-4 sm:mt-8 pb-18 pt-2 gap-4">
        {cursos.map((curso, index) => (
          <motion.div
            key={curso.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <CourseCard
              curso={curso}
              locked={isLocked(curso.id)}
              codCurso={curso.codigoAcesso}
              onClick={
                isLocked(curso.id) && !isAluno
                  ? undefined
                  : () => handleCourseClick(curso)
              }
              monitorNome={monitorNames(
                curso.monitorIds,
                monitors,
                user,
                curso.id
              )}
              canDelete={isAdmin}
              onEdit={() => {
                setEditingCourse(curso);
                setOpenCourseDialog(true);
              }}
              onDelete={() => removeCourse(curso.id)}
            />
          </motion.div>
        ))}
      </div>

      <CodeDialog
        open={openCodeDialog}
        onOpenChange={setOpenCodeDialog}
        onSubmit={handleCodeSubmit}
      />
      <NewCourseDialog
        open={openCourseDialog}
        onOpenChange={handleCourseDialogChange}
        curso={editingCourse}
      />
      <NewAdminDialog
        open={openAdminDialog}
        onOpenChange={setOpenAdminDialog}
      />
    </div>
  );
};
