import { api } from './api';
import type { RankingResponse } from './types';

export const listarRankings = async (cursoId?: string) => {
  const { data } = await api.get<RankingResponse[]>('/api/rankings', {
    params: cursoId ? { cursoId } : undefined,
  });
  return data;
};
