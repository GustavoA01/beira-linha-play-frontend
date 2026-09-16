import { courseKeys, moduleKeys, monitorKeys } from '@/lib/queryClientKeys';
import { toCourse, withModuleDetails } from '../utils';
import { listCourses } from '@/services/cursos';
import { listMonitors } from '@/services/usuarios';
import { useQueries, useQuery } from '@tanstack/react-query';
import { toModule } from '@/pages/modulo/utils';
import { getModule } from '@/services/modulos';
import { useDeleteCourse } from './useMutation';

export const useCursosMutation = () => {
  const { mutate: removeCourse } = useDeleteCourse();

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

  const moduleIds = [
    ...new Set(
      courses.flatMap((course) =>
        (course.modulos ?? []).map((modulo) => modulo.id)
      )
    ),
  ];

  const moduleQueries = useQueries({
    queries: moduleIds.map((id) => ({
      queryKey: moduleKeys.detail(id),
      queryFn: async () => toModule(await getModule(id)),
    })),
  });

  const modulesById = new Map(
    moduleQueries.flatMap((query) =>
      query.data ? [[query.data.id, query.data] as const] : []
    )
  );

  const cursos = courses.map((course) =>
    withModuleDetails(toCourse(course), modulesById)
  );

  return {
    cursos,
    isPending,
    isError,
    removeCourse,
    monitors,
  };
};
