import type { CursoType } from '@/data/types/api';
import { useAuthUser } from '@/providers/UserProvider';
import { ApiError } from '@/services/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEnrollCourse } from './useMutation';

export const useCursos = () => {
  const { user, setUser } = useAuthUser();
  const navigate = useNavigate();
  const { mutateAsync: enroll } = useEnrollCourse();
  const [openCodeDialog, setOpenCodeDialog] = useState(false);
  const [openCourseDialog, setOpenCourseDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CursoType>();
  const [openAdminDialog, setOpenAdminDialog] = useState(false);

  const openCourse = (cursoId: string) => navigate(`/cursos/${cursoId}`);
  const handleCourseClick = (cursoId: string) => openCourse(cursoId);

  const handleCodeSubmit = async (code: string) => {
    try {
      const curso = await enroll(code);

      if (user.tipo === 'ALUNO') {
        setUser({
          ...user,
          cursoIds: user.cursoIds.includes(curso.id)
            ? user.cursoIds
            : [...user.cursoIds, curso.id],
        });
      }

      openCourse(curso.id);
    } catch (error) {
      return error instanceof ApiError &&
        error.message !== 'Não foi possível completar a operação'
        ? error.message
        : 'Código inválido. Confira e tente de novo.';
    }
  };

  const handleCourseDialogChange = (open: boolean) => {
    setOpenCourseDialog(open);
    if (!open) setEditingCourse(undefined);
  };

  return {
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
  };
};
