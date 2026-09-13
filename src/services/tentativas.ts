import { api } from './api';
import { endpoints } from './endpoints';
import type { TentativaType } from '@/data/types/api';
import type {
  AttemptResultResponseType,
  SubmitAttemptPayloadType,
} from '@/data/types/services';

export const listMyAttempts = async (activityId?: string) => {
  const { data } = await api.get<TentativaType[]>(endpoints.attempts.mine, {
    params: activityId ? { atividadeId: activityId } : undefined,
  });
  return data;
};

export const submitAttempt = async (
  activityId: string,
  payload: SubmitAttemptPayloadType
) => {
  const { data } = await api.post<AttemptResultResponseType>(
    endpoints.activities.attempts(activityId),
    payload
  );
  return data;
};
