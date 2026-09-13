import type { NewCourseFormType } from '@/data/schemas/course';
import type { CursoType, UsuarioType } from '@/data/types/api';
import type { CourseResponseType } from '@/data/types/services';

export const toCurso = (course: CourseResponseType): CursoType => ({
  id: course.id,
  nome: course.nome,
  codigoAcesso: course.codigoAcesso ?? '',
  monitorIds: course.monitorIds,
  modulos: (course.modulos ?? []).map((modulo) => ({
    ...modulo,
    atividades: [],
  })),
});

export const monitorNames = (
  ids: string[],
  monitors: UsuarioType[],
  currentUser?: UsuarioType,
  courseId?: string
) => {
  const known = currentUser ? [currentUser, ...monitors] : monitors;
  const names = ids
    .map((id) => known.find((monitor) => monitor.id === id)?.nome)
    .filter((nome): nome is string => Boolean(nome));

  if (
    names.length === 0 &&
    currentUser?.tipo === 'MONITOR' &&
    courseId &&
    currentUser.cursoIds.includes(courseId)
  ) {
    return currentUser.nome;
  }

  return names.join(', ') || 'Sem monitor';
};

const emptyValues: NewCourseFormType = {
  nome: '',
  monitorIds: [],
};

export const valuesFromCurso = (curso?: CursoType): NewCourseFormType => {
  if (!curso) return emptyValues;
  return { nome: curso.nome, monitorIds: curso.monitorIds };
};
