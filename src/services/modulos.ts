import { api } from './api';
import { endpoints } from './endpoints';
import type {
  ModuleResponseType,
  SaveModulePayloadType,
} from '@/data/types/services';

export const createModule = async (
  courseId: string,
  payload: SaveModulePayloadType
) => {
  const { data } = await api.post<ModuleResponseType>(
    endpoints.courses.modules(courseId),
    payload
  );
  return data;
};

export const getModule = async (id: string) => {
  const { data } = await api.get<ModuleResponseType>(
    endpoints.modules.byId(id)
  );
  return data;
};

export const updateModule = async (
  id: string,
  payload: SaveModulePayloadType
) => {
  const { data } = await api.patch<ModuleResponseType>(
    endpoints.modules.byId(id),
    payload
  );
  return data;
};

export const deleteModule = async (id: string) => {
  await api.delete(endpoints.modules.byId(id));
};
