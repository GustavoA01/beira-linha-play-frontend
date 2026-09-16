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
  const [selectedCourse, setSelectedCourse] = useState<CursoType | null>(null);
  const [openCourseDialog, setOpenCourseDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CursoType>();
  const [openAdminDialog, setOpenAdminDialog] = useState(false);

  const isLocked = (cursoId: string) =>
    user.tipo !== 'ADMIN' && !user.cursoIds.includes(cursoId);

  const openCourse = (curso: CursoType) => navigate(`/cursos/${curso.id}`);

  const handleCourseClick = (curso: CursoType) => {
    if (!isLocked(curso.id)) {
      openCourse(curso);
      return;
    }

    if (user.tipo !== 'ALUNO') return;

    setSelectedCourse(curso);
    setOpenCodeDialog(true);
  };

  const handleCodeSubmit = async (code: string) => {
    if (!selectedCourse) return 'Curso não encontrado';

    try {
      await enroll({
        id: selectedCourse.id,
        codigoAcesso: code,
      });

      if (user.tipo === 'ALUNO') {
        setUser({
          ...user,
          cursoIds: user.cursoIds.includes(selectedCourse.id)
            ? user.cursoIds
            : [...user.cursoIds, selectedCourse.id],
        });
      }

      openCourse(selectedCourse);
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
    isLocked,
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
