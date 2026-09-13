import { api } from './api';
import { endpoints } from './endpoints';
import type { RankingResponseType } from '@/data/types/services';

export const listRankings = async (courseId?: string) => {
  const { data } = await api.get<RankingResponseType[]>(
    endpoints.rankings.list,
    { params: courseId ? { cursoId: courseId } : undefined }
  );
  return data;
};
