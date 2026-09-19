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
import { CoursesPageSkeleton } from '@/components/PageSkeleton';
import { monitorNames } from './utils';
import { useCursosMutation } from './hooks/useCursosMutation';

const emptyCoursesMessage = {
  ADMIN: 'Nenhum curso cadastrado.',
  MONITOR: 'Você não está alocado em nenhum curso.',
  ALUNO:
    'Você ainda não está em nenhum curso. Use o código que o monitor passou.',
} as const;

export const CoursesPage = () => {
  const { containerClassName } = useMediaDevice();
  const { user, isAdmin, isAluno } = useAuthUser();
  const { cursos, isPending, isError, removeCourse, monitors } =
    useCursosMutation();
  const {
    openCodeDialog,
    setOpenCodeDialog,
    handleCourseClick,
    handleCodeSubmit,
    openCourseDialog,
    setOpenCourseDialog,
    editingCourse,
    setEditingCourse,
    openAdminDialog,
    setOpenAdminDialog,
    handleCourseDialogChange,
  } = useCursos();

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
        onEnterCode={isAluno ? () => setOpenCodeDialog(true) : undefined}
      />

      {isPending && <CoursesPageSkeleton />}

      {isError && (
        <p className="mt-8 text-sm text-destructive font-montserrat">
          Não foi possível carregar os cursos.
        </p>
      )}

      {!isPending && !isError && cursos.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground font-montserrat">
          {emptyCoursesMessage[user.tipo]}
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
              codCurso={curso.codigoAcesso}
              onClick={() => handleCourseClick(curso.id)}
              monitorNome={monitorNames(
                curso.monitorIds,
                monitors,
                user,
                curso.id,
                curso.monitorNomes
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
