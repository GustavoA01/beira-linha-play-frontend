import type { CursoType, UsuarioType } from '@/data/types/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useCursos = (user: UsuarioType) => {
  const navigate = useNavigate();
  const [openCodeDialog, setOpenCodeDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CursoType | null>(null);

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

  const handleCodeSubmit = (code: string) => {
    if (!selectedCourse) return 'Curso não encontrado';
    if (code.toUpperCase() !== selectedCourse.codigoAcesso.toUpperCase()) {
      return 'Código inválido';
    }
    openCourse(selectedCourse);
  };

  return {
    openCodeDialog,
    setOpenCodeDialog,
    isLocked,
    handleCourseClick,
    handleCodeSubmit,
  };
};
