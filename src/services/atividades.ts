import { api } from './api';
import { endpoints } from './endpoints';
import type {
  ActivityResponseType,
  MonitoringResponseType,
  SaveActivityPayloadType,
} from '@/data/types/services';

export const createActivity = async (
  moduleId: string,
  payload: SaveActivityPayloadType
) => {
  const { data } = await api.post<ActivityResponseType>(
    endpoints.modules.activities(moduleId),
    payload
  );
  return data;
};

export const getActivity = async (id: string) => {
  const { data } = await api.get<ActivityResponseType>(
    endpoints.activities.byId(id)
  );
  return data;
};

export const updateActivity = async (
  id: string,
  payload: SaveActivityPayloadType
) => {
  const { data } = await api.patch<ActivityResponseType>(
    endpoints.activities.byId(id),
    payload
  );
  return data;
};

export const deleteActivity = async (id: string) => {
  await api.delete(endpoints.activities.byId(id));
};

export const getActivityMonitoring = async (id: string) => {
  const { data } = await api.get<MonitoringResponseType>(
    endpoints.activities.monitoring(id)
  );
  return data;
};
