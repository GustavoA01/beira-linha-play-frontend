import { CourseCard } from '@/pages/cursos/components/CourseCard';
import { CoursesHeader } from './components/CoursesHeader';
import { CodeDialog } from './components/CodeDialog';
import { NewCourseDialog } from './components/NewCourseDialog';
import { NewAdminDialog } from './components/NewAdminDialog';
import { useMediaDevice } from '@/hooks/useMediaDevice';
import { motion } from 'framer-motion';
import { temporaryCursos } from '@/data/temporaryMocks/cursos';
import { getMonitoresNomes } from '@/data/temporaryMocks/monitores';
import { useCursos } from './hooks/useCursos';
import { useAuthUser } from '@/providers/UserProvider';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export const CoursesPage = () => {
  const { containerClassName } = useMediaDevice();
  const { user, isMonitor, isAdmin } = useAuthUser();
  const {
    openCodeDialog,
    setOpenCodeDialog,
    isLocked,
    handleCourseClick,
    handleCodeSubmit,
  } = useCursos(user);
  const [openCourseDialog, setOpenCourseDialog] = useState(false);
  const [openAdminDialog, setOpenAdminDialog] = useState(false);

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
        onAddCourse={() => setOpenCourseDialog(true)}
        onAddAdmin={() => setOpenAdminDialog(true)}
      />

      <div className="flex flex-col scrollbar-hidden overflow-y-auto md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 mt-4 sm:mt-8 pb-18 pt-2 gap-4">
        {temporaryCursos.map((curso, index) => (
          <motion.div
            key={curso.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <CourseCard
              curso={curso}
              isMonitor={isMonitor}
              locked={isLocked(curso.id)}
              codCurso={curso.codigoAcesso}
              onClick={() => handleCourseClick(curso)}
              monitorNome={getMonitoresNomes(curso.monitorIds)}
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
        onOpenChange={setOpenCourseDialog}
      />
      <NewAdminDialog
        open={openAdminDialog}
        onOpenChange={setOpenAdminDialog}
      />
    </div>
  );
};
