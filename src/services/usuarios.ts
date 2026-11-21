import { api } from './api';
import { endpoints } from './endpoints';
import { toUser } from './auth';
import type {
  CreateAdminPayloadType,
  UpdateAccountPayloadType,
  UserResponseType,
} from '@/data/types/services';

export const updateAccount = async (payload: UpdateAccountPayloadType) => {
  const { data } = await api.patch<UserResponseType>(
    endpoints.users.me,
    payload
  );
  return toUser(data);
};

export const createAdmin = async (payload: CreateAdminPayloadType) => {
  const { data } = await api.post<UserResponseType>(
    endpoints.users.admins,
    payload
  );
  return toUser(data);
};

export const escolherCursoPontuado = async (cursoId: string) => {
  const { data } = await api.put<UserResponseType>(
    endpoints.users.cursoPontuado,
    { cursoId }
  );
  return toUser(data);
};

export const listMonitors = async () => {
  const { data } = await api.get<UserResponseType[]>(endpoints.users.monitors);
  return data.map(toUser);
};
