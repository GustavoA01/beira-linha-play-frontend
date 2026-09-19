import { useQuery } from '@tanstack/react-query';
import { queryClientKeys } from '@/lib/queryClientKeys';
import { listCourses } from '@/services/cursos';
import { listMyAttempts } from '@/services/tentativas';
import { toCourse } from '@/pages/cursos/utils';
import { courseProgressPercent } from '@/data/atividades';
import { useAuthUser } from '@/providers/UserProvider';

export const useAlunoCursosProgresso = (enabled: boolean) => {
  const { user, isAluno } = useAuthUser();
  const canFetch = enabled && isAluno;

  const { data: courses = [], isPending: isCoursesPending } = useQuery({
    queryKey: queryClientKeys.courseKeys.all,
    queryFn: listCourses,
    enabled: canFetch,
  });

  const { data: attempts = [], isPending: isAttemptsPending } = useQuery({
    queryKey: queryClientKeys.attemptKeys.mine(),
    queryFn: () => listMyAttempts(),
    enabled: canFetch,
  });

  const cursos = courses
    .filter((course) => 'cursoIds' in user && user.cursoIds.includes(course.id))
    .map((course) => {
      const curso = toCourse(course);
      return {
        id: curso.id,
        nome: curso.nome,
        progresso: courseProgressPercent(curso, attempts, user.id),
      };
    });

  return {
    cursos,
    isPending: canFetch && (isCoursesPending || isAttemptsPending),
  };
};
