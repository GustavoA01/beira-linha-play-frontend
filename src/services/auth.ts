import type { UsuarioType } from '@/data/types/api';
import { api, ApiError } from './api';
import type { CadastroPayload, LoginPayload, UsuarioResponse } from './types';

export type { CadastroPayload, LoginPayload, UsuarioResponse } from './types';

export const toUsuario = (data: UsuarioResponse): UsuarioType => {
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

export const login = async (payload: LoginPayload) => {
  const { data } = await api.post<UsuarioResponse>('/api/auth/login', payload);
  return toUsuario(data);
};

export const cadastro = async (payload: CadastroPayload) => {
  const { data } = await api.post<UsuarioResponse>(
    '/api/auth/cadastro',
    payload
  );
  return toUsuario(data);
};

export const me = async (): Promise<UsuarioType | null> => {
  try {
    const { data } = await api.get<UsuarioResponse>('/api/auth/me');
    return toUsuario(data);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
};

export const refresh = async (): Promise<UsuarioType | null> => {
  try {
    const { data } = await api.post<UsuarioResponse>('/api/auth/refresh');
    return toUsuario(data);
  } catch {
    return null;
  }
};

export const logout = async () => {
  await api.post('/api/auth/logout');
};
