import { toCourse } from '../utils';
import { listCourses } from '@/services/cursos';
import { listMonitors } from '@/services/usuarios';
import { useQuery } from '@tanstack/react-query';
import { queryClientKeys } from '@/lib/queryClientKeys';
import { useDeleteCourse } from './useMutation';
import { useAuthUser } from '@/providers/UserProvider';

export const useCursosMutation = () => {
  const { user, isAdmin, isAluno } = useAuthUser();
  const { mutate: removeCourse } = useDeleteCourse();

  const {
    data: courses = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: queryClientKeys.courseKeys.all,
    queryFn: listCourses,
  });

  const { data: monitors = [] } = useQuery({
    queryKey: queryClientKeys.monitorKeys.all,
    queryFn: listMonitors,
    enabled: !isAluno,
  });

  const visibleCourses = courses.filter(
    (course) =>
      isAdmin ||
      (user != null && 'cursoIds' in user && user.cursoIds.includes(course.id))
  );

  const cursos = visibleCourses.map(toCourse);

  return {
    cursos,
    isPending,
    isError,
    removeCourse,
    monitors,
  };
};
