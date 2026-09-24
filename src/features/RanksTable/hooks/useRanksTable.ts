import { useQuery } from '@tanstack/react-query';
import { queryClientKeys } from '@/lib/queryClientKeys';
import { cn } from '@/lib/utils';
import { useAuthUser } from '@/providers/UserProvider';
import { listCourses } from '@/services/cursos';
import { listRankings } from '@/services/rankings';
import { useCallback, useState } from 'react';

type UseRanksTableProps = {
  floating?: boolean;
};

const GERAL = { id: 'geral', nome: 'Geral' };

export const useRanksTable = ({ floating }: UseRanksTableProps) => {
  const auth = useAuthUser();
  const [selected, setSelected] = useState(GERAL.id);

  const loggedAlunoId = auth.isAluno ? auth.user.id : undefined;

  const shellClassName = cn(
    'flex h-fit flex-col overflow-hidden w-80 bg-white border rounded-md shadow-lg',
    floating ? 'fixed m-5 z-50' : 'relative self-start'
  );

  const maxHeight = floating ? 'calc(100dvh - 180px)' : 'calc(100dvh - 14rem)';

  const scrollToLoggedRow = useCallback((node: HTMLTableRowElement | null) => {
    if (!node) return;
    requestAnimationFrame(() => {
      node.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    });
  }, []);

  const { data: courses = [] } = useQuery({
    queryKey: queryClientKeys.courseKeys.all,
    queryFn: listCourses,
  });

  const items = [
    GERAL,
    ...courses
      .filter(
        (course) => auth.isAdmin || auth.user.cursoIds.includes(course.id)
      )
      .map((course) => ({ id: course.id, nome: course.nome })),
  ];

  const courseId = selected === GERAL.id ? undefined : selected;

  const {
    data: ranks = [],
    isPending: isRanksPending,
    isFetching: isRanksFetching,
  } = useQuery({
    queryKey: queryClientKeys.rankingKeys.list(courseId),
    queryFn: () => listRankings(courseId),
  });

  return {
    selected,
    setSelected,
    items,
    loggedAlunoId,
    scrollToLoggedRow,
    ranks,
    isRanksLoading: isRanksPending || isRanksFetching,
    shellClassName,
    maxHeight,
    showName: !auth.isAluno,
  };
};
