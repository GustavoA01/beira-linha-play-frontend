import type { NewCourseFormType } from '@/data/schemas/course';
import type {
  AtividadeType,
  CursoType,
  ModuloType,
  UsuarioType,
} from '@/data/types/api';
import type {
  CourseModuleResponseType,
  CourseResponseType,
} from '@/data/types/services';
import { toActivitySummary } from '@/pages/atividade/utils';

const toCourseActivities = (
  modulo: CourseModuleResponseType
): AtividadeType[] => {
  const atividades = (modulo.atividades ?? []).map(toActivitySummary);

  if (atividades.length > 0) return atividades;

  const quantAtividades =
    modulo.quantAtividades ?? modulo.quantidadeAtividades ?? 0;

  return Array.from({ length: quantAtividades }, (_, index) => ({
    id: `${modulo.id}-atividade-${index}`,
    titulo: '',
    quantQuestoes: 0,
    moduloId: modulo.id,
    questoes: [],
  }));
};

export const toCourse = (course: CourseResponseType): CursoType => ({
  id: course.id,
  nome: course.nome,
  codigoAcesso: course.codigoAcesso ?? '',
  monitorIds: course.monitorIds,
  monitorNomes: course.monitorNomes ?? [],
  modulos: (course.modulos ?? []).map((modulo) => ({
    id: modulo.id,
    nome: modulo.nome,
    cursoId: modulo.cursoId,
    atividades: toCourseActivities(modulo),
  })),
});

export const withModuleDetails = (
  curso: CursoType,
  modulesById: Map<string, ModuloType>
): CursoType => ({
  ...curso,
  modulos: curso.modulos.map((modulo) => modulesById.get(modulo.id) ?? modulo),
});

export const monitorNames = (
  ids: string[],
  monitors: UsuarioType[],
  currentUser?: UsuarioType,
  courseId?: string,
  nomesDoCurso?: string[]
) => {
  if (nomesDoCurso && nomesDoCurso.length > 0) {
    return nomesDoCurso.join(', ');
  }

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

export const valuesFromCourse = (curso?: CursoType): NewCourseFormType => {
  if (!curso) return emptyValues;
  return { nome: curso.nome, monitorIds: curso.monitorIds };
};
