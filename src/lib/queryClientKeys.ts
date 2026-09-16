export const queryClientKeys = {
  medalKeys: {
    all: ['medals'] as const,
  },
  courseKeys: {
    all: ['courses'] as const,
    detail: (id: string) => [...queryClientKeys.courseKeys.all, id] as const,
  },
  rankingKeys: {
    all: ['rankings'] as const,
    list: (courseId?: string) =>
      [...queryClientKeys.rankingKeys.all, courseId ?? 'geral'] as const,
  },
  monitorKeys: {
    all: ['monitors'] as const,
  },
  moduleKeys: {
    all: ['modules'] as const,
    detail: (id: string) => [...queryClientKeys.moduleKeys.all, id] as const,
  },
  activityKeys: {
    all: ['activities'] as const,
    detail: (id: string) => [...queryClientKeys.activityKeys.all, id] as const,
    monitoring: (id: string) =>
      [...queryClientKeys.activityKeys.all, id, 'monitoring'] as const,
  },
  attemptKeys: {
    all: ['attempts'] as const,
    mine: (activityId?: string) =>
      [
        ...queryClientKeys.attemptKeys.all,
        'mine',
        activityId ?? 'all',
      ] as const,
  },
};
