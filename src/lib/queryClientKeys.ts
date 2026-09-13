export const medalKeys = {
  all: ['medals'] as const,
};

export const courseKeys = {
  all: ['courses'] as const,
  detail: (id: string) => [...courseKeys.all, id] as const,
};

export const rankingKeys = {
  all: ['rankings'] as const,
  list: (courseId?: string) =>
    [...rankingKeys.all, courseId ?? 'geral'] as const,
};

export const monitorKeys = {
  all: ['monitors'] as const,
};

export const moduleKeys = {
  all: ['modules'] as const,
  detail: (id: string) => [...moduleKeys.all, id] as const,
};

export const activityKeys = {
  all: ['activities'] as const,
  detail: (id: string) => [...activityKeys.all, id] as const,
};
