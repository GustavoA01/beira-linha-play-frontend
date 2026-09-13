import type { UsuarioType } from '@/data/types/api';
import { api, ApiError } from './api';
import { endpoints } from './endpoints';
import type {
  LoginPayloadType,
  RegisterPayloadType,
  UserResponseType,
} from '@/data/types/services';

export const toUser = (data: UserResponseType): UsuarioType => {
  if (data.tipo === 'ALUNO') {
    return {
      id: data.id,
      nome: data.nome,
      tipo: 'ALUNO',
      apelido: data.apelido ?? '',
      pontos: data.pontos ?? 0,
      imagemPerfil: data.imagemPerfil ?? '',
      cursoIds: data.cursoIds ?? [],
    };
  }

  if (data.tipo === 'MONITOR') {
    return {
      id: data.id,
      nome: data.nome,
      tipo: 'MONITOR',
      email: data.email ?? '',
      cursoIds: data.cursoIds ?? [],
      cursoOrigem: data.cursoOrigem,
    };
  }

  return {
    id: data.id,
    nome: data.nome,
    tipo: 'ADMIN',
  };
};

export const login = async (payload: LoginPayloadType) => {
  const { data } = await api.post<UserResponseType>(
    endpoints.auth.login,
    payload
  );
  return toUser(data);
};

export const register = async (payload: RegisterPayloadType) => {
  const { data } = await api.post<UserResponseType>(
    endpoints.auth.register,
    payload
  );
  return toUser(data);
};

export const currentUser = async (): Promise<UsuarioType | null> => {
  try {
    const { data } = await api.get<UserResponseType>(
      endpoints.auth.currentUser
    );
    return toUser(data);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
};

export const refresh = async (): Promise<UsuarioType | null> => {
  try {
    const { data } = await api.post<UserResponseType>(endpoints.auth.refresh);
    return toUser(data);
  } catch {
    return null;
  }
};

export const logout = async () => await api.post(endpoints.auth.logout);
